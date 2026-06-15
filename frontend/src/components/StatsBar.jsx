import { ListTodo, Loader, CheckCircle2, ListChecks } from 'lucide-react'

export default function StatsBar({ tasks }) {
  const total = tasks.length
  const done = tasks.filter((t) => t.status === 'done').length
  const inProgress = tasks.filter((t) => t.status === 'in_progress').length
  const todo = tasks.filter((t) => t.status === 'todo').length
  const percent = total === 0 ? 0 : Math.round((done / total) * 100)

  return (
    <div className="stats-bar">
      <div className="stat-card stat-total">
        <div className="stat-icon"><ListChecks size={20} /></div>
        <div>
          <span className="stat-value">{total}</span>
          <span className="stat-label">Jami vazifalar</span>
        </div>
      </div>
      <div className="stat-card stat-todo">
        <div className="stat-icon"><ListTodo size={20} /></div>
        <div>
          <span className="stat-value">{todo}</span>
          <span className="stat-label">To Do</span>
        </div>
      </div>
      <div className="stat-card stat-progress">
        <div className="stat-icon"><Loader size={20} /></div>
        <div>
          <span className="stat-value">{inProgress}</span>
          <span className="stat-label">Jarayonda</span>
        </div>
      </div>
      <div className="stat-card stat-done">
        <div className="stat-icon"><CheckCircle2 size={20} /></div>
        <div>
          <span className="stat-value">{done}</span>
          <span className="stat-label">Bajarildi</span>
        </div>
      </div>
      <div className="stat-card stat-percent">
        <div className="progress-ring" style={{ '--percent': `${percent}%` }}>
          <div className="progress-ring-fill">
            <span>{percent}%</span>
          </div>
        </div>
        <span className="stat-label">Progress</span>
      </div>
    </div>
  )
}
