"use client";

import { FormEvent, useState } from "react";
import styles from "./auth-panel.module.css";

export function AuthPanel() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    const email = new FormData(event.currentTarget).get("email");
    const response = await fetch("/api/v1/auth/email", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email }),
    }).catch(() => null);
    setState(response?.ok ? "sent" : "error");
  }
  return <div className={styles.panel}>
    <form onSubmit={submit}>
      <label htmlFor="account-email">Email address</label>
      <input id="account-email" name="email" type="email" autoComplete="email" required maxLength={254} />
      <button disabled={state === "sending"}>{state === "sending" ? "Sending…" : "Email me a secure sign-in link"}</button>
    </form>
    <a href="/api/v1/auth/github">Continue with GitHub</a>
    <p role="status">{state === "sent" ? "Check your email for the sign-in link." : state === "error" ? "Sign-in is unavailable. Try again later." : "No password is stored by Spark Plug."}</p>
  </div>;
}

