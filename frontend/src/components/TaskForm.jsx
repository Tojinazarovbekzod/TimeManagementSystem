import { useState } from 'react'
import { Plus, Save, X } from 'lucide-react'

const emptyTask = {
  title: '',
  description: '',
  category: '',
  priority: 'medium',
  status: 'todo',
  due_date: '',
}

function taskToForm(editingTask) {
  if (!editingTask) return emptyTask
  return {
    title: editingTask.title,
    description: editingTask.description || '',
    category: editingTask.category || '',
    priority: editingTask.priority,
    status: editingTask.status,
    due_date: editingTask.due_date ? editingTask.due_date.slice(0, 16) : '',
  }
}

export default function TaskForm({ categories, editingTask, onSave, onCancel }) {
  const [form, setForm] = useState(() => taskToForm(editingTask))

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const payload = {
      ...form,
      category: form.category || null,
      due_date: form.due_date || null,
    }
    onSave(payload)
    setForm(emptyTask)
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h2>{editingTask ? 'Vazifani tahrirlash' : 'Yangi vazifa'}</h2>
      <input
        type="text"
        name="title"
        placeholder="Sarlavha"
        value={form.title}
        onChange={handleChange}
        required
      />
      <textarea
        name="description"
        placeholder="Tavsif"
        value={form.description}
        onChange={handleChange}
      />
      <div className="form-row">
        <select name="category" value={form.category} onChange={handleChange}>
          <option value="">Kategoriyasiz</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select name="priority" value={form.priority} onChange={handleChange}>
          <option value="low">Past</option>
          <option value="medium">O'rta</option>
          <option value="high">Yuqori</option>
        </select>
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="todo">Boshlanmagan</option>
          <option value="in_progress">Jarayonda</option>
          <option value="done">Bajarildi</option>
        </select>
        <input type="datetime-local" name="due_date" value={form.due_date} onChange={handleChange} />
      </div>
      <div className="form-actions">
        <button type="submit" className="btn-primary">
          {editingTask ? <><Save size={16} /> Saqlash</> : <><Plus size={16} /> Qo'shish</>}
        </button>
        <button type="button" onClick={onCancel}>
          <X size={16} /> Bekor qilish
        </button>
      </div>
    </form>
  )
}
