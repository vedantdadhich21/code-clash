import axios from 'axios'
import { auth } from '@/firebase/config'

const api = axios.create({
  baseURL: 'http://localhost:3000/api'
})

// before every request — attach the Firebase JWT token
api.interceptors.request.use(async (config) => {
  if (auth.currentUser) {
    const token = await auth.currentUser.getIdToken()
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api