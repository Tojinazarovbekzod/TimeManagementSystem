import { useNavigate } from 'react-router-dom'

export default function AuthTransitionLink({ to, direction, children, ...props }) {
  const navigate = useNavigate()

  const handleClick = (e) => {
    e.preventDefault()
    const card = e.currentTarget.closest('.auth-card')
    if (!card) {
      navigate(to, { state: { direction } })
      return
    }
    card.classList.add(direction === 'backward' ? 'exit-backward' : 'exit-forward')
    setTimeout(() => navigate(to, { state: { direction } }), 250)
  }

  return (
    <a href={to} onClick={handleClick} {...props}>
      {children}
    </a>
  )
}
