import { api } from "./request";

const URL = "/api/v1/pairing";
const auth = { requireAuth: true as const };

export async function generateCode(
  params?: { childId?: string | null }
): Promise<{ code: string; barcodeToken: string; expiresAt: string }> {
  return api.post<{ code: string; barcodeToken: string; expiresAt: string }>(
    `${URL}/generate-code`,
    params?.childId != null ? { childId: params.childId } : undefined,
    auth
  );
}

export async function linkDevice(
  params: { code?: string; barcodeToken?: string }
): Promise<{ token: string; parentId: string; childId: string }> {
  return api.post<{ token: string; parentId: string; childId: string }>(
    `${URL}/link-device`,
    params,
    auth
  );
}

