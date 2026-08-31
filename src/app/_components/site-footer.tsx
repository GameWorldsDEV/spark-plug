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
        <a href={stripeSupportUrl} rel="noopener noreferrer">Support</a>
        <Link href="/why-spark-plug">Why Spark Plug</Link>
        <Link href="/benchmarks">Benchmarks</Link>
        <Link href="/security">Security</Link>
        <Link href="/privacy">Privacy</Link>
        <Link href="/terms">Terms</Link>
        <Link href="/trademarks">Trademarks</Link>
      </nav>
      <p className={styles.legal}>© 2026 GameWorlds. Independent software. Product names belong to their respective owners.</p>
    </footer>
  );
}
