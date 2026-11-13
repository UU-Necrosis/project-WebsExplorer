import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { customerAuthApi } from '../../../services/api'
import './css/GuestLoginPage.css'

export default function GuestLoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
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
      const result = await customerAuthApi.login(form)
      localStorage.setItem('customer_token', result.token)
      localStorage.setItem('customer_user', JSON.stringify(result.user))
      navigate('/submit')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="guest-auth-page">
      <div className="guest-auth-card">
        <div className="guest-auth-header">
          <div className="guest-auth-brand">Web Explorer</div>
          <Link to="/guest" className="guest-auth-link">Back home</Link>
        </div>

        {error && <div className="guest-auth-error">{error}</div>}

        <form className="guest-auth-form" onSubmit={handleSubmit}>
          <div className="guest-auth-field">
            <label htmlFor="email" className="guest-auth-label">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="guest-auth-input"
              required
            />
          </div>

          <div className="guest-auth-field">
            <label htmlFor="password" className="guest-auth-label">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Your password"
              className="guest-auth-input"
              required
            />
          </div>

          <button type="submit" disabled={loading} className="guest-auth-button">
            {loading ? 'Please wait...' : 'Log in'}
          </button>
        </form>

        <div className="guest-auth-switch">
          Don&apos;t have an account? <Link to="/guest-signup">Sign up</Link>
        </div>
      </div>
    </div>
  )
}
