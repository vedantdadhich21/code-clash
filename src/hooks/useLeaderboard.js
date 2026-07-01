import { useQuery } from '@tanstack/react-query'
import api from '@/api/api'

export const useLeaderboard = () => {
  return useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => api.get('/leaderboard').then(res => res.data),
    staleTime: 60_000,  // fresh for 1 minute — leaderboard doesn't change every second
  })
}
