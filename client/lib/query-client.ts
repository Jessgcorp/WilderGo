import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { Platform } from "react-native";
import Constants from "expo-constants";

const LIVE_PRODUCTION_API_URL =
  "https://aa60d38e-336a-4c6c-8c7a-2e8f4ae13a3f-00-37dgmtff0mvif.picard.replit.dev/";

const DEFAULT_API_TIMEOUT_MS = 15000;
const DEFAULT_DEV_API_PORT = process.env.EXPO_PUBLIC_API_PORT ?? "5000";

type ExpoManifestLike = {
  extra?: Record<string, unknown>;
  debuggerHost?: string;
  hostUri?: string;
};

export async function fetchWithTimeout(
  input: RequestInfo,
  init: RequestInit = {},
  timeoutMs = DEFAULT_API_TIMEOUT_MS,
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(input, {
      ...init,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

function withTrailingSlash(url: string): string {
  return url.endsWith("/") ? url : `${url}/`;
}

function isLoopbackHostname(hostname: string): boolean {
  return ["localhost", "127.0.0.1", "::1", "[::1]"].includes(
    hostname.toLowerCase(),
  );
}

function isPrivateNetworkHostname(hostname: string): boolean {
  return /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[0-1])\.)/.test(hostname);
}

function usesTunnelHost(value: string): boolean {
  return /ngrok(-free)?\.app|ngrok\.io|trycloudflare\.com|replit\.dev|picard\.replit\.dev/i.test(
    value,
  );
}

function normalizeApiUrl(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;

  const valueWithProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `${usesTunnelHost(trimmed) ? "https" : "http"}://${trimmed}`;

  try {
    const url = new URL(valueWithProtocol);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return undefined;
    }
    return withTrailingSlash(url.href);
  } catch {
    return undefined;
  }
}

function getExtraString(key: string): string | undefined {
  const constants = Constants as typeof Constants & {
    manifest?: ExpoManifestLike;
    manifest2?: ExpoManifestLike;
  };
  const extraSources = [
    Constants.expoConfig?.extra,
    constants.manifest?.extra,
    constants.manifest2?.extra,
  ];

  for (const extra of extraSources) {
    const value = extra?.[key];
    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }

  return undefined;
}

function getExpoHostUri(): string | undefined {
  const constants = Constants as typeof Constants & {
    manifest?: ExpoManifestLike;
    manifest2?: ExpoManifestLike;
  };
  const expoConfig = Constants.expoConfig as ExpoManifestLike | null | undefined;

  return (
    expoConfig?.hostUri ??
    expoConfig?.debuggerHost ??
    (expoConfig?.extra?.expoGo as ExpoManifestLike | undefined)?.debuggerHost ??
    (expoConfig?.extra?.expoClient as ExpoManifestLike | undefined)?.hostUri ??
    constants.manifest?.hostUri ??
    constants.manifest?.debuggerHost ??
    constants.manifest2?.hostUri ??
    constants.manifest2?.debuggerHost
  );
}

function deriveApiUrlFromPackagerHost(): string | undefined {
  const hostUri = getExpoHostUri();
  if (!hostUri || hostUri.includes("exp.direct") || hostUri.includes(".exp.")) {
    return undefined;
  }

  try {
    const url = new URL(
      /^https?:\/\//i.test(hostUri) ? hostUri : `http://${hostUri}`,
    );

    if (isLoopbackHostname(url.hostname)) {
      return undefined;
    }

    if (usesTunnelHost(url.hostname)) {
      url.protocol = "https:";
      url.port = "";
      return withTrailingSlash(url.href);
    }

    if (isPrivateNetworkHostname(url.hostname)) {
      url.protocol = "http:";
      url.port = DEFAULT_DEV_API_PORT;
      return withTrailingSlash(url.href);
    }
  } catch {
    return undefined;
  }

  return undefined;
}

function firstConfiguredApiUrl(...values: Array<string | undefined>): string | undefined {
  for (const value of values) {
    if (!value) continue;
    const normalized = normalizeApiUrl(value);
    if (normalized) return normalized;
  }

  return undefined;
}

/**
 * REST API base URL for native apps.
 * iOS simulator auth must target a real LAN IP or HTTPS tunnel, not localhost.
 */
export function getApiUrl(): string {
  if (Platform.OS === "web" && typeof window !== "undefined") {
    const loc = window.location;
    if (loc.hostname === "localhost" || loc.hostname === "127.0.0.1") {
      return "http://localhost:5000/";
    }
    return `${loc.protocol}//${loc.host}/`;
  }

  const configured = firstConfiguredApiUrl(
    process.env.EXPO_PUBLIC_API_URL,
    process.env.EXPO_PUBLIC_NGROK_URL,
    process.env.EXPO_PUBLIC_NGROK_DOMAIN,
    process.env.EXPO_PUBLIC_DEV_API_URL,
    process.env.EXPO_PUBLIC_DEV_API_HOST,
    process.env.EXPO_PUBLIC_DOMAIN,
    getExtraString("apiBaseUrl"),
  );
  if (configured) {
    return configured;
  }

  const packagerDerivedUrl = deriveApiUrlFromPackagerHost();
  if (packagerDerivedUrl) {
    return packagerDerivedUrl;
  }

  console.warn(
    "No native API URL configured. Set EXPO_PUBLIC_API_URL, EXPO_PUBLIC_DEV_API_HOST, EXPO_PUBLIC_NGROK_URL, or extra.apiBaseUrl.",
  );

  return LIVE_PRODUCTION_API_URL;
}

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  route: string,
  data?: unknown | undefined,
): Promise<Response> {
  const baseUrl = getApiUrl();
  const url = new URL(route, baseUrl);

  const res = await fetchWithTimeout(
    url.toString(),
    {
      method,
      headers: data ? { "Content-Type": "application/json" } : {},
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
    },
    DEFAULT_API_TIMEOUT_MS,
  );

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const baseUrl = getApiUrl();
    const url = new URL(queryKey.join("/") as string, baseUrl);

    const res = await fetchWithTimeout(
      url.toString(),
      {
        credentials: "include",
      },
      DEFAULT_API_TIMEOUT_MS,
    );

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
