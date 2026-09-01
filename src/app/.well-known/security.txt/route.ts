export const dynamic = "force-static";

export function GET() {
  return new Response([
    "Contact: mailto:security@gameworlds.ai",
    "Policy: https://sparkplug.gameworlds.ai/security",
    "Expires: 2027-09-01T00:00:00.000Z",
    "Preferred-Languages: en",
    "Canonical: https://sparkplug.gameworlds.ai/.well-known/security.txt",
    "",
  ].join("\n"), {
    headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" },
  });
}

