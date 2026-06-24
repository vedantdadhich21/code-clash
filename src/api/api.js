import axios from 'axios'
import useAuthStore from '@/store/useAuthStore'

const api = axios.create({
  baseURL: 'http://localhost:3000/api'
})

// before every request — attach the your JWT token
api.interceptors.request.use( (config) => {

  const jwt = useAuthStore.getState().jwt
  if (jwt) {
    config.headers.Authorization = `Bearer ${jwt}`
  }
  return config
})

export default api