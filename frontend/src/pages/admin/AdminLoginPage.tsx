import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, authenticateDemoAccount } from '../../context/AuthContext'
import './css/AdminLoginPage.css'

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [remember, setRemember] = useState(true)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [toast, setToast]       = useState<{ title: string; msg: string; icon: string } | null>(null)

  function showToast(title: string, msg: string, icon: string) {
    setToast({ title, msg, icon })
    setTimeout(() => setToast(null), 4000)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    showToast('Connecting...', 'Validating admin credentials...', 'shield')

    try {
      // ── Demo login (remove when backend is ready) ──────────
      await new Promise((r) => setTimeout(r, 800)) // simulate network
      const demoAccount = authenticateDemoAccount(email, password)
      if (!demoAccount) {
        throw new Error('Invalid email or password.')
      }
      login('demo-token', demoAccount.id)
      // ── Real API (uncomment when backend is ready) ─────────
      // const { token } = await authApi.login(email, password)
      // login(token)
      // ───────────────────────────────────────────────────────
      showToast('Welcome', 'Authentication verified. Redirecting...', 'verified')
      setTimeout(() => navigate('/admin/overview'), 700)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed'
      setError(msg)
      showToast('Failed', msg, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login">
      <div className="admin-login__bg">
        <div className="admin-login__blob-top" />
        <div className="admin-login__blob-br" />
        <div className="admin-login__blob-left" />
      </div>

      {/* Header */}
      <header className="admin-login__header">
        <div className="admin-login__header-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <a href="#" className="admin-login__brand">
              <div className="admin-login__brand-icon">
                <span className="material-symbols-outlined">admin_panel_settings</span>
              </div>
              <div>
                <span className="admin-login__brand-name">Admin</span>
                <span className="admin-login__brand-sub">Admin Console</span>
              </div>
            </a>
            <div className="admin-login__divider" />
            <span className="admin-login__portal">Admin Operations Portal</span>
          </div>
          <div className="admin-login__status">
            <span className="admin-login__status-dot" />
            Systems Operational
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="admin-login__main">
        <div className="admin-login__grid">

          {/* Sign-in card */}
          <div className="admin-login__card">
            <div className="admin-login__card-bar" />
            <div>
              <div className="admin-login__card-hd">
                <div className="admin-login__card-icon">
                  <span className="material-symbols-outlined">lock</span>
                </div>
                <div>
                  <h1 className="admin-login__card-title">Admin Sign In</h1>
                  <p className="admin-login__card-sub">Sign in to manage submissions, directory, and audit logs.</p>
                </div>
              </div>

              {error && (
                <div className="admin-login__error">
                  <span className="material-symbols-outlined">error</span>
                  {error}
                </div>
              )}

              <form className="admin-login__form" onSubmit={handleSubmit}>
                {/* Email */}
                <div>
                  <label htmlFor="al-email" className="admin-login__label">
                    <span className="material-symbols-outlined">mail</span>
                    Email or Admin Username
                  </label>
                  <div className="admin-login__field">
                    <span className="material-symbols-outlined admin-login__field-icon">account_circle</span>
                    <input
                      id="al-email" type="text" required
                      value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@websexplore.com"
                      className="admin-login__input"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="admin-login__label-row">
                    <label htmlFor="al-pass" className="admin-login__label" style={{ marginBottom: 0 }}>
                      <span className="material-symbols-outlined">key</span>
                      Password
                    </label>
                    <a href="#" className="admin-login__forgot">Forgot password?</a>
                  </div>
                  <div className="admin-login__field">
                    <span className="material-symbols-outlined admin-login__field-icon">lock_outline</span>
                    <input
                      id="al-pass" type={showPass ? 'text' : 'password'} required
                      value={password} onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="admin-login__input admin-login__input--mono admin-login__input--pad-r"
                    />
                    <button type="button" className="admin-login__eye" onClick={() => setShowPass(v => !v)}>
                      <span className="material-symbols-outlined">{showPass ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>
                </div>

                {/* Remember */}
                <label className="admin-login__remember">
                  <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                  <span className="admin-login__remember-text">Remember this device for 30 days</span>
                </label>

                {/* Submit */}
                <button type="submit" disabled={loading} className="admin-login__submit">
                  <span className="material-symbols-outlined">{loading ? 'autorenew' : 'login'}</span>
                  {loading ? 'Authenticating...' : 'Sign In to Admin Console'}
                  {!loading && <span className="material-symbols-outlined">arrow_forward</span>}
                </button>

                {/* Divider */}
                <div className="admin-login__divider-row">
                  <div className="admin-login__divider-line" />
                  <span className="admin-login__divider-text">or continue with</span>
                </div>

                {/* Passkey */}
                <button type="button" className="admin-login__passkey"
                  onClick={() => showToast('FIDO2', 'Touch your hardware key now.', 'usb')}>
                  <span className="material-symbols-outlined">passkey</span>
                  Sign In with Passkey or Hardware Key
                </button>
              </form>
            </div>

            <div className="admin-login__card-foot">
              <span className="material-symbols-outlined">shield</span>
              TLS 1.3 · Zero-Trust · RFC-7519 · No user telemetry
            </div>
          </div>

          {/* Right info panel */}
          <div className="admin-login__panel">
            <div className="admin-login__panel-card">
              <div className="admin-login__panel-hd">
                <p className="admin-login__panel-title" style={{ marginBottom: 0 }}>System Status</p>
                <span className="admin-login__panel-badge">
                  <span className="admin-login__panel-dot" /> All Nominal
                </span>
              </div>
              {[
                { label: 'Submission Queue', val: '99.98% uptime' },
                { label: 'Audit Ledger',     val: 'Sealed 2m ago' },
                { label: 'SGX Enclaves',     val: '5/5 online' },
                { label: 'Consensus Sync',   val: '12ms avg' },
              ].map((r) => (
                <div key={r.label} className="admin-login__panel-row">
                  <span style={{ color: '#3d4a42' }}>{r.label}</span>
                  <span className="admin-login__panel-row-val">
                    <span className="admin-login__panel-dot" />{r.val}
                  </span>
                </div>
              ))}
            </div>

            <div className="admin-login__panel-card">
              <p className="admin-login__panel-title">Security & Compliance</p>
              {[
                { icon: 'verified_user',      text: 'RFC-7519 JWT · Zero-PII architecture' },
                { icon: 'lock',               text: 'End-to-end TLS 1.3 encryption' },
                { icon: 'shield',             text: 'ISO/IEC 27001 certified' },
                { icon: 'history_toggle_off', text: 'Full immutable audit trail' },
              ].map((i) => (
                <div key={i.icon} className="admin-login__panel-sec">
                  <span className="material-symbols-outlined">{i.icon}</span>{i.text}
                </div>
              ))}
            </div>

            <div className="admin-login__panel-access">
              Need admin access?{' '}
              <a href="#">Contact System Administrator</a>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="admin-login__footer">
        <div className="admin-login__footer-inner">
          <span>© 2025 WebsExplore Inc.</span>
          <a href="#">Privacy Policy</a>
          <a href="#">Security Terms</a>
          <a href="#">Compliance (ISO/IEC 27001)</a>
        </div>
      </footer>

      {/* Toast */}
      {toast && (
        <div className="admin-login__toast">
          <div className="admin-login__toast-icon">
            <span className="material-symbols-outlined">{toast.icon}</span>
          </div>
          <div style={{ flex: 1 }}>
            <p className="admin-login__toast-title">{toast.title}</p>
            <p className="admin-login__toast-msg">{toast.msg}</p>
          </div>
          <button className="admin-login__toast-close" onClick={() => setToast(null)}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      )}
    </div>
  )
}
