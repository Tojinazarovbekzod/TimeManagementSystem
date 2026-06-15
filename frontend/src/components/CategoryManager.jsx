import { useState } from 'react'
import { Plus, X, Tags } from 'lucide-react'
import client from '../api/client'

export default function CategoryManager({ categories, onChange }) {
  const [name, setName] = useState('')
  const [color, setColor] = useState('#6366f1')

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    await client.post('/categories/', { name, color })
    setName('')
    onChange()
  }

  const handleDelete = async (id) => {
    await client.delete(`/categories/${id}/`)
    onChange()
  }

  return (
    <div className="category-manager">
      <h2><Tags size={16} /> Kategoriyalar</h2>
      {categories.length === 0 && <p className="empty-small">Kategoriyalar yo'q</p>}
      <ul>
        {categories.map((c) => (
          <li key={c.id}>
            <span className="color-dot" style={{ backgroundColor: c.color }} />
            {c.name}
            <button onClick={() => handleDelete(c.id)} title="O'chirish"><X size={13} /></button>
          </li>
        ))}
      </ul>
      <form onSubmit={handleAdd} className="category-form">
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
        <input
          type="text"
          placeholder="Yangi kategoriya"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit"><Plus size={15} /></button>
      </form>
    </div>
  )
}
