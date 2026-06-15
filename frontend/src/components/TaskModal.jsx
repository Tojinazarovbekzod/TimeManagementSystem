import { useState } from 'react'
import { X } from 'lucide-react'
import TaskForm from './TaskForm'

export default function TaskModal({ categories, editingTask, onSave, onClose }) {
  const [closing, setClosing] = useState(false)

  const handleClose = () => {
    setClosing(true)
    setTimeout(onClose, 180)
  }

  return (
    <div className={`modal-backdrop ${closing ? 'closing' : ''}`} onClick={handleClose}>
      <div className={`modal ${closing ? 'closing' : ''}`} onClick={(e) => e.stopPropagation()}>
        <button className="icon-btn modal-close" onClick={handleClose}><X size={18} /></button>
        <TaskForm key={editingTask?.id ?? 'new'} categories={categories} editingTask={editingTask} onSave={onSave} onCancel={handleClose} />
      </div>
    </div>
  )
}
