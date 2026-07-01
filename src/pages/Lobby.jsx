import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { onRoomUpdate } from "@/firebase/battleService";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import useAuthStore from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { startBattle } from "@/firebase/battleService";
import { Copy, Swords, Loader2 } from "lucide-react";
import { toast } from "sonner";

const Lobby = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  const user = useAuthStore((state) => state.user);

  // ── same logic as before ──────────────────────────────────────────────────
  const runBattle = async (roomId) => {
    startBattle(roomId);
    navigate(`/battle/${roomId}`);
  };

  useEffect(() => {
    const unsubscribe = onRoomUpdate(roomId, (data) => {
      setRoom(data);
      if (data?.status === "active") {
        navigate(`/battle/${roomId}`);
      }
    });
    return unsubscribe;
  }, [roomId]);
  // ─────────────────────────────────────────────────────────────────────────

  const isOwner = room?.player1?.uid === user?.uid;
  const canStart = isOwner && !!room?.player2;

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomId);
    toast.success("Room code copied!");
  };

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (!room) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[85vh] gap-6 px-4">
        <div className="text-center space-y-2">
          <Skeleton className="h-10 w-48 mx-auto" />
          <Skeleton className="h-5 w-64 mx-auto" />
        </div>
        <div className="flex gap-4 w-full max-w-2xl">
          {[0, 1].map((i) => (
            <Card key={i} className="flex-1 bg-card border-border">
              <CardContent className="flex flex-col items-center gap-3 py-6">
                <Skeleton className="size-16 rounded-full" />
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-4 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Skeleton className="h-11 w-40" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] gap-8 px-4">

      {/* Room header */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-black tracking-tight">Lobby</h1>
        <div className="flex items-center gap-2 justify-center">
          <span className="text-muted-foreground text-sm">Room Code</span>
          <Badge
            variant="outline"
            className="font-mono text-xl py-4 tracking-widest cursor-pointer hover:bg-muted transition-colors"
            onClick={copyRoomCode}
          >
            {roomId}
          </Badge>
          <button
            onClick={copyRoomCode}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Copy className="size-4" />
          </button>
        </div>
        <p className="text-muted-foreground text-sm">
          Share the room code with your opponent
        </p>
      </div>

      {/* Player cards */}
      <div className="flex gap-4 w-full max-w-2xl">

        {/* Player 1 */}
        <Card className="flex-1 bg-card border-border">
          <CardContent className="flex flex-col items-center gap-4 py-7">
            <Avatar className="size-20">
              <AvatarImage src={room.player1?.photoURL} />
              <AvatarFallback className="text-2xl">
                {room.player1?.displayName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <p className="font-bold text-lg">{room.player1?.displayName}</p>
              <Badge variant="secondary" className="text-xs mt-1">
                {isOwner ? "You · Host" : "Host"}
              </Badge>
            </div>
            <div className="flex items-center gap-1.5 text-green-400 text-sm font-medium">
              <div className="size-2 rounded-full bg-green-400 animate-pulse" />
              Ready
            </div>
          </CardContent>
        </Card>

        {/* VS divider */}
        <div className="flex items-center">
          <Swords className="size-6 text-muted-foreground" />
        </div>

        {/* Player 2 */}
        <Card className="flex-1 bg-card border-border">
          <CardContent className="flex flex-col items-center gap-4 py-7">
            {room.player2 ? (
              <>
                <Avatar className="size-20">
                  <AvatarImage src={room.player2?.photoURL} />
                  <AvatarFallback className="text-2xl">
                    {room.player2?.displayName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <p className="font-bold text-lg">{room.player2?.displayName}</p>
                  <Badge variant="secondary" className="text-xs mt-1">
                    {!isOwner ? "You" : "Opponent"}
                  </Badge>
                </div>
                <div className="flex items-center gap-1.5 text-green-400 text-sm font-medium">
                  <div className="size-2 rounded-full bg-green-400 animate-pulse" />
                  Ready
                </div>
              </>
            ) : (
              <>
                <div className="size-20 rounded-full border-2 border-dashed border-border flex items-center justify-center">
                  <Loader2 className="size-7 text-muted-foreground animate-spin" />
                </div>
                <div className="text-center">
                  <p className="text-muted-foreground font-medium">Waiting for opponent...</p>
                  <p className="text-muted-foreground/60 text-xs mt-1">Share the room code above</p>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground text-sm font-medium">
                  <div className="size-2 rounded-full bg-muted-foreground animate-pulse" />
                  Not connected
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Start button — only owner sees it, only enabled when player2 is present */}
      {isOwner ? (
        <Button
          size="lg"
          className="px-14 h-12 text-base gap-2"
          onClick={() => runBattle(roomId)}
          disabled={!canStart}
        >
          <Swords className="size-5" />
          {canStart ? "Start Battle" : "Waiting for opponent..."}
        </Button>
      ) : (
        <p className="text-muted-foreground">
          Waiting for the host to start the battle...
        </p>
      )}
    </div>
  );
};

export default Lobby;
