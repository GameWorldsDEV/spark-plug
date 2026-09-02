import { describe, expect, it } from "vitest";
import { decodeCatalogCursor, encodeCatalogCursor } from "./catalog-cursor";

describe("catalog cursor", () => {
  const value = {
    publishedAt: "2026-08-18T15:00:00.000Z",
    id: "00000000-0000-4000-8000-000000000123",
  };

  it("round trips both stable sort keys", () => {
    expect(decodeCatalogCursor(encodeCatalogCursor(value))).toEqual(value);
  });

  it.each(["", "not-json", "a".repeat(513)])("rejects malformed cursors", (cursor) => {
    expect(decodeCatalogCursor(cursor)).toBeNull();
  });

  it("rejects extension fields and noncanonical dates", () => {
    const extended = Buffer.from(JSON.stringify({ ...value, admin: true })).toString("base64url");
    const dateOnly = Buffer.from(JSON.stringify({ ...value, publishedAt: "2026-08-18" })).toString("base64url");
    expect(decodeCatalogCursor(extended)).toBeNull();
    expect(decodeCatalogCursor(dateOnly)).toBeNull();
  });
});
