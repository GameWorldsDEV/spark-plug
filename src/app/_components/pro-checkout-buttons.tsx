"use client";

import { useState } from "react";
import styles from "./commerce-actions.module.css";

export function ProCheckoutButtons() {
  const [busy, setBusy] = useState<"monthly" | "annual" | null>(null);
  const [message, setMessage] = useState("");
  async function checkout(cadence: "monthly" | "annual") {
    setBusy(cadence); setMessage("");
    try {
      const response = await fetch("/api/v1/billing/checkout", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ cadence }) });
      const result = await response.json() as { url?: unknown; error?: unknown };
      if (!response.ok || typeof result.url !== "string" || !result.url.startsWith("https://checkout.stripe.com/")) throw new Error(typeof result.error === "string" ? result.error : "Checkout is unavailable.");
      window.location.assign(result.url);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Checkout is unavailable.");
      setBusy(null);
    }
  }
  return <div className={styles.actions}>
    <button type="button" disabled={busy !== null} onClick={() => checkout("monthly")}>{busy === "monthly" ? "OPENING…" : "CHOOSE $5 MONTHLY"}</button>
    <button type="button" disabled={busy !== null} onClick={() => checkout("annual")}>{busy === "annual" ? "OPENING…" : "CHOOSE $48 ANNUAL"}</button>
    <p className={styles.status} role="status">{message}</p>
  </div>;
}
