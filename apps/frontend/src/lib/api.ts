const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

export interface ApiResponse<T> {
  data: T | null
  error: string | null
}

export async function apiFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${path}`
    const { headers: optionHeaders, ...restOptions } = options || {}
    const res = await fetch(url, {
      ...restOptions,
      headers: {
        'Content-Type': 'application/json',
        ...(optionHeaders as Record<string, string>),
      },
    })

    if (!res.ok) {
      return { data: null, error: `HTTP ${res.status}: ${res.statusText}` }
    }

    const data = (await res.json()) as T
    return { data, error: null }
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Unknown error',
    }
  }
}
