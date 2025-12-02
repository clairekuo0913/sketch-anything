export const API_BASE_URL = "http://localhost:8000/api";

export interface SessionSettings {
  category: string;
  count: number;
  duration: number;
}

export interface SessionResponse {
  images: string[];
  duration: number;
}

export async function getCategories(): Promise<string[]> {
  const response = await fetch(`${API_BASE_URL}/categories`);
  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }
  return response.json();
}

export async function startSession(settings: SessionSettings): Promise<SessionResponse> {
  const response = await fetch(`${API_BASE_URL}/session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(settings),
  });
  
  if (!response.ok) {
    throw new Error("Failed to start session");
  }
  return response.json();
}

export function getImageUrl(path: string): string {
  return `http://localhost:8000${path}`;
}

