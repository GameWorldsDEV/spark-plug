import Image from "next/image";
import Link from "next/link";

import { Story } from "./_components/story";
import styles from "./page.module.css";

const engines = [
  { name: "vLLM", status: "Working build", tone: "live", role: "General local inference", detail: "A profile selects models and sets context, streaming, concurrency, request limits, and residency policy." },
  { name: "Colibri", status: "Working build", tone: "live", role: "A separate local inference lane", detail: "It has its own selected models, context presets, reply and sampling defaults, health contract, and queue." },
  { name: "ComfyUI", status: "Working build", tone: "live", role: "Image and media jobs", detail: "Media work has its own profile policy, queue, status, and memory budget." },
  { name: "Switchyard", status: "In qualification", tone: "qualifying", role: "Profile-scoped request routing", detail: "It may choose only among routes the node owner placed in the active profile. It is not part of the first public claim until qualification finishes." },
];

const controls = [
  { number: "01", title: "Pair", copy: "Discover a node on your network, move authentication to HTTPS, and enroll each device to that exact machine." },
  { number: "02", title: "Build", copy: "Choose models and set each engine’s context, streaming, concurrency, residency, media, and routing rules in one saved profile." },
  { number: "03", title: "Apply", copy: "The broker checks the plan against available memory, starts or stops the required services, and reports loading separately from ready." },
  { number: "04", title: "Work", copy: "Connected apps call the node through stable endpoints. The broker sends work to the selected engine and keeps each queue and result observable." },
];

const releaseSteps = [
  ["01", "Qualify the current build", "The broker, profile workflow, engines, queues, clients, and accessibility must pass together on the supported DGX Spark configuration."],
  ["02", "Extract a clean public core", "Only reviewed source crosses into the new public repository. Private credentials, profiles, histories, addresses, and deployment details stay out."],
  ["03", "Prove the installer", "Preflight checks must verify the operating system, architecture, drivers, storage, memory, dependencies, and exact release before changing a node."],
  ["04", "Publish the release evidence", "The repository, supported installers, setup guide, release notes, checksums, and measured compatibility results must agree before the release is called ready."],
];

const faqs = [
  ["Is Spark Plug an AI model?", "No. Spark Plug is the control app and node broker around the models you choose. It installs and supervises engines, saves workload profiles, admits work against memory, and gives clients one controlled way into the node."],
  ["What is a profile?", "A profile is the configuration Spark Plug applies to the node. It records the selected vLLM and Colibri models, engine settings, residency, context, streaming, concurrency, ComfyUI policy, and allowed routing candidates."],
  ["Can I control it from another device?", "The current product has browser, Mac, iPhone, and iPad control surfaces. Each client enrolls to a specific node; local discovery does not replace authentication, and credentials move only over the node’s HTTPS path."],
  ["Do I need a DGX Spark?", "DGX Spark with Ubuntu 24.04 ARM64 is the first qualified public node target. The product architecture is endpoint-based, but other node classes need their own tested engine and installer contracts."],
  ["Does the local product require a cloud account?", "No. The node owns its local account, pairing, profiles, engines, queues, and controls. A cloud provider may be added as an optional route, and Tailscale may provide remote reachability, but neither replaces node authentication."],
  ["Is the private GameWorlds build being published?", "No. The public edition is separately maintained and sanitized. Private credentials, profiles, routes, identities, histories, node addresses, and Tailnet details never ship."],
];

export default function Home() {
  return (
    <main>
      <a className={styles.skipLink} href="#main-content">Skip to content</a>
      <header className={styles.header}>
        <Link className={styles.brand} href="/" aria-label="Spark Plug home"><span aria-hidden="true"><i /></span>SPARK PLUG</Link>
        <nav className={styles.nav} aria-label="Primary navigation">
          <a href="#product">Product</a><a href="#workflow">Workflow</a><a href="#engines">Engines</a><a href="#release-status">Release</a><Link href="/benchmarks">Benchmarks</Link><a href="https://github.com/GameWorldsDEV/spark-plug" rel="noopener noreferrer">GitHub</a>
        </nav>
        <a className={styles.headerCta} href="#release">Request release access</a>
      </header>

      <div id="main-content">
        <Story />

        <section className={styles.definition} id="product" aria-labelledby="definition-title">
          <p className={styles.eyebrow}>THE ACTUAL PRODUCT</p>
          <div className={styles.definitionGrid}>
            <h2 id="definition-title">One control system for the AI machine you own.</h2>
            <div><p className={styles.lead}>Spark Plug is a local control app and broker for a dedicated AI node. It connects the node’s models and media engines to the computers, phones, agents, and tools you authorize.</p><p>Pair a client to one node. Select or import models. Save their engine settings as a profile. Apply that profile. Spark Plug then supervises services, memory, queues, and connections while reporting whether a model is stopped, loading, ready, busy, or failed.</p></div>
          </div>
          <div className={styles.principles}><span>NODE-OWNED ACCOUNTS</span><span>PROFILE-DRIVEN</span><span>MULTI-ENGINE</span><span>CLIENT-READY</span></div>
        </section>

        <section className={styles.architecture} id="workflow" aria-labelledby="architecture-title">
          <div className={styles.sectionHead}><div><p className={styles.eyebrow}>ONE NODE, MANY SURFACES</p><h2 id="architecture-title">The node stays in charge.</h2></div><p>The broker runs on the node and holds the runtime truth. Enrolled clients use its API to manage profiles and see status; authorized agents and tools use its inference routes to submit work.</p></div>
          <div className={styles.routeMap}>
            <div className={styles.stack}><small>CLIENTS</small><span>MAC + BROWSER</span><span>IPHONE + IPAD</span><span>AGENTS + HARNESSES</span></div>
            <div className={styles.wire}><i /><b>PAIR / CALL</b></div>
            <div className={styles.router}><span>SP</span><small>NODE AUTHORITY</small><strong>SPARK<br />PLUG</strong><ul><li>admit</li><li>route</li><li>prove</li></ul></div>
            <div className={`${styles.wire} ${styles.wireOut}`}><i /><b>PROFILE</b></div>
            <div className={styles.stack}><small>WORK LANES</small><span>vLLM</span><span>COLIBRI</span><span>COMFYUI</span><span>CLOUD*</span></div>
          </div>
          <p className={styles.diagramNote}>*Cloud routes are optional and owner-configured. They are not required for local accounts, local engines, or local control.</p>
        </section>

        <section className={styles.controlSection} aria-labelledby="control-title">
          <div className={styles.sectionHead}><div><p className={styles.eyebrow}>THE OPERATING WORKFLOW</p><h2 id="control-title">Pair. Build. Apply. Work.</h2></div><p>These are product operations, not a marketing sequence. Pairing grants a client access, a profile defines the workload, Apply changes node state, and the broker handles requests.</p></div>
          <div className={styles.controlGrid}>{controls.map((item) => <article key={item.number}><span>{item.number}</span><h3>{item.title}</h3><p>{item.copy}</p></article>)}</div>
        </section>

        <section className={styles.engines} id="engines" aria-labelledby="engines-title">
          <div className={styles.sectionHead}><div><p className={styles.eyebrow}>PROFILE-CONTROLLED ENGINES</p><h2 id="engines-title">One profile. Separate runtimes.</h2></div><p>vLLM, Colibri, and ComfyUI do different jobs and keep separate settings, health checks, queues, and memory costs. The profile coordinates them without pretending they are interchangeable.</p></div>
          <div className={styles.engineTable}>
            <div className={styles.tableHead}><span>ENGINE</span><span>ROLE</span><span>CURRENT PRODUCT STATE</span></div>
            {engines.map((engine) => <article key={engine.name}><h3>{engine.name}</h3><div><strong>{engine.role}</strong><p>{engine.detail}</p></div><span className={styles.status} data-tone={engine.tone}><i />{engine.status}</span></article>)}
          </div>
        </section>

        <section className={styles.memory} aria-labelledby="memory-title">
          <div className={styles.memoryCopy}><p className={styles.eyebrow}>MEMORY ADMISSION</p><h2 id="memory-title">Check capacity before changing the node.</h2><p>Spark Plug reads current physical and process memory, protects a system reserve, and estimates the cost of the profile’s resident models and services. Apply can then proceed, queue work, or fail with a reason instead of silently overcommitting the machine.</p></div>
          <div className={styles.ledger} aria-label="Illustrative shared memory ledger">
            <div className={styles.ledgerTop}><span>UNIFIED MEMORY / ILLUSTRATIVE</span><b>128 GB</b></div>
            <div className={styles.meter}><i data-part="vllm" /><i data-part="colibri" /><i data-part="media" /><i data-part="safe" /></div>
            <ul><li><i data-color="vllm" /><span>vLLM</span><small>primary inference</small></li><li><i data-color="colibri" /><span>Colibri</span><small>independent engine</small></li><li><i data-color="media" /><span>Media / jobs</span><small>queued capacity</small></li><li><i data-color="safe" /><span>Protected</span><small>system headroom</small></li></ul>
            <p>Example only. Live values come from current process, cgroup, queue, and physical-memory telemetry.</p>
          </div>
        </section>

        <section className={styles.hardware} aria-labelledby="hardware-title">
          <div className={styles.hardwarePhoto}><Image src="/dgx/dgx-spark-front.jpg" width={800} height={541} sizes="(max-width: 800px) 100vw, 55vw" alt="A real NVIDIA DGX Spark photographed from the front" /><span>REAL DEVELOPMENT HARDWARE / NO GENERATED PROP</span></div>
          <div className={styles.hardwareCopy}><p className={styles.eyebrow}>FIRST SUPPORTED NODE</p><h2 id="hardware-title">Built on DGX Spark. Controlled from your devices.</h2><p>The current build runs on an NVIDIA DGX Spark with Ubuntu 24.04 ARM64. Its node service owns accounts, profiles, credentials, engine state, and queues; browser and native clients connect back to that authority.</p><ul><li><strong>Exact enrollment</strong><span>Every client is paired to the specific node it may control.</span></li><li><strong>Optional remote path</strong><span>LAN discovery works locally; Tailscale can provide reachability away from home but does not provide Spark Plug authentication.</span></li><li><strong>One qualified target</strong><span>Other hardware is not claimed until it has its own tested installer and engine contract.</span></li></ul></div>
        </section>

        <section className={styles.boundary} aria-labelledby="boundary-title">
          <div><p className={styles.eyebrow}>THE PUBLIC-RELEASE BOUNDARY</p><h2 id="boundary-title">Publish the software, not a private machine.</h2><p>The public core is being extracted into a new, reviewed repository. Product code and declarative setup contracts may cross that boundary. Runtime data from development nodes may not.</p></div>
          <div className={styles.boundaryCards}><article><span>PLANNED PUBLIC CORE</span><ul><li>Reviewed source with new history</li><li>Local account and pairing contracts</li><li>Profile, broker, engine, and node controls</li><li>Installer checks and setup documentation</li></ul></article><article className={styles.never}><span>EXCLUDED FROM RELEASE</span><ul><li>Credentials, tokens, or account pools</li><li>Private profiles, prompts, or histories</li><li>Node identities, addresses, or internal URLs</li><li>Personal runtime state and deployment topology</li></ul></article></div>
        </section>

        <section className={styles.plans} id="release-status" aria-labelledby="plans-title">
          <div className={styles.sectionHead}><div><p className={styles.eyebrow}>FIRST PUBLIC RELEASE</p><h2 id="plans-title">What exists now. What ships next.</h2></div><p>The product is working in the private development build, and the public release repository is now open for documentation and issue tracking. Product source and installers are still being prepared. There is no public product download, paid plan, or marketplace to buy today.</p></div>
          <div className={styles.planGrid}>
            <article><p>CURRENT WORKING BUILD</p><h3>Built <small>and in use</small></h3><ul><li>Node-owned accounts and HTTPS client pairing</li><li>Saved profiles that configure multiple engines</li><li>Separate inference and media queues</li><li>Memory admission and observable readiness</li><li>Browser, Mac, iPhone, and iPad control surfaces</li></ul><a href="#product">Review how it works</a></article>
            <article className={styles.pro}><span>IN PREPARATION</span><p>PUBLIC RELEASE</p><h3>Next <small>after qualification</small></h3><ul><li>Reviewed product source added to the public repository</li><li>DGX Spark installer with preflight checks</li><li>Documented support and security boundary</li><li>Release notes, checksums, and measured results</li><li>No pricing claim before plans are approved</li></ul><a href="https://github.com/GameWorldsDEV/spark-plug" rel="noopener noreferrer">Follow on GitHub</a></article>
          </div>
          <p className={styles.planPromise}>Release status as of August 30, 2026. Dates, pricing, and hosted services are not announced.</p>
        </section>

        <section className={styles.releasePath} aria-labelledby="path-title">
          <div><p className={styles.eyebrow}>THE RELEASE GATE</p><h2 id="path-title">Working privately is not the same as shipping publicly.</h2><p>The first release must prove the supported node, clean source boundary, installer, documentation, and runtime behavior as one product.</p></div>
          <ol>{releaseSteps.map(([number,title,copy]) => <li key={number}><span>{number}</span><div><h3>{title}</h3><p>{copy}</p></div></li>)}</ol>
        </section>

        <section className={styles.bench} id="benchmarks" aria-labelledby="bench-title">
          <div><p className={styles.eyebrow}>MEASURED, NOT MARKETED</p><h2 id="bench-title">If we did not run it, we do not print it.</h2></div>
          <div className={styles.benchCard}><span><i />NO RESULTS PUBLISHED YET</span><h3>Public benchmark ledger</h3><p>The table is intentionally empty. A result will appear only with the hardware, software build, engine, model, quantization, context, concurrency, test method, and date needed to interpret it.</p><Link href="/benchmarks">See the publication rules ↗</Link></div>
        </section>

        <section className={styles.securityStrip}><div><p className={styles.eyebrow}>SECURITY BOUNDARY</p><h2>Local control starts with an exact node and an exact client.</h2></div><p>The node owns authentication and credentials. Discovery does not grant access, remote networking does not replace authentication, and the public release excludes private runtime state.</p><Link href="/security">Read what is live and what is planned ↗</Link></section>

        <section className={styles.faq} aria-labelledby="faq-title"><div><p className={styles.eyebrow}>STRAIGHT ANSWERS</p><h2 id="faq-title">Before you plug in.</h2></div><div className={styles.faqList}>{faqs.map(([question,answer]) => <details key={question}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}</div></section>

        <section className={styles.join} id="release" aria-labelledby="join-title"><p className={styles.eyebrow}>EARLY RELEASE ACCESS</p><h2 id="join-title">Help test the first honest release.</h2><p>The public repository now tracks documentation, security boundaries, and release work. Follow it now, or request an email when the qualified DGX Spark installer and reviewed product source are ready. This site does not pretend a download exists before it does.</p><div className={styles.releaseActions}><a className={styles.releaseCta} href="https://github.com/GameWorldsDEV/spark-plug" rel="noopener noreferrer">Follow on GitHub <span aria-hidden="true">↗</span></a><a className={styles.releaseCtaAlt} href="mailto:hello@gameworlds.ai?subject=Spark%20Plug%20public%20release%20access">Request release access <span aria-hidden="true">↗</span></a></div><p className={styles.releaseNote}>GitHub stars and traffic help measure public interest; they never unlock product features. No account or payment is required for the local core.</p></section>
      </div>

      <footer className={styles.footer}><div><Link className={styles.brand} href="/"><span aria-hidden="true"><i /></span>SPARK PLUG</Link><p>A GameWorlds product.</p></div><nav aria-label="Footer navigation"><a href="https://github.com/GameWorldsDEV/spark-plug" rel="noopener noreferrer">GitHub</a><Link href="/benchmarks">Benchmarks</Link><Link href="/security">Security</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/trademarks">Trademarks</Link></nav><p>© 2026 GameWorlds. Independent software. Product names belong to their respective owners.</p></footer>
    </main>
  );
}
