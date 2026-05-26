type ApiError = {
  status: number;
  message: string;
};

export async function apiClient<T>(path: string, init?: RequestInit) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "";
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => null)) as { message?: string } | null;

    const error: ApiError = {
      status: response.status,
      message: errorBody?.message ?? "Request failed",
    };

    throw error;
  }

  return (await response.json()) as T;
}
