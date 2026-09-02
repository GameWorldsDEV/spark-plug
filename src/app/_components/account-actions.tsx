"use client";

import { useState } from "react";
import styles from "./commerce-actions.module.css";

export function AccountActions() {
  const [busy, setBusy] = useState<"portal" | "seller" | null>(null);
  const [message, setMessage] = useState("");
  async function open(path: string, kind: "portal" | "seller") {
    setBusy(kind); setMessage("");
    try {
      const response = await fetch(path, { method: "POST" });
      const result = await response.json() as { url?: unknown; error?: unknown };
      const rawUrl = typeof result.url === "string" ? result.url : null;
      const destination = rawUrl ? new URL(rawUrl) : null;
      if (!response.ok || !destination || !["billing.stripe.com", "connect.stripe.com"].includes(destination.hostname) || destination.protocol !== "https:") throw new Error(typeof result.error === "string" ? result.error : "This action is unavailable.");
      window.location.assign(rawUrl!);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "This action is unavailable.");
      setBusy(null);
    }
  }
  return <div className={styles.actions}>
    <button type="button" disabled={busy !== null} onClick={() => open("/api/v1/billing/portal", "portal")}>MANAGE PRO BILLING</button>
    <button type="button" disabled={busy !== null} onClick={() => open("/api/v1/marketplace/seller-onboarding", "seller")}>CREATOR PAYOUT SETUP</button>
    <p className={styles.status} role="status">{message}</p>
  </div>;
}
