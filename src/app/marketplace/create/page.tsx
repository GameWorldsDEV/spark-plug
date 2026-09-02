import Link from "next/link";
import { CreatorBuilder } from "../../_components/creator-builder";
import { LegalShell } from "../../_components/legal-shell";
import { detailMetadata } from "@/lib/metadata";
import styles from "../marketplace.module.css";

export const metadata = detailMetadata("Creator builder", "Create declarative Spark Plug profiles, themes, and motion packs locally in your browser.", "/marketplace/create");

export default function CreatorBuilderPage() {
  return <LegalShell eyebrow="CREATOR KIT / LOCAL DRAFT" title="Build the package. Keep control of the files." summary="Create a schema-shaped profile, theme, or motion pack entirely in your browser. Exporting is local and free. A future Pro account is required only to submit a listing to the hosted marketplace.">
    <div className={styles.notice}><strong>PREVIEW BOUNDARY</strong><p>This tool does not upload, publish, purchase, or activate anything. Never paste credentials, prompts, private paths, customer information, or proprietary datasets into a marketplace package.</p></div>
    <CreatorBuilder />
    <h2>Start from a file</h2>
    <ul>
      <li><a href="/templates/profile-boilerplate.sparkplug-profile" download>Download the profile boilerplate</a></li>
      <li><a href="/templates/theme-boilerplate.sparkplug-theme" download>Download the theme boilerplate</a></li>
      <li><a href="/templates/motion-boilerplate.sparkplug-motion" download>Download the motion boilerplate</a></li>
      <li><Link href="/docs">Read the public documentation and safety boundaries</Link></li>
    </ul>
  </LegalShell>;
}
