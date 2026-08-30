import Image from "next/image";
import Link from "next/link";

import { Story } from "./_components/story";
import { WaitlistForm } from "./_components/waitlist-form";
import styles from "./page.module.css";

const engines = [
  { name: "vLLM", status: "Integrated", tone: "live", role: "Resident and on-demand models", detail: "Profiles set model order, context, KV policy, streaming, and request limits." },
  { name: "Colibri", status: "Integrated", tone: "live", role: "Independent fast local lane", detail: "Its own model settings, context presets, scheduler, health contract, and queue." },
  { name: "ComfyUI", status: "Integrated", tone: "live", role: "Image and media jobs", detail: "Profile-aware media modes with a separate queue and memory policy." },
  { name: "Switchyard", status: "Qualifying", tone: "qualifying", role: "Profile-scoped automatic routing", detail: "Chooses only among local and cloud candidates that the owner placed in the active profile." },
];

const controls = [
  { number: "01", title: "Pair", copy: "Discover a node on your network, move authentication to HTTPS, and enroll each device to that exact machine." },
  { number: "02", title: "Build", copy: "Turn models, engine settings, tools, media policy, and routing candidates into a saved profile." },
  { number: "03", title: "Apply", copy: "The broker admits the plan against real memory, starts the right engines, and exposes loading truth instead of fake readiness." },
  { number: "04", title: "Work", copy: "Agents and apps use stable endpoints while Spark Plug manages queues, receipts, failures, and where results return." },
];

const releaseSteps = [
  ["01", "Freeze a proven product build", "Node accounts, pairing, profiles, engines, queues, clients, and accessibility must work together on real hardware."],
  ["02", "Extract the public core", "Reviewed functionality crosses into a clean repository; private nodes, routes, credentials, profiles, and histories do not."],
  ["03", "Ship a guided installer", "Doctor checks the OS, architecture, drivers, storage, memory, dependencies, and exact release before it mutates a node."],
  ["04", "Publish one verifiable release", "Source, desktop and mobile clients, setup documentation, release notes, hashes, and measured runs go live together."],
];

const faqs = [
  ["Is Spark Plug another AI model?", "No. It is the app and broker that turns models, engines, media tools, queues, memory, devices, and agent connections into one operable local-AI system."],
  ["What is a profile?", "A profile is a saved workload plan: which vLLM and Colibri models participate, what stays resident, context and streaming settings, request limits, ComfyUI policy, routing candidates, and display preferences."],
  ["Can I control it from my phone or another computer?", "Yes. A node owns its account and can enroll desktop, browser, iPhone, and iPad clients. Discovery may begin on the LAN, but credentials move only over the node’s reviewed HTTPS path."],
  ["Do I need a DGX Spark?", "DGX Spark with Ubuntu 24.04 ARM64 is the first qualified public node target. The product architecture is endpoint-based, but other node classes need their own tested engine and installer contracts."],
  ["Does the free edition require a cloud login?", "No. Local accounts, pairing, profiles, routing, engines, queues, and controls remain usable without a required cloud identity. Cloud providers and remote convenience are optional."],
  ["Is the private GameWorlds build being published?", "No. The public edition is separately maintained and sanitized. Private credentials, profiles, routes, identities, histories, node addresses, and Tailnet details never ship."],
];

export default function Home() {
  return (
    <main>
      <a className={styles.skipLink} href="#main-content">Skip to content</a>
      <header className={styles.header}>
        <Link className={styles.brand} href="/" aria-label="Spark Plug home"><span aria-hidden="true"><i /></span>SPARK PLUG</Link>
        <nav className={styles.nav} aria-label="Primary navigation">
          <a href="#product">Product</a><a href="#workflow">Workflow</a><a href="#engines">Engines</a><a href="#plans">Plans</a><Link href="/benchmarks">Benchmarks</Link>
        </nav>
        <a className={styles.headerCta} href="#release">Join the release</a>
      </header>

      <div id="main-content">
        <Story />

        <section className={styles.definition} id="product" aria-labelledby="definition-title">
          <p className={styles.eyebrow}>THE ACTUAL PRODUCT</p>
          <div className={styles.definitionGrid}>
            <h2 id="definition-title">Your AI box should feel like one product.</h2>
            <div><p className={styles.lead}>Spark Plug is the node-and-client system for running local models, media tools, and agent connections on hardware you control.</p><p>Pair your devices. Find or import models. Build a profile. Apply it to the node. Then watch real engine, queue, memory, and connection state from one place—without pretending “request accepted” means “model ready.”</p></div>
          </div>
          <div className={styles.principles}><span>NODE-OWNED ACCOUNTS</span><span>PROFILE-DRIVEN</span><span>MULTI-ENGINE</span><span>CLIENT-READY</span></div>
        </section>

        <section className={styles.architecture} id="workflow" aria-labelledby="architecture-title">
          <div className={styles.sectionHead}><div><p className={styles.eyebrow}>ONE NODE, MANY SURFACES</p><h2 id="architecture-title">Control the box.<br />Connect the work.</h2></div><p>Your node remains the authority. Native clients, browsers, agents, and harnesses connect to the same broker contract instead of each inventing their own path into the machine.</p></div>
          <div className={styles.routeMap}>
            <div className={styles.stack}><small>CLIENTS</small><span>MAC + BROWSER</span><span>IPHONE + IPAD</span><span>AGENTS + HARNESSES</span></div>
            <div className={styles.wire}><i /><b>PAIR / CALL</b></div>
            <div className={styles.router}><span>SP</span><small>NODE AUTHORITY</small><strong>SPARK<br />PLUG</strong><ul><li>admit</li><li>route</li><li>prove</li></ul></div>
            <div className={`${styles.wire} ${styles.wireOut}`}><i /><b>PROFILE</b></div>
            <div className={styles.stack}><small>WORK LANES</small><span>vLLM</span><span>COLIBRI</span><span>COMFYUI</span><span>CLOUD*</span></div>
          </div>
          <p className={styles.diagramNote}>*Cloud providers are optional profile candidates. Local accounts, local engines, and local control do not require them.</p>
        </section>

        <section className={styles.controlSection} aria-labelledby="control-title">
          <div className={styles.sectionHead}><div><p className={styles.eyebrow}>THE DAILY WORKFLOW</p><h2 id="control-title">Pair. Build. Apply. Work.</h2></div><p>The app is not a decorative dashboard over loose services. Each step changes or proves something concrete on the node.</p></div>
          <div className={styles.controlGrid}>{controls.map((item) => <article key={item.number}><span>{item.number}</span><h3>{item.title}</h3><p>{item.copy}</p></article>)}</div>
        </section>

        <section className={styles.engines} id="engines" aria-labelledby="engines-title">
          <div className={styles.sectionHead}><div><p className={styles.eyebrow}>PROFILE-CONTROLLED ENGINES</p><h2 id="engines-title">Different runtimes.<br />One workload plan.</h2></div><p>A profile can use vLLM, Colibri, ComfyUI, and approved cloud routes without flattening them into one fake engine. Each keeps its own settings, health, queue, and memory footprint.</p></div>
          <div className={styles.engineTable}>
            <div className={styles.tableHead}><span>ENGINE</span><span>ROLE</span><span>RELEASE STATE</span></div>
            {engines.map((engine) => <article key={engine.name}><h3>{engine.name}</h3><div><strong>{engine.role}</strong><p>{engine.detail}</p></div><span className={styles.status} data-tone={engine.tone}><i />{engine.status}</span></article>)}
          </div>
        </section>

        <section className={styles.memory} aria-labelledby="memory-title">
          <div className={styles.memoryCopy}><p className={styles.eyebrow}>UNIFIED MEMORY, PLAIN LANGUAGE</p><h2 id="memory-title">Know what can run<br />before you press Apply.</h2><p><strong>Available to use = unused now + reusable memory.</strong> Spark Plug then subtracts protected system headroom and accounts for resident models, engine growth, active work, and media jobs. Requests wait in the correct queue when the box needs time.</p></div>
          <div className={styles.ledger} aria-label="Illustrative shared memory ledger">
            <div className={styles.ledgerTop}><span>UNIFIED MEMORY / ILLUSTRATIVE</span><b>128 GB</b></div>
            <div className={styles.meter}><i data-part="vllm" /><i data-part="colibri" /><i data-part="media" /><i data-part="safe" /></div>
            <ul><li><i data-color="vllm" /><span>vLLM</span><small>primary inference</small></li><li><i data-color="colibri" /><span>Colibri</span><small>independent engine</small></li><li><i data-color="media" /><span>Media / jobs</span><small>queued capacity</small></li><li><i data-color="safe" /><span>Protected</span><small>system headroom</small></li></ul>
            <p>Example only. Live values come from current process, cgroup, queue, and physical-memory telemetry.</p>
          </div>
        </section>

        <section className={styles.hardware} aria-labelledby="hardware-title">
          <div className={styles.hardwarePhoto}><Image src="/dgx/dgx-spark-front.jpg" width={800} height={541} sizes="(max-width: 800px) 100vw, 55vw" alt="A real NVIDIA DGX Spark photographed from the front" /><span>REAL DEVELOPMENT HARDWARE / NO GENERATED PROP</span></div>
          <div className={styles.hardwareCopy}><p className={styles.eyebrow}>THE NODE IS THE BOX</p><h2 id="hardware-title">The control surface travels. The authority stays home.</h2><p>Spark Plug is built and measured on a real NVIDIA DGX Spark node, then controlled from its browser, Mac app, iPhone, and iPad. The machine owns its accounts, profiles, credentials, and runtime truth.</p><ul><li><strong>One node identity</strong><span>Every client enrolls to the exact machine it controls.</span></li><li><strong>Home or away</strong><span>LAN discovery for home; optional Tailscale reachability away from it.</span></li><li><strong>Independent software</strong><span>NVIDIA is the first qualified node target, not a sponsor or cloud dependency.</span></li></ul></div>
        </section>

        <section className={styles.boundary} aria-labelledby="boundary-title">
          <div><p className={styles.eyebrow}>THE PUBLIC BOUNDARY</p><h2 id="boundary-title">The product can ship. Your machine cannot leak.</h2><p>The public edition is separately maintained, reviewed, and sanitized. Pairing, profiles, engine control, model management, and client workflows can cross the boundary; private state never does.</p></div>
          <div className={styles.boundaryCards}><article><span>PUBLIC EDITION</span><ul><li>Reviewed open-core source</li><li>Local accounts and pairing</li><li>Engine and node controls</li><li>Verified setup documentation</li></ul></article><article className={styles.never}><span>NEVER SHIPPED</span><ul><li>Credentials or account pools</li><li>Private profiles or histories</li><li>Node identities or internal URLs</li><li>Personal runtime configuration</li></ul></article></div>
        </section>

        <section className={styles.plans} id="plans" aria-labelledby="plans-title">
          <div className={styles.sectionHead}><div><p className={styles.eyebrow}>SIMPLE FROM DAY ONE</p><h2 id="plans-title">The engine is free.<br />Pro adds the finish.</h2></div><p>No compute-credit maze. Run the local core on your own hardware, then add optional visual and hosted convenience if it earns its place.</p></div>
          <div className={styles.planGrid}>
            <article><p>COMMUNITY</p><h3>Free <small>forever</small></h3><ul><li>Node-owned accounts and secure client pairing</li><li>Profiles, broker routing, and separate queues</li><li>vLLM, Colibri, ComfyUI, memory, and node controls</li><li>Model discovery and standard accessible UI</li><li>No required cloud account</li></ul><a href="#release">Join the release</a></article>
            <article className={styles.pro}><span>OPTIONAL</span><p>PRO</p><h3>$5 <small>/ month</small></h3><ul><li>Everything in Community</li><li>Premium themes and motion packs</li><li>Custom profile and model artwork</li><li>Private sync and hosted profiles</li><li>Privacy-safe usage analytics</li></ul><a href="#release">Get Pro updates</a><small>$48 annually when available.</small></article>
          </div>
          <p className={styles.planPromise}>Security, routing, engines, local accounts, and accessibility are never Pro gates.</p>
        </section>

        <section className={styles.releasePath} aria-labelledby="path-title">
          <div><p className={styles.eyebrow}>HOW WE SHIP</p><h2 id="path-title">Source tests are not a release.</h2><p>Every public build must cross a real machine, a clean boundary, and an installation path before it earns the label.</p></div>
          <ol>{releaseSteps.map(([number,title,copy]) => <li key={number}><span>{number}</span><div><h3>{title}</h3><p>{copy}</p></div></li>)}</ol>
        </section>

        <section className={styles.bench} id="benchmarks" aria-labelledby="bench-title">
          <div><p className={styles.eyebrow}>MEASURED, NOT MARKETED</p><h2 id="bench-title">If we did not run it, we do not print it.</h2></div>
          <div className={styles.benchCard}><span><i />RUNS IN PREPARATION</span><h3>Public benchmark ledger</h3><p>Published results include hardware, engine, model, quantization, context, concurrency, and method. The table stays empty until the evidence is ready.</p><Link href="/benchmarks">View the benchmark method ↗</Link></div>
        </section>

        <section className={styles.securityStrip}><div><p className={styles.eyebrow}>TRUST THE WIRING</p><h2>Local-first is a boundary, not a slogan.</h2></div><p>Credentials stay server-side. Setups declare access. Unknown sources cannot spend compute without owner approval.</p><Link href="/security">Read the security boundary ↗</Link></section>

        <section className={styles.faq} aria-labelledby="faq-title"><div><p className={styles.eyebrow}>STRAIGHT ANSWERS</p><h2 id="faq-title">Before you plug in.</h2></div><div className={styles.faqList}>{faqs.map(([question,answer]) => <details key={question}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}</div></section>

        <section className={styles.join} id="release" aria-labelledby="join-title"><p className={styles.eyebrow}>PUBLIC RELEASE LIST</p><h2 id="join-title">Build the profile.<br />Own the box.</h2><p>Get the open-core repository, node and client installers, verified setup guide, release notes, and first measured runs when the public build is ready.</p><WaitlistForm /><a className={styles.emailFallback} href="mailto:hello@gameworlds.ai?subject=Spark%20Plug%20early%20access">Prefer email? Contact hello@gameworlds.ai ↗</a></section>
      </div>

      <footer className={styles.footer}><div><Link className={styles.brand} href="/"><span aria-hidden="true"><i /></span>SPARK PLUG</Link><p>A GameWorlds product.</p></div><nav aria-label="Footer navigation"><Link href="/benchmarks">Benchmarks</Link><Link href="/security">Security</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/trademarks">Trademarks</Link></nav><p>© 2026 GameWorlds. Independent software. Product names belong to their respective owners.</p></footer>
    </main>
  );
}
