import StatsBar from './StatsBar'
import TaskCard from './TaskCard'
import Scene3D from './Scene3D'
import { AlertTriangle, Clock4, ListChecks } from 'lucide-react'
import { getDueStatus } from '../utils/date'

export default function Overview({ user, tasks, categories, onEdit, onDelete, onStatusChange }) {
  const overdue = tasks.filter((t) => getDueStatus(t.due_date, t.status) === 'overdue')
  const soon = tasks.filter((t) => getDueStatus(t.due_date, t.status) === 'soon')
  const recent = tasks.slice(0, 6)
  const pending = tasks.filter((t) => t.status !== 'done').length

  return (
    <div className="overview">
      <section className="welcome-banner">
        <div className="welcome-banner-text">
          <h2>Xush kelibsiz, {user?.username}!</h2>
          <p>
            {pending > 0
              ? `Sizda ${pending} ta bajarilmagan vazifa bor. Vaqtni unumli rejalashtiring!`
              : "Barcha vazifalar bajarildi. Ajoyib natija!"}
          </p>
        </div>
        <Scene3D className="welcome-banner-scene" />
      </section>

      <StatsBar tasks={tasks} />

      {overdue.length > 0 && (
        <section className="reminder-section reminder-overdue">
          <h2><AlertTriangle size={18} /> Muddati o'tgan vazifalar ({overdue.length})</h2>
          <div className="task-grid">
            {overdue.map((t) => (
              <TaskCard key={t.id} task={t} categories={categories} onEdit={onEdit} onDelete={onDelete} onStatusChange={onStatusChange} />
            ))}
          </div>
        </section>
      )}

      {soon.length > 0 && (
        <section className="reminder-section reminder-soon">
          <h2><Clock4 size={18} /> Tez orada muddati tugaydi ({soon.length})</h2>
          <div className="task-grid">
            {soon.map((t) => (
              <TaskCard key={t.id} task={t} categories={categories} onEdit={onEdit} onDelete={onDelete} onStatusChange={onStatusChange} />
            ))}
          </div>
        </section>
      )}

      <section className="reminder-section">
        <h2><ListChecks size={18} /> So'nggi vazifalar</h2>
        {recent.length === 0 ? (
          <p className="empty-small">Hozircha vazifalar yo'q. "Yangi vazifa" tugmasini bosing!</p>
        ) : (
          <div className="task-grid">
            {recent.map((t) => (
              <TaskCard key={t.id} task={t} categories={categories} onEdit={onEdit} onDelete={onDelete} onStatusChange={onStatusChange} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
