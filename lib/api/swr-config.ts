import apiClient from "../axios"

/**
 * SWR fetcher: makes a GET request with the axios client.
 * Rejects on non-2xx responses (SWR handles retries).
 */
export async function swrFetcher<T>(url: string, signal?: AbortSignal): Promise<T> {
  const { data } = await apiClient.get<T>(url, { signal })
  return data
}

/**
 * Build query string from params object, filtering out undefined/null/empty values.
 */
export function buildQS(params: Record<string, string | number | boolean | null | undefined>): string {
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && v !== ""
  )
  return new URLSearchParams(entries.map(([k, v]) => [k, String(v)])).toString()
}
