import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { onDisconnect, ref, update, get } from "firebase/database";
import { db } from "@/firebase/config";
import { onRoomUpdate, updatePlayerStatus } from "@/firebase/battleService";
import useAuthStore from "@/store/useAuthStore";
import CodeEditor from "@/components/Editor/CodeEditor";
import TimerBar from "@/components/Battle/TimerBar";
import { Button } from "@/components/ui/button";
import { verdictEngine } from "@/utils/verdictEngine";
import { toast } from "sonner";
const LANGUAGES = [
  { id: "javascript", label: "JavaScript", icon: "JS" },
  { id: "python", label: "Python", icon: "PY" },
  { id: "java", label: "Java", icon: "JV" },
  { id: "cpp", label: "C++", icon: "C+" },
];
const LANGUAGE_IDS = {
  javascript: 63,
  python: 71,
  java: 62,
  cpp: 54,
};

const Battle = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const [roomData, setRoomData] = useState(null);
  const [language, setLanguage] = useState("javascript");
  const codeRef = useRef("");
  const [submitting, setSubmitting] = useState(false);
  const disconnectRef = useRef(null); // track the onDisconnect ref so we don't register twice

  // 1) Set up onDisconnect dynamically — needs a one-time read to know which player we are
  useEffect(() => {
    const setupDisconnect = async () => {
      const snapshot = await get(ref(db, `rooms/${roomId}`));
      if (!snapshot.exists()) return;

      const room = snapshot.val();
      const playerKey = room.player1?.uid === user?.uid ? "player1" : "player2";

      // store reference so we can cancel if needed
      const playerRef = ref(db, `rooms/${roomId}/${playerKey}`);
      disconnectRef.current = onDisconnect(playerRef);
      disconnectRef.current.update({ status: "disconnected" });
    };

    setupDisconnect();

    // cancel the disconnect handler when component unmounts normally (not a crash)
    return () => {
      if (disconnectRef.current) {
        disconnectRef.current.cancel();
      }
    };
  }, [roomId, user?.uid]);

  // 2) Listen to room updates + detect opponent solved
  useEffect(() => {
    const unsubscribe = onRoomUpdate(roomId, (room) => {
      if (!room) return;
      console.log("ROOM UPDATE");
      console.log(room);

      setRoomData(room);

      const isPlayer1 = room.player1?.uid === user?.uid;
      const opponentKey = isPlayer1 ? "player2" : "player1";

      console.log("opponent status:");
      console.log(room[opponentKey]?.status);
      if (room[opponentKey]?.status === "solved") {
        navigate(`/results/${roomId}`);
      }
      if (room.player1.status === "solved") {
        navigate(`/results/${roomId}`);
      }
      // opponent disconnected
      if (room[opponentKey]?.status === "disconnected") {
        // the other player left — you win by default, go to results
        navigate(`/results/${roomId}`);
      }

      // room marked as timeout (by either player's timer expiring)
      if (room.status === "timeout") {
        navigate(`/results/${roomId}`);
      }
    });

    return unsubscribe;
  }, [roomId, user?.uid, navigate]);

  // 3) Timer expired — update room status and navigate
  const handleTimeUp = async () => {
    await update(ref(db, `rooms/${roomId}`), { status: "timeout" });
    navigate(`/results/${roomId}`);
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);

    try {
      const result = await verdictEngine(
        codeRef.current,
        LANGUAGE_IDS[language],
        roomData.problem.problem_id,
      );

      if (result.verdict === "Accepted") {
        toast.success("All test cases passed!");
        const isPlayer1 = roomData.player1?.uid === user.uid;
        const playerKey = isPlayer1 ? "player1" : "player2";

        await update(ref(db, `rooms/${roomId}/${playerKey}`), {
          status: "solved",
          runtime: result.runtime,
          memory: result.memory,
          solveTime: Date.now() - roomData.startTime,
        });
        navigate(`/results/${roomId}`);
      } else if (result.verdict === "Wrong Answer") {
        toast.error("Wrong Answer — check your logic and try again.");
      } else if (result.verdict === "Compile Error") {
        toast.error(`Compile Error: ${result.message?.slice(0, 120) || 'Check your syntax'}`);
      } else if (result.verdict === "Runtime Error") {
        toast.error(`Runtime Error: ${result.message?.slice(0, 120) || 'Your code crashed'}`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Submission failed — please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!roomData) return <div>Loading...</div>;

  return (
    <div className="flex flex-col flex-1">
      {/* Timer + Submit bar */}
      <div className="flex items-center justify-center p-4 border-b border-border">
        <TimerBar startTime={roomData.startTime} onTimeUp={handleTimeUp} />
        <div className="p-4  border-border">
          <Button className="w-full" onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Judging...' : 'Submit Solution'}
          </Button>
        </div>
      </div>

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Problem panel */}
        <div className="w-1/2 p-6 overflow-auto border-r border-border">
          <h2>{roomData.problem?.title}</h2>
          <p>{roomData.problem?.description}</p>
          <br />
          <div>
            <div className="text-2xl font-bold ">
              Input Format: <br />
            </div>

            <pre>{roomData.problem.inputFormat}</pre>
            <br />
            <div className="text-2xl font-bold ">
              Output Format: <br />
            </div>

            <pre>{roomData.problem.outputFormat}</pre>
          </div>
          {language === "java" && <div> Note: {roomData.problem.note} </div>}
        </div>

        {/* Editor panel */}
        <div className="w-1/2 flex flex-col">
          {/* Language selector */}
          <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-card">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.id}
                onClick={() => setLanguage(lang.id)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  language === lang.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>

          <div className="flex-1">
            <CodeEditor
              language={language}
              onChange={(val) => {
                codeRef.current = val;
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Battle;
