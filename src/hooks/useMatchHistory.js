import { useQuery } from '@tanstack/react-query'
import api from '@/api/api'

export const useMatchHistory = (userId, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['matches', userId, page],
    queryFn: () => api.get(`/matches/${userId}?page=${page}&limit=${limit}`).then(res => res.data),
    enabled: !!userId,  // don't fetch until userId is available
    staleTime: 30_000,
  })
}
