import axios from 'axios'
import useAuthStore from '@/store/useAuthStore'

const getBaseURL = () => {
  const url = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
  if (url && !url.endsWith('/api') && !url.endsWith('/api/')) {
    return `${url.replace(/\/$/, '')}/api`
  }
  return url
}

const api = axios.create({
  baseURL: getBaseURL()
})

// before every request — attach the your JWT token
api.interceptors.request.use( (config) => {

  const jwt = useAuthStore.getState().jwt
  if (jwt) {
    config.headers.Authorization = `Bearer ${jwt}`
  }
  return config
})
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
    }
    return Promise.reject(error)
  }
)

export default api