export type JsonBodyResult =
  | { ok: true; value: unknown }
  | { ok: false; status: 400 | 413; message: string };

export const WAITLIST_BODY_LIMIT_BYTES = 16 * 1024;

export async function readJsonBodyWithLimit(
  request: Request,
  maxBytes = WAITLIST_BODY_LIMIT_BYTES,
): Promise<JsonBodyResult> {
  const contentLength = request.headers.get("content-length");
  if (contentLength) {
    const declaredBytes = Number(contentLength);
    if (!Number.isSafeInteger(declaredBytes) || declaredBytes < 0) {
      return { ok: false, status: 400, message: "The form could not be read." };
    }
    if (declaredBytes > maxBytes) {
      return { ok: false, status: 413, message: "The form payload is too large." };
    }
  }

  if (!request.body) {
    return { ok: false, status: 400, message: "The form could not be read." };
  }

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let bytesRead = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytesRead += value.byteLength;
      if (bytesRead > maxBytes) {
        await reader.cancel("payload limit exceeded");
        return { ok: false, status: 413, message: "The form payload is too large." };
      }
      chunks.push(value);
    }
  } catch {
    return { ok: false, status: 400, message: "The form could not be read." };
  }

  const body = new Uint8Array(bytesRead);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }

  try {
    const text = new TextDecoder("utf-8", { fatal: true }).decode(body);
    return { ok: true, value: JSON.parse(text) };
  } catch {
    return { ok: false, status: 400, message: "The form could not be read." };
  }
}
