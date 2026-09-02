"use client";

import { useEffect, useState } from "react";
import styles from "./commerce-actions.module.css";

type CatalogProfile = {
  id: string; slug: string; title: string; summary: string;
  access: "free" | "paid"; price_cents: number; currency: string;
  creator_display_name: string; risk_level: string; current_manifest_sha256: string;
};

export function MarketplaceCatalog() {
  const [profiles, setProfiles] = useState<CatalogProfile[]>([]);
  const [message, setMessage] = useState("Loading reviewed profiles…");
  const [busy, setBusy] = useState<string | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/v1/catalog/profiles?limit=24", { signal: controller.signal, cache: "force-cache" })
      .then(async (response) => {
        const value = await response.json() as { profiles?: CatalogProfile[]; error?: string };
        if (!response.ok || !Array.isArray(value.profiles)) throw new Error(value.error || "Catalog is unavailable.");
        setProfiles(value.profiles); setMessage(value.profiles.length ? "" : "No reviewed profiles are published yet.");
      }).catch((error) => { if (error?.name !== "AbortError") setMessage("Catalog is temporarily unavailable."); });
    return () => controller.abort();
  }, []);

  async function download(profile: CatalogProfile) {
    setBusy(profile.id); setMessage("");
    try {
      if (profile.access === "paid") {
        const response = await fetch("/api/v1/marketplace/checkout", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ listingId: profile.id }) });
        const result = await response.json() as { url?: string; error?: string };
        if (!response.ok || !result.url?.startsWith("https://checkout.stripe.com/")) throw new Error(result.error || "Checkout is unavailable.");
        window.location.assign(result.url); return;
      }
      const response = await fetch(`/api/v1/catalog/profiles/${encodeURIComponent(profile.slug)}/manifest`);
      if (!response.ok) throw new Error("Profile download is unavailable.");
      const manifest = await response.json();
      const url = URL.createObjectURL(new Blob([JSON.stringify(manifest, null, 2)], { type: "application/vnd.gameworlds.sparkplug-profile+json" }));
      const anchor = document.createElement("a"); anchor.href = url; anchor.download = `${profile.slug}.sparkplug-profile`; anchor.click(); URL.revokeObjectURL(url);
      setMessage("Profile downloaded. Open it in Spark Plug to review every setting and run local compatibility preflight.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "This action is unavailable.");
    } finally { setBusy(null); }
  }

  return <section aria-labelledby="live-catalog-title">
    <h2 id="live-catalog-title">Reviewed marketplace catalog</h2>
    <div className={styles.actions}>
      {profiles.map((profile) => <article key={profile.id}>
        <p>{profile.access === "free" ? "$0.00" : new Intl.NumberFormat("en-US", { style: "currency", currency: profile.currency }).format(profile.price_cents / 100)}</p>
        <h3>{profile.title}</h3><p>{profile.summary}</p>
        <small>By {profile.creator_display_name} · {profile.risk_level} · SHA-256 {profile.current_manifest_sha256.slice(0, 12)}…</small>
        <button type="button" disabled={busy !== null} onClick={() => download(profile)}>{busy === profile.id ? "OPENING…" : profile.access === "paid" ? "BUY WITH STRIPE" : "DOWNLOAD PROFILE"}</button>
      </article>)}
      <p className={styles.status} role="status">{message}</p>
    </div>
  </section>;
}
