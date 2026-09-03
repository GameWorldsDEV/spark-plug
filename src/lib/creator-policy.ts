export type ModelLicenseDecision = "commercial-ok" | "noncommercial" | "review-required";

const COMMERCIAL_LICENSES = new Set([
  "apache-2.0",
  "mit",
  "bsd-2-clause",
  "bsd-3-clause",
  "cc-by-4.0",
]);

const NONCOMMERCIAL_MARKERS = ["noncommercial", "non-commercial", "-nc", "research-only"];

export function classifyModelLicense(licenseId: string): ModelLicenseDecision {
  const normalized = licenseId.trim().toLowerCase();
  if (COMMERCIAL_LICENSES.has(normalized)) return "commercial-ok";
  if (NONCOMMERCIAL_MARKERS.some((marker) => normalized.includes(marker))) return "noncommercial";
  return "review-required";
}

export function modelLicenseCopy(decision: ModelLicenseDecision): string {
  if (decision === "commercial-ok") return "Commercial reference may be reviewed; repository terms still apply.";
  if (decision === "noncommercial") return "Blocked from paid listings. The user must obtain the model from its source under its own terms.";
  return "Paid publishing is blocked until the exact revision and license text pass review.";
}

export function huggingFaceRevisionHref(repoId: string, revision: string): string | null {
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]{0,95}\/[A-Za-z0-9][A-Za-z0-9._-]{0,95}$/.test(repoId)) return null;
  if (!/^[a-f0-9]{40}$/.test(revision)) return null;
  return `https://huggingface.co/${repoId}/tree/${revision}`;
}
