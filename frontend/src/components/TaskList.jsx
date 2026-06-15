import { Pencil, Trash2, Calendar, Tag, Flag, ClipboardList } from 'lucide-react'

const PRIORITY_LABELS = { low: 'Past', medium: "O'rta", high: 'Yuqori' }
const STATUS_LABELS = { todo: 'To Do', in_progress: 'Jarayonda', done: 'Bajarildi' }

export default function TaskList({ tasks, onEdit, onDelete, onToggleStatus }) {
  if (tasks.length === 0) {
    return (
      <div className="empty">
        <ClipboardList size={36} strokeWidth={1.5} />
        <p>Hozircha vazifalar yo'q. Yangisini qo'shing!</p>
      </div>
    )
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task.id} className={`task-item priority-${task.priority} ${task.status === 'done' ? 'done' : ''}`}>
          <div className="task-main">
            <label className="checkbox">
              <input
                type="checkbox"
                checked={task.status === 'done'}
                onChange={() => onToggleStatus(task)}
              />
              <span className="checkmark" />
            </label>
            <div>
              <h3>{task.title}</h3>
              {task.description && <p>{task.description}</p>}
              <div className="task-meta">
                <span className={`badge priority-${task.priority}`}>
                  <Flag size={12} /> {PRIORITY_LABELS[task.priority]}
                </span>
                <span className={`badge status-${task.status}`}>{STATUS_LABELS[task.status]}</span>
                {task.category_name && (
                  <span className="badge"><Tag size={12} /> {task.category_name}</span>
                )}
                {task.due_date && (
                  <span className="badge"><Calendar size={12} /> {new Date(task.due_date).toLocaleString()}</span>
                )}
              </div>
            </div>
          </div>
          <div className="task-actions">
            <button onClick={() => onEdit(task)} title="Tahrirlash"><Pencil size={15} /></button>
            <button onClick={() => onDelete(task.id)} title="O'chirish" className="danger"><Trash2 size={15} /></button>
          </div>
        </li>
      ))}
    </ul>
  )
}
