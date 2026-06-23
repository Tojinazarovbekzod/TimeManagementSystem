import { useMemo, useState } from 'react'
import TaskCard from './TaskCard'
import { Filter } from 'lucide-react'

const COLUMNS = [
  { id: 'todo', label: 'Boshlanmagan' },
  { id: 'in_progress', label: 'Jarayonda' },
  { id: 'done', label: 'Bajarildi' },
]

export default function TasksView({ tasks, categories, onEdit, onDelete, onStatusChange }) {
  const [priorityFilter, setPriorityFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

  const filtered = useMemo(
    () => tasks.filter((t) =>
      (!priorityFilter || t.priority === priorityFilter) &&
      (!categoryFilter || String(t.category) === categoryFilter)
    ),
    [tasks, priorityFilter, categoryFilter]
  )

  const groupedTasks = useMemo(() => {
    const groups = { todo: [], in_progress: [], done: [] }
    filtered.forEach((task) => {
      if (groups[task.status]) groups[task.status].push(task)
    })
    return groups
  }, [filtered])

  return (
    <div className="tasks-view">
      <div className="filters">
        <span className="filters-label"><Filter size={15} /> Filtr:</span>
        <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
          <option value="">Barcha prioritetlar</option>
          <option value="low">Past</option>
          <option value="medium">O'rta</option>
          <option value="high">Yuqori</option>
        </select>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="">Barcha kategoriyalar</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="kanban">
        {COLUMNS.map((col) => {
          const colTasks = groupedTasks[col.id]
          return (
            <div key={col.id} className="kanban-column">
              <div className="kanban-header">
                <h3>{col.label}</h3>
                <span className="kanban-count">{colTasks.length}</span>
              </div>
              <div className="kanban-tasks">
                {colTasks.length === 0 ? (
                  <p className="empty-small">Vazifalar yo'q</p>
                ) : (
                  colTasks.map((t) => (
                    <TaskCard key={t.id} task={t} categories={categories} onEdit={onEdit} onDelete={onDelete} onStatusChange={onStatusChange} />
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
