import { api } from "./client";

const URL = "/api/v1/parent";

export type Child = {
  _id: string;
  name: string;
  birthDate: string;
  gender?: string;
  interests?: string[];
  coins: number;
  isActive: boolean;
  role: string;
  achievementIds?: string[];
  avatar?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
};

export type AddChildParams = {
  name: string;
  birthDate: string;
  gender?: string;
  interests?: string[];
};

export type AddChildDataFromServer = {
  child: Child;
};

export type GetMyChildDataFromServer = {
  children: Child[];
};

export type SetChildActiveDataFromServer = {
  [key: string]: unknown;
};

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
