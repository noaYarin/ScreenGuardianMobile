import { api } from "./request";

type Child = {
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

const URL = "/api/v1/parent";
const auth = { requireAuth: true as const };

export async function addChild(body: {
  name: string;
  birthDate: string;
  gender?: string;
}): Promise<{ child: Child }> {
  return api.post<{ child: Child }>("/api/v1/parent/add/child", body, auth);
}

export async function getMyChildren(options?: {
  includeInactive?: boolean;
}): Promise<{ children: Child[] }> {
  const query =
    options?.includeInactive === true ? "?includeInactive=true" : "";
  return api.get<{ children: Child[] }>(`${URL}/get/children${query}`, auth);
}

export async function setChildActive(
  childId: string,
  isActive: boolean
): Promise<{ [key: string]: unknown }> {
  return api.patch<{ [key: string]: unknown }>(
    `${URL}/set/child/${encodeURIComponent(childId)}/active`,
    { isActive },
    auth
  );
}

