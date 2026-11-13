import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import GuestAuthLayout from '../../../layout/GuestAuthLayout'
import { customerAuthApi } from '../../../services/api'
import './css/GuestSignupPage.css'

export default function GuestSignupPage() {
  const navigate = useNavigate()
  const { loginCustomer } = useAuth()
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
      const result = await customerAuthApi.signup(form)
      loginCustomer(result.token, result.user)
      navigate('/home')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <GuestAuthLayout title="Create account">
      {error && <div className="guest-auth-error">{error}</div>}

      <form className="guest-auth-form" onSubmit={handleSubmit}>
        <div className="guest-auth-field">
          <label htmlFor="name" className="guest-auth-label">Full name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="Jane Doe"
            className="guest-auth-input"
            required
          />
        </div>

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
            placeholder="At least 6 characters"
            className="guest-auth-input"
            required
          />
        </div>

        <button type="submit" disabled={loading} className="guest-auth-button">
          {loading ? 'Please wait...' : 'Create account'}
        </button>
      </form>

      <div className="guest-auth-switch">
        Already have an account? <Link to="/guest-login">Log in</Link>
      </div>
    </GuestAuthLayout>
  )
}
