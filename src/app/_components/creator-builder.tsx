"use client";

import { FormEvent, useMemo, useState } from "react";
import styles from "./creator-builder.module.css";

type AssetKind = "profile" | "theme" | "motion";

const HEX_40 = /^[a-f0-9]{40}$/;
const HEX_64 = /^[a-f0-9]{64}$/;
const REPO = /^[A-Za-z0-9][A-Za-z0-9._-]{0,95}\/[A-Za-z0-9][A-Za-z0-9._-]{0,95}$/;

function safeSlug(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "sparkplug-asset";
}

async function digest(value: string) {
  const bytes = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function CreatorBuilder() {
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
  const [accent, setAccent] = useState("#a9ff2e");
  const [motionSlot, setMotionSlot] = useState("panel-enter");
  const [message, setMessage] = useState("Nothing leaves this browser.");
  const [packageHash, setPackageHash] = useState("");

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
        },
      }],
      routing: { defaultModelAlias: "primary-model", capabilities: ["chat"] },
    };
  }, [accent, context, engine, fileHash, filename, kind, license, motionSlot, name, quantization, repoId, revision, sizeBytes, summary]);

  const json = useMemo(() => JSON.stringify(asset, null, 2), [asset]);

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
    }
    return errors;
  }

  async function exportAsset(event: FormEvent) {
    event.preventDefault();
    const errors = validate();
    if (errors.length) {
      setPackageHash("");
      setMessage(errors.join(" "));
      return;
    }
    const hash = await digest(json);
    const extension = kind === "profile" ? "sparkplug-profile" : kind === "theme" ? "sparkplug-theme" : "sparkplug-motion";
    const url = URL.createObjectURL(new Blob([`${json}\n`], { type: "application/json" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${safeSlug(name)}.${extension}`;
    anchor.click();
    URL.revokeObjectURL(url);
    setPackageHash(hash);
    setMessage("Exported locally. Spark Plug must still validate and show an import review before saving it.");
  }

  return (
    <section className={styles.builder} aria-labelledby="creator-builder-title">
      <div className={styles.heading}>
        <div><p>LOCAL-ONLY CREATOR TOOL</p><h2 id="creator-builder-title">Build a safe starter package.</h2></div>
        <span>NO UPLOAD</span>
      </div>
      <form onSubmit={exportAsset}>
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
          <label>Engine<select value={engine} onChange={(event) => setEngine(event.target.value)}><option value="vllm">vLLM</option><option value="llama.cpp">llama.cpp</option><option value="transformers">Transformers</option><option value="comfyui">ComfyUI</option></select></label>
          <label>Quantization<select value={quantization} onChange={(event) => setQuantization(event.target.value)}><option value="none">None</option><option value="awq">AWQ</option><option value="gptq">GPTQ</option><option value="gguf">GGUF</option><option value="bitsandbytes">bitsandbytes</option></select></label>
          <label>Maximum context tokens<input inputMode="numeric" value={context} onChange={(event) => setContext(event.target.value)} /></label>
        </> : null}
        {kind === "theme" ? <label>Accent color<input type="color" value={accent} onChange={(event) => setAccent(event.target.value)} /></label> : null}
        {kind === "motion" ? <label>Motion slot<select value={motionSlot} onChange={(event) => setMotionSlot(event.target.value)}><option value="panel-enter">Panel enter</option><option value="profile-switch">Profile switch</option><option value="model-load">Model load</option><option value="queue-pulse">Queue pulse</option><option value="success">Success</option><option value="warning">Warning</option></select></label> : null}
        <div className={styles.actions}><button type="submit">VALIDATE + EXPORT LOCALLY</button><button type="button" disabled>PRO PUBLISHING / COMING SOON</button></div>
      </form>
      <div className={styles.output}><div><strong>Package preview</strong>{packageHash ? <small>SHA-256 {packageHash}</small> : null}</div><pre tabIndex={0} aria-label="Generated package JSON">{json}</pre></div>
      <p className={styles.status} role="status">{message}</p>
    </section>
  );
}
