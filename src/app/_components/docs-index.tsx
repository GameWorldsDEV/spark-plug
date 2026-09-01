"use client";

import { useDeferredValue, useState } from "react";
import Link from "next/link";
import styles from "./docs-index.module.css";

export type DocEntry = { slug: string; title: string; summary: string; topics: readonly string[] };

export function DocsIndex({ entries }: { entries: readonly DocEntry[] }) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());
  const results = deferredQuery
    ? entries.filter((entry) => `${entry.title} ${entry.summary} ${entry.topics.join(" ")}`.toLowerCase().includes(deferredQuery))
    : entries;

  return (
    <section className={styles.search} aria-labelledby="docs-index-title">
      <h2 id="docs-index-title">Find a guide</h2>
      <label>
        <span>Search public documentation</span>
        <input value={query} onChange={(event) => setQuery(event.target.value)} type="search" placeholder="Profiles, ComfyUI, remote access…" />
      </label>
      <p role="status">{results.length} {results.length === 1 ? "guide" : "guides"}</p>
      <div className={styles.grid}>
        {results.map((entry) => (
          <article key={entry.slug}>
            <p>{entry.topics.join(" · ")}</p>
            <h3><Link href={`/docs#${entry.slug}`}>{entry.title}</Link></h3>
            <div>{entry.summary}</div>
          </article>
        ))}
      </div>
    </section>
  );
}

