import { useEffect, useRef, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { db } from "@/firebase/config"
import useAuthStore from "@/store/useAuthStore"
import { onRoomUpdate } from "@/firebase/battleService"
import { getBattlePlayers } from "@/utils/getPlayer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { RotateCcw, Swords } from "lucide-react"
import api from "@/api/api"
import { useMutation } from "@tanstack/react-query"

const Results = () => {
  const { roomId } = useParams()
  const navigate = useNavigate()
  const [room, setRoom] = useState(null)
  const user = useAuthStore(state => state.user)
  const matchSavedRef = useRef(false)  // prevent calling mutate() twice

  // useMutation — POST /api/matches
  const { mutate: saveMatch, isPending: isSaving } = useMutation({
    mutationFn: (matchData) => api.post('/matches', matchData),
    onSuccess: () => console.log('Match saved to MongoDB'),
    onError: (err) => {
      console.error('Failed to save match:', err)
      matchSavedRef.current = false  // allow retry on failure
    },
  })

  useEffect(() => {
    const unsubscribe = onRoomUpdate(roomId, (data) => {
      setRoom(data)
    })
    return unsubscribe
  }, [roomId])

  // Determine winner/loser and fire saveMatch once when room data is ready
  useEffect(() => {
    if (!room || matchSavedRef.current) return

    const { me, opponent } = getBattlePlayers(room, user.uid)
    const meSolved = me?.status === 'solved'
    const oppSolved = opponent?.status === 'solved'
    const oppDisconnected = opponent?.status === 'disconnected'

    // Only save if there's a clear outcome (not still in progress)
    const hasOutcome = meSolved || oppSolved || oppDisconnected || room.status === 'timeout'
    if (!hasOutcome) return

    matchSavedRef.current = true

    saveMatch({ roomId })
  }, [room, user?.uid, roomId, saveMatch])

  if (!room) return (
    <div className="flex items-center justify-center h-[80vh]">
      <p className="text-muted-foreground">Loading results...</p>
    </div>
  )

  // Safe to destructure now — room is guaranteed non-null
  const { me, opponent } = getBattlePlayers(room, user.uid)

  // Determine winner: solved beats unsolved; if both solved, fastest time wins
  const determineWin = () => {
    const meSolved = me?.status === 'solved'
    const oppSolved = opponent?.status === 'solved'
    const oppDisconnected = opponent?.status === 'disconnected'
    console.log(meSolved+" "+ oppSolved + " "+oppDisconnected)
    if (meSolved && !oppSolved) return true        // I solved, they didn't
    if (!meSolved && oppSolved) return false        // They solved, I didn't
    if (meSolved && oppSolved) {                    // Both solved — fastest wins
      return (me.solveTime || Infinity) <= (opponent.solveTime || Infinity)
    }
    if (oppDisconnected) return true                // Opponent left
    return false                                    // Timeout, nobody solved
  }

  const iWon = determineWin()
  const isDraw = !me?.status?.match(/solved/) && !opponent?.status?.match(/solved/) && opponent?.status !== 'disconnected'

  const formatTime = (ms) => {
    if (!ms) return '--:--'
    const mins = Math.floor(ms / 60000)
    const secs = Math.floor((ms % 60000) / 1000)
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const totalCases = room.problem?.totalTestCases || 120
  const passedCases = me?.passedCases || (me?.status === 'solved' ? totalCases : 0)
  const passedPercent = Math.round((passedCases / totalCases) * 100)

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] gap-10 px-4">

      {/* Title */}
      <div className="text-center">
        <h1 className={`text-6xl font-black tracking-tight ${
          isDraw ? 'text-yellow-400' : iWon ? 'text-green-400' : 'text-red-400'
        }`}>
          {isDraw ? 'DRAW' : iWon ? 'VICTORY' : 'DEFEAT'}
        </h1>
        <p className="text-muted-foreground mt-2">
          {isDraw
            ? 'Time ran out — nobody cracked it.'
            : iWon
              ? 'You successfully optimized the target algorithm.'
              : 'Better luck next time. Keep grinding.'}
        </p>
      </div>

      {/* Cards */}
      <div className="flex gap-6 w-full max-w-3xl">

        {/* Execution Stats */}
        <Card className="flex-1 bg-card border-border">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <span>⊕</span> Execution Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div className="flex gap-8">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Runtime</p>
                <p className="text-3xl font-bold">
                  {me?.runtime || '--'}
                  <span className="text-sm font-normal text-muted-foreground ml-1">ms</span>
                </p>
                {me?.runtimeBeat && (
                  <p className="text-xs text-green-400 mt-1">Beats {me.runtimeBeat}%</p>
                )}
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Memory</p>
                <p className="text-3xl font-bold">
                  {me?.memory || '--'}
                  <span className="text-sm font-normal text-muted-foreground ml-1">MB</span>
                </p>
                {me?.memoryBeat && (
                  <p className="text-xs text-green-400 mt-1">Beats {me.memoryBeat}%</p>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-muted-foreground">Test Cases</p>
                <span className="text-xs bg-muted px-2 py-0.5 rounded">
                  {passedCases}/{totalCases}
                </span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all"
                  style={{ width: `${passedPercent}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Matchup */}
        <Card className="flex-1 bg-card border-border">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Swords className="size-4" /> Matchup
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">

            {/* Me */}
            <div className={`flex items-center justify-between p-3 rounded-lg ${iWon ? 'bg-muted' : 'bg-muted/50'}`}>
              <div className="flex items-center gap-3">
                <Avatar className="size-7">
                  <AvatarImage src={user?.photoURL} />
                  <AvatarFallback>{user?.displayName?.[0]}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">You</span>
              </div>
              <span className={`text-xl font-bold tabular-nums ${iWon ? 'text-white' : 'text-muted-foreground'}`}>
                {formatTime(me?.solveTime)}
              </span>
            </div>

            <p className="text-center text-xs text-muted-foreground mt-0">vs</p>

            {/* Opponent */}
            <div className={`flex items-center justify-between p-3 rounded-lg ${!iWon ? 'bg-muted' : 'bg-muted/50'}`}>
              <div className="flex items-center gap-3">
                <Avatar className="size-7">
                  <AvatarImage src={opponent?.photoURL} />
                  <AvatarFallback>{opponent?.displayName?.[0]}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-muted-foreground">
                  {opponent?.displayName || 'Opponent'}
                </span>
              </div>
              <span className={`text-xl font-bold tabular-nums ${!iWon ? 'text-white' : 'text-muted-foreground'}`}>
                {formatTime(opponent?.solveTime)}
              </span>
            </div>

          </CardContent>
        </Card>

      </div>

      {/* Buttons */}
      <div className="flex gap-4 w-full items-center justify-center pl-7">
        <Button variant="outline" className="gap-2 px-8 " onClick={() => navigate('/')}>
          <RotateCcw className="size-4" /> Rematch
        </Button>
        <Button className="px-8" onClick={() => navigate('/')}>
          Return to Lobby
        </Button>
      </div>

    </div>
  )
}

export default Results