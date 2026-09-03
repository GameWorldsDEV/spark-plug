import Image from "next/image";
import Link from "next/link";
import { LegalShell } from "../../_components/legal-shell";
import { detailMetadata } from "@/lib/metadata";
import styles from "../marketplace.module.css";

export const metadata = detailMetadata("Model catalog", "Find Hugging Face models and the files required by each Spark Plug engine.", "/marketplace/models");

const engines = [
  { name: "vLLM", status: "QUALIFIED FIRST", format: "Pinned Transformers repositories and safetensors selected for the qualified vLLM build.", href: "https://huggingface.co/models?library=transformers" },
  { name: "Colibri", status: "SPARK PLUG SIDECAR", format: "Pinned artifacts must match the reviewed Colibri runtime contract, accelerator backend, and exact model revision.", href: "https://huggingface.co/models?search=Colibri" },
  { name: "MLX", status: "APPLE TARGET", format: "Apple Silicon packages remain revision pinned and require model/runtime qualification before Spark Plug marks them ready.", href: "https://huggingface.co/models?library=mlx" },
  { name: "Ollama", status: "LOCAL TARGET", format: "Pinned model references stay separate from the Ollama runtime installation and platform evidence.", href: "https://huggingface.co/models?search=Ollama" },
  { name: "llama.cpp", status: "FORMAT GUIDE", format: "Pinned GGUF files with an explicit quantization and checksum. Runtime qualification remains platform-specific.", href: "https://huggingface.co/models?search=GGUF" },
  { name: "Transformers", status: "PROFILE READY", format: "Pinned repository revisions and selected files; architecture support must be proven by the installed engine.", href: "https://huggingface.co/models?library=transformers" },
  { name: "ComfyUI", status: "MEDIA FILES", format: "Checkpoints, adapters, encoders, and workflow dependencies listed separately with licenses and hashes.", href: "https://huggingface.co/models?search=ComfyUI" },
] as const;

export default function ModelsPage() {
  return <LegalShell eyebrow="HUGGING FACE / MODEL SOURCE" title="Find the model. Choose the engine files." summary="Spark Plug organizes reviewed Hugging Face references by engine, format, revision, license, storage, and memory fit. Downloads come from their model source after the user approves them; GameWorlds does not resell model weights.">
    <div className={styles.notice}><Image src="/integrations/hugging-face.svg" width={56} height={56} alt="Hugging Face logo" /><p><strong>Catalog publication is coming after exact-revision license review.</strong> Until then, these links open Hugging Face discovery pages and do not claim that every result is compatible, safe, or commercially usable.</p></div>
    <h2>Browse by engine</h2>
    <div className={styles.marketGrid}>
      {engines.map((engine) => <article key={engine.name}><small>{engine.status}</small><h3>{engine.name}</h3><p>{engine.format}</p><a href={engine.href} target="_blank" rel="noreferrer">EXPLORE ON HUGGING FACE ↗</a></article>)}
    </div>
    <h2>What a reviewed model entry will show</h2>
    <ul><li>Exact repository and immutable revision.</li><li>Engine and qualified version.</li><li>Selected files, sizes, and SHA-256 checksums.</li><li>Quantization, storage estimate, memory estimate, and tested hardware.</li><li>License, gating, attribution, commercial-use review, and safety labels.</li></ul>
    <h2>Use it in a profile</h2><p>Copy the reviewed repository, revision, files, and engine choice into the <Link href="/marketplace/create">local creator builder</Link>. Spark Plug will compare those requirements with the user&rsquo;s installed engines and local inventory before offering any download.</p>
  </LegalShell>;
}
