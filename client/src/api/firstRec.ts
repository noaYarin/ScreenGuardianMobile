import { CSHARP_API_BASE_URL } from "../config/env";

export type ScreenTimeRecommendation = {
  id: number;
  minAge: number;
  maxAge: number;
  recommendedMinutes: number;
  message: string;
};

export async function getRecommendationByAge(
  age: number
): Promise<ScreenTimeRecommendation> {
  const response = await fetch(
    `${CSHARP_API_BASE_URL}/api/screentime/recommendation?age=${age}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch recommendation");
  }

  return response.json();
}