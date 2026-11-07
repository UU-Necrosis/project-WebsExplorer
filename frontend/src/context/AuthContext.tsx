import { createContext, useContext, useState, ReactNode } from 'react'

// ── Demo account (for local testing only) ────────────────────
// Remove / replace this with a real API call once the backend is ready.
const DEMO_ACCOUNTS = [
  { email: 'test@gmail.com', password: '123456' },
]

export function checkDemoLogin(email: string, password: string): boolean {
  return DEMO_ACCOUNTS.some(
    (a) => a.email === email && a.password === password
  )
}
// ─────────────────────────────────────────────────────────────

interface AuthCtx {
  token: string | null
  login: (token: string) => void
  logout: () => void
  isLoggedIn: boolean
}

const AuthContext = createContext<AuthCtx | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem('admin_token')
  )

  function login(t: string) {
    localStorage.setItem('admin_token', t)
    setToken(t)
  }

  function logout() {
    localStorage.removeItem('admin_token')
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ token, login, logout, isLoggedIn: !!token }}>
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
