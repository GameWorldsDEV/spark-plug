const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export type CatalogCursor = {
  publishedAt: string;
  id: string;
};

export function encodeCatalogCursor(value: CatalogCursor): string {
  return Buffer.from(JSON.stringify(value), "utf8").toString("base64url");
}

export function decodeCatalogCursor(value: string): CatalogCursor | null {
  if (value.length < 8 || value.length > 512 || !/^[A-Za-z0-9_-]+$/.test(value)) return null;
  try {
    const parsed = JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
    const cursor = parsed as Record<string, unknown>;
    if (
      Object.keys(cursor).length !== 2 ||
      typeof cursor.publishedAt !== "string" ||
      typeof cursor.id !== "string" ||
      !UUID.test(cursor.id)
    ) return null;
    const publishedAt = new Date(cursor.publishedAt);
    if (Number.isNaN(publishedAt.valueOf()) || publishedAt.toISOString() !== cursor.publishedAt) return null;
    return { publishedAt: cursor.publishedAt, id: cursor.id };
  } catch {
    return null;
  }
}
