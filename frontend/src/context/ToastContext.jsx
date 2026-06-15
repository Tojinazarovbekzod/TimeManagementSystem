import { createContext, useCallback, useContext, useState } from 'react'
import { CheckCircle2, XCircle, Info, X } from 'lucide-react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const removeToast = useCallback((id) => {
    setToasts((t) => t.filter((toast) => toast.id !== id))
  }, [])

  const dismissToast = useCallback((id) => {
    setToasts((t) => t.map((toast) => (toast.id === id ? { ...toast, leaving: true } : toast)))
    setTimeout(() => removeToast(id), 200)
  }, [removeToast])

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, message, type, leaving: false }])
    setTimeout(() => dismissToast(id), 3000)
  }, [dismissToast])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.type} ${toast.leaving ? 'leaving' : ''}`}>
            {toast.type === 'success' && <CheckCircle2 size={18} />}
            {toast.type === 'error' && <XCircle size={18} />}
            {toast.type === 'info' && <Info size={18} />}
            <span>{toast.message}</span>
            <button onClick={() => dismissToast(toast.id)}><X size={14} /></button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  return useContext(ToastContext)
}
