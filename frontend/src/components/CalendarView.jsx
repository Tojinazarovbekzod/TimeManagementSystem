import { useState } from 'react'
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react'
import TaskCard from './TaskCard'

const MONTH_NAMES = [
  'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
  'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr',
]

const WEEKDAYS = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya']

function sameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export default function CalendarView({ tasks, categories, onEdit, onDelete, onStatusChange }) {
  const today = new Date()
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [selected, setSelected] = useState(today)

  const year = cursor.getFullYear()
  const month = cursor.getMonth()

  const firstDay = new Date(year, month, 1)
  const startOffset = (firstDay.getDay() + 6) % 7 // Monday = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells = []
  for (let i = 0; i < startOffset; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d))

  const tasksByDay = (day) => tasks.filter((t) => t.due_date && sameDay(new Date(t.due_date), day))

  const goPrev = () => setCursor(new Date(year, month - 1, 1))
  const goNext = () => setCursor(new Date(year, month + 1, 1))

  const selectedTasks = tasksByDay(selected)

  return (
    <div className="calendar-view">
      <div className="calendar-card">
        <div className="calendar-header">
          <h2>{MONTH_NAMES[month]} {year}</h2>
          <div className="calendar-nav">
            <button className="icon-btn" onClick={goPrev}><ChevronLeft size={18} /></button>
            <button className="icon-btn-today" onClick={() => { setCursor(new Date(today.getFullYear(), today.getMonth(), 1)); setSelected(today) }}>Bugun</button>
            <button className="icon-btn" onClick={goNext}><ChevronRight size={18} /></button>
          </div>
        </div>
        <div className="calendar-grid calendar-weekdays">
          {WEEKDAYS.map((w) => <div key={w} className="calendar-weekday">{w}</div>)}
        </div>
        <div className="calendar-grid">
          {cells.map((day, i) => {
            if (!day) return <div key={i} className="calendar-cell empty" />
            const dayTasks = tasksByDay(day)
            const isToday = sameDay(day, today)
            const isSelected = sameDay(day, selected)
            return (
              <button
                key={i}
                className={`calendar-cell ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                onClick={() => setSelected(day)}
              >
                <span className="calendar-date">{day.getDate()}</span>
                {dayTasks.length > 0 && <span className="calendar-dot-count">{dayTasks.length}</span>}
              </button>
            )
          })}
        </div>
      </div>

      <section className="reminder-section">
        <h2><CalendarDays size={18} /> {selected.toLocaleDateString('uz-UZ', { day: '2-digit', month: 'long', year: 'numeric' })}</h2>
        {selectedTasks.length === 0 ? (
          <p className="empty-small">Bu kunga vazifa belgilanmagan.</p>
        ) : (
          <div className="task-grid">
            {selectedTasks.map((t) => (
              <TaskCard key={t.id} task={t} categories={categories} onEdit={onEdit} onDelete={onDelete} onStatusChange={onStatusChange} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
