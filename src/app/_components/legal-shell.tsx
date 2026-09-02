import type { ReactNode } from "react";
import Link from "next/link";
import { BrandLogo } from "./brand-logo";
import styles from "./legal-shell.module.css";

type LegalShellProps = {
  eyebrow: string;
  title: string;
  summary: string;
  children: ReactNode;
};

export function LegalShell({ eyebrow, title, summary, children }: LegalShellProps) {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.brand} href="/" aria-label="Spark Plug home">
          <BrandLogo className={styles.brandLogo} />
        </Link>
        <nav aria-label="Information pages">
          <Link href="/docs">Docs</Link>
          <Link href="/download">Download</Link>
          <Link href="/themes">Themes</Link>
          <Link href="/pricing">Pro</Link>
          <Link href="/support">Support</Link>
          <Link href="/legal">Legal</Link>
        </nav>
      </header>
      <section className={styles.hero}>
        <p>{eyebrow}</p>
        <h1>{title}</h1>
        <div>{summary}</div>
      </section>
      <article className={styles.content}>{children}</article>
      <footer className={styles.footer}>
        <p>© 2026 GameWorlds LLC. Spark Plug is an independent product.</p>
        <Link href="/">Return to the public launch ↗</Link>
      </footer>
    </main>
  );
}
