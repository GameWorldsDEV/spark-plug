import type { ReactNode } from "react";
import Link from "next/link";
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
          <span aria-hidden="true" /> SPARK PLUG
        </Link>
        <nav aria-label="Legal and security pages">
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/trademarks">Trademarks</Link>
          <Link href="/security">Security</Link>
        </nav>
      </header>
      <section className={styles.hero}>
        <p>{eyebrow}</p>
        <h1>{title}</h1>
        <div>{summary}</div>
      </section>
      <article className={styles.content}>{children}</article>
      <footer className={styles.footer}>
        <p>© 2026 GameWorlds. Spark Plug is an independent product.</p>
        <Link href="/">Return to the public launch ↗</Link>
      </footer>
    </main>
  );
}
