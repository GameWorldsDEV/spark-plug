import Image from "next/image";
import Link from "next/link";

import { BrandLogo } from "./brand-logo";
import { stripeSupportUrl } from "../../lib/support-links";
import styles from "./site-footer.module.css";

type SiteFooterProps = {
  repositoryUrl: string;
};

export function SiteFooter({ repositoryUrl }: SiteFooterProps) {
  return (
    <footer className={styles.footer}>
      <div className={styles.products}>
        <Link href="/" aria-label="Spark Plug home">
          <BrandLogo className={styles.sparkLogo} />
        </Link>
        <span className={styles.divider} aria-hidden="true" />
        <div className={styles.parent}>
          <Image
            src="/brand/gameworlds.png"
            width={500}
            height={500}
            alt="GameWorlds"
            className={styles.gameworlds}
          />
          <p><strong>Built by GameWorlds</strong><span>Parent company and developer of Spark Plug.</span></p>
        </div>
      </div>
      <nav aria-label="Footer navigation">
        <a href={repositoryUrl} rel="noopener noreferrer">GitHub</a>
        <Link href="/support">Support</Link>
        <Link href="/docs">Docs</Link>
        <Link href="/download">Download</Link>
        <Link href="/marketplace">Marketplace</Link>
        <Link href="/pricing">Community + Pro</Link>
        <Link href="/themes">Themes</Link>
        <Link href="/training">Training</Link>
        <Link href="/changelog">Changelog</Link>
        <Link href="/why-spark-plug">Why Spark Plug</Link>
        <Link href="/benchmarks">Benchmarks</Link>
        <Link href="/legal">Legal</Link>
        <a href={stripeSupportUrl} rel="noopener noreferrer" aria-label="Optional Stripe support">Stripe support ↗</a>
      </nav>
      <p className={styles.legal}>© 2026 GameWorlds LLC. Maryland, USA. Independent software. Product names belong to their respective owners.</p>
    </footer>
  );
}
