import Image from "next/image";
import Link from "next/link";

import { BrandLogo } from "./_components/brand-logo";
import { ReleaseDownloads } from "./_components/release-downloads";
import { Story } from "./_components/story";
import { currentRelease } from "../lib/release-manifest";
import styles from "./page.module.css";

const workflow = [
  ["01", "Pair", "Enroll a browser, native client, or compatible harness to one exact node over HTTPS."],
  ["02", "Build", "Choose models and tune context, concurrency, streaming, residency, media, and route policy per engine."],
  ["03", "Apply", "GW Broker checks the complete profile against current capacity before it changes runtime state."],
  ["04", "Work", "Authorized apps call stable endpoints while engine state, queues, memory, and results stay observable."],
];

const engines = [
  ["vLLM", "QUALIFIED FIRST", "Primary concurrent inference on DGX Spark, with model, context, parser, streaming, and memory controls."],
  ["Colibri", "WORKING BUILD", "An independent text and reasoning lane for slow, large, background workloads. Its queue and settings remain separate."],
  ["ComfyUI", "WORKING BUILD", "Typed image, video, and 3D jobs with their own queue, memory policy, progress, and returned assets."],
  ["MLX + Ollama", "ROADMAP", "Future engine contracts for additional node classes. They are not first-release compatibility claims."],
];

const harnesses = [
  ["OPENCLAW", "/integrations/openclaw.svg"],
  ["HERMES", "/integrations/hermes.svg"],
  ["PAPERCLIP", "/integrations/paperclip.svg"],
  ["CODEX", "/integrations/codex.svg"],
  ["CLAUDE CODE", "/integrations/claude-code.svg"],
] as const;

const faqs = [
  ["Is Spark Plug an AI model?", "No. Spark Plug is the control application and GW Broker around the models and engines you choose."],
  ["Does every request leave my network?", "No. Local clients, GW Broker, and local engines can operate on your infrastructure. Optional cloud routes and Rabbit R1 transport have separate, clearly disclosed boundaries."],
  ["Can I control it away from home?", "Yes, when your node is reachable through a supported HTTPS path such as Tailscale or a compatible user-managed VPN. Network reachability never replaces Spark Plug authentication."],
  ["Do I need a DGX Spark?", "DGX Spark with Ubuntu 24.04 ARM64 is the first qualified public node target. Other systems need their own tested engine and installer contracts."],
  ["Can I download it today?", "The public repository is open. Installers remain disabled until the matching source, checksum, release notes, and clean-install evidence are published together."],
];

export default function Home() {
  return (
    <main>
      <a className={styles.skipLink} href="#main-content">Skip to content</a>
      <header className={styles.header}>
        <Link className={styles.brandLink} href="/" aria-label="Spark Plug home">
          <BrandLogo className={styles.brandLogo} />
        </Link>
        <nav className={styles.nav} aria-label="Primary navigation">
          <a href="#product">Product</a><a href="#routing">Routing</a><a href="#engines">Engines</a><a href="#devices">Devices</a><a href="#release">Release</a>
        </nav>
        <a className={styles.headerCta} href={currentRelease.repositoryUrl} rel="noopener noreferrer">GitHub <span aria-hidden="true">↗</span></a>
      </header>

      <div id="main-content">
        <Story />

        <section className={styles.definition} id="product" aria-labelledby="product-title">
          <div><p className={styles.eyebrow}>THE ACTUAL PRODUCT</p><h2 id="product-title">Run the AI machine you own.</h2></div>
          <div className={styles.definitionCopy}><p className={styles.lead}>Spark Plug is a local control app and GW Broker for your models, media engines, queues, and authorized tools.</p><p>Build one profile for the work you want to run. Spark Plug checks whether it fits, applies the required runtimes, and shows what is stopped, loading, ready, busy, queued, or failed.</p></div>
          <div className={styles.workflowGrid} id="workflow">
            {workflow.map(([number, title, copy]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></article>)}
          </div>
          <div className={styles.harnessRow} aria-label="Compatible agent and coding harnesses">
            <p>CONNECT THE TOOLS YOU ALREADY USE</p>
            <div>
              {harnesses.map(([name, icon]) => <span key={name}><Image src={icon} width={36} height={36} alt="" loading="eager" unoptimized /><b>{name}</b></span>)}
              <span className={styles.moreHarnesses}><b>+ COMPATIBLE ENDPOINTS</b></span>
            </div>
          </div>
        </section>

        <section className={styles.routing} id="routing" aria-labelledby="routing-title">
          <div className={styles.sectionHead}><div><p className={styles.eyebrow}>GW BROKER + NVIDIA NEMO SWITCHYARD</p><h2 id="routing-title">Different work. The right lane.</h2></div><p>GW Broker authenticates and admits every request. For automatic text routing, Switchyard can recommend an allowed model; the broker adopts only a route already approved by the active profile.</p></div>
          <div className={styles.routeScene} aria-label="Illustrative request routing examples">
            <div className={styles.requestStack}>
              <article data-route="fast"><small>OPENCLAW / INTERACTIVE</small><strong>“What time is it?”</strong><span>FAST RESPONSE</span></article>
              <article data-route="code"><small>HERMES / CODING</small><strong>“Build a watch app.”</strong><span>DEEPER REASONING</span></article>
              <article data-route="batch"><small>PAPERCLIP / BACKGROUND</small><strong>“Prepare five days of reports.”</strong><span>LONG-RUNNING JOB</span></article>
            </div>
            <div className={styles.routeLines} aria-hidden="true"><i /><i /><i /></div>
            <div className={styles.brokerCard}><BrandLogo compact className={styles.brokerMark} /><small>NODE AUTHORITY</small><h3>GW<br />BROKER</h3><ul><li>authenticate</li><li>admit</li><li>route</li><li>observe</li></ul></div>
            <div className={styles.switchyardCard}><small>ADVISORY ROUTING</small><strong>NEMO<br />SWITCHYARD</strong><span>PROFILE-APPROVED CANDIDATES ONLY</span></div>
            <div className={styles.modelStack}>
              <article><i /><div><small>vLLM / FAST LANE</small><strong>NEMOTRON 8B</strong></div></article>
              <article><i /><div><small>vLLM / PRIMARY</small><strong>QWEN 27B</strong></div></article>
              <article><i /><div><small>COLIBRI / EXPERIMENTAL</small><strong>GLM-5.2 BACKGROUND</strong></div></article>
            </div>
          </div>
          <p className={styles.diagramNote}>Illustrative policy examples—not benchmark results. Explicit engine or model requests bypass advisory routing. Media uses typed ComfyUI endpoints.</p>
        </section>

        <section className={styles.engines} id="engines" aria-labelledby="engines-title">
          <div className={styles.sectionHead}><div><p className={styles.eyebrow}>PROFILE-CONTROLLED ENGINES</p><h2 id="engines-title">One profile. Separate runtimes.</h2></div><p>Each engine keeps its own settings, health, queue, and memory cost. The profile coordinates them without pretending they are interchangeable.</p></div>
          <div className={styles.engineGrid}>{engines.map(([name, status, copy]) => <article key={name}><span>{status}</span><h3>{name}</h3><p>{copy}</p></article>)}</div>
          <div className={styles.capacityPanel}>
            <div><p className={styles.eyebrow}>MEMORY ADMISSION</p><h3>Check capacity before changing models.</h3><p>GW Broker combines the selected engines, resident models, context, queues, services, and protected system headroom before Apply can proceed.</p></div>
            <div className={styles.ledger} aria-label="Illustrative shared memory ledger"><header><span>UNIFIED MEMORY / EXAMPLE</span><b>128 GB</b></header><div className={styles.meter}><i /><i /><i /><i /></div><ul><li><i />vLLM</li><li><i />Colibri</li><li><i />Media jobs</li><li><i />Protected</li></ul><small>Live decisions use current node telemetry. Cluster admission is not enabled yet.</small></div>
          </div>
        </section>

        <section className={styles.mediaSection} id="media" aria-labelledby="media-title">
          <div className={styles.mediaVisual} aria-hidden="true"><div className={styles.mediaCanvas}><span>IMAGE</span><i /><i /><i /></div><div className={styles.mediaQueue}><span>QUEUED 03</span><b>GENERATING</b><span>ASSET READY</span></div><div className={styles.mesh}><i /><i /><i /><i /><i /><i /></div></div>
          <div className={styles.mediaCopy}><p className={styles.eyebrow}>COMFYUI MEDIA LANE</p><h2 id="media-title">Generate it. Queue it. Keep it.</h2><p>Image, video, and 3D work should not disappear into a chat response. Spark Plug gives ComfyUI jobs a dedicated queue, visible progress, memory policy, and returned asset record.</p><ul><li><strong>Generation queue</strong><span>See what is waiting, running, completed, or failed.</span></li><li><strong>Asset management</strong><span>Return outputs to the requesting client without mixing them into model state.</span></li><li><strong>TRELLIS 3D</strong><span>Image-to-3D runs as a qualified ComfyUI workflow—not a separate broker engine.</span></li></ul></div>
        </section>

        <section className={styles.devices} id="devices" aria-labelledby="devices-title">
          <div className={styles.deviceCopy}><p className={styles.eyebrow}>BUILT ON DGX SPARK. CONTROLLED FROM YOUR DEVICES.</p><h2 id="devices-title">Your node does not need you sitting beside it.</h2><p>Use the browser, Mac, iPhone, or iPad to inspect state and change approved profiles. Connect on LAN or Wi-Fi, through Tailscale, or through a compatible VPN that provides routed HTTPS reachability.</p><p className={styles.deviceBoundary}>Remote networking provides a path. Spark Plug pairing and node authentication still decide who gets control.</p></div>
          <div className={styles.deviceVisual}><div className={styles.desktopFrame}><span>SPARK PLUG / NODE READY</span><Image src="/dgx/dgx-spark-front.jpg" width={800} height={541} alt="NVIDIA DGX Spark, the first supported Spark Plug node" /></div><div className={styles.phoneFrame}><i /><strong>READY</strong><span>QWEN 27B</span><small>vLLM · 262K</small></div><div className={styles.tabletFrame}><span>PROFILE</span><strong>CREATIVE + CODE</strong><i /></div></div>
        </section>

        <section className={styles.localValue} id="local-ai" aria-labelledby="local-title"><div><p className={styles.eyebrow}>MANAGED LOCAL AI</p><h2 id="local-title">Domesticate your AI.</h2></div><div><p className={styles.lead}>Owning compute is useful. Knowing what it is running—and who can reach it—is better.</p><p>Spark Plug is being built for developers and businesses that want local models without treating infrastructure like a mystery box: explicit clients, saved profiles, capacity checks, separate queues, and observable runtime state.</p></div></section>

        <section className={styles.rabbit} id="rabbit-r1" aria-labelledby="rabbit-title">
          <div className={styles.rabbitBadge} aria-hidden="true"><span>r1</span><i /></div>
          <div><p className={styles.eyebrow}>RABBIT R1 / INTEGRATION PREVIEW</p><h2 id="rabbit-title">Handheld control—with a disclosed cloud boundary.</h2><p>When a request starts on Rabbit R1, Rabbit’s service transports it to the user’s computer. From there, Spark Plug can send approved work through the local broker and local engines. That transport is not the same as an entirely local request.</p><div className={styles.rabbitNotes}><span>NO RABBIT PARTNERSHIP OR ENDORSEMENT</span><span>THIRD-PARTY TERMS APPLY</span><span>LOCAL EXECUTION AFTER TRANSPORT</span></div><p className={styles.rabbitLinks}><Link href="/terms#rabbit-r1">Read the Spark Plug disclosure</Link><a href="https://www.rabbit.tech/support/article/agents-on-rabbit-r1" rel="noopener noreferrer">Rabbit’s agent documentation ↗</a></p></div>
        </section>

        <section className={styles.roadmap} id="roadmap" aria-labelledby="roadmap-title">
          <div><p className={styles.eyebrow}>WHAT’S NEXT</p><h2 id="roadmap-title">More clients. More nodes. Proven one platform at a time.</h2></div>
          <ol><li><span>NOW</span><div><h3>DGX Spark / Linux first</h3><p>Ubuntu 24.04 ARM64 is the first public node contract, led by vLLM concurrency and inference.</p></div></li><li><span>NEXT</span><div><h3>Android + public Mac client</h3><p>Control the node from more devices without turning every client into compute.</p></div></li><li><span>ROADMAP</span><div><h3>Mac nodes</h3><p>Apple Silicon node support centered on qualified MLX and Ollama contracts. vLLM is not promised without proven upstream support.</p></div></li><li><span>ROADMAP</span><div><h3>Windows nodes</h3><p>AMD and NVIDIA paths with engines qualified for each stack. MLX is not presented as a Windows engine.</p></div></li></ol>
        </section>

        <section className={styles.release} id="release" aria-labelledby="release-title"><h2 id="release-title" className={styles.srOnly}>Spark Plug releases</h2><ReleaseDownloads manifest={currentRelease} /></section>

        <section className={styles.faq} aria-labelledby="faq-title"><div><p className={styles.eyebrow}>STRAIGHT ANSWERS</p><h2 id="faq-title">Before you plug in.</h2></div><div className={styles.faqList}>{faqs.map(([question, answer]) => <details key={question}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}</div></section>
      </div>

      <footer className={styles.footer}><div><Link href="/" aria-label="Spark Plug home"><BrandLogo className={styles.brandLogo} /></Link><p>A GameWorlds product.</p></div><nav aria-label="Footer navigation"><a href={currentRelease.repositoryUrl} rel="noopener noreferrer">GitHub</a><Link href="/benchmarks">Benchmarks</Link><Link href="/security">Security</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/trademarks">Trademarks</Link></nav><p>© 2026 GameWorlds. Independent software. Product names belong to their respective owners.</p></footer>
    </main>
  );
}
