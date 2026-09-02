import "server-only";

import { NextResponse } from "next/server";
import { readJsonBodyWithLimit } from "@/lib/read-json-body";
import {
  MAX_SETUP_PROFILE_BYTES,
  validateSetupProfile,
} from "@/lib/setup-profile";
import { supabaseServiceRpc, supabaseUserRpc } from "@/lib/supabase-rest";
import { currentLaunch } from "@/lib/launch-stage";
import { parseCompatibilityDeclarations, type CompatibilityDeclaration } from "@/lib/marketplace-policy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BODY_LIMIT = MAX_SETUP_PROFILE_BYTES + 8 * 1024;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SLUG = /^[a-z0-9][a-z0-9-]{2,79}$/;
const NO_STORE = { "cache-control": "private, no-store" };
const INPUT_KEYS = new Set([
  "slug", "title", "summary", "access", "priceCents", "currency", "manifest",
  "compatibility", "creatorSupportUrl",
]);

type EntitlementProjection = {
  user_id?: unknown;
  plan?: unknown;
  status?: unknown;
  creator_class?: unknown;
};

type ProfileSubmission = {
  slug: string;
  title: string;
  summary: string;
  access: "free" | "paid";
  priceCents: number;
  currency: "usd";
  manifest: unknown;
  compatibility: CompatibilityDeclaration[];
  creatorSupportUrl: string;
};

function bearerToken(request: Request): string | null {
  const authorization = request.headers.get("authorization") || "";
  if (!authorization.startsWith("Bearer ")) return null;
  const token = authorization.slice(7).trim();
  return token.length >= 16 && token.length <= 8_192 ? token : null;
}

function parseSubmission(value: unknown): ProfileSubmission | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const input = value as Record<string, unknown>;
  if (Object.keys(input).some((key) => !INPUT_KEYS.has(key))) return null;
  if (
    typeof input.slug !== "string" ||
    !SLUG.test(input.slug) ||
    typeof input.title !== "string" ||
    input.title.length < 1 ||
    input.title.length > 100 ||
    typeof input.summary !== "string" ||
    input.summary.length < 1 ||
    input.summary.length > 500 ||
    !["free", "paid"].includes(String(input.access)) ||
    !Number.isSafeInteger(input.priceCents) ||
    input.currency !== "usd" ||
    !("manifest" in input)
  ) return null;
  const access = input.access as "free" | "paid";
  const priceCents = input.priceCents as number;
  if (
    (access === "free" && priceCents !== 0) ||
    (access === "paid" && (priceCents < 100 || priceCents > 100_000))
  ) return null;
  const compatibility = parseCompatibilityDeclarations(input.compatibility);
  if (!compatibility || typeof input.creatorSupportUrl !== "string" || !input.creatorSupportUrl.startsWith("https://") || input.creatorSupportUrl.length > 500) return null;
  return {
    slug: input.slug,
    title: input.title,
    summary: input.summary,
    access,
    priceCents,
    currency: "usd",
    manifest: input.manifest,
    compatibility,
    creatorSupportUrl: input.creatorSupportUrl,
  };
}

export async function POST(request: Request) {
  if (!currentLaunch.creatorPublishing) {
    return NextResponse.json({ error: "profile publishing is not active" }, { status: 503, headers: NO_STORE });
  }
  const accessToken = bearerToken(request);
  if (!accessToken) {
    return NextResponse.json({ error: "authentication required" }, { status: 401, headers: NO_STORE });
  }
  const body = await readJsonBodyWithLimit(request, BODY_LIMIT);
  if (!body.ok) {
    return NextResponse.json({ error: body.message }, { status: body.status, headers: NO_STORE });
  }
  const submission = parseSubmission(body.value);
  if (!submission) {
    return NextResponse.json({ error: "profile submission is invalid" }, { status: 400, headers: NO_STORE });
  }

  const validation = validateSetupProfile(submission.manifest);
  if (!validation.ok) {
    return NextResponse.json(
      { error: "profile manifest failed validation", issues: validation.errors.slice(0, 20) },
      { status: 422, headers: NO_STORE },
    );
  }

  try {
    const entitlement = await supabaseUserRpc<EntitlementProjection>(
      accessToken,
      "current_entitlement_claims",
    );
    const official = entitlement.creator_class === "gameworlds_official";
    const activePro = entitlement.plan === "pro" && ["active", "trialing"].includes(String(entitlement.status));
    if (typeof entitlement.user_id !== "string" || !UUID.test(entitlement.user_id)) {
      throw new Error("invalid authenticated user");
    }
    if (!activePro && !official) {
      return NextResponse.json(
        { error: "active Pro is required for hosted profiles" },
        { status: 403, headers: NO_STORE },
      );
    }

    const hfRevisions = validation.manifest.models.map((model) => ({
      repoId: model.repoId,
      revision: model.revision,
      licenseId: model.licenseId,
      files: model.files.map((file) => ({ filename: file.filename, sha256: file.sha256 })),
    }));
    const listingId = await supabaseServiceRpc<string>("submit_creator_profile_draft", {
      p_owner_id: entitlement.user_id,
      p_slug: submission.slug,
      p_title: submission.title,
      p_summary: submission.summary,
      p_access: submission.access,
      p_price_cents: submission.priceCents,
      p_currency: submission.currency,
      p_manifest: validation.manifest,
      p_manifest_sha256: validation.sha256,
      p_hf_revisions: hfRevisions,
      p_risk_labels: validation.riskLabels,
      p_declared_bytes: validation.declaredBytes,
      p_compatibility: submission.compatibility,
      p_creator_support_url: submission.creatorSupportUrl,
    });
    if (!UUID.test(listingId)) throw new Error("invalid profile draft id");
    return NextResponse.json(
      { id: listingId, status: "pending", manifestSha256: validation.sha256 },
      { status: 202, headers: NO_STORE },
    );
  } catch {
    return NextResponse.json(
      { error: "profile draft could not be submitted" },
      { status: 409, headers: NO_STORE },
    );
  }
}
