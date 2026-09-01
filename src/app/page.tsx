import Link from "next/link";

import { BrandLogo } from "./_components/brand-logo";
import { ComfySection } from "./_components/comfy-section";
import { DevicesSection } from "./_components/devices-section";
import { EnginesSection } from "./_components/engines-section";
import { GitHubProof } from "./_components/github-proof";
import { MarketplaceSection } from "./_components/marketplace-section";
import { ReleaseDownloads } from "./_components/release-downloads";
import { RoadmapSection } from "./_components/roadmap-section";
import { RoutingSection } from "./_components/routing-section";
import { SiteFooter } from "./_components/site-footer";
import { Story } from "./_components/story";
import { ToolsCarousel } from "./_components/tools-carousel";
import { TrainingSection } from "./_components/training-section";
import { WhyTeaser } from "./_components/why-teaser";
import { currentRelease } from "../lib/release-manifest";
import styles from "./page.module.css";

const faqs = [
  ["What is a Spark Plug profile?", "A profile is a reusable workload plan. It can coordinate models from multiple engines while preserving each engine’s settings, queue, lifecycle, and memory cost."],
  ["Is Spark Plug an AI model?", "No. Spark Plug is the control application and GW Broker around the models and engines you choose."],
  ["Does every request leave my network?", "No. Local clients, GW Broker, models, telemetry, and logs can stay on your node. Optional cloud routes and user-initiated downloads from hosted profile or model sources have separate boundaries."],
  ["Can I control it away from home?", "Yes, when the node is reachable through a reviewed HTTPS path such as Tailscale, Headscale, or another trusted user-managed VPN. Reachability never replaces Spark Plug pairing and authentication."],
  ["Can I download it today?", "The public repository is open. Installers stay disabled until matching source, checksums, release notes, and clean-install evidence are published together."],
] as const;

export default function Home() {
  return (
    <main>
      <a className={styles.skipLink} href="#main-content">Skip to content</a>
      <header className={styles.header}>
        <Link className={styles.brandLink} href="/" aria-label="Spark Plug home">
          <BrandLogo className={styles.brandLogo} />
        </Link>
        <nav className={styles.nav} aria-label="Primary navigation">
          <a href="#tools">Tools</a>
          <a href="#routing">Routing</a>
          <a href="#engines">Engines</a>
          <a href="#devices">Remote</a>
          <a href="#marketplace">Marketplace</a>
          <a href="#release">Release</a>
        </nav>
        <a className={styles.headerCta} href={currentRelease.repositoryUrl} rel="noopener noreferrer">GitHub <span aria-hidden="true">↗</span></a>
      </header>

      <div id="main-content" className={styles.content}>
        <Story />

        <section className={styles.release} id="release" aria-labelledby="release-title">
          <h2 id="release-title" className={styles.srOnly}>Spark Plug releases</h2>
          <ReleaseDownloads manifest={currentRelease} />
        </section>

        <GitHubProof />
        <ToolsCarousel />
        <RoutingSection />
        <EnginesSection />
        <ComfySection />
        <DevicesSection />
        <MarketplaceSection />
        <TrainingSection />
        <WhyTeaser />
        <RoadmapSection />

        <section className={styles.faq} aria-labelledby="faq-title">
          <div><p className={styles.eyebrow}>STRAIGHT ANSWERS</p><h2 id="faq-title">Before you plug in.</h2></div>
          <div className={styles.faqList}>
            {faqs.map(([question, answer]) => (
              <details key={question}>
                <summary>{question}<span aria-hidden="true">+</span></summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>
      </div>

      <SiteFooter repositoryUrl={currentRelease.repositoryUrl} />
    </main>
  );
}
