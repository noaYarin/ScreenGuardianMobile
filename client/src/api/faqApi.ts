import { CSHARP_API_BASE_URL } from "../config/env";

export type FaqItem = {
  id: number;
  question: string;
  answer: string;
  category: string;
  displayOrder: number;
};

export async function getFaq(): Promise<FaqItem[]> {
  const response = await fetch(`${CSHARP_API_BASE_URL}/api/faq`);

  if (!response.ok) {
    throw new Error("Failed to fetch FAQ");
  }

  return response.json();
}