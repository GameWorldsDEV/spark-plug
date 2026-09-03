import { describe, expect, it } from "vitest";
import { classifyModelLicense, huggingFaceRevisionHref, modelLicenseCopy } from "./creator-policy";

describe("creator model policy", () => {
  it("allows review of common commercial licenses without granting model rights", () => {
    expect(classifyModelLicense("Apache-2.0")).toBe("commercial-ok");
    expect(modelLicenseCopy("commercial-ok")).toMatch(/repository terms still apply/i);
  });

  it("blocks noncommercial licenses from paid listings and fails unknown licenses closed", () => {
    expect(classifyModelLicense("CC-BY-NC-4.0")).toBe("noncommercial");
    expect(classifyModelLicense("custom-license")).toBe("review-required");
    expect(modelLicenseCopy("noncommercial")).toMatch(/blocked from paid listings/i);
  });

  it("creates only immutable, well-formed Hugging Face revision links", () => {
    expect(huggingFaceRevisionHref("owner/model", "a".repeat(40))).toBe(`https://huggingface.co/owner/model/tree/${"a".repeat(40)}`);
    expect(huggingFaceRevisionHref("owner/model", "main")).toBeNull();
    expect(huggingFaceRevisionHref("https://evil.test", "a".repeat(40))).toBeNull();
  });
});
