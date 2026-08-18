import { describe, expect, it } from "vitest";
import { readRawBodyWithLimit } from "./read-raw-body";

describe("bounded raw request reader", () => {
  it("reads exact bytes without text re-encoding", async () => {
    const bytes = new Uint8Array([0, 1, 2, 255]);
    const result = await readRawBodyWithLimit(
      new Request("https://example.test", { method: "POST", body: bytes }),
      4,
    );
    expect(result).toEqual({ ok: true, value: bytes });
  });

  it("rejects a declared oversized body before reading", async () => {
    const result = await readRawBodyWithLimit(
      new Request("https://example.test", {
        method: "POST",
        headers: { "content-length": "5" },
        body: "hello",
      }),
      4,
    );
    expect(result).toMatchObject({ ok: false, status: 413 });
  });

  it("rejects a chunked body once it crosses the cap", async () => {
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(new Uint8Array([1, 2, 3]));
        controller.enqueue(new Uint8Array([4, 5, 6]));
        controller.close();
      },
    });
    const result = await readRawBodyWithLimit(
      new Request("https://example.test", { method: "POST", body: stream, duplex: "half" } as RequestInit),
      4,
    );
    expect(result).toMatchObject({ ok: false, status: 413 });
  });
});
