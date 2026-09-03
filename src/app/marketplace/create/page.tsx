import Link from "next/link";
import { CreatorBuilder } from "../../_components/creator-builder";
import { LegalShell } from "../../_components/legal-shell";
import { detailMetadata } from "@/lib/metadata";
import { hostedMarketplaceHref } from "@/lib/hosted-marketplace";
import styles from "../marketplace.module.css";

export const metadata = detailMetadata("Creator builder", "Create declarative Spark Plug profiles, themes, and motion packs locally in your browser.", "/marketplace/create");

export default function CreatorBuilderPage() {
  const accountHref = hostedMarketplaceHref("/account");
  const publishingHref = hostedMarketplaceHref("/creator/new");
  return <LegalShell eyebrow="CREATOR STUDIO / PRO WORKSPACE" title="Design locally. Publish through one guarded door." summary="Preview the declarative profile, theme, and motion formats entirely in your browser without an account. Draft import, export, marketplace submission, analytics, and publishing become available only after the private service verifies an authenticated Pro creator.">
    <div className={styles.notice}><strong>SECURITY BOUNDARY</strong><p>This public preview never authenticates, uploads, publishes, purchases, or activates anything. Never paste credentials, prompts, private paths, customer information, or proprietary datasets into a marketplace package.</p></div>
    <CreatorBuilder accountHref={accountHref} publishingHref={publishingHref} />
    <h2>Start from a file</h2>
    <ul>
      <li><a href="/templates/profile-boilerplate.sparkplug-profile" download>Download the profile boilerplate</a></li>
      <li><a href="/templates/theme-boilerplate.sparkplug-theme" download>Download the theme boilerplate</a></li>
      <li><a href="/templates/motion-boilerplate.sparkplug-motion" download>Download the motion boilerplate</a></li>
      <li><Link href="/docs">Read the public documentation and safety boundaries</Link></li>
    </ul>
  </LegalShell>;
}
