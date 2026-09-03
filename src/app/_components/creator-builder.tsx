"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { classifyModelLicense, huggingFaceRevisionHref, modelLicenseCopy } from "@/lib/creator-policy";
import styles from "./creator-builder.module.css";

type AssetKind = "profile" | "theme" | "motion";

const HEX_40 = /^[a-f0-9]{40}$/;
const HEX_64 = /^[a-f0-9]{64}$/;
const REPO = /^[A-Za-z0-9][A-Za-z0-9._-]{0,95}\/[A-Za-z0-9][A-Za-z0-9._-]{0,95}$/;

async function digest(value: string) {
  const bytes = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

type CreatorBuilderProps = {
  accountHref?: string | null;
  publishingHref?: string | null;
};

type DraftReview = { name: string; kind: string; bytes: number; warnings: string[] };

const MAX_DRAFT_BYTES = 64 * 1024;
const SECRET_VALUE = /(?:-----BEGIN [A-Z ]*PRIVATE KEY-----|\b(?:hf|sk)_[A-Za-z0-9_-]{16,}\b|\bBearer\s+[A-Za-z0-9._~-]{12,})/i;

const FORBIDDEN_SINGLE_SEGMENTS = new Set([
  "authorization", "bearer", "command", "credential", "env", "executable",
  "hook", "password", "prompt", "script", "secret", "session", "shell",
]);
const TOKEN_PREFIXES = new Set(["access", "api", "auth", "bearer", "hf", "id", "refresh"]);
const KEY_PREFIXES = new Set(["api", "private", "secret", "signing"]);
const PATH_PREFIXES = new Set(["absolute", "host", "local", "private"]);

function keySegments(key: string): string[] {
  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

export function isProhibitedDraftKey(key: string): boolean {
  const parts = keySegments(key);
  if (parts.length === 1 && parts[0] === "token") return true;
  if (parts.some((part) => FORBIDDEN_SINGLE_SEGMENTS.has(part))) return true;
  return parts.some((part, index) => {
    const previous = parts[index - 1];
    if ((part === "token" || part === "tokens") && TOKEN_PREFIXES.has(previous)) return true;
    if (part === "key" && KEY_PREFIXES.has(previous)) return true;
    if (part === "path" && PATH_PREFIXES.has(previous)) return true;
    return false;
  });
}

function inspectDraft(value: unknown, path = "$", warnings: string[] = []): string[] {
  if (Array.isArray(value)) {
    value.forEach((child, index) => inspectDraft(child, `${path}[${index}]`, warnings));
  } else if (value && typeof value === "object") {
    Object.entries(value as Record<string, unknown>).forEach(([key, child]) => {
      if (isProhibitedDraftKey(key)) warnings.push(`${path}.${key} is prohibited.`);
      inspectDraft(child, `${path}.${key}`, warnings);
    });
  } else if (typeof value === "string") {
    if (SECRET_VALUE.test(value)) warnings.push(`${path} resembles a credential.`);
    if (/^(?:\/|~\/|[A-Za-z]:[\\/]|file:\/\/)/.test(value)) warnings.push(`${path} contains a local path.`);
  }
  return warnings;
}

export function CreatorBuilder({ accountHref = null, publishingHref = null }: CreatorBuilderProps) {
  const [kind, setKind] = useState<AssetKind>("profile");
  const [name, setName] = useState("My local profile");
  const [summary, setSummary] = useState("A tested local AI setup for Spark Plug.");
  const [license, setLicense] = useState("Apache-2.0");
  const [repoId, setRepoId] = useState("owner/model-repository");
  const [revision, setRevision] = useState("");
  const [filename, setFilename] = useState("model.safetensors");
  const [fileHash, setFileHash] = useState("");
  const [sizeBytes, setSizeBytes] = useState("1");
  const [engine, setEngine] = useState("vllm");
  const [quantization, setQuantization] = useState("none");
  const [context, setContext] = useState("32768");
  const [capabilities, setCapabilities] = useState(["chat"]);
  const [mlxPrefill, setMlxPrefill] = useState("2048");
  const [ollamaBatch, setOllamaBatch] = useState("512");
  const [ollamaGpuLayers, setOllamaGpuLayers] = useState("999");
  const [ollamaThreads, setOllamaThreads] = useState("8");
  const [ollamaKeepAlive, setOllamaKeepAlive] = useState("300");
  const [ollamaFlash, setOllamaFlash] = useState(true);
  const [accent, setAccent] = useState("#a9ff2e");
  const [motionSlot, setMotionSlot] = useState("panel-enter");
  const [message, setMessage] = useState("Nothing leaves this browser.");
  const [packageHash, setPackageHash] = useState("");
  const [draftReview, setDraftReview] = useState<DraftReview | null>(null);
  const [workspace, setWorkspace] = useState<"build" | "import" | "publish">("build");

  const asset = useMemo(() => {
    if (kind === "theme") {
      return {
        schemaVersion: 1,
        kind: "sparkplug.theme",
        name,
        summary,
        license,
        palette: {
          canvas: "#050806", panel: "#0a140e", text: "#eef3ea",
          mutedText: "#9aa69e", accent, danger: "#ff6b5f", border: "#344139",
        },
        presentation: { fontMode: "technical", density: "standard", cornerStyle: "square" },
        artwork: [],
      };
    }
    if (kind === "motion") {
      return {
        schemaVersion: 1,
        kind: "sparkplug.motion-pack",
        name,
        summary,
        license,
        reducedMotion: "fade-only",
        motions: [{
          slot: motionSlot, durationMs: 280, easing: "ease-out", iterations: 1,
          keyframes: [{ offset: 0, opacity: 0, translateY: 12 }, { offset: 1, opacity: 1, translateY: 0 }],
        }],
      };
    }
    const settings = engine === "mlx"
      ? { prefillStepTokens: Number(mlxPrefill) }
      : engine === "ollama"
        ? { batchTokens: Number(ollamaBatch), gpuLayers: Number(ollamaGpuLayers), threadCount: Number(ollamaThreads), keepAliveSeconds: Number(ollamaKeepAlive), flashAttention: ollamaFlash }
        : undefined;
    return {
      schemaVersion: 1,
      kind: "sparkplug.setup-profile",
      name,
      summary,
      models: [{
        repoId,
        revision,
        licenseId: license,
        gated: false,
        files: [{ filename, sha256: fileHash, sizeBytes: Number(sizeBytes) }],
        runtime: {
          alias: "primary-model", engine, quantization,
          maxContextTokens: Number(context),
          ...(settings ? { settings } : {}),
        },
      }],
      routing: { defaultModelAlias: "primary-model", capabilities },
    };
  }, [accent, capabilities, context, engine, fileHash, filename, kind, license, mlxPrefill, motionSlot, name, ollamaBatch, ollamaFlash, ollamaGpuLayers, ollamaKeepAlive, ollamaThreads, quantization, repoId, revision, sizeBytes, summary]);

  const json = useMemo(() => JSON.stringify(asset, null, 2), [asset]);
  const modelDecision = classifyModelLicense(license);
  const revisionHref = huggingFaceRevisionHref(repoId, revision);

  function validate() {
    const errors: string[] = [];
    if (!name.trim() || name.length > 80) errors.push("Name must contain 1–80 characters.");
    if (!summary.trim() || summary.length > 500) errors.push("Summary must contain 1–500 characters.");
    if (!license.trim()) errors.push("A package or model license is required.");
    if (kind === "profile") {
      if (!REPO.test(repoId)) errors.push("Repository must use owner/model format.");
      if (!HEX_40.test(revision)) errors.push("Revision must be an exact 40-character lowercase Git commit.");
      if (!HEX_64.test(fileHash)) errors.push("Model file SHA-256 must contain 64 lowercase hexadecimal characters.");
      if (!filename || filename.startsWith("/") || filename.includes("..") || filename.includes("\\")) errors.push("Model filename must be a safe relative path.");
      if (!Number.isSafeInteger(Number(sizeBytes)) || Number(sizeBytes) < 1) errors.push("File size must be a positive integer in bytes.");
      if (!Number.isInteger(Number(context)) || Number(context) < 1024 || Number(context) > 1_048_576) errors.push("Context must be between 1,024 and 1,048,576 tokens.");
      if (capabilities.length < 1) errors.push("Select at least one declared capability.");
    }
    return errors;
  }

  async function validatePreview(event: FormEvent) {
    event.preventDefault();
    const errors = validate();
    if (errors.length) {
      setPackageHash("");
      setMessage(errors.join(" "));
      return;
    }
    const hash = await digest(json);
    setPackageHash(hash);
    setMessage("Preview validated locally. Authenticated Pro export and submission happen only in the private Creator Studio.");
  }

  async function inspectUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setDraftReview(null);
    if (!file) return;
    if (file.size > MAX_DRAFT_BYTES) {
      setMessage(`Draft exceeds the ${MAX_DRAFT_BYTES / 1024} KiB inspection limit.`);
      return;
    }
    try {
      const raw = await file.text();
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      const warnings = inspectDraft(parsed);
      const knownKind = ["sparkplug.setup-profile", "sparkplug.theme", "sparkplug.motion-pack"].includes(String(parsed.kind));
      if (parsed.schemaVersion !== 1) warnings.push("Only schemaVersion 1 drafts are accepted by this public preview.");
      if (!knownKind) warnings.push("The package kind is not a supported declarative Spark Plug asset.");
      setDraftReview({ name: String(parsed.name || file.name), kind: String(parsed.kind || "unknown"), bytes: file.size, warnings });
      setMessage(warnings.length ? "Draft blocked. Remove every flagged field before submission." : "Draft passed the browser privacy preflight. Private service validation and review are still required.");
    } catch {
      setMessage("Draft blocked: the file is not valid JSON.");
    }
  }

  return (
    <section className={styles.studio} aria-labelledby="creator-builder-title">
      <div className={styles.accessBar}>
        <div><span className={accountHref ? styles.readyDot : styles.lockedDot} /> <strong>{accountHref ? "ACCOUNT SERVICE READY" : "PREVIEW LOCKED"}</strong><small>Creator publishing requires an authenticated Pro account. Local inference never does.</small></div>
        {accountHref ? <a href={accountHref}>SIGN IN SECURELY ↗</a> : <span>AUTH + BILLING DISABLED</span>}
      </div>
      <nav className={styles.tabs} aria-label="Creator Studio sections">
        <button type="button" aria-current={workspace === "build" ? "page" : undefined} onClick={() => setWorkspace("build")}>01 BUILD</button>
        <button type="button" aria-current={workspace === "import" ? "page" : undefined} onClick={() => setWorkspace("import")}>02 INSPECT DRAFT</button>
        <button type="button" aria-current={workspace === "publish" ? "page" : undefined} onClick={() => setWorkspace("publish")}>03 PUBLISH</button>
      </nav>
      {workspace === "build" ? <div className={styles.builder}>
      <div className={styles.heading}>
        <div><p>DECLARATIVE CREATOR WORKSPACE</p><h2 id="creator-builder-title">Build without executable code.</h2></div>
        <span>LOCAL PREVIEW</span>
      </div>
      <form onSubmit={validatePreview}>
        <label>Asset type<select value={kind} onChange={(event) => setKind(event.target.value as AssetKind)}><option value="profile">AI profile</option><option value="theme">Visual theme</option><option value="motion">Motion pack</option></select></label>
        <label>Name<input required maxLength={80} value={name} onChange={(event) => setName(event.target.value)} /></label>
        <label className={styles.wide}>Summary<textarea required maxLength={500} value={summary} onChange={(event) => setSummary(event.target.value)} /></label>
        <label>License<input required maxLength={120} value={license} onChange={(event) => setLicense(event.target.value)} /></label>
        {kind === "profile" ? <>
          <label>Hugging Face repository<input value={repoId} onChange={(event) => setRepoId(event.target.value)} placeholder="owner/model" /></label>
          <label className={styles.wide}>Immutable model revision<input value={revision} onChange={(event) => setRevision(event.target.value)} placeholder="40-character Git commit" /></label>
          <label>Selected model file<input value={filename} onChange={(event) => setFilename(event.target.value)} /></label>
          <label>File size in bytes<input inputMode="numeric" value={sizeBytes} onChange={(event) => setSizeBytes(event.target.value)} /></label>
          <label className={styles.wide}>Model file SHA-256<input value={fileHash} onChange={(event) => setFileHash(event.target.value)} placeholder="64 lowercase hexadecimal characters" /></label>
          <label>Engine<select value={engine} onChange={(event) => setEngine(event.target.value)}><option value="vllm">vLLM</option><option value="colibri">Colibri</option><option value="mlx">MLX</option><option value="ollama">Ollama</option><option value="llama.cpp">llama.cpp</option><option value="transformers">Transformers</option><option value="comfyui">ComfyUI</option></select></label>
          <label>Quantization<select value={quantization} onChange={(event) => setQuantization(event.target.value)}><option value="none">None</option><option value="awq">AWQ</option><option value="gptq">GPTQ</option><option value="gguf">GGUF</option><option value="bitsandbytes">bitsandbytes</option></select></label>
          <label>Maximum context tokens<input inputMode="numeric" value={context} onChange={(event) => setContext(event.target.value)} /></label>
          {engine === "mlx" ? <fieldset className={styles.wide}><legend>Closed MLX settings</legend><div className={styles.settingsGrid}><label>Prefill step tokens<input inputMode="numeric" value={mlxPrefill} onChange={(event) => setMlxPrefill(event.target.value)} /></label></div></fieldset> : null}
          {engine === "ollama" ? <fieldset className={styles.wide}><legend>Closed Ollama settings</legend><div className={styles.settingsGrid}><label>Batch tokens<input inputMode="numeric" value={ollamaBatch} onChange={(event) => setOllamaBatch(event.target.value)} /></label><label>GPU layers<input inputMode="numeric" value={ollamaGpuLayers} onChange={(event) => setOllamaGpuLayers(event.target.value)} /></label><label>CPU threads<input inputMode="numeric" value={ollamaThreads} onChange={(event) => setOllamaThreads(event.target.value)} /></label><label>Keep alive seconds<input inputMode="numeric" value={ollamaKeepAlive} onChange={(event) => setOllamaKeepAlive(event.target.value)} /></label><label className={styles.inlineCheck}><input type="checkbox" checked={ollamaFlash} onChange={(event) => setOllamaFlash(event.target.checked)} />Flash attention</label></div></fieldset> : null}
          <fieldset className={`${styles.wide} ${styles.capabilities}`}><legend>Declared capabilities</legend>{["chat", "code", "tools", "thinking", "vision", "streaming"].map((capability) => <label key={capability}><input type="checkbox" checked={capabilities.includes(capability)} onChange={(event) => setCapabilities((current) => event.target.checked ? [...current, capability] : current.filter((item) => item !== capability))} />{capability}</label>)}</fieldset>
        </> : null}
        {kind === "theme" ? <label>Accent color<input type="color" value={accent} onChange={(event) => setAccent(event.target.value)} /></label> : null}
        {kind === "motion" ? <label>Motion slot<select value={motionSlot} onChange={(event) => setMotionSlot(event.target.value)}><option value="panel-enter">Panel enter</option><option value="profile-switch">Profile switch</option><option value="model-load">Model load</option><option value="queue-pulse">Queue pulse</option><option value="success">Success</option><option value="warning">Warning</option></select></label> : null}
        <div className={styles.actions}><button type="submit">VALIDATE PREVIEW</button><button type="button" disabled>PRO EXPORT + PUBLISHING</button></div>
      </form>
      {kind === "profile" ? <aside className={styles.dependency} aria-label="Hugging Face dependency review">
        <div><small>MODEL SOURCE</small><strong>{repoId}</strong><span>{revision ? `${revision.slice(0, 10)}…` : "Exact revision required"}</span></div>
        <div><small>ENGINE</small><strong>{engine}</strong><span>{quantization} · {Number(context || 0).toLocaleString()} context</span></div>
        <div><small>LICENSE GATE</small><strong data-decision={modelDecision}>{modelDecision.replace("-", " ")}</strong><span>{modelLicenseCopy(modelDecision)}</span></div>
        {revisionHref ? <a href={revisionHref} target="_blank" rel="noreferrer">VERIFY EXACT REVISION ON HUGGING FACE ↗</a> : <span>Enter an immutable revision to verify the source.</span>}
      </aside> : null}
      <div className={styles.output}><div><strong>Package preview</strong>{packageHash ? <small>SHA-256 {packageHash}</small> : null}</div><pre tabIndex={0} aria-label="Generated package JSON">{json}</pre></div>
      <p className={styles.status} role="status">{message}</p>
      </div> : null}
      {workspace === "import" ? <section className={styles.inspector}>
        <p className={styles.kicker}>SANITIZED DRAFT UPLOAD</p><h2>Inspect locally before anything is submitted.</h2>
        <p>The browser reads at most 64 KiB and rejects obvious credentials, private paths, commands, and unsupported package kinds. This preview does not upload the file.</p>
        <label className={styles.dropzone}>SELECT A DECLARATIVE JSON DRAFT<input type="file" accept=".sparkplug-profile,.sparkplug-theme,.sparkplug-motion,application/json" onChange={inspectUpload} /></label>
        {draftReview ? <div className={styles.review}><strong>{draftReview.name}</strong><span>{draftReview.kind} · {draftReview.bytes.toLocaleString()} bytes</span>{draftReview.warnings.length ? <ul>{draftReview.warnings.map((warning) => <li key={warning}>{warning}</li>)}</ul> : <p>Browser privacy preflight passed. No model weights or executable content detected.</p>}</div> : null}
        <p className={styles.status} role="status">{message}</p>
      </section> : null}
      {workspace === "publish" ? <section className={styles.publisher}>
        <p className={styles.kicker}>CREATOR DASHBOARD</p><h2>One lifecycle. Nothing skips review.</h2>
        <div className={styles.lifecycle} aria-label="Listing lifecycle"><span data-active="true">DRAFT</span><span>VALIDATION</span><span>LICENSE REVIEW</span><span>MODERATION</span><span>PUBLISHED</span></div>
        <div className={styles.dashboardGrid}><article><small>IDENTITY</small><strong>{accountHref ? "Sign in to continue" : "Unavailable in Preview"}</strong><p>Google OAuth, PKCE, a verified Pro entitlement, and seller onboarding are checked by the private service.</p></article><article><small>SUBMISSION</small><strong>Private review queue</strong><p>Upload, price, payout destination, signatures, grants, and moderation are server-owned and fail closed.</p></article><article><small>APP HANDOFF</small><strong>Signed package only</strong><p>Approved free assets use a verified endpoint. Paid assets use a short-lived acquisition grant. Spark Plug shows an import review before saving.</p></article></div>
        {publishingHref ? <a className={styles.primaryLink} href={publishingHref}>CONTINUE TO PRO PUBLISHING ↗</a> : <button className={styles.primaryLink} type="button" disabled>PRO PUBLISHING DISABLED IN PREVIEW</button>}
      </section> : null}
    </section>
  );
}
