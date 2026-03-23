import { api } from "./request";
import type { Child } from "@/src/redux/slices/children-slice";

export async function fetchCurrentChildProfile(): Promise<{ child: Child }> {
  return api.get<{ child: Child }>("/api/v1/child/profile", {
    requireAuth: true,
    role: "CHILD",
  });
}

// Update current child profile by id
export async function updateCurrentChildProfile(name: string, birthDate: string, gender: string): Promise<{ child: Child }> {
  return api.put<{ child: Child }>("/api/v1/child/profile", { name, birthDate, gender }, {
      requireAuth: true,
      role: "CHILD",
    },
  );
}