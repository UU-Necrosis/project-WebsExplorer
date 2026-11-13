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

export interface SubmissionCooldown {
  canSubmit: boolean
  adminBypass: boolean
  availableAt: string | null
}

export interface AdminAuditLog {
  id: string
  event: string
  type: string
  actorId: string | null
  actor: string
  actorRole: string
  targetId: string | null
  target: string | null
  details: Record<string, unknown>
  time: string
  previousHash: string
  hash: string
}

export interface AuditChainVerification {
  valid: boolean
  checked: number
  firstInvalidId: string | null
  headHash: string
}

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim()
const BASE = (configuredApiUrl || (import.meta.env.DEV ? 'http://localhost:3000' : '')).replace(/\/+$/, '')

function authHeader(): Record<string, string> {
  const customerToken = localStorage.getItem('customer_token')
  const adminToken = localStorage.getItem('admin_token')
  const token = customerToken ?? adminToken
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function req<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const headers = new Headers(opts.headers)
  if (opts.body != null && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json')
  for (const [name, value] of Object.entries(authHeader())) headers.set(name, value)

  if (!BASE) throw new Error('Backend API URL is not configured. Set VITE_API_URL in Vercel and redeploy.')
  let res: Response
  try {
    res = await fetch(`${BASE}${path}`, {
      ...opts,
      headers: {
        ...Object.fromEntries(headers.entries()),
      },
    })
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(`Could not connect to the backend at ${BASE}. Check VITE_API_URL and the backend CORS_ORIGIN setting.`)
    }
    throw error
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body?.message ?? `HTTP ${res.status}`)
  }
  return res.json()
}

export const authApi = {
  login: (identifier: string, password: string) =>
    req<{ token: string; accountId: number }>('/api/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password }),
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
  login: (payload: { identifier?: string; email?: string; password: string }) =>
    req<{ token: string; user: CustomerUser }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
}

export const submissionsApi = {
  list: () => req<SubmissionRecord[]>('/api/submissions'),
  mine: () => req<SubmissionRecord[]>('/api/submissions/mine'),
  clientVoting: () => req<SubmissionRecord[]>('/api/submissions/voting'),
  cooldown: () => req<SubmissionCooldown>('/api/submissions/cooldown'),
  create: (submission: NewClientSubmission) => req<SubmissionRecord & {
    duplicate?: boolean
    voteAdded?: boolean
    message?: string
  }>('/api/submissions', {
    method: 'POST',
    body: JSON.stringify(submission),
  }),
  vote: (id: string, kind: 'admin' | 'client', voterId: number | string) =>
    req<SubmissionRecord>(`/api/submissions/${id}/votes/${kind}`, {
      method: 'POST',
      body: JSON.stringify(kind === 'admin' ? { voterId: Number(voterId) } : {}),
    }),
}

export const savedWebsitesApi = {
  list: () => req<SubmissionRecord[]>('/api/websites-saved'),
}

export const nodesApi = {
  list: () => req<ApiNode[]>('/api/nodes'),
}

export const auditApi = {
  list: (limit = 200) => req<AdminAuditLog[]>(`/api/audit-logs?limit=${limit}`),
  verify: () => req<AuditChainVerification>('/api/audit-logs/verify'),
}
