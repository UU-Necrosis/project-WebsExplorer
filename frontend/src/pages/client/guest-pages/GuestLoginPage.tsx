import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import GuestAuthLayout from '../../../layout/GuestAuthLayout'
import { customerAuthApi } from '../../../services/api'
import './css/GuestLoginPage.css'

export default function GuestLoginPage() {
  const navigate = useNavigate()
  const { loginCustomer } = useAuth()
  const [form, setForm] = useState({ identifier: '', password: '' })
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
      loginCustomer(result.token, result.user)
      navigate('/home')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <GuestAuthLayout title="Web Explorer">
      {error && <div className="guest-auth-error">{error}</div>}

      <form className="guest-auth-form" onSubmit={handleSubmit}>
        <div className="guest-auth-field">
          <label htmlFor="identifier" className="guest-auth-label">Name or email</label>
          <input
            id="identifier"
            name="identifier"
            type="text"
            value={form.identifier}
            onChange={handleChange}
            placeholder="Your name or email"
            autoComplete="username"
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
    </GuestAuthLayout>
  )
}
