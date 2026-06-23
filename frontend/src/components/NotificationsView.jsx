import { useMemo } from 'react'
import { AlertTriangle, Clock4, BellOff, Pencil } from 'lucide-react'
import { getDueStatus, formatDate } from '../utils/date'

export default function NotificationsView({ tasks, categories, onEdit }) {
  const categoryMap = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, c])),
    [categories]
  )

  const items = useMemo(() => {
    const list = []
    tasks.forEach((task) => {
      const dueStatus = getDueStatus(task.due_date, task.status)
      if (dueStatus === 'overdue') list.push({ task, type: 'overdue' })
      if (dueStatus === 'soon') list.push({ task, type: 'soon' })
    })
    return list
  }, [tasks])

  return (
    <div className="notifications-view">
      {items.length === 0 ? (
        <div className="empty-state">
          <BellOff size={40} />
          <p>Hozircha bildirishnomalar yo'q.</p>
        </div>
      ) : (
        <div className="notifications-list">
          {items.map(({ task, type }) => {
            const category = categoryMap[task.category]
            return (
              <div key={task.id} className={`notification-item notification-${type}`}>
                <div className="notification-icon">
                  {type === 'overdue' ? <AlertTriangle size={18} /> : <Clock4 size={18} />}
                </div>
                <div className="notification-body">
                  <h3>{task.title}</h3>
                  <p>
                    {type === 'overdue' ? "Muddati o'tib ketdi" : 'Tez orada muddati tugaydi'}
                    {' · '}{formatDate(task.due_date)}
                    {category && <> · {category.name}</>}
                  </p>
                </div>
                <button className="icon-btn" onClick={() => onEdit(task)} title="Tahrirlash"><Pencil size={15} /></button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
