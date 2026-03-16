import { api } from "../request";
import { setToken } from "../../services/authStorage";
import type {
  AuthDataFromServer,
  RegisterParentParams,
  LoginParentParams,
  ResetPasswordParams,
} from "./auth.types";

const URL = "/api/v1/auth";

export async function apiRegisterParent(
  params: RegisterParentParams
): Promise<AuthDataFromServer> {
  const data = await api.post<AuthDataFromServer>(
    `${URL}/register-parent`,
    params
  );
  if (data.token) {
    await setToken(data.token);
  }
  return data;
}

export async function apiLoginParent(
  params: LoginParentParams
): Promise<AuthDataFromServer> {
  const data = await api.post<AuthDataFromServer>(
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
): Promise<AuthDataFromServer> {
  const data = await api.post<AuthDataFromServer>(
    `${URL}/forgot-password`,
    { email }
  );
  return data;
}

export async function apiResetPassword(
  params: ResetPasswordParams
): Promise<AuthDataFromServer> {
  const data = await api.post<AuthDataFromServer>(
    `${URL}/reset-password-confirm`,
    params
  );

  if (data.token) {
    await setToken(data.token);
  }

  return data;
}


