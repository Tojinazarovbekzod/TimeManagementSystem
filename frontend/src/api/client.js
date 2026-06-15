import axios from 'axios'

const BASE_URL = 'http://127.0.0.1:8000/api'

const client = axios.create({
  baseURL: BASE_URL,
})

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('access')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let isRefreshing = false
let pendingRequests = []

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error

    if (response?.status !== 401 || config._retry) {
      return Promise.reject(error)
    }

    const refresh = localStorage.getItem('refresh')
    if (!refresh) {
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingRequests.push({ resolve, reject, config })
      })
    }

    config._retry = true
    isRefreshing = true

    try {
      const { data } = await axios.post(`${BASE_URL}/auth/token/refresh/`, { refresh })
      localStorage.setItem('access', data.access)

      pendingRequests.forEach(({ resolve, config: pendingConfig }) => {
        pendingConfig.headers.Authorization = `Bearer ${data.access}`
        resolve(client(pendingConfig))
      })
      pendingRequests = []

      config.headers.Authorization = `Bearer ${data.access}`
      return client(config)
    } catch (refreshError) {
      pendingRequests.forEach(({ reject: rejectPending }) => rejectPending(refreshError))
      pendingRequests = []
      localStorage.removeItem('access')
      localStorage.removeItem('refresh')
      window.location.href = '/login'
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  }
)

export default client
