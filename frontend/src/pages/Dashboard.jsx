import { useEffect, useState } from 'react'
import { Search, Plus, Menu } from 'lucide-react'
import client from '../api/client'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import Sidebar from '../components/Sidebar'
import Overview from '../components/Overview'
import TasksView from '../components/TasksView'
import CategoriesView from '../components/CategoriesView'
import StatsView from '../components/StatsView'
import CalendarView from '../components/CalendarView'
import NotificationsView from '../components/NotificationsView'
import ProfileView from '../components/ProfileView'
import TaskModal from '../components/TaskModal'

const VIEW_TITLES = {
  overview: 'Bosh sahifa',
  tasks: 'Vazifalar',
  categories: 'Kategoriyalar',
  calendar: 'Kalendar',
  notifications: 'Bildirishnomalar',
  stats: 'Statistika',
  profile: 'Profil',
}

export default function Dashboard() {
  const { user, logout } = useAuth()
  const { showToast } = useToast()
  const [view, setView] = useState('overview')
  const [tasks, setTasks] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [editingTask, setEditingTask] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const loadCategories = async () => {
    const { data } = await client.get('/categories/')
    setCategories(data)
  }

  const loadTasks = async () => {
    const { data } = await client.get('/tasks/')
    setTasks(data)
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    Promise.all([loadCategories(), loadTasks()]).finally(() => setLoading(false))
  }, [])

  const handleSaveTask = async (taskData) => {
    try {
      if (editingTask) {
        await client.put(`/tasks/${editingTask.id}/`, taskData)
        showToast('Vazifa tahrirlandi')
      } else {
        await client.post('/tasks/', taskData)
        showToast("Vazifa qo'shildi")
      }
      setEditingTask(null)
      setModalOpen(false)
      loadTasks()
    } catch {
      showToast('Xatolik yuz berdi', 'error')
    }
  }

  const handleDeleteTask = async (id) => {
    if (!window.confirm("Vazifani o'chirishni tasdiqlaysizmi?")) return
    await client.delete(`/tasks/${id}/`)
    showToast("Vazifa o'chirildi", 'info')
    loadTasks()
  }

  const handleStatusChange = async (task, status) => {
    await client.patch(`/tasks/${task.id}/`, { status })
    loadTasks()
  }

  const openNewTaskModal = () => {
    setEditingTask(null)
    setModalOpen(true)
  }

  const openEditTaskModal = (task) => {
    setEditingTask(task)
    setModalOpen(true)
  }

  const filteredTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    (t.description || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="app-layout">
      <Sidebar
        view={view}
        setView={setView}
        user={user}
        logout={logout}
        tasks={tasks}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="main-area">
        <header className="topbar">
          <button className="icon-btn menu-btn" onClick={() => setSidebarOpen(true)}><Menu size={20} /></button>
          <h1>{VIEW_TITLES[view]}</h1>
          <div className="topbar-actions">
            {view === 'tasks' && (
              <div className="search-box">
                <Search size={16} />
                <input placeholder="Qidirish..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            )}
            <button className="btn-primary" onClick={openNewTaskModal}><Plus size={16} /> Yangi vazifa</button>
          </div>
        </header>

        <div className="view-content">
          {loading ? (
            <div className="loading-inline">
              <span className="spinner" />
              <p>Yuklanmoqda...</p>
            </div>
          ) : (
            <div className="view-fade" key={view}>
              {view === 'overview' && (
                <Overview
                  user={user}
                  tasks={tasks}
                  categories={categories}
                  onEdit={openEditTaskModal}
                  onDelete={handleDeleteTask}
                  onStatusChange={handleStatusChange}
                />
              )}
              {view === 'tasks' && (
                <TasksView
                  tasks={filteredTasks}
                  categories={categories}
                  onEdit={openEditTaskModal}
                  onDelete={handleDeleteTask}
                  onStatusChange={handleStatusChange}
                />
              )}
              {view === 'categories' && (
                <CategoriesView categories={categories} tasks={tasks} onChange={loadCategories} />
              )}
              {view === 'calendar' && (
                <CalendarView
                  tasks={tasks}
                  categories={categories}
                  onEdit={openEditTaskModal}
                  onDelete={handleDeleteTask}
                  onStatusChange={handleStatusChange}
                />
              )}
              {view === 'notifications' && (
                <NotificationsView tasks={tasks} categories={categories} onEdit={openEditTaskModal} />
              )}
              {view === 'stats' && (
                <StatsView tasks={tasks} categories={categories} />
              )}
              {view === 'profile' && (
                <ProfileView tasks={tasks} categories={categories} />
              )}
            </div>
          )}
        </div>
      </div>

      {modalOpen && (
        <TaskModal
          categories={categories}
          editingTask={editingTask}
          onSave={handleSaveTask}
          onClose={() => { setModalOpen(false); setEditingTask(null) }}
        />
      )}
    </div>
  )
}
