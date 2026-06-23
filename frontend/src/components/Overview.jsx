import { useMemo } from 'react'
import StatsBar from './StatsBar'
import TaskCard from './TaskCard'
import Scene3D from './Scene3D'
import { AlertTriangle, Clock4, ListChecks } from 'lucide-react'
import { getDueStatus } from '../utils/date'

export default function Overview({ user, tasks, categories, onEdit, onDelete, onStatusChange }) {
  const [overdue, soon, recent, pending] = useMemo(() => {
    const overdueList = []
    const soonList = []
    let pendingCount = 0

    tasks.forEach((task) => {
      const dueStatus = getDueStatus(task.due_date, task.status)
      if (dueStatus === 'overdue') overdueList.push(task)
      if (dueStatus === 'soon') soonList.push(task)
      if (task.status !== 'done') pendingCount += 1
    })

    return [overdueList, soonList, tasks.slice(0, 6), pendingCount]
  }, [tasks])

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
