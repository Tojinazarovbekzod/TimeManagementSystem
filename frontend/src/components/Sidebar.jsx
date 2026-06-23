import { useMemo } from 'react'
import { Home, ListTodo, Tags, BarChart3, CalendarDays, Bell, UserCog, LogOut, X, Sun, Moon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import Scene3DMini from './Scene3DMini'
import { getDueStatus } from '../utils/date'

const NAV_ITEMS = [
  { id: 'overview', label: 'Bosh sahifa', icon: Home },
  { id: 'tasks', label: 'Vazifalar', icon: ListTodo },
  { id: 'categories', label: 'Kategoriyalar', icon: Tags },
  { id: 'calendar', label: 'Kalendar', icon: CalendarDays },
  { id: 'notifications', label: 'Bildirishnomalar', icon: Bell },
  { id: 'stats', label: 'Statistika', icon: BarChart3 },
  { id: 'profile', label: 'Profil', icon: UserCog },
]

export default function Sidebar({ view, setView, user, logout, tasks = [], open, onClose }) {
  const { theme, toggleTheme } = useTheme()

  const { total, done, percent, alerts } = useMemo(() => {
    const stats = { total: tasks.length, done: 0, alerts: 0 }

    tasks.forEach((task) => {
      if (task.status === 'done') stats.done += 1
      const dueStatus = getDueStatus(task.due_date, task.status)
      if (dueStatus === 'overdue' || dueStatus === 'soon') stats.alerts += 1
    })

    return {
      ...stats,
      percent: stats.total === 0 ? 0 : Math.round((stats.done / stats.total) * 100),
    }
  }, [tasks])

  return (
    <>
      <aside className={`sidebar-nav ${open ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <span className="brand-icon"><Scene3DMini /></span>
          <span className="brand-text">TimeManagement</span>
          <button className="icon-btn close-btn" onClick={onClose}><X size={18} /></button>
        </div>
        <nav>
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`nav-item ${view === id ? 'active' : ''}`}
              onClick={() => { setView(id); onClose() }}
            >
              <Icon size={18} /> {label}
              {id === 'notifications' && alerts > 0 && <span className="nav-badge">{alerts}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-progress">
          <div className="sidebar-progress-head">
            <span>Bajarilgan vazifalar</span>
            <span className="sidebar-progress-percent">{percent}%</span>
          </div>
          <div className="sidebar-progress-bar">
            <div className="sidebar-progress-fill" style={{ width: `${percent}%` }} />
          </div>
          <span className="sidebar-progress-sub">{done} / {total} bajarildi</span>
        </div>

        <div className="sidebar-footer">
          <button className="nav-item theme-toggle" onClick={toggleTheme}>
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            {theme === 'light' ? 'Tungi rejim' : 'Kunduzgi rejim'}
          </button>
          <div className="user-info">
            <span className="user-avatar">{user?.username?.[0]?.toUpperCase()}</span>
            <span className="user-name">{user?.username}</span>
          </div>
          <button className="btn-ghost logout-btn" onClick={logout}><LogOut size={15} /> Chiqish</button>
        </div>
      </aside>
      {open && <div className="sidebar-backdrop" onClick={onClose} />}
    </>
  )
}
