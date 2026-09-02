export const REQUIRED_COMPATIBILITY_FIELDS = [
  "deviceMaker",
  "deviceModel",
  "operatingSystem",
  "architecture",
  "memoryGb",
  "engine",
  "engineVersion",
  "modelRevision",
  "testedAt",
] as const;

export type CompatibilityDeclaration = {
  deviceMaker: string;
  deviceModel: string;
  operatingSystem: string;
  architecture: "arm64" | "x86_64";
  memoryGb: number;
  gpu?: string;
  vramGb?: number;
  engine: string;
  engineVersion: string;
  modelRevision: string;
  evidenceUrl?: string;
  testedAt: string;
  notes?: string;
};

function boundedText(value: unknown, max: number): value is string {
  return typeof value === "string" && value.trim().length > 0 && value.length <= max;
}

export function parseCompatibilityDeclarations(value: unknown): CompatibilityDeclaration[] | null {
  if (!Array.isArray(value) || value.length < 1 || value.length > 24) return null;
  const allowed = new Set([...REQUIRED_COMPATIBILITY_FIELDS, "gpu", "vramGb", "evidenceUrl", "notes"]);
  const parsed: CompatibilityDeclaration[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object" || Array.isArray(item)) return null;
    const row = item as Record<string, unknown>;
    if (Object.keys(row).some((key) => !allowed.has(key))) return null;
    if (
      !boundedText(row.deviceMaker, 100) ||
      !boundedText(row.deviceModel, 160) ||
      !boundedText(row.operatingSystem, 120) ||
      !["arm64", "x86_64"].includes(String(row.architecture)) ||
      typeof row.memoryGb !== "number" || !Number.isFinite(row.memoryGb) || row.memoryGb <= 0 ||
      !boundedText(row.engine, 100) ||
      !boundedText(row.engineVersion, 100) ||
      !boundedText(row.modelRevision, 200) ||
      typeof row.testedAt !== "string" || !Number.isFinite(Date.parse(row.testedAt)) ||
      (row.gpu !== undefined && !boundedText(row.gpu, 160)) ||
      (row.vramGb !== undefined && (typeof row.vramGb !== "number" || !Number.isFinite(row.vramGb) || row.vramGb < 0)) ||
      (row.evidenceUrl !== undefined && (typeof row.evidenceUrl !== "string" || !row.evidenceUrl.startsWith("https://"))) ||
      (row.notes !== undefined && !boundedText(row.notes, 1000))
    ) return null;
    parsed.push(row as CompatibilityDeclaration);
  }
  return parsed;
}

export type RefundAssessment = {
  mandatoryLawApplies: boolean;
  configurationWasDeclaredCompatible: boolean;
  reproducibleDefect: boolean;
  creatorCureAttempted: boolean;
  creatorFixedIssue: boolean;
  creatorAbandonedListing: boolean;
  gameWorldsVerified: boolean;
};

export type RefundDecision = "eligible" | "not-eligible" | "needs-review";

export function assessMarketplaceRefund(input: RefundAssessment): RefundDecision {
  if (input.mandatoryLawApplies) return "eligible";
  if (input.creatorAbandonedListing) return "eligible";
  if (!input.configurationWasDeclaredCompatible) return "not-eligible";
  if (!input.reproducibleDefect) return "not-eligible";
  if (!input.creatorCureAttempted || !input.gameWorldsVerified) return "needs-review";
  return input.creatorFixedIssue ? "not-eligible" : "eligible";
}
