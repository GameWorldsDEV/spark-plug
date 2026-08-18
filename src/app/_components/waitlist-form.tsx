"use client";

import { FormEvent, useState } from "react";
import styles from "../page.module.css";

type FormState = "idle" | "submitting" | "success" | "error";

export function WaitlistForm() {
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setState("submitting");
    setMessage("");

    const form = new FormData(formElement);
    const response = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        companyUrl: form.get("companyUrl"),
        consent: form.get("consent") === "on",
      }),
    }).catch(() => null);

    if (response?.ok) {
      setState("success");
      setMessage("You’re on the signal list. We’ll only send launch updates.");
      formElement.reset();
      return;
    }

    const payload = response
      ? ((await response.json().catch(() => ({}))) as { message?: string })
      : {};
    setState("error");
    setMessage(
      payload.message ??
        "The list is warming up. Email hello@gameworlds.ai and we’ll add you manually.",
    );
  }

  return (
    <form className={styles.waitlistForm} onSubmit={submit}>
      <div className={styles.inputRow}>
        <label htmlFor="waitlist-email" className={styles.srOnly}>
          Email address
        </label>
        <input
          id="waitlist-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
          maxLength={254}
        />
        <input
          className={styles.honeypot}
          name="companyUrl"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />
        <button type="submit" disabled={state === "submitting"}>
          {state === "submitting" ? "Connecting…" : "Join early access"}
          <span aria-hidden="true">↗</span>
        </button>
      </div>
      <label className={styles.consentRow}>
        <input type="checkbox" name="consent" required />
        <span>
          Send me launch updates. I can unsubscribe anytime. See the{" "}
          <a href="/privacy">privacy notice</a>.
        </span>
      </label>
      <p className={styles.formStatus} role="status" aria-live="polite">
        {message}
      </p>
    </form>
  );
}
