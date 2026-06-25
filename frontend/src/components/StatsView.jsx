import { useMemo } from 'react'
import StatsBar from './StatsBar'
import { BarChart3, PieChart } from 'lucide-react'

const PRIORITY_LABELS = { low: 'Past', medium: "O'rta", high: 'Yuqori' }
const PRIORITY_COLORS = { low: '#10b981', medium: '#f59e0b', high: '#ef4444' }

export default function StatsView({ tasks, categories }) {
  const total = tasks.length

  const { priorityCounts, categoryCounts, maxCategoryCount, maxPriorityCount } = useMemo(() => {
    const priorityMap = { low: 0, medium: 0, high: 0 }
    const categoryMap = {}

    tasks.forEach((task) => {
      if (task.priority in priorityMap) priorityMap[task.priority] += 1
      categoryMap[task.category] = (categoryMap[task.category] || 0) + 1
    })

    const priorityCounts = ['low', 'medium', 'high'].map((p) => ({
      key: p,
      label: PRIORITY_LABELS[p],
      color: PRIORITY_COLORS[p],
      count: priorityMap[p],
    }))

    const categoryCounts = categories
      .map((c) => ({ ...c, count: categoryMap[c.id] || 0 }))
      .sort((a, b) => b.count - a.count)

    return {
      priorityCounts,
      categoryCounts,
      maxCategoryCount: Math.max(1, ...categoryCounts.map((c) => c.count)),
      maxPriorityCount: Math.max(1, ...priorityCounts.map((c) => c.count)),
    }
  }, [tasks, categories])

  return (
    <div className="stats-view">
      <StatsBar tasks={tasks} />

      <div className="stats-grid">
        <div className="stats-card-block">
          <h2><BarChart3 size={18} /> Muhimlik darajasi bo'yicha</h2>
          {total === 0 ? (
            <p className="empty-small">Ma'lumot yo'q</p>
          ) : (
            <div className="bar-chart">
              {priorityCounts.map((p) => (
                <div key={p.key} className="bar-row">
                  <span className="bar-label">{p.label}</span>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${(p.count / maxPriorityCount) * 100}%`, background: p.color }} />
                  </div>
                  <span className="bar-value">{p.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="stats-card-block">
          <h2><PieChart size={18} /> Kategoriyalar bo'yicha</h2>
          {categoryCounts.length === 0 ? (
            <p className="empty-small">Kategoriyalar yo'q</p>
          ) : (
            <div className="bar-chart">
              {categoryCounts.map((c) => (
                <div key={c.id} className="bar-row">
                  <span className="bar-label">{c.name}</span>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${(c.count / maxCategoryCount) * 100}%`, background: c.color }} />
                  </div>
                  <span className="bar-value">{c.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
