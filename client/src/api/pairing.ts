import { api } from "./client";

const URL = "/api/v1/pairing";

export type GenerateCodeParams = {
  childId?: string | null;
};

export type GenerateCodeDataFromServer = {
  code: string;
  barcodeToken: string;
  expiresAt: string;
};

export type LinkDeviceParams = {
  code?: string;
  barcodeToken?: string;
};

export type LinkDeviceDataFromServer = {
  token: string;
  parentId: string;
  childId: string;
};

const auth = { requireAuth: true as const };

export async function generateCode(
  params?: GenerateCodeParams
): Promise<GenerateCodeDataFromServer> {
  return api.post<GenerateCodeDataFromServer>(
    `${URL}/generate-code`,
    params?.childId != null ? { childId: params.childId } : undefined,
    auth
  );
}

export async function linkDevice(
  params: LinkDeviceParams
): Promise<LinkDeviceDataFromServer> {
  return api.post<LinkDeviceDataFromServer>(`${URL}/link-device`, params, auth);
}
