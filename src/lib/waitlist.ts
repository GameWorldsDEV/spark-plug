export type WaitlistPayload = {
  email?: unknown;
  companyUrl?: unknown;
  consent?: unknown;
};

export type WaitlistValidation =
  | { ok: true; email: string; isBot: boolean }
  | { ok: false; message: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateWaitlistPayload(
  payload: WaitlistPayload,
): WaitlistValidation {
  if (typeof payload.companyUrl === "string" && payload.companyUrl.trim()) {
    return { ok: true, email: "bot@example.invalid", isBot: true };
  }

  if (payload.consent !== true) {
    return { ok: false, message: "Please confirm you want launch updates." };
  }

  if (typeof payload.email !== "string") {
    return { ok: false, message: "Enter a valid email address." };
  }

  const email = payload.email.trim().toLowerCase();
  if (email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return { ok: false, message: "Enter a valid email address." };
  }

  return { ok: true, email, isBot: false };
}
