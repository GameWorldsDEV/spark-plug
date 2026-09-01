import "server-only";

import { currentLaunch } from "./launch-stage";

export type BillingCadence = "monthly" | "annual";

type BillingConfig = {
  secretKey: string;
  monthlyPriceId: string;
  annualPriceId: string;
};

const PRICE_ID = /^price_[A-Za-z0-9_]{8,128}$/;

export function parseBillingCadence(value: unknown): BillingCadence | null {
  return value === "monthly" || value === "annual" ? value : null;
}

export function billingConfig(): BillingConfig | null {
  const mode = process.env.PAYMENTS_MODE;
  if (!currentLaunch.billing || !["test", "live"].includes(mode || "")) return null;
  const secretKey = process.env.STRIPE_SECRET_KEY || "";
  const monthlyPriceId = process.env.STRIPE_PRO_MONTHLY_PRICE_ID || "";
  const annualPriceId = process.env.STRIPE_PRO_ANNUAL_PRICE_ID || "";
  const keyMatchesMode = mode === "test" ? secretKey.startsWith("sk_test_") : secretKey.startsWith("sk_live_");
  if (!keyMatchesMode || !PRICE_ID.test(monthlyPriceId) || !PRICE_ID.test(annualPriceId)) return null;
  return { secretKey, monthlyPriceId, annualPriceId };
}

export function bearerToken(request: Request): string | null {
  const header = request.headers.get("authorization") || "";
  if (!header.startsWith("Bearer ")) return null;
  const token = header.slice(7).trim();
  return token.length >= 16 && token.length <= 8192 ? token : null;
}

export async function stripeRequest<T>(
  config: BillingConfig,
  path: "checkout/sessions" | "billing_portal/sessions",
  params: URLSearchParams,
): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const response = await fetch(`https://api.stripe.com/v1/${path}`, {
      method: "POST",
      headers: {
        authorization: `Basic ${Buffer.from(`${config.secretKey}:`).toString("base64")}`,
        "content-type": "application/x-www-form-urlencoded",
      },
      body: params,
      cache: "no-store",
      signal: controller.signal,
    });
    const text = await response.text();
    if (!response.ok || Buffer.byteLength(text, "utf8") > 256 * 1024) {
      throw new Error(`billing provider returned HTTP ${response.status}`);
    }
    return JSON.parse(text) as T;
  } finally {
    clearTimeout(timeout);
  }
}

