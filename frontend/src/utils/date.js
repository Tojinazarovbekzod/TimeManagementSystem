export function getDueStatus(dueDate, status) {
  if (!dueDate || status === 'done') return null
  const diffHours = (new Date(dueDate) - new Date()) / (1000 * 60 * 60)
  if (diffHours < 0) return 'overdue'
  if (diffHours <= 24) return 'soon'
  return null
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString('uz-UZ', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
