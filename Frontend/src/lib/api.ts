export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/+$/, '');

export class ApiError extends Error {
  constructor(message: string, public status: number, public code?: string) { super(message); }
}

export async function api<T = Record<string, unknown>>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options, credentials: 'include',
    headers: { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...options.headers },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const detail = data.detail;
    const message = typeof detail === 'string' ? detail : Array.isArray(detail)
      ? detail.map((item: { msg?: string }) => item.msg || 'Invalid information.').join(' ')
      : detail?.message || 'Unable to complete your request. Please try again.';
    throw new ApiError(message, response.status, detail?.code);
  }
  return data as T;
}
