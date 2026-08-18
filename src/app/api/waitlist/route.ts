import "server-only";

import { createHmac } from "node:crypto";
import { NextResponse } from "next/server";
import { readJsonBodyWithLimit } from "@/lib/read-json-body";
import { validateWaitlistPayload, WaitlistPayload } from "@/lib/waitlist";

const JSON_HEADERS = {
  "cache-control": "no-store",
  "content-type": "application/json",
};

function clientFingerprint(request: Request, secret: string): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const address = forwarded || request.headers.get("x-real-ip") || "unknown";
  return createHmac("sha256", secret).update(address).digest("hex");
}

async function supabaseRequest(
  path: string,
  init: RequestInit,
  url: string,
  serviceKey: string,
) {
  return fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: serviceKey,
      authorization: `Bearer ${serviceKey}`,
      "content-type": "application/json",
      ...init.headers,
    },
    cache: "no-store",
  });
}

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.startsWith("application/json")) {
    return NextResponse.json(
      { message: "Send the form as JSON." },
      { status: 415, headers: JSON_HEADERS },
    );
  }

  const bodyResult = await readJsonBodyWithLimit(request);
  if (!bodyResult.ok) {
    return NextResponse.json(
      { message: bodyResult.message },
      { status: bodyResult.status, headers: JSON_HEADERS },
    );
  }

  const body = bodyResult.value as WaitlistPayload;

  const result = validateWaitlistPayload(body);
  if (!result.ok) {
    return NextResponse.json(result, { status: 400, headers: JSON_HEADERS });
  }

  // Silently accept honeypot submissions so bots cannot tune around it.
  if (result.isBot) {
    return NextResponse.json({ ok: true }, { status: 202, headers: JSON_HEADERS });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const hashSecret = process.env.WAITLIST_HASH_SECRET;
  if (!supabaseUrl || !serviceKey || !hashSecret) {
    return NextResponse.json(
      {
        message:
          "The list is warming up. Email hello@gameworlds.ai and we’ll add you manually.",
      },
      { status: 503, headers: JSON_HEADERS },
    );
  }

  const fingerprint = clientFingerprint(request, hashSecret);
  const rateLimit = await fetch(`${supabaseUrl}/rest/v1/rpc/claim_waitlist_slot`, {
    method: "POST",
    headers: {
      apikey: serviceKey,
      authorization: `Bearer ${serviceKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ p_requester_hash: fingerprint }),
    cache: "no-store",
  });

  if (!rateLimit.ok || (await rateLimit.json().catch(() => false)) !== true) {
    return NextResponse.json(
      { message: "Too many attempts. Please wait a few minutes and try again." },
      { status: 429, headers: JSON_HEADERS },
    );
  }

  const signup = await supabaseRequest(
    "waitlist_signups?on_conflict=email",
    {
      method: "POST",
      headers: { prefer: "resolution=ignore-duplicates,return=minimal" },
      body: JSON.stringify({
        email: result.email,
        consented_at: new Date().toISOString(),
        source: "launch-site",
      }),
    },
    supabaseUrl,
    serviceKey,
  );

  if (!signup.ok) {
    return NextResponse.json(
      { message: "We could not save that address. Please try again shortly." },
      { status: 502, headers: JSON_HEADERS },
    );
  }

  return NextResponse.json({ ok: true }, { status: 202, headers: JSON_HEADERS });
}
