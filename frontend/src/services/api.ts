// All real API calls go here.
// Set VITE_API_URL in a .env file to point at your NestJS backend.
const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

function authHeader(): Record<string, string> {
  const t = localStorage.getItem('admin_token')
  return t ? { Authorization: `Bearer ${t}` } : {}
}

async function req<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...authHeader(),
      ...(opts.headers as Record<string, string>),
    },
    ...opts,
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body?.message ?? `HTTP ${res.status}`)
  }
  return res.json()
}

export const authApi = {
  login: (email: string, password: string) =>
    req<{ token: string }>('/api/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
}

export const submissionsApi = {
  list:    ()           => req<unknown[]>('/api/submissions'),
  approve: (id: string) => req<void>(`/api/submissions/${id}/approve`, { method: 'POST' }),
  reject:  (id: string) => req<void>(`/api/submissions/${id}/reject`,  { method: 'POST' }),
}

export const directoryApi = {
  list:   ()           => req<unknown[]>('/api/directory'),
  remove: (id: string) => req<void>(`/api/directory/${id}`, { method: 'DELETE' }),
}

export const auditApi = {
  list: () => req<unknown[]>('/api/audit-logs'),
}
