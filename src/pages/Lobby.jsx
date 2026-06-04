import React from "react";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { onRoomUpdate } from "@/firebase/battleService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { startBattle } from "@/firebase/battleService";
const Lobby = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  const user = useAuthStore((state) => state.user);

  const runBattle = async (roomId) => {
    startBattle(roomId);
    navigate(`/battle/${roomId}`);
  };

  useEffect(() => {
    const unsubscribe = onRoomUpdate(roomId, (data) => {
      console.log(data);
      setRoom(data);
      if (data.status === "active") {
        navigate(`/battle/${roomId}`);
      }
    });
    return unsubscribe;
  }, [roomId]);

  if (!room) {
    return <div>Loading...</div>;
  }
  console.log(user.uid);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lobby {roomId}</CardTitle>
      </CardHeader>

      <CardContent>
        <p>
          Player 1:
          {room.player1?.displayName}
        </p>
        {room.player1.uid === user.uid && room.player2 && (
          <Button onClick={() => runBattle(roomId)}>Start Battle</Button>
        )}
        <p>
          Player 2:
          {room.player2?.displayName || "Waiting..."}
        </p>
      </CardContent>
    </Card>
  );
};

export default Lobby;
