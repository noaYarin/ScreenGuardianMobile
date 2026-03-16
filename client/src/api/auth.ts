import { api } from "./request";
import { setToken } from "../services/authStorage";

const URL = "/api/v1/auth";

export async function apiRegisterParent(
  params: { email: string; password: string }
): Promise<{ token: string; parentId: string }> {
  const data = await api.post<{ token: string; parentId: string }>(
    `${URL}/register-parent`,
    params
  );
  if (data.token) {
    await setToken(data.token);
  }
  return data;
}

export async function apiLoginParent(
  params: { email: string; password: string }
): Promise<{ token: string; parentId: string }> {
  const data = await api.post<{ token: string; parentId: string }>(
    `${URL}/login-parent`,
    params
  );
  if (data.token) {
    await setToken(data.token);
  }
  return data;
}

export async function apiForgotPassword(
  email: string
): Promise<{ message: string }> {
  const data = await api.post<{ message: string }>(
    `${URL}/forgot-password`,
    { email }
  );
  return data;
}

export async function apiResetPassword(
  params: { email: string; otpCode: string; password: string }
): Promise<{ token: string; parentId: string }> {
  const data = await api.post<{ token: string; parentId: string }>(
    `${URL}/reset-password-confirm`,
    params
  );

  if (data.token) {
    await setToken(data.token);
  }

  return data;
}


