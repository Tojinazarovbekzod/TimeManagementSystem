import { useMemo, useState } from 'react'
import { Plus, Trash2, Tags } from 'lucide-react'
import client from '../api/client'
import { useToast } from '../context/ToastContext'

export default function CategoriesView({ categories, tasks, onChange }) {
  const [name, setName] = useState('')
  const [color, setColor] = useState('#6366f1')
  const { showToast } = useToast()

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    try {
      await client.post('/categories/', { name, color })
      setName('')
      showToast("Kategoriya qo'shildi")
      onChange()
    } catch {
      showToast('Xatolik yuz berdi', 'error')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Kategoriyani o'chirishni tasdiqlaysizmi?")) return
    await client.delete(`/categories/${id}/`)
    showToast("Kategoriya o'chirildi", 'info')
    onChange()
  }

  const categoryCounts = useMemo(() => {
    return tasks.reduce((acc, task) => {
      acc[task.category] = (acc[task.category] || 0) + 1
      return acc
    }, {})
  }, [tasks])

  return (
    <div className="categories-view">
      <form onSubmit={handleAdd} className="category-form-big">
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        <input
          type="text"
          placeholder="Yangi kategoriya nomi"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit" className="btn-primary"><Plus size={16} /> Qo'shish</button>
      </form>

      {categories.length === 0 ? (
        <div className="empty">
          <Tags size={36} strokeWidth={1.5} />
          <p>Hozircha kategoriyalar yo'q</p>
        </div>
      ) : (
        <div className="category-grid">
          {categories.map((c) => {
            const count = categoryCounts[c.id] || 0
            return (
              <div key={c.id} className="category-card" style={{ borderTopColor: c.color }}>
                <div className="category-card-header">
                  <span className="color-dot" style={{ backgroundColor: c.color }} />
                  <h3>{c.name}</h3>
                  <button onClick={() => handleDelete(c.id)} className="danger" title="O'chirish"><Trash2 size={15} /></button>
                </div>
                <p>{count} ta vazifa</p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
