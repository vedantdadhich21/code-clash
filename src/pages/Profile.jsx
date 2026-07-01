import { useState } from "react"
import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import useAuthStore from "@/store/useAuthStore"
import { useMatchHistory } from "@/hooks/useMatchHistory"
import api from "@/api/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Swords, ChevronLeft, ChevronRight } from "lucide-react"

const Profile = () => {
  const { userId } = useParams()  // Firebase uid from the URL
  const loggedInUser = useAuthStore(state => state.user)
  const [page, setPage] = useState(1)

  // Fetch the profile owner's data from backend (works for any user, not just self)
  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => api.get(`/users/${userId}`).then(res => res.data),
    enabled: !!userId,
    staleTime: 60_000,
  })

  // Use fetched profile data; fall back to logged-in user if viewing own profile
  const profileUser = profileData || (loggedInUser?.uid === userId ? loggedInUser : null)

  const { data, isLoading, isError } = useMatchHistory(userId, page)

  const formatTime = (ms) => {
    if (!ms) return '--:--'
    const mins = Math.floor(ms / 60000)
    const secs = Math.floor((ms % 60000) / 1000)
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    })
  }

  return (
    <div className="min-w-2xl mx-auto p-10 space-y-6">

      {/* User Info Card */}
      <Card className="border-border bg-card ">
        <CardContent className="flex items-center gap-4 p-4">
          {profileLoading ? (
            <>
              <Skeleton className="size-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-52" />
              </div>
            </>
          ) : (
            <>
              <Avatar className="size-16">
                <AvatarImage src={profileUser?.photoURL} />
                <AvatarFallback className="text-xl">{profileUser?.displayName?.[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">{profileUser?.displayName}</h1>
                <p className="text-muted-foreground text-sm mt-0">{profileUser?.email}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Wins', value: profileUser?.wins || 0, color: 'text-green-400' },
          { label: 'Losses', value: profileUser?.losses || 0, color: 'text-red-400' },
          { label: 'Win Rate', value: profileUser?.totalMatches > 0 
              ? `${Math.round((profileUser.wins / profileUser.totalMatches) * 100)}%` 
              : '0%', 
            color: 'text-foreground' },
        ].map(stat => (
          <Card key={stat.label} className="border-border bg-card">
            <CardContent className=" text-center">
              {profileLoading ? (
                <Skeleton className="h-9 w-16 mx-auto" />
              ) : (
                <p className={`text-3xl font-bold tabular-nums ${stat.color}`}>
                  {stat.value}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Match History */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Swords className="size-4" /> Match History
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-2">
          {isLoading && (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-3">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-20 ml-auto" />
              </div>
            ))
          )}

          {isError && (
            <p className="text-destructive text-sm">Failed to load match history.</p>
          )}

          {data?.data?.length === 0 && (
            <p className="text-muted-foreground text-sm text-center py-8">
              No matches yet. Start a battle!
            </p>
          )}

          {data?.data?.map((match) => {
            const won = match.winnerId === userId
            return (
              <div
                key={match._id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors m-0 "
              >
                <div className="flex items-center gap-3">
                  <Badge variant={won ? "default" : "destructive"} className="w-10 justify-center text-xs">
                    {won ? 'W' : 'L'}
                  </Badge>
                  <div>
                    <p className="text-sm font-medium">
                      vs {won ? match.loserDisplayName : match.winnerDisplayName}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0">
                      {formatDate(match.playedAt)}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-mono tabular-nums text-muted-foreground">
                  {formatTime(won ? match.winnerSolveTime : match.loserSolveTime)}
                </span>
              </div>
            )
          })}

          {/* Pagination */}
          {data?.totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >
                <ChevronLeft className="size-4 mr-1" /> Prev
              </Button>
              <span className="text-xs text-muted-foreground">
                Page {page} of {data.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= data.totalPages}
                onClick={() => setPage(p => p + 1)}
              >
                Next <ChevronRight className="size-4 ml-1" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Profile
