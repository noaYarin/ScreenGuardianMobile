import { api } from "./request";
import type { Child } from "@/src/redux/slices/children-slice";

export async function fetchCurrentChildProfile(): Promise<{ child: Child }> {
  return api.get<{ child: Child }>("/api/v1/child/profile", {
    requireAuth: true,
    role: "CHILD",
  });
}
