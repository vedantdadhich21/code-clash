// src/store/useAuthStore.js
import { create } from 'zustand'

const useAuthStore = create((set) => ({
  // state
  user: null,
  jwt: null,
  isLoading: true,

  // actions
  setUser: (user) => set({ user }),
  setJwt: (jwt) => set({ jwt }),
  setIsLoading: (isLoading) => set({ isLoading }),
  logout: () => set({ user: null, jwt: null }),
}))

export default useAuthStore