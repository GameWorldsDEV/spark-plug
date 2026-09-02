import "server-only";

type SupabaseConfig = {
  url: string;
  anonKey: string | null;
  serviceRoleKey: string | null;
};

const RPC_NAME = /^[a-z][a-z0-9_]{0,63}$/;
const MAX_JSON_RESPONSE_BYTES = 512 * 1024;

export function supabaseConfig(): SupabaseConfig | null {
  const configured = process.env.SUPABASE_URL;
  if (!configured) return null;
  let url: URL;
  try {
    url = new URL(configured);
  } catch {
    return null;
  }
  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  ) return null;
  return {
    url: url.origin,
    anonKey: process.env.SUPABASE_ANON_KEY || null,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || null,
  };
}

async function checkedJson<T>(response: Response): Promise<T> {
  if (!response.ok) throw new Error(`public data service returned HTTP ${response.status}`);
  const declared = Number(response.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > MAX_JSON_RESPONSE_BYTES) {
    throw new Error("public data service response is too large");
  }
  const body = await response.text();
  if (Buffer.byteLength(body, "utf8") > MAX_JSON_RESPONSE_BYTES) {
    throw new Error("public data service response is too large");
  }
  if (!body.trim()) return undefined as T;
  return JSON.parse(body) as T;
}

function rpcPath(config: SupabaseConfig, functionName: string): string {
  if (!RPC_NAME.test(functionName)) throw new Error("invalid public data function name");
  return `${config.url}/rest/v1/rpc/${functionName}`;
}

export async function authenticateSupabaseUser(accessToken: string) {
  const config = supabaseConfig();
  if (!config?.anonKey) throw new Error("public auth service is not configured");
  const response = await fetch(`${config.url}/auth/v1/user`, {
    headers: {
      apikey: config.anonKey,
      authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });
  const user = await checkedJson<{ id?: unknown }>(response);
  if (typeof user.id !== "string") throw new Error("public auth token has no user id");
  return { id: user.id };
}

export async function supabaseUserRpc<T>(
  accessToken: string,
  functionName: string,
  body: Record<string, unknown> = {},
): Promise<T> {
  const config = supabaseConfig();
  if (!config?.anonKey) throw new Error("public auth service is not configured");
  const response = await fetch(rpcPath(config, functionName), {
    method: "POST",
    headers: {
      apikey: config.anonKey,
      authorization: `Bearer ${accessToken}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  return checkedJson<T>(response);
}

export async function supabaseAnonRpc<T>(
  functionName: string,
  body: Record<string, unknown> = {},
): Promise<T> {
  const config = supabaseConfig();
  if (!config?.anonKey) throw new Error("public data service is not configured");
  const response = await fetch(rpcPath(config, functionName), {
    method: "POST",
    headers: {
      apikey: config.anonKey,
      authorization: `Bearer ${config.anonKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  return checkedJson<T>(response);
}

export async function supabaseServiceRpc<T>(
  functionName: string,
  body: Record<string, unknown>,
): Promise<T> {
  const config = supabaseConfig();
  if (!config?.serviceRoleKey) throw new Error("public data service is not configured");
  const response = await fetch(rpcPath(config, functionName), {
    method: "POST",
    headers: {
      apikey: config.serviceRoleKey,
      authorization: `Bearer ${config.serviceRoleKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  return checkedJson<T>(response);
}

export async function supabaseServiceSelect<T>(path: string): Promise<T> {
  const config = supabaseConfig();
  if (!config?.serviceRoleKey) throw new Error("public data service is not configured");
  if (path.length > 4_096 || /[\r\n]/.test(path) || !/^[a-z][a-z0-9_]*(?:\?|$)/.test(path)) {
    throw new Error("invalid public data path");
  }
  const response = await fetch(`${config.url}/rest/v1/${path}`, {
    headers: {
      apikey: config.serviceRoleKey,
      authorization: `Bearer ${config.serviceRoleKey}`,
    },
    next: { revalidate: 300 },
  });
  return checkedJson<T>(response);
}
