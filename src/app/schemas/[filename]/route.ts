import appCatalogPointer from "../../../../schemas/app-catalog-pointer.v1.schema.json";
import appCatalogSnapshot from "../../../../schemas/app-catalog-snapshot.v1.schema.json";
import entitlementClaims from "../../../../schemas/entitlement-claims.v1.schema.json";
import marketplaceListing from "../../../../schemas/marketplace-listing.v1.schema.json";
import motionPack from "../../../../schemas/motion-pack.v1.schema.json";
import setupProfile from "../../../../schemas/setup-profile.v1.schema.json";
import themePackage from "../../../../schemas/theme-package.v1.schema.json";

export const dynamic = "force-static";
export const dynamicParams = false;

const schemas = {
  "app-catalog-pointer.v1.schema.json": appCatalogPointer,
  "app-catalog-snapshot.v1.schema.json": appCatalogSnapshot,
  "entitlement-claims.v1.schema.json": entitlementClaims,
  "marketplace-listing.v1.schema.json": marketplaceListing,
  "motion-pack.v1.schema.json": motionPack,
  "setup-profile.v1.schema.json": setupProfile,
  "theme-package.v1.schema.json": themePackage,
} as const;

export function generateStaticParams() {
  return Object.keys(schemas).map((filename) => ({ filename }));
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ filename: string }> },
) {
  const { filename } = await context.params;
  const schema = schemas[filename as keyof typeof schemas];
  if (!schema) return new Response("Not found", { status: 404 });
  return Response.json(schema, {
    headers: { "cache-control": "public, max-age=31536000, s-maxage=31536000, immutable" },
  });
}
