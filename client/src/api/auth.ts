import { api } from "./client";
import { setToken } from "../services/authStorage";

const URL = "/api/v1/auth";

export type AuthDataFromServer = {
  token: string;
  parentId: string;
};

export type RegisterParentParams = {
  email: string;
  password: string;
  name: string;
  phoneNumber?: string;
  gender?: string;
};

export type LoginParentParams = {
  email: string;
  password: string;
};

export async function registerParent(params: RegisterParentParams): Promise<AuthDataFromServer> {
  const data = await api.post<AuthDataFromServer>(`${URL}/register-parent`, params);
  if (data.token) {
    await setToken(data.token);
  }
  return data;
}

export async function loginParent(params: LoginParentParams): Promise<AuthDataFromServer> {
  const data = await api.post<AuthDataFromServer>(`${URL}/login-parent`, params);
  if (data.token) {
    await setToken(data.token);
  }
  return data;
}

export async function googleAuthParent(idToken: string): Promise<AuthDataFromServer> {
  const data = await api.post<AuthDataFromServer>(`${URL}/google-auth-parent`, {
    idToken,
  });
  if (data.token) {
    await setToken(data.token);
  }
  return data;
}
