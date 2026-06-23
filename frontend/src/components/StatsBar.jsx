import { useMemo } from 'react'
import { ListTodo, Loader, CheckCircle2, ListChecks } from 'lucide-react'

export default function StatsBar({ tasks }) {
  const { total, done, inProgress, todo, percent } = useMemo(() => {
    const counts = { total: tasks.length, done: 0, inProgress: 0, todo: 0 }
    tasks.forEach((task) => {
      if (task.status === 'done') counts.done += 1
      else if (task.status === 'in_progress') counts.inProgress += 1
      else if (task.status === 'todo') counts.todo += 1
    })
    return {
      ...counts,
      percent: counts.total === 0 ? 0 : Math.round((counts.done / counts.total) * 100),
    }
  }, [tasks])

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
