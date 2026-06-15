import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { LogIn, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Scene3D from '../components/Scene3D'
import AuthTransitionLink from '../components/AuthTransitionLink'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const enterClass = location.state?.direction === 'backward' ? 'enter-backward' : location.state?.direction === 'forward' ? 'enter-forward' : ''

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await login(username, password)
      navigate('/')
    } catch {
      setError('Login yoki parol noto\'g\'ri')
    }
  }

  return (
    <div className="auth-page">
      <div className={`auth-card ${enterClass}`}>
        <div className="auth-side">
          <Scene3D className="scene-3d" />
          <h2>TimeManagement</h2>
          <p>Vaqtingizni rejalashtiring, vazifalarni prioritetlang va maqsadlaringizga yetib boring.</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <h1>Xush kelibsiz</h1>
          <p className="subtitle">Hisobingizga kiring</p>
          {error && <p className="error">{error}</p>}
          <label>Username</label>
          <input
            type="text"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <label>Parol</label>
          <div className="password-field">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((s) => !s)}
              title={showPassword ? 'Parolni yashirish' : 'Parolni ko\'rsatish'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <button type="submit" className="btn-primary">
            <LogIn size={16} /> Kirish
          </button>
          <p className="switch">
            Akkaunt yo'qmi? <AuthTransitionLink to="/register" direction="forward">Ro'yxatdan o'tish</AuthTransitionLink>
          </p>
        </form>
      </div>
    </div>
  )
}
