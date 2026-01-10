import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SectionLoader from '../components/SectionLoader.jsx'
import { API_BASE_URL } from '../utils/api.js'

export default function AdminLogin() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [msg, setMsg] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400)
    return () => clearTimeout(timer)
  }, [])

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.username.trim() || !form.password.trim()) {
      setMsg('Please enter username and password')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch(`${API_BASE_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: form.username,
          password: form.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Invalid credentials')
      }

      // Store admin token in sessionStorage
      sessionStorage.setItem('admin_token', data.token)
      
      setMsg('Admin logged in — redirecting...')
      setTimeout(() => navigate('/admin-dashboard'), 700)
    } catch (err) {
      console.error('Login error:', err)
      setMsg('Error: ' + (err.message || 'Failed to login'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <SectionLoader isLoading={isLoading} height="360px">
      <div className="auth-modal-overlay">
        <div className="auth-modal" role="dialog" aria-labelledby="admin-login-title">
          <header className="auth-header" style={{ position: 'relative' }}>
            <h2 id="admin-login-title">Admin Access</h2>
            <button
              type="button"
              className="btn-link"
              onClick={() => navigate('/')}
              aria-label="Close and go back"
              title="Close"
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                color: '#d32f2f',
                cursor: 'pointer',
                border: 'none',
                background: 'transparent',
                padding: 0,
                transition: 'transform 0.2s, color 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.15)'
                e.target.style.color = '#ff5252'
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)'
                e.target.style.color = '#d32f2f'
              }}
            >
              ✕
            </button>
          </header>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              Username
              <input
                id="username"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="admin"
                autoComplete="username"
                required
              />
            </label>

            <label>
              Password
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="btn-link"
                  onClick={() => setShowPassword(s => !s)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{ position: 'absolute', right: 8 }}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </label>

            <div className="btn-row" style={{ marginTop: 8 }}>
              <button 
                className="btn-primary" 
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </button>
              <button
                type="button"
                className="btn-link"
                onClick={() => {
                  setForm({ username: 'admin123', password: 'admin123' })
                  setMsg('Demo credentials filled')
                }}
                disabled={isSubmitting}
                style={{ marginLeft: 8 }}
              >
                Fill demo
              </button>
            </div>

            {msg && <div className="muted" style={{ marginTop: 10 }}>{msg}</div>}
          </form>
        </div>
      </div>
    </SectionLoader>
  )
}
