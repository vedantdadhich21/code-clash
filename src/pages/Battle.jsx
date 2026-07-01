import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { onDisconnect, ref, update, get } from "firebase/database";
import { db } from "@/firebase/config";
import { onRoomUpdate } from "@/firebase/battleService";
import useAuthStore from "@/store/useAuthStore";
import CodeEditor from "@/components/Editor/CodeEditor";
import TimerBar from "@/components/Battle/TimerBar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { verdictEngine } from "@/utils/verdictEngine";
import { toast } from "sonner";
import { ChevronDown, ChevronUp } from "lucide-react";

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

const DIFFICULTY_COLOR = {
  Easy: "text-green-400 border-green-400/40 bg-green-400/10",
  Medium: "text-yellow-400 border-yellow-400/40 bg-yellow-400/10",
  Hard: "text-red-400 border-red-400/40 bg-red-400/10",
};

const Battle = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const [roomData, setRoomData] = useState(null);
  const [language, setLanguage] = useState("javascript");
  const codeRef = useRef("");
  const [submitting, setSubmitting] = useState(false);
  const disconnectRef = useRef(null);
  const [ioOpen, setIoOpen] = useState(false); // collapsible I/O section

  // ── 1) onDisconnect setup — identical logic ───────────────────────────────
  useEffect(() => {
    const setupDisconnect = async () => {
      const snapshot = await get(ref(db, `rooms/${roomId}`));
      if (!snapshot.exists()) return;
      const room = snapshot.val();
      const playerKey = room.player1?.uid === user?.uid ? "player1" : "player2";
      const playerRef = ref(db, `rooms/${roomId}/${playerKey}`);
      disconnectRef.current = onDisconnect(playerRef);
      disconnectRef.current.update({ status: "disconnected" });
    };
    setupDisconnect();
    return () => { if (disconnectRef.current) disconnectRef.current.cancel(); };
  }, [roomId, user?.uid]);

  // ── 2) Room listener — identical logic ───────────────────────────────────
  useEffect(() => {
    const unsubscribe = onRoomUpdate(roomId, (room) => {
      if (!room) return;
      setRoomData(room);
      const isPlayer1 = room.player1?.uid === user?.uid;
      const myKey = isPlayer1 ? "player1" : "player2";
      const opponentKey = isPlayer1 ? "player2" : "player1";
      
      if (room[myKey]?.status === "solved") navigate(`/results/${roomId}`);
      if (room[opponentKey]?.status === "solved") navigate(`/results/${roomId}`);
      if (room[opponentKey]?.status === "disconnected") navigate(`/results/${roomId}`);
      if (room.status === "timeout") navigate(`/results/${roomId}`);
    });
    return unsubscribe;
  }, [roomId, user?.uid, navigate]);

  // ── 3) Timer expired — identical logic ───────────────────────────────────
  const handleTimeUp = async () => {
    await update(ref(db, `rooms/${roomId}`), { status: "timeout" });
    navigate(`/results/${roomId}`);
  };

  // ── 4) Submit — identical logic ──────────────────────────────────────────
  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const result = await verdictEngine(codeRef.current, LANGUAGE_IDS[language], roomData.problem.problem_id);
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
        toast.error(`Compile Error: ${result.message?.slice(0, 120) || "Check your syntax"}`);
      } else if (result.verdict === "Runtime Error") {
        toast.error(`Runtime Error: ${result.message?.slice(0, 120) || "Your code crashed"}`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Submission failed — please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (!roomData) {
    return (
      <div className="flex flex-col flex-1">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-9 w-36" />
        </div>
        <div className="flex flex-1">
          <div className="w-1/2 p-6 border-r border-border space-y-4">
            <Skeleton className="h-7 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="w-1/2 flex items-center justify-center">
            <Skeleton className="w-full h-full m-8 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  const problem = roomData.problem;
  const difficulty = problem?.difficulty || "Medium";

  return (
    <div className="flex flex-col flex-1 overflow-hidden">

      {/* ── Top bar: Timer + Submit ─────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-card/50 shrink-0">
        <div className="flex items-center gap-3">
          <TimerBar startTime={roomData.startTime} onTimeUp={handleTimeUp} />
        </div>
        <Button
          onClick={handleSubmit}
          disabled={submitting}
          className="gap-2 px-6"
        >
          {submitting ? "Judging…" : "Submit Solution"}
        </Button>
      </div>

      {/* ── Main layout ────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Problem panel */}
        <div className="w-1/2 flex flex-col overflow-hidden border-r border-border">

          {/* Problem title + difficulty */}
          <div className="px-6 py-4 border-b border-border shrink-0">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-lg font-bold leading-tight">{problem?.title}</h2>
              <Badge
                variant="outline"
                className={`shrink-0 text-xs font-semibold ${DIFFICULTY_COLOR[difficulty] || DIFFICULTY_COLOR.Medium}`}
              >
                {difficulty}
              </Badge>
            </div>
          </div>

          {/* Scrollable problem body */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

            {/* Description */}
            <p className="text-base text-foreground leading-relaxed whitespace-pre-wrap">
              {problem?.description}
            </p>

            {/* Constraints */}
            {problem?.constraints?.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Constraints</p>
                <ul className="space-y-1">
                  {problem.constraints.map((c, i) => (
                    <li key={i} className="text-sm font-mono text-foreground/80 flex gap-2">
                      <span className="text-muted-foreground">•</span>{c}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Examples */}
            {problem?.examples?.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Example</p>
                {problem.examples.map((ex, i) => (
                  <div key={i} className="rounded-lg border border-border overflow-hidden text-sm">
                    <div className="grid grid-cols-2 divide-x divide-border">
                      <div className="p-3 space-y-1">
                        <p className="text-xs font-semibold text-muted-foreground">Input</p>
                        <pre className="font-mono text-xs text-foreground/90 whitespace-pre-wrap leading-relaxed">{ex.input}</pre>
                      </div>
                      <div className="p-3 space-y-1">
                        <p className="text-xs font-semibold text-muted-foreground">Output</p>
                        <pre className="font-mono text-xs text-foreground/90 whitespace-pre-wrap leading-relaxed">{ex.output}</pre>
                      </div>
                    </div>
                    {ex.explanation && (
                      <div className="px-3 py-2 border-t border-border bg-muted/20">
                        <p className="text-xs text-muted-foreground">
                          <span className="font-semibold">Explanation: </span>{ex.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Collapsible I/O format */}
            <div className="rounded-lg border border-border overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-4 py-2.5 bg-muted/40 hover:bg-muted/60 transition-colors text-sm font-semibold"
                onClick={() => setIoOpen((v) => !v)}
              >
                <span>Input / Output Format</span>
                {ioOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
              </button>

              {ioOpen && (
                <div className="divide-y divide-border">
                  <div className="px-4 py-3 space-y-1">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Input Format</p>
                    <pre className="text-xs font-mono text-foreground/80 whitespace-pre-wrap leading-relaxed">
                      {problem?.inputFormat}
                    </pre>
                  </div>
                  <div className="px-4 py-3 space-y-1">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Output Format</p>
                    <pre className="text-xs font-mono text-foreground/80 whitespace-pre-wrap leading-relaxed">
                      {problem?.outputFormat}
                    </pre>
                  </div>
                  {language === "java" && problem?.note && (
                    <div className="px-4 py-3 space-y-1">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Note</p>
                      <p className="text-xs text-foreground/80">{problem.note}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Editor panel */}
        <div className="w-1/2 flex flex-col overflow-hidden">

          {/* Language selector */}
          <div className="flex items-center gap-1 px-4 py-2 border-b border-border bg-card shrink-0">
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

          {/* Editor — fills remaining height */}
          <div className="flex-1 overflow-hidden">
            <CodeEditor
              language={language}
              roomId={roomId}
              onChange={(val) => { codeRef.current = val; }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Battle;
