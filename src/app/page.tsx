import Image from "next/image";

import { ExperienceLayer } from "./_components/experience-layer";
import { PricingPlans } from "./_components/pricing-plans";
import { WaitlistForm } from "./_components/waitlist-form";
import styles from "./page.module.css";

const clients = ["OPENCLAW", "HERMES", "CLAUDE CODE", "PAPERCLIP"];

const creatorProfiles = [
  {
    badge: "FREE SETUP",
    name: "Quiet Studio",
    author: "DEMO PROFILE / MIRA K.",
    description: "A low-noise writing and research stack for one workstation.",
    stats: "12 ROUTES · 4 TOOLS",
    color: "lime",
  },
  {
    badge: "$12 PACK",
    name: "Film Lab",
    author: "DEMO PROFILE / NORTHFRAME",
    description: "Storyboard, image, video, and 3D handoffs in one durable queue.",
    stats: "28 ROUTES · 9 TOOLS",
    color: "cyan",
  },
  {
    badge: "FREE SETUP",
    name: "Research Bench",
    author: "DEMO PROFILE / OPEN SIGNAL",
    description: "Long-context local models with source-first output organization.",
    stats: "8 ROUTES · 6 TOOLS",
    color: "orange",
  },
];

export default function Home() {
  return (
    <main>
      <ExperienceLayer />
      <a className={styles.skipLink} href="#main-content">
        Skip to content
      </a>

      <header className={styles.header}>
        <a className={styles.wordmark} href="#top" aria-label="Spark Plug home">
          <span aria-hidden="true" className={styles.mark}>
            <span />
          </span>
          <span>SPARK PLUG</span>
        </a>
        <nav className={styles.nav} aria-label="Primary navigation">
          <a href="#how-it-works">How it works</a>
          <a href="#outputs">Outputs</a>
          <a href="#community">Community</a>
          <a href="#plans">Plans</a>
        </nav>
        <a className={styles.headerCta} href="#join">
          Get early access
        </a>
      </header>

      <div id="main-content">
        <section className={styles.hero} id="top" aria-labelledby="hero-title">
          <div className={styles.ambient} aria-hidden="true" />
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>
              <span aria-hidden="true" /> Local AI orchestration
            </p>
            <h1 id="hero-title">
              Plug in.
              <br />
              Route <em>anything.</em>
              <br />
              Keep control.
            </h1>
            <p className={styles.lede}>
              Spark Plug gives every agent one dependable path to the models,
              tools, and creative hardware you already own.
            </p>
            <div className={styles.heroActions}>
              <a className={styles.primaryCta} href="#join">
                Join early access <span aria-hidden="true">↗</span>
              </a>
              <a className={styles.textCta} href="#how-it-works">
                See the signal flow <span aria-hidden="true">↓</span>
              </a>
            </div>
            <ul className={styles.proofList} aria-label="Product highlights">
              <li>Free community core</li>
              <li>Bring your own hardware</li>
              <li>Agent-first MCP</li>
            </ul>
          </div>

          <div className={styles.stage}>
            <div className={styles.signalTag}>
              <span /> Signal locked
            </div>
            <div className={styles.machine} aria-hidden="true">
              <div className={styles.machineTop} />
              <div className={styles.machineSide} />
              <div className={styles.machineFace}>
                <div className={styles.machineBrand}>SPARK</div>
                <div className={styles.vent} />
                <div className={styles.powerRow}>
                  <span className={styles.powerLight} />
                  <span>ROUTER ONLINE</span>
                </div>
              </div>
              <div className={styles.energyCore} />
            </div>
            <div className={styles.cable} aria-hidden="true" />
            <div className={styles.routeCard}>
              <p>LIVE ROUTE</p>
              <strong>Agent → Broker → GPU</strong>
              <span>Local handoff · status visible</span>
            </div>
            <div className={styles.grid} aria-hidden="true" />
          </div>

          <a className={styles.scrollCue} href="#how-it-works">
            <span>Scroll to route</span>
            <i aria-hidden="true">↓</i>
          </a>
        </section>

        <section
          className={styles.intro}
          id="how-it-works"
          aria-labelledby="intro-title"
        >
          <div data-reveal>
            <p className={styles.sectionIndex}>01 / THE SIGNAL</p>
            <h2 id="intro-title">
              One clean connection between your agents and your compute.
            </h2>
            <p className={styles.introBody}>
              Choose the model. Spark Plug discovers capability metadata,
              queues the work, and returns a usable output to the agent that
              asked for it.
            </p>
          </div>
        </section>

        <section className={styles.signalFlow} aria-labelledby="flow-title">
          <div className={styles.sectionHeading} data-reveal>
            <div>
              <p className={styles.sectionIndex}>THE REQUEST PATH</p>
              <h2 id="flow-title">Every request stays understandable.</h2>
            </div>
            <p>
              One contract at the front. Explicit model facts in the middle.
              Durable output references at the end.
            </p>
          </div>

          <div className={styles.flowCanvas} data-reveal>
            <div className={styles.flowLine} aria-hidden="true">
              <span />
            </div>
            <article className={styles.flowNode}>
              <span>01 / ASK</span>
              <div className={styles.nodeGlyph} aria-hidden="true">A</div>
              <h3>Any connected agent</h3>
              <p>Requests text, images, video, audio, code, or a 3D job.</p>
            </article>
            <article className={styles.flowNode}>
              <span>02 / ROUTE</span>
              <div className={styles.nodeGlyph} aria-hidden="true">S</div>
              <h3>Spark Plug broker</h3>
              <p>Uses model capability facts and preserves queue state.</p>
            </article>
            <article className={styles.flowNode}>
              <span>03 / RUN</span>
              <div className={styles.nodeGlyph} aria-hidden="true">GPU</div>
              <h3>Your compute</h3>
              <p>Runs the model or creative workflow you selected.</p>
            </article>
            <article className={styles.flowNode}>
              <span>04 / RETURN</span>
              <div className={styles.nodeGlyph} aria-hidden="true">↗</div>
              <h3>Output receipt</h3>
              <p>Returns the artifact plus a durable URI or approved path.</p>
            </article>
          </div>

          <div className={styles.modelFact} data-reveal>
            <div className={styles.codeLabel}>MODEL FACT / CONTEXT WINDOW</div>
            <div className={styles.factValue}>131,072</div>
            <div className={styles.factMeta}>
              <span>source: model metadata</span>
              <span>status: known</span>
              <span>client refresh: required</span>
            </div>
          </div>
        </section>

        <section className={styles.powerStory} aria-labelledby="power-title">
          <div className={styles.powerBackdrop} aria-hidden="true" />
          <div className={styles.powerCopy} data-reveal>
            <p className={styles.sectionIndex}>02 / POWER ON</p>
            <h2 id="power-title">Your GPU box becomes reachable.</h2>
            <p>
              Spark Plug loads the route, the status light turns green, and
              agents see one consistent interface instead of a pile of ports,
              containers, and model-specific response formats.
            </p>
            <ul>
              <li><strong>01</strong> Discover live capabilities</li>
              <li><strong>02</strong> Bind approved tools and queues</li>
              <li><strong>03</strong> Return outputs through MCP</li>
            </ul>
          </div>
          <div className={styles.powerVisual} data-reveal>
            <figure className={styles.powerRenderFrame}>
              <Image
                className={styles.powerRender}
                src="/power-core-mcp.png"
                width={1536}
                height={864}
                sizes="(max-width: 1080px) 100vw, 55vw"
                alt="Original concept render of a generic compute box powering on with a vivid green core"
              />
              <figcaption>
                Generated through Spark Plug’s private media route and returned
                to the requesting agent through MCP.
              </figcaption>
            </figure>
            <div className={styles.powerTelemetry}>
              <p>SPARK PLUG LOADED</p>
              <span>broker</span><strong>healthy</strong>
              <span>queue</span><strong>persistent</strong>
              <span>outputs</span><strong>exposed</strong>
            </div>
          </div>
          <p className={styles.hardwareNote}>
            Hardware shown is an original generic visualization. Spark Plug is
            independent and is not sponsored, endorsed, or affiliated with NVIDIA.
          </p>
        </section>

        <section className={styles.outputs} id="outputs" aria-labelledby="outputs-title">
          <div className={styles.sectionHeading} data-reveal>
            <div>
              <p className={styles.sectionIndex}>03 / GET IT BACK</p>
              <h2 id="outputs-title">A render is not done until the agent can reach it.</h2>
            </div>
            <p>
              Completed media lands in an output ledger with a preview, provenance,
              status, and a reference the requesting agent can actually use.
            </p>
          </div>

          <div className={styles.outputConsole} data-reveal>
            <aside className={styles.consoleRail} aria-label="Output filters">
              <p>OUTPUTS</p>
              <button className={styles.activeFilter} type="button">All <span>18</span></button>
              <button type="button">Images <span>12</span></button>
              <button type="button">Video <span>3</span></button>
              <button type="button">3D <span>2</span></button>
              <button type="button">Audio <span>1</span></button>
            </aside>
            <div className={styles.assetPanel}>
              <div className={styles.assetHeader}>
                <div>
                  <span className={styles.statusDot} /> COMPLETE
                </div>
                <span>REQ-8F2A</span>
              </div>
              <div
                className={styles.assetPreview}
                role="img"
                aria-label="Abstract preview for a completed cinematic render"
              >
                <span>CINEMATIC FRAME / 04</span>
                <div className={styles.previewOrb} aria-hidden="true" />
              </div>
              <div className={styles.assetMeta}>
                <div><span>FORMAT</span><strong>PNG · 2048 × 1152</strong></div>
                <div><span>CREATED BY</span><strong>local-image-01</strong></div>
                <div><span>POLICY</span><strong>owner approved</strong></div>
              </div>
            </div>
            <aside className={styles.receiptPanel} aria-label="Agent output receipt">
              <p>AGENT RECEIPT</p>
              <div className={styles.receiptStatus}>✓ returned through MCP</div>
              <dl>
                <dt>artifact_uri</dt>
                <dd>sparkplug://outputs/req-8f2a/final</dd>
                <dt>preview</dt>
                <dd>/api/outputs/req-8f2a/preview</dd>
                <dt>expires</dt>
                <dd>never · owner managed</dd>
              </dl>
              <button type="button">Copy reference</button>
            </aside>
          </div>
          <p className={styles.consoleCaption} data-reveal>
            Illustrative public demo UI. No private dashboard source, screenshots,
            production paths, or customer data are included.
          </p>
        </section>

        <section className={styles.clients} aria-labelledby="clients-title">
          <p id="clients-title">ONE MCP CONTRACT / THE CLIENTS YOU CHOOSE</p>
          <div className={styles.clientMarquee}>
            {[...clients, ...clients].map((client, index) => (
              <span key={`${client}-${index}`}>{client}<i aria-hidden="true">✦</i></span>
            ))}
          </div>
          <small>
            Client names are trademarks of their respective owners. Compatibility
            references do not imply sponsorship or endorsement.
          </small>
        </section>

        <section className={styles.community} id="community" aria-labelledby="community-title">
          <div className={styles.sectionHeading} data-reveal>
            <div>
              <p className={styles.sectionIndex}>04 / COMMUNITY SIGNALS</p>
              <h2 id="community-title">Find a setup. Or make yours worth following.</h2>
            </div>
            <p>
              Community can browse, download, and build unlimited profiles locally.
              Pro creators can publish up to ten hosted free or paid profiles, while
              trust labels distinguish community, verified, business, and GameWorlds
              Official publishers.
            </p>
          </div>

          <div className={styles.profileGrid} data-reveal>
            {creatorProfiles.map((profile, index) => (
              <article className={styles.profileCard} data-accent={profile.color} key={profile.name}>
                <div className={styles.profileVisual} aria-hidden="true">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div />
                </div>
                <div className={styles.profileBody}>
                  <span className={styles.profileBadge}>{profile.badge}</span>
                  <p>{profile.author}</p>
                  <h3>{profile.name}</h3>
                  <p>{profile.description}</p>
                  <div className={styles.profileStats}>{profile.stats}</div>
                </div>
              </article>
            ))}
          </div>

          <div className={styles.marketRules} data-reveal>
            <span>CREATOR STANDARD / 01</span>
            <p>
              Paid packs disclose every route, dependency, permission, and file
              they request before installation. Secrets are never bundled.
            </p>
          </div>
        </section>

        <section className={styles.plans} id="plans" aria-labelledby="plans-title">
          <div className={styles.planHeading} data-reveal>
            <p className={styles.sectionIndex}>05 / PICK YOUR SIGNAL</p>
            <h2 id="plans-title">The program stays free. Pro pays for the extra polish.</h2>
            <p>
              Core routing, outputs, and community setups remain available without
              a subscription. Premium themes and motion fund the product around it.
            </p>
          </div>
          <PricingPlans />
          <p className={styles.feeNote}>
            Marketplace fees, verification rules, and payout terms will be published
            before paid listings open. No unpublished fee is charged.
          </p>
        </section>

        <section className={styles.trust} aria-labelledby="trust-title">
          <div className={styles.trustIntro} data-reveal>
            <p className={styles.sectionIndex}>06 / TRUST THE WIRING</p>
            <h2 id="trust-title">Local-first is a boundary, not a slogan.</h2>
            <p>
              The public launch architecture keeps service credentials on the
              server, scopes profile data per user, and treats every downloaded
              setup as untrusted until the owner approves it.
            </p>
          </div>
          <div className={styles.trustGrid} data-reveal>
            <article><span>01</span><h3>Secrets stay server-side</h3><p>Browser bundles never receive Supabase service keys, payout secrets, or local model credentials.</p></article>
            <article><span>02</span><h3>Ownership is checked</h3><p>Row-level policies scope private profiles, purchases, and drafts to their owner.</p></article>
            <article><span>03</span><h3>Setups declare access</h3><p>Manifests disclose routes, permissions, dependencies, and checksums before install.</p></article>
            <article><span>04</span><h3>Outputs keep provenance</h3><p>Receipts connect each artifact to its requester, model, workflow, and approval state.</p></article>
          </div>
        </section>

        <section className={styles.faq} aria-labelledby="faq-title">
          <div className={styles.faqHeading} data-reveal>
            <p className={styles.sectionIndex}>07 / STRAIGHT ANSWERS</p>
            <h2 id="faq-title">Before you plug in.</h2>
          </div>
          <div className={styles.faqList} data-reveal>
            <details>
              <summary>Is Spark Plug really free?</summary>
              <p>Yes. The community tier includes the core program, local model routes, output handoff, and public setup discovery. Pro adds optional visual themes, motion packs, and sync.</p>
            </details>
            <details>
              <summary>Do I need a specific GPU or DGX system?</summary>
              <p>No. Spark Plug is designed around explicit model and tool endpoints, not one hardware vendor. NVIDIA DGX is one possible deployment target, not a requirement.</p>
            </details>
            <details>
              <summary>Does Spark Plug decide what I can generate?</summary>
              <p>Spark Plug is the routing and orchestration layer. The models and workflows you operate determine their behavior. Operators remain responsible for applicable law, safety, licenses, and the rights of others.</p>
            </details>
            <details>
              <summary>Can creators charge for their setup profiles?</summary>
              <p>Pro creators can list up to ten original setup profiles for free or for a price. Unverified publishers are clearly labeled, and buyers see immutable model revisions, checksums, dependencies, and risk warnings before installation.</p>
            </details>
            <details>
              <summary>Are my private routes or outputs published?</summary>
              <p>No. Community can create unlimited local profiles, while hosted publishing is a separate Pro action. A public profile contains a scrubbed manifest—not credentials, private paths, session history, prompts, outputs, or customer data.</p>
            </details>
          </div>
        </section>

        <section className={styles.join} id="join" aria-labelledby="join-title">
          <div className={styles.joinGlow} aria-hidden="true" />
          <div data-reveal>
            <p className={styles.sectionIndex}>EARLY ACCESS / SIGNAL OPEN</p>
            <h2 id="join-title">Your compute is waiting.</h2>
            <p>
              Join the launch list for the free public release, creator verification,
              and the first Pro theme drop.
            </p>
            <WaitlistForm />
          </div>
        </section>
      </div>

      <footer className={styles.footer}>
        <div className={styles.footerBrand}>
          <a className={styles.wordmark} href="#top" aria-label="Back to top">
            <span aria-hidden="true" className={styles.mark}><span /></span>
            <span>SPARK PLUG</span>
          </a>
          <p>Local AI orchestration by GameWorlds.</p>
        </div>
        <nav aria-label="Legal navigation">
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
          <a href="/trademarks">Trademarks</a>
          <a href="/security">Security</a>
        </nav>
        <p className={styles.disclaimer}>
          NVIDIA and DGX are trademarks and/or registered trademarks of NVIDIA
          Corporation in the U.S. and other countries. Spark Plug and GameWorlds
          are independent and are not affiliated with, sponsored by, or endorsed
          by NVIDIA. All other marks belong to their respective owners.
        </p>
        <div className={styles.footerBottom}>
          <span>© 2026 GameWorlds. All rights reserved.</span>
          <span>BUILD LOCAL / ROUTE CLEARLY / KEEP CONTROL</span>
        </div>
      </footer>
    </main>
  );
}
