import { API_BASE_URL } from "../config/env";
import { getParentToken, getChildToken, removeParentToken, removeChildToken } from "../services/authStorage";
import i18n from "../locales/i18n"; 

type RequestOptions = {
  requireAuth?: boolean;
  role?: "PARENT" | "CHILD";
};

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  options: RequestOptions = {}
): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  
  const headers: any = {
    "Content-Type": "application/json",
  };

  if (options.requireAuth) {

    const parentData = await getParentToken();
    const childData = await getChildToken();

    const authData = options.role === "CHILD" ? childData : parentData;
    const token = typeof authData === 'object' ? authData?.token : authData;
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const result = await response.json().catch(() => ({}));

  if (response.status === 401) {
    await removeParentToken();
    await removeChildToken();
    throw new Error(i18n.t("api.unauthorized"));
  }

  if (!response.ok) {
    const errorMessage = result?.error?.message || result?.message || i18n.t("api.generic_error");
    throw new Error(errorMessage);
  }

  return result?.data as T;
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>("GET", path, null, options),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>("POST", path, body, options),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>("PUT", path, body, options),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>("PATCH", path, body, options),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>("DELETE", path, null, options),
};