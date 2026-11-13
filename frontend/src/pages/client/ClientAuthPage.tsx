import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { customerAuthApi } from '../../services/api'

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #f8fafc 0%, #ecfeff 100%)',
    padding: '2rem',
    fontFamily: 'Inter, sans-serif',
  } as const,
  card: {
    width: '100%',
    maxWidth: '440px',
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: '1.25rem',
    boxShadow: '0 12px 30px rgba(15, 23, 42, 0.08)',
    padding: '1.5rem',
  } as const,
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.25rem',
  } as const,
  brand: {
    fontWeight: 700,
    fontSize: '1.1rem',
    color: '#0f172a',
  } as const,
  tabs: {
    display: 'flex',
    gap: '0.5rem',
    background: '#f1f5f9',
    padding: '0.25rem',
    borderRadius: '0.75rem',
    marginBottom: '1rem',
  } as const,
  tab: {
    flex: 1,
    border: 'none',
    borderRadius: '0.6rem',
    padding: '0.7rem 0.8rem',
    fontWeight: 600,
    background: 'transparent',
    color: '#475569',
    cursor: 'pointer',
  } as const,
  tabActive: {
    background: '#0f172a',
    color: '#fff',
  } as const,
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.45rem',
    marginBottom: '1rem',
  } as const,
  label: {
    fontSize: '0.8rem',
    fontWeight: 600,
    color: '#334155',
  } as const,
  input: {
    border: '1px solid #cbd5e1',
    borderRadius: '0.7rem',
    padding: '0.8rem 0.9rem',
    fontSize: '0.95rem',
    outline: 'none',
  } as const,
  button: {
    width: '100%',
    border: 'none',
    borderRadius: '0.7rem',
    background: '#0f172a',
    color: '#fff',
    padding: '0.82rem 1rem',
    fontWeight: 700,
    cursor: 'pointer',
    marginTop: '0.25rem',
  } as const,
  secondary: {
    display: 'inline-block',
    marginTop: '1rem',
    color: '#475569',
    textDecoration: 'none',
    fontSize: '0.86rem',
  } as const,
  error: {
    color: '#b91c1c',
    background: '#fef2f2',
    border: '1px solid #fecaca',
    padding: '0.7rem 0.8rem',
    borderRadius: '0.6rem',
    fontSize: '0.86rem',
    marginBottom: '1rem',
  } as const,
  note: {
    marginTop: '1rem',
    fontSize: '0.78rem',
    color: '#64748b',
    textAlign: 'center',
  } as const,
} as const

export default function ClientAuthPage() {
  const navigate = useNavigate()
  const { loginCustomer } = useAuth()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = mode === 'signup'
        ? await customerAuthApi.signup(form)
        : await customerAuthApi.login(form)

      loginCustomer(result.token, result.user)
      navigate('/home')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.brand}>Web Explorer</div>
          <Link to="/" style={{ ...styles.secondary, marginTop: 0 }}>Back home</Link>
        </div>

        <div style={styles.tabs}>
          <button
            type="button"
            style={{ ...styles.tab, ...(mode === 'login' ? styles.tabActive : {}) }}
            onClick={() => setMode('login')}
          >
            Login
          </button>
          <button
            type="button"
            style={{ ...styles.tab, ...(mode === 'signup' ? styles.tabActive : {}) }}
            onClick={() => setMode('signup')}
          >
            Sign up
          </button>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <div style={styles.field}>
              <label htmlFor="name" style={styles.label}>Full name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Jane Doe"
                style={styles.input}
                required
              />
            </div>
          )}

          <div style={styles.field}>
            <label htmlFor="email" style={styles.label}>Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.field}>
            <label htmlFor="password" style={styles.label}>Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
              style={styles.input}
              required
            />
          </div>

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Please wait...' : mode === 'signup' ? 'Create account' : 'Log in'}
          </button>
        </form>

        <div style={styles.note}>
          Demo customer flow for verifying the submit website workflow.
        </div>
      </div>
    </div>
  )
}
