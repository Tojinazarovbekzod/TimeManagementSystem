import { useState } from 'react'
import { Save, KeyRound, Sun, Moon } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { useTheme } from '../context/ThemeContext'

export default function ProfileView({ tasks, categories }) {
  const { user, updateProfile, changePassword } = useAuth()
  const { showToast } = useToast()
  const { theme, toggleTheme } = useTheme()

  const [email, setEmail] = useState(user?.email || '')
  const [savingProfile, setSavingProfile] = useState(false)

  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [savingPassword, setSavingPassword] = useState(false)

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setSavingProfile(true)
    try {
      await updateProfile({ email })
      showToast('Profil yangilandi')
    } catch {
      showToast('Profilni yangilashda xatolik', 'error')
    } finally {
      setSavingProfile(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setSavingPassword(true)
    try {
      await changePassword(oldPassword, newPassword)
      showToast('Parol yangilandi')
      setOldPassword('')
      setNewPassword('')
    } catch (err) {
      const msg = err?.response?.data?.old_password?.[0] || err?.response?.data?.new_password?.[0] || 'Parolni yangilashda xatolik'
      showToast(msg, 'error')
    } finally {
      setSavingPassword(false)
    }
  }

  const total = tasks.length
  const done = tasks.filter((t) => t.status === 'done').length

  return (
    <div className="profile-view">
      <section className="profile-card profile-summary">
        <span className="user-avatar profile-avatar">{user?.username?.[0]?.toUpperCase()}</span>
        <div>
          <h2>{user?.username}</h2>
          <p>{user?.email || 'Email kiritilmagan'}</p>
          <p className="profile-stats-line">{total} vazifa · {done} bajarildi · {categories.length} kategoriya</p>
        </div>
      </section>

      <section className="profile-card">
        <h2>Profil ma'lumotlari</h2>
        <form className="task-form" onSubmit={handleProfileSubmit}>
          <label className="profile-label">
            Foydalanuvchi nomi
            <input type="text" value={user?.username || ''} disabled />
          </label>
          <label className="profile-label">
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" />
          </label>
          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={savingProfile}>
              <Save size={16} /> Saqlash
            </button>
          </div>
        </form>
      </section>

      <section className="profile-card">
        <h2>Parolni o'zgartirish</h2>
        <form className="task-form" onSubmit={handlePasswordSubmit}>
          <label className="profile-label">
            Joriy parol
            <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required />
          </label>
          <label className="profile-label">
            Yangi parol
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} minLength={8} required />
          </label>
          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={savingPassword}>
              <KeyRound size={16} /> Parolni yangilash
            </button>
          </div>
        </form>
      </section>

      <section className="profile-card">
        <h2>Ko'rinish</h2>
        <button className="nav-item theme-toggle profile-theme-btn" onClick={toggleTheme}>
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          {theme === 'light' ? "Tungi rejimga o'tish" : "Kunduzgi rejimga o'tish"}
        </button>
      </section>
    </div>
  )
}
