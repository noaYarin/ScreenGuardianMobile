import { API_BASE_URL } from "../config/env";
import { getToken, removeToken } from "../services/authStorage";

export type ApiError = {
  code: string;
  message: string;
};

export type ApiResponse<T> =
  | { ok: true; data: T }
  | { ok: false; error: ApiError };

type RequestOptions = {
  requireAuth?: boolean;
};

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  options: RequestOptions = {}
): Promise<T> {
  const { requireAuth = false } = options;
  const url = `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (requireAuth) {
    const token = await getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const init: RequestInit = {
    method,
    headers,
  };
  if (body !== undefined && body !== null && method !== "GET") {
    init.body = JSON.stringify(body);
  }

  const res = await fetch(url, init);
  const json = (await res.json().catch(() => ({}))) as ApiResponse<T>;

  if (!res.ok) {
    const err = new Error(
      (json as { ok?: boolean; error?: ApiError }).error?.message ?? `HTTP ${res.status}`
    ) as Error & { code?: string; status?: number };
    err.code = (json as { error?: ApiError }).error?.code;
    err.status = res.status;
    if (res.status === 401) {
      removeToken();
    }
    throw err;
  }

  const payload = json as { ok: true; data: T };
  if (payload.ok !== true) {
    const errPayload = json as { ok: false; error: ApiError };
    const err = new Error(errPayload.error?.message ?? "Request failed") as Error & {
      code?: string;
    };
    err.code = errPayload.error?.code;
    throw err;
  }

  return payload.data;
}

export const api = {
  get<T>(path: string, options?: RequestOptions) {
    return request<T>("GET", path, undefined, options);
  },
  post<T>(path: string, body?: unknown, options?: RequestOptions) {
    return request<T>("POST", path, body, options);
  },
  patch<T>(path: string, body?: unknown, options?: RequestOptions) {
    return request<T>("PATCH", path, body, options);
  },
  put<T>(path: string, body?: unknown, options?: RequestOptions) {
    return request<T>("PUT", path, body, options);
  },
  delete<T>(path: string, options?: RequestOptions) {
    return request<T>("DELETE", path, undefined, options);
  },
};
