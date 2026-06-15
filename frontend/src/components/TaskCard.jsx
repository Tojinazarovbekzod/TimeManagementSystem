import { Pencil, Trash2, Calendar, Tag, Flag, AlertTriangle } from 'lucide-react'
import { getDueStatus, formatDate } from '../utils/date'

const PRIORITY_LABELS = { low: 'Past', medium: "O'rta", high: 'Yuqori' }
const STATUS_FLOW = {
  todo: { label: 'Boshlandi', next: 'in_progress' },
  in_progress: { label: 'Jarayonda', next: 'done' },
  done: { label: 'Bajarildi', next: null },
}

export default function TaskCard({ task, categories, onEdit, onDelete, onStatusChange }) {
  const dueStatus = getDueStatus(task.due_date, task.status)
  const category = categories.find((c) => c.id === task.category)

  return (
    <div className={`task-card priority-${task.priority} ${task.status === 'done' ? 'done' : ''} ${dueStatus ? `due-${dueStatus}` : ''}`}>
      <div className="task-card-header">
        <label className="checkbox">
          <input
            type="checkbox"
            checked={task.status === 'done'}
            onChange={() => onStatusChange(task, task.status === 'done' ? 'todo' : 'done')}
          />
          <span className="checkmark" />
        </label>
        <h3>{task.title}</h3>
      </div>
      {task.description && <p className="task-card-desc">{task.description}</p>}
      <div className="task-meta">
        <span className={`badge priority-${task.priority}`}><Flag size={12} /> {PRIORITY_LABELS[task.priority]}</span>
        {category && (
          <span className="badge category-badge" style={{ background: `${category.color}22`, color: category.color }}>
            <Tag size={12} /> {category.name}
          </span>
        )}
        {task.due_date && (
          <span className={`badge ${dueStatus ? `due-${dueStatus}` : ''}`}>
            {dueStatus === 'overdue' ? <AlertTriangle size={12} /> : <Calendar size={12} />} {formatDate(task.due_date)}
          </span>
        )}
      </div>
      <div className="task-card-footer">
        <button
          type="button"
          className={`status-btn status-${task.status}`}
          onClick={() => STATUS_FLOW[task.status].next && onStatusChange(task, STATUS_FLOW[task.status].next)}
          disabled={!STATUS_FLOW[task.status].next}
        >
          {STATUS_FLOW[task.status].label}
        </button>
        <div className="task-actions">
          <button onClick={() => onEdit(task)} title="Tahrirlash"><Pencil size={15} /></button>
          <button onClick={() => onDelete(task.id)} title="O'chirish" className="danger"><Trash2 size={15} /></button>
        </div>
      </div>
    </div>
  )
}
