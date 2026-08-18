export type RawBodyResult =
  | { ok: true; value: Uint8Array }
  | { ok: false; status: 400 | 413; message: string };

export async function readRawBodyWithLimit(
  request: Request,
  maxBytes: number,
): Promise<RawBodyResult> {
  const declared = request.headers.get("content-length");
  if (declared) {
    const parsed = Number(declared);
    if (!Number.isSafeInteger(parsed) || parsed < 0) {
      return { ok: false, status: 400, message: "invalid content length" };
    }
    if (parsed > maxBytes) {
      return { ok: false, status: 413, message: "payload too large" };
    }
  }
  if (!request.body) return { ok: false, status: 400, message: "payload missing" };

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > maxBytes) {
        await reader.cancel("payload limit exceeded");
        return { ok: false, status: 413, message: "payload too large" };
      }
      chunks.push(value);
    }
  } catch {
    return { ok: false, status: 400, message: "payload unreadable" };
  }

  const value = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    value.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return { ok: true, value };
}
