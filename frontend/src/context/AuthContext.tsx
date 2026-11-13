import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'

// Demo account presence data is not used to authenticate sessions.
const DEMO_ACCOUNTS = [
  { id: '1', name: 'admin', email: 'test@gmail.com' },
  { id: '2', name: 'reviewer-02', email: 'test2@gmail.com' },
  { id: '3', name: 'reviewer-03', email: 'test3@gmail.com' },
  { id: '4', name: 'reviewer-04', email: 'test4@gmail.com' },
  { id: '5', name: 'reviewer-05', email: 'test5@gmail.com' },
  { id: '6', name: 'reviewer-06', email: 'test6@gmail.com' },
  { id: '7', name: 'reviewer-07', email: 'test7@gmail.com' },
  { id: '8', name: 'reviewer-08', email: 'test8@gmail.com' },
  { id: '9', name: 'reviewer-09', email: 'test9@gmail.com' },
  { id: '10', name: 'reviewer-10', email: 'test10@gmail.com' },
  { id: '11', name: 'reviewer-11', email: 'test11@gmail.com' },
  { id: '12', name: 'reviewer-12', email: 'test12@gmail.com' },
  { id: '13', name: 'reviewer-13', email: 'test13@gmail.com' },
  { id: '14', name: 'reviewer-14', email: 'test14@gmail.com' },
  { id: '15', name: 'reviewer-15', email: 'test15@gmail.com' },
  { id: '16', name: 'reviewer-16', email: 'test16@gmail.com' },
  { id: '17', name: 'reviewer-17', email: 'test17@gmail.com' },
  { id: '18', name: 'reviewer-18', email: 'test18@gmail.com' },
  { id: '19', name: 'reviewer-19', email: 'test19@gmail.com' },
  { id: '20', name: 'reviewer-20', email: 'test20@gmail.com' },
  { id: '21', name: 'reviewer-21', email: 'test21@gmail.com' },
  { id: '22', name: 'reviewer-22', email: 'test22@gmail.com' },
  { id: '23', name: 'reviewer-23', email: 'test23@gmail.com' },
  { id: '24', name: 'reviewer-24', email: 'test24@gmail.com' },
]

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

export type CustomerUser = {
  id: string
  name: string
  email: string
}

function readCustomerUser(): CustomerUser | null {
  try {
    const raw = localStorage.getItem('customer_user')
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<CustomerUser>
    if (!parsed || typeof parsed !== 'object') return null
    if (typeof parsed.name !== 'string' || typeof parsed.email !== 'string') return null
    return {
      id: String(parsed.id ?? ''),
      name: parsed.name,
      email: parsed.email,
    }
  } catch {
    return null
  }
}

interface AuthCtx {
  accountId: string | null
  demoAccounts: DemoAccountPresence[]
  customerUser: CustomerUser | null
  login: (token: string, accountId?: string) => void
  loginCustomer: (token: string, user?: CustomerUser | null) => void
  logout: () => void
  logoutCustomer: () => void
  isAdminLoggedIn: boolean
  isUserLoggedIn: boolean
}

const AuthContext = createContext<AuthCtx | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    const storedAdminToken = localStorage.getItem('admin_token')
    const storedCustomerToken = localStorage.getItem('customer_token')
    if (storedAdminToken && storedCustomerToken) {
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_account_id')
      localStorage.removeItem('customer_token')
      localStorage.removeItem('customer_user')
      return null
    }
    return storedAdminToken
  })
  const [customerToken, setCustomerToken] = useState<string | null>(() => localStorage.getItem('customer_token'))
  const [customerUser, setCustomerUser] = useState<CustomerUser | null>(
    () => customerToken ? readCustomerUser() : null
  )
  const [accountId, setAccountId] = useState<string | null>(
    () => adminToken ? localStorage.getItem('admin_account_id') : null
  )
  const [sessionId] = useState(createSessionId)
  const [, setPresenceRevision] = useState(0)

  useEffect(() => {
    if (!adminToken || !accountId) return

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
  }, [accountId, adminToken, sessionId])

  function login(t: string, nextAccountId?: string) {
    if (accountId && accountId !== nextAccountId) {
      removePresenceSession(accountId, sessionId)
    }
    localStorage.setItem('admin_token', t)
    localStorage.removeItem('customer_token')
    localStorage.removeItem('customer_user')
    if (nextAccountId) localStorage.setItem('admin_account_id', nextAccountId)
    else localStorage.removeItem('admin_account_id')
    setAdminToken(t)
    setCustomerToken(null)
    setCustomerUser(null)
    setAccountId(nextAccountId ?? null)
  }

  function loginCustomer(t: string, user?: CustomerUser | null) {
    if (accountId) removePresenceSession(accountId, sessionId)
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_account_id')
    localStorage.setItem('customer_token', t)

    const nextUser = user ?? readCustomerUser()
    if (nextUser) {
      localStorage.setItem('customer_user', JSON.stringify(nextUser))
      setCustomerUser(nextUser)
    } else {
      localStorage.removeItem('customer_user')
      setCustomerUser(null)
    }

    setAdminToken(null)
    setCustomerToken(t)
    setAccountId(null)
  }

  function logout() {
    if (accountId) removePresenceSession(accountId, sessionId)
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_account_id')
    localStorage.removeItem('customer_token')
    localStorage.removeItem('customer_user')
    setAdminToken(null)
    setCustomerToken(null)
    setCustomerUser(null)
    setAccountId(null)
    setPresenceRevision((revision) => revision + 1)
  }

  function logoutCustomer() {
    localStorage.removeItem('customer_token')
    localStorage.removeItem('customer_user')
    setCustomerToken(null)
    setCustomerUser(null)
  }

  return (
    <AuthContext.Provider value={{
      accountId,
      demoAccounts: getDemoAccounts(),
      customerUser,
      login,
      loginCustomer,
      logout,
      logoutCustomer,
      isAdminLoggedIn: !!adminToken,
      isUserLoggedIn: !!customerToken,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

// Use this in any component: const { isUserLoggedIn, loginCustomer, logoutCustomer } = useAuth()
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside <AuthProvider>')
  return ctx
}
