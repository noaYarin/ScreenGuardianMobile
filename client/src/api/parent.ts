import { api } from "./client";
import type {
  AddChildParams,
  AddChildDataFromServer,
  GetMyChildDataFromServer,
  SetChildActiveDataFromServer,
} from "./parent.types";

const URL = "/api/v1/parent";

const auth = { requireAuth: true as const };

export async function addChild(body: AddChildParams): Promise<AddChildDataFromServer> {
  return api.post<AddChildDataFromServer>("/api/v1/parent/add/child", body, auth);
}

export async function getMyChild(options?: {
  includeInactive?: boolean;
}): Promise<GetMyChildDataFromServer> {
  const query =
    options?.includeInactive === true ? "?includeInactive=true" : "";
  return api.get<GetMyChildDataFromServer>(`${URL}/get/child${query}`, auth);
}

export async function setChildActive(
  childId: string,
  isActive: boolean
): Promise<SetChildActiveDataFromServer> {
  return api.patch<SetChildActiveDataFromServer>(
    `${URL}/set/child/${encodeURIComponent(childId)}/active`,
    { isActive },
    auth
  );
}
