import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { UserPlus, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Scene3D from '../components/Scene3D'
import AuthTransitionLink from '../components/AuthTransitionLink'

export default function Register() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const { register } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const enterClass = location.state?.direction === 'backward' ? 'enter-backward' : location.state?.direction === 'forward' ? 'enter-forward' : ''

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await register(username, email, password)
      navigate('/')
    } catch (err) {
      const data = err.response?.data
      const message = data ? Object.values(data).flat().join(' ') : 'Ro\'yxatdan o\'tishda xatolik'
      setError(message)
    }
  }

  return (
    <div className="auth-page">
      <div className={`auth-card reverse ${enterClass}`}>
        <div className="auth-side">
          <Scene3D className="scene-3d" />
          <h2>TimeManagement</h2>
          <p>Kundalik, haftalik va uzoq muddatli vazifalaringizni bitta joyda boshqaring.</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <h1>Ro'yxatdan o'tish</h1>
          <p className="subtitle">Yangi hisob yarating</p>
          {error && <p className="error">{error}</p>}
          <label>Username</label>
          <input
            type="text"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <label>Email</label>
          <input
            type="email"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Parol</label>
          <div className="password-field">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="kamida 8 belgi"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
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
            <UserPlus size={16} /> Ro'yxatdan o'tish
          </button>
          <p className="switch">
            Akkauntingiz bormi? <AuthTransitionLink to="/login" direction="backward">Kirish</AuthTransitionLink>
          </p>
        </form>
      </div>
    </div>
  )
}
