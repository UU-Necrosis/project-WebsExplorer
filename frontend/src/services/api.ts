// All real API calls go here.
// Set VITE_API_URL in a .env file to point at your NestJS backend.
import type { NewClientSubmission, SubmissionRecord } from '../context/ClientSubmissionStore'

export interface ApiNode {
  id: string
  name: string
  region: string
  latencyMs: number | null
  status: 'online' | 'offline' | 'maintenance'
}

const BASE = (import.meta.env.VITE_API_URL ?? 'http://localhost:3000').replace(/\/+$/, '')

function authHeader(): Record<string, string> {
  const customerToken = localStorage.getItem('customer_token')
  const adminToken = localStorage.getItem('admin_token')
  const token = customerToken ?? adminToken
  return token ? { Authorization: `Bearer ${token}` } : {}
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

export type CustomerUser = {
  id: string
  name: string
  email: string
}

export const customerAuthApi = {
  signup: (payload: { name: string; email: string; password: string }) =>
    req<{ token: string; user: CustomerUser }>('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  login: (payload: { email: string; password: string }) =>
    req<{ token: string; user: CustomerUser }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
}

export const submissionsApi = {
  list: () => req<SubmissionRecord[]>('/api/submissions'),
  create: (submission: NewClientSubmission) => req<SubmissionRecord>('/api/submissions', {
    method: 'POST',
    body: JSON.stringify(submission),
  }),
  vote: (id: string, kind: 'admin' | 'client', voterId: number) =>
    req<SubmissionRecord>(`/api/submissions/${id}/votes/${kind}`, {
      method: 'POST',
      body: JSON.stringify({ voterId }),
    }),
}

export const savedWebsitesApi = {
  list: () => req<SubmissionRecord[]>('/api/websites-saved'),
}

export const nodesApi = {
  list: () => req<ApiNode[]>('/api/nodes'),
}

export const auditApi = {
  list: () => req<unknown[]>('/api/audit-logs'),
}
