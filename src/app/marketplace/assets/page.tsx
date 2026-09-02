import Link from "next/link";
import { LegalShell } from "../../_components/legal-shell";
import { detailMetadata } from "@/lib/metadata";
import styles from "../marketplace.module.css";

export const metadata = detailMetadata("Spark Plug asset market", "Curated free and paid Spark Plug profiles, themes, motion packs, and rights-cleared LoRA adapters.", "/marketplace/assets");

const categories = [
  { label: "LOCAL AI CONFIGURATION", title: "Profiles", copy: "Engine, pinned model files, context, queue, memory, and routing choices packaged as reviewable declarative data.", href: "/marketplace/create" },
  { label: "PRESENTATION", title: "Themes", copy: "Color, typography, density, component treatment, and licensed artwork without changing broker or runtime authority.", href: "/themes" },
  { label: "PRESENTATION", title: "Motion packs", copy: "Bounded loading, transition, profile, queue, success, and warning motion with a required reduced-motion fallback.", href: "/marketplace/create" },
  { label: "TRAINING OUTPUT", title: "LoRA adapters", copy: "Separately packaged adapters only after dataset rights, base-model terms, provenance, compatibility, and commercial distribution are reviewed.", href: "/training" },
] as const;

export default function AssetsPage() {
  return <LegalShell eyebrow="SPARK PLUG MARKET / FREE + PAID" title="Curated assets for the control room." summary="GameWorlds and approved Pro creators will share free or one-time-purchase assets here. The live catalog remains empty until identity, licensing, compatibility, moderation, support, and payment gates pass.">
    <div className={styles.notice}><strong>NO FAKE INVENTORY</strong><p>Bundled themes remain $0.00. Marketplace cards activate only when an actual versioned, checksummed package has passed review. Paid creator assets will show the complete price, license, tested systems, support state, and refund boundary before checkout.</p></div>
    <h2>Browse asset formats</h2>
    <div className={styles.marketGrid} aria-label="Spark Plug asset categories">
      {categories.map((category) => <article key={category.title}><small>{category.label}</small><h3>{category.title}</h3><p>{category.copy}</p><Link href={category.href}>EXPLORE FORMAT →</Link></article>)}
    </div>
    <h2>Creator path</h2><ol><li>Build or export a scrubbed package.</li><li>Declare license, contents, price, tested compatibility, and creator support.</li><li>The private marketplace validates and creates an immutable candidate version.</li><li>GameWorlds reviews safety, provenance, licensing, accessibility, and compatibility.</li><li>After approval, the website listing becomes the current source of truth and the next monthly app catalog can include it.</li></ol>
    <p><Link href="/marketplace/create">Start with the local creator builder</Link>.</p>
  </LegalShell>;
}
