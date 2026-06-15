import { createContext, useContext, useEffect, useState } from 'react'
import client from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(() => !!localStorage.getItem('access'))

  useEffect(() => {
    if (!localStorage.getItem('access')) return
    client
      .get('/auth/me/')
      .then(({ data }) => setUser(data))
      .catch(() => {
        localStorage.removeItem('access')
        localStorage.removeItem('refresh')
      })
      .finally(() => setLoading(false))
  }, [])

  const login = async (username, password) => {
    const { data } = await client.post('/auth/token/', { username, password })
    localStorage.setItem('access', data.access)
    localStorage.setItem('refresh', data.refresh)
    const me = await client.get('/auth/me/')
    setUser(me.data)
  }

  const register = async (username, email, password) => {
    await client.post('/auth/register/', { username, email, password })
    await login(username, password)
  }

  const logout = () => {
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    setUser(null)
  }

  const updateProfile = async (data) => {
    const { data: updated } = await client.patch('/auth/me/', data)
    setUser(updated)
    return updated
  }

  const changePassword = async (oldPassword, newPassword) => {
    await client.post('/auth/change-password/', { old_password: oldPassword, new_password: newPassword })
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, changePassword }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext)
}
