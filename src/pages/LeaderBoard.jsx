import { useLeaderboard } from "@/hooks/useLeaderboard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Trophy, Medal, Award } from "lucide-react"

const rankIcons = {
  0: <Trophy className="size-5 text-yellow-400" />,
  1: <Medal className="size-5 text-gray-300" />,
  2: <Award className="size-5 text-amber-600" />,
}

const LeaderBoard = () => {
  const { data, isLoading, isError, error } = useLeaderboard()

  return (
    <div className="min-w-2xl mx-auto p-6 space-y-6">
      <div className="flex flex-col items-center">
        <h1 className="text-5xl font-black tracking-tight ">Leaderboard</h1>
        <p className="text-muted-foreground text-xl mt-1">Top players by wins</p>
      </div>

      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Trophy className="size-4" /> Global Rankings
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-1">
          {isLoading && (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-3">
                <Skeleton className="size-8 rounded-full" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-16 ml-auto" />
              </div>
            ))
          )}

          {isError && (
            <p className="text-destructive text-sm p-4">
              Failed to load leaderboard: {error.message}
            </p>
          )}

          {data?.data?.map((player, index) => (
            <div
              key={player.uid}
              className={`flex items-center gap-4 p-3 rounded-lg transition-colors hover:bg-muted/50 ${
                index < 3 ? 'bg-muted/30' : ''
              }`}
            >
              {/* Rank */}
              <div className="w-8 flex justify-center">
                {rankIcons[index] || (
                  <span className="text-sm font-bold text-muted-foreground">
                    {index + 1}
                  </span>
                )}
              </div>

              {/* Avatar + Name */}
              <Avatar className="size-8">
                <AvatarImage src={player.photoURL} />
                <AvatarFallback>{player.displayName?.[0]}</AvatarFallback>
              </Avatar>
              <span className="font-medium text-sm">{player.displayName}</span>

              {/* Stats */}
              <div className="ml-auto flex items-center gap-4 text-sm">
                <span className="text-muted-foreground">
                  {player.wins}W - {player.losses}L
                </span>
                <span className="font-bold tabular-nums w-12 text-right">
                  {player.winRate}%
                </span>
              </div>
            </div>
          ))}

          {data?.data?.length === 0 && (
            <p className="text-muted-foreground text-sm text-center py-8">
              No matches played yet. Be the first!
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default LeaderBoard
