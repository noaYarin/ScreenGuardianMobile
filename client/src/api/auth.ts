import { api } from "./client";
import { setToken } from "../services/authStorage";
import type {
  AuthDataFromServer,
  RegisterParentParams,
  LoginParentParams,
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

export async function apiGoogleAuthParent(idToken: string): Promise<AuthDataFromServer> {
  const data = await api.post<AuthDataFromServer>(`${URL}/google-auth-parent`, {
    idToken,
  });
  if (data.token) {
    await setToken(data.token);
  }
  return data;
}
