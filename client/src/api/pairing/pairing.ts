import { api } from "../request";
import type {
  GenerateCodeParams,
  GenerateCodeDataFromServer,
  LinkDeviceParams,
  LinkDeviceDataFromServer,
} from "./pairing.types";

const URL = "/api/v1/pairing";

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
