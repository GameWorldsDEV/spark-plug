// @vitest-environment node

import { describe, expect, it } from "vitest";
import {
  readJsonBodyWithLimit,
  WAITLIST_BODY_LIMIT_BYTES,
} from "./read-json-body";

describe("readJsonBodyWithLimit", () => {
  it("parses a small JSON request", async () => {
    const request = new Request("https://example.test/api/waitlist", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: "person@example.com" }),
    });

    await expect(readJsonBodyWithLimit(request)).resolves.toEqual({
      ok: true,
      value: { email: "person@example.com" },
    });
  });

  it("rejects a declared fixed-length body before reading it", async () => {
    const request = new Request("https://example.test/api/waitlist", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "content-length": String(WAITLIST_BODY_LIMIT_BYTES + 1),
      },
      body: "{}",
    });

    await expect(readJsonBodyWithLimit(request)).resolves.toMatchObject({
      ok: false,
      status: 413,
    });
  });

  it("aborts a chunked body as soon as accumulated bytes exceed the cap", async () => {
    const first = new Uint8Array(10 * 1024).fill(0x20);
    const second = new Uint8Array(7 * 1024).fill(0x20);
    let canceled = false;
    let chunkIndex = 0;
    const body = new ReadableStream<Uint8Array>({
      pull(controller) {
        controller.enqueue(chunkIndex++ === 0 ? first : second);
      },
      cancel() {
        canceled = true;
      },
    });
    const request = new Request("https://example.test/api/waitlist", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
      duplex: "half",
    } as RequestInit & { duplex: "half" });

    await expect(readJsonBodyWithLimit(request)).resolves.toMatchObject({
      ok: false,
      status: 413,
    });
    expect(canceled).toBe(true);
  });
});
