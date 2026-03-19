import { API_BASE_URL } from "../config/env";
import en from "../locales/en.json";
import { getParentToken, getChildToken, removeParentToken, removeChildToken } from "../services/authStorage";
import { useTranslation } from "react-i18next";

const { t } = useTranslation();


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
    
    const token = options.role === "CHILD" ? childData?.token : parentData?.token;
    
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const result = await response.json();

  if (response.status === 401) {
    await removeParentToken();
    await removeChildToken();
    throw new Error(t("api.unauthorized"));
  }

  if (!response.ok) {
    throw new Error(result?.error?.message || result?.message|| t("api.generic_error"));
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