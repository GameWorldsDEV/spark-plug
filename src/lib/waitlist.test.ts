import { describe, expect, it } from "vitest";
import { validateWaitlistPayload } from "./waitlist";

describe("waitlist validation", () => {
  it("normalizes a valid email", () => {
    expect(
      validateWaitlistPayload({
        email: "  Test@Example.COM ",
        consent: true,
      }),
    ).toEqual({ ok: true, email: "test@example.com", isBot: false });
  });

  it("requires explicit consent", () => {
    expect(
      validateWaitlistPayload({ email: "test@example.com", consent: false }),
    ).toMatchObject({ ok: false });
  });

  it("rejects malformed and oversized addresses", () => {
    expect(
      validateWaitlistPayload({ email: "not-an-email", consent: true }),
    ).toMatchObject({ ok: false });
    expect(
      validateWaitlistPayload({ email: `${"a".repeat(250)}@x.io`, consent: true }),
    ).toMatchObject({ ok: false });
  });

  it("silently accepts the honeypot without retaining the supplied address", () => {
    expect(
      validateWaitlistPayload({
        email: "person@example.com",
        companyUrl: "https://bot.invalid",
        consent: true,
      }),
    ).toEqual({ ok: true, email: "bot@example.invalid", isBot: true });
  });
});
