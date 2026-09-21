const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

export function isApiConfigured() {
  return Boolean(apiUrl);
}

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  if (!apiUrl) throw new Error("NEXT_PUBLIC_API_URL is not configured");
  const response = await fetch(`${apiUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(payload?.error ?? `API request failed with status ${response.status}`);
  }
  return response.status === 204 ? (undefined as T) : response.json();
}
