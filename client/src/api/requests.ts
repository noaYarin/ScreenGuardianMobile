import { api } from "./request";

const URL = "/api/v1/requests";

export type ParentExtensionRequest = {
  _id: string;
  parentId: string;
  childId: string;
  deviceId: string;
  requestedMinutes: number;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt?: string;
  updatedAt?: string;
};

export async function apiGetPendingRequests(childId?: string) {
  const query = childId ? `?childId=${encodeURIComponent(childId)}` : "";

  return api.get<ParentExtensionRequest[]>(
    `${URL}/parent/pending${query}`,
    {
      requireAuth: true,
      role: "PARENT",
    }
  );
}

export async function apiDecideRequest(
  requestId: string,
  decision: "APPROVED" | "REJECTED"
) {
  return api.patch<ParentExtensionRequest>(
    `${URL}/parent/${encodeURIComponent(requestId)}/decision`,
    { decision },
    {
      requireAuth: true,
      role: "PARENT",
    }
  );
}