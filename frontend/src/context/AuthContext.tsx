import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'

// ── Demo account (for local testing only) ────────────────────
// Remove / replace this with a real API call once the backend is ready.
const DEMO_ACCOUNTS = [
  {id: '1', name: 'admin', status:'',email: 'test@gmail.com', password: '123456' },
  {id: '2', name: 'reviewer-02', status:'', email: 'test2@gmail.com', password: '123456' },
  {id: '3', name: 'reviewer-03', status:'', email: 'test3@gmail.com', password: '123456' },
  {id: '4', name: 'reviewer-04', status:'', email: 'test4@gmail.com', password: '123456' },
  {id: '5', name: 'reviewer-05', status:'', email: 'test5@gmail.com', password: '123456' },
  {id: '6', name: 'reviewer-06', status:'', email: 'test6@gmail.com', password: '123456' },
  {id: '7', name: 'reviewer-07', status:'', email: 'test7@gmail.com', password: '123456' },
  {id: '8', name: 'reviewer-08', status:'', email: 'test8@gmail.com', password: '123456' },
  {id: '9', name: 'reviewer-09', status:'', email: 'test9@gmail.com', password: '123456' },
  {id: '10', name: 'reviewer-10', status:'', email: 'test10@gmail.com', password: '123456' },
  {id: '11', name: 'reviewer-11', status:'', email: 'test11@gmail.com', password: '123456' },
  {id: '12', name: 'reviewer-12', status:'', email: 'test12@gmail.com', password: '123456' },
  {id: '13', name: 'reviewer-13', status:'', email: 'test13@gmail.com', password: '123456' },
  {id: '14', name: 'reviewer-14', status:'', email: 'test14@gmail.com', password: '123456' },
  {id: '15', name: 'reviewer-15', status:'', email: 'test15@gmail.com', password: '123456' },
  {id: '16', name: 'reviewer-16', status:'', email: 'test16@gmail.com', password: '123456' },
  {id: '17', name: 'reviewer-17', status:'', email: 'test17@gmail.com', password: '123456' },
  {id: '18', name: 'reviewer-18', status:'', email: 'test18@gmail.com', password: '123456' },
  {id: '19', name: 'reviewer-19', status:'', email: 'test19@gmail.com', password: '123456' },
  {id: '20', name: 'reviewer-20', status:'', email: 'test20@gmail.com', password: '123456' },
  {id: '21', name: 'reviewer-21', status:'', email: 'test21@gmail.com', password: '123456' },
  {id: '22', name: 'reviewer-22', status:'', email: 'test22@gmail.com', password: '123456' },
  {id: '23', name: 'reviewer-23', status:'', email: 'test23@gmail.com', password: '123456' },
  {id: '24', name: 'reviewer-24', status:'', email: 'test24@gmail.com', password: '123456' },
]

type DemoAccount = (typeof DEMO_ACCOUNTS)[number]

export interface DemoAccountPresence {
  id: string
  name: string
  email: string
  status: 'online' | 'offline'
  lastSeen: number | null
}

const PRESENCE_KEY = 'demo_account_presence'
const PRESENCE_TTL_MS = 60_000
const PRESENCE_HEARTBEAT_MS = 15_000
type PresenceRecords = Record<string, Record<string, number>>

function readPresence(): PresenceRecords {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(PRESENCE_KEY) ?? '{}')
    if (!stored || typeof stored !== 'object' || Array.isArray(stored)) return {}
    return stored as PresenceRecords
  } catch {
    return {}
  }
}

function writePresence(presence: PresenceRecords) {
  try {
    localStorage.setItem(PRESENCE_KEY, JSON.stringify(presence))
  } catch {
    // Presence is best-effort when browser storage is unavailable.
  }
}

function createSessionId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function removePresenceSession(accountId: string, sessionId: string) {
  const presence = readPresence()
  delete presence[accountId]?.[sessionId]
  if (!Object.keys(presence[accountId] ?? {}).length) delete presence[accountId]
  writePresence(presence)
}

export function authenticateDemoAccount(email: string, password: string): DemoAccount | null {
  const normalizedEmail = email.trim().toLowerCase()
  return DEMO_ACCOUNTS.find(
    (account) => account.email.toLowerCase() === normalizedEmail && account.password === password
  ) ?? null
}

export function checkDemoLogin(email: string, password: string): boolean {
  return authenticateDemoAccount(email, password) !== null
}

export function getDemoAccounts(): DemoAccountPresence[] {
  const now = Date.now()
  const presence = readPresence()

  return DEMO_ACCOUNTS.map(({ id, name, email }) => {
    const timestamps = Object.values(presence[id] ?? {})
      .filter((timestamp) => Number.isFinite(timestamp) && now >= timestamp && now - timestamp < PRESENCE_TTL_MS)
    const lastSeen = timestamps.length ? Math.max(...timestamps) : null

    return { id, name, email, status: lastSeen === null ? 'offline' : 'online', lastSeen }
  })
}
// ─────────────────────────────────────────────────────────────

interface AuthCtx {
  token: string | null
  accountId: string | null
  demoAccounts: DemoAccountPresence[]
  login: (token: string, accountId?: string) => void
  logout: () => void
  isLoggedIn: boolean
}

const AuthContext = createContext<AuthCtx | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem('admin_token') ?? localStorage.getItem('customer_token')
  )
  const [accountId, setAccountId] = useState<string | null>(
    () => localStorage.getItem('admin_account_id')
  )
  const [sessionId] = useState(createSessionId)
  const [, setPresenceRevision] = useState(0)

  useEffect(() => {
    if (!token || !accountId) return

    const heartbeat = () => {
      const now = Date.now()
      const presence = readPresence()
      const activeSessions = Object.fromEntries(
        Object.entries(presence[accountId] ?? {}).filter(
          ([, timestamp]) => Number.isFinite(timestamp) && now >= timestamp && now - timestamp < PRESENCE_TTL_MS
        )
      )
      presence[accountId] = { ...activeSessions, [sessionId]: now }
      writePresence(presence)
      setPresenceRevision((revision) => revision + 1)
    }
    const handleStorage = (event: StorageEvent) => {
      if (event.key === PRESENCE_KEY) setPresenceRevision((revision) => revision + 1)
    }

    heartbeat()
    const intervalId = window.setInterval(heartbeat, PRESENCE_HEARTBEAT_MS)
    window.addEventListener('storage', handleStorage)
    window.addEventListener('focus', heartbeat)

    return () => {
      window.clearInterval(intervalId)
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('focus', heartbeat)
    }
  }, [accountId, sessionId, token])

  function login(t: string, nextAccountId?: string) {
    if (accountId && accountId !== nextAccountId) {
      removePresenceSession(accountId, sessionId)
    }
    localStorage.setItem('admin_token', t)
    localStorage.removeItem('customer_token')
    if (nextAccountId) localStorage.setItem('admin_account_id', nextAccountId)
    else localStorage.removeItem('admin_account_id')
    setToken(t)
    setAccountId(nextAccountId ?? null)
  }

  function logout() {
    if (accountId) removePresenceSession(accountId, sessionId)
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_account_id')
    localStorage.removeItem('customer_token')
    localStorage.removeItem('customer_user')
    setToken(null)
    setAccountId(null)
    setPresenceRevision((revision) => revision + 1)
  }

  return (
    <AuthContext.Provider value={{ token, accountId, demoAccounts: getDemoAccounts(), login, logout, isLoggedIn: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

// Use this in any component: const { isLoggedIn, login, logout } = useAuth()
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside <AuthProvider>')
  return ctx
}
