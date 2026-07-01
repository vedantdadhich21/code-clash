import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Zap, Trophy, Code2, ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { nanoid } from "nanoid";
import { createRoom, joinRoom } from "@/firebase/battleService";
import { useNavigate } from "react-router-dom";
import useAuthStore from "@/store/useAuthStore";
import { toast } from "sonner";

const FEATURES = [
  { icon: <Zap className="size-4" />, label: "Real-time battles" },
  { icon: <Code2 className="size-4" />, label: "Live code execution" },
  { icon: <Trophy className="size-4" />, label: "Global leaderboard" },
]

const CODE_LINES = [
  { tokens: [{ t: 'keyword', v: 'function ' }, { t: 'fn', v: 'twoSum' }, { t: 'plain', v: '(nums, target) {' }] },
  { tokens: [{ t: 'keyword', v: '  const ' }, { t: 'plain', v: 'map = ' }, { t: 'keyword', v: 'new ' }, { t: 'fn', v: 'Map' }, { t: 'plain', v: '();' }] },
  { tokens: [{ t: 'keyword', v: '  for ' }, { t: 'plain', v: '(let i = 0; i < nums.length; i++) {' }] },
  { tokens: [{ t: 'keyword', v: '    const ' }, { t: 'plain', v: 'comp = target - nums[i];' }] },
  { tokens: [{ t: 'keyword', v: '    if ' }, { t: 'plain', v: '(map.' }, { t: 'fn', v: 'has' }, { t: 'plain', v: '(comp)) {' }] },
  { tokens: [{ t: 'keyword', v: '      return ' }, { t: 'plain', v: '[map.' }, { t: 'fn', v: 'get' }, { t: 'plain', v: '(comp), i];' }] },
  { tokens: [{ t: 'plain', v: '    }' }] },
  { tokens: [{ t: 'plain', v: '    map.' }, { t: 'fn', v: 'set' }, { t: 'plain', v: '(nums[i], i);' }] },
  { tokens: [{ t: 'plain', v: '  }' }] },
  { tokens: [{ t: 'plain', v: '}' }] },
]

const TOKEN_COLOR = {
  keyword: 'text-purple-400',
  fn: 'text-blue-400',
  plain: 'text-gray-300',
}

const Home = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    if (!user) {
      toast.error("You are not Logged in Yet", {
        position: "top-right",
        action: { label: "Log In", onClick: () => navigate("/auth") },
      });
      return;
    }
    const roomExist = await joinRoom(data.roomCode.toUpperCase(), user);
    if (roomExist) {
      navigate(`/lobby/${data.roomCode.toUpperCase()}`);
    } else {
      toast.error("No room exist for this code", { position: "top-right" });
    }
  };

  const handleCreateRoom = async () => {
    if (!user) {
      toast.error("You are not Logged in Yet", {
        position: "top-right",
        action: { label: "Log In", onClick: () => navigate("/auth") },
      });
      return;
    }
    const roomId = nanoid(4).toUpperCase();
    await createRoom(roomId, user);
    navigate(`/lobby/${roomId}`);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 gap-10">

      {/* ── Top section: hero + code snippet side by side ── */}
      <div className="flex flex-col lg:flex-row items-center gap-10 w-full max-w-5xl">

        {/* Hero text */}
        <div className="flex flex-col gap-5 flex-1 text-center lg:text-left">
          <div className="flex items-center gap-2 justify-center lg:justify-start">
            <div className="h-px w-8 bg-primary" />
            <span className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              1v1 Coding Arena
            </span>
            <div className="h-px w-8 bg-primary" />
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-none">
            Code.<br />Clash.<br />
            <span className="text-primary">Conquer.</span>
          </h1>

          <p className="text-muted-foreground text-lg max-w-sm">
            Challenge a friend to a real-time coding duel. Same problem, same clock, first to solve it wins.
          </p>

          <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
            {FEATURES.map((f) => (
              <Badge key={f.label} variant="outline" className="flex items-center gap-1.5 px-3 py-3 text-sm font-medium">
                {f.icon}{f.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Decorative code window */}
        <div className="hidden lg:block w-96 rounded-xl border border-border bg-zinc-950 overflow-hidden shadow-2xl shrink-0">
          {/* Window chrome */}
          <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border bg-zinc-900">
            <div className="size-3 rounded-full bg-red-500/80" />
            <div className="size-3 rounded-full bg-yellow-500/80" />
            <div className="size-3 rounded-full bg-green-500/80" />
            <span className="ml-3 text-xs text-zinc-500 font-mono">solution.js</span>
            <div className="ml-auto flex items-center gap-1">
              <div className="h-4 w-px bg-zinc-700" />
              <span className="text-xs text-green-400 font-mono ml-2">✓ Accepted</span>
            </div>
          </div>
          {/* Code */}
          <div className="px-5 py-4 font-mono text-sm leading-7 select-none">
            <div className="text-zinc-600 text-xs mb-2 font-sans">Two Sum — 12ms · 42.5 MB</div>
            {CODE_LINES.map((line, i) => (
              <div key={i} className="flex">
                <span className="text-zinc-700 text-xs w-5 shrink-0 select-none mr-3 mt-0.5">{i + 1}</span>
                <span>
                  {line.tokens.map((tok, j) => (
                    <span key={j} className={TOKEN_COLOR[tok.t]}>{tok.v}</span>
                  ))}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Action card ── */}
      <Card className="w-full max-w-md">
        <CardContent className="p-8 flex flex-col gap-5">
          <Button className="w-full h-12 text-base font-semibold gap-2" onClick={handleCreateRoom}>
            <Search className="size-4" />
            Create a Room
            <ArrowRight className="size-4 ml-auto" />
          </Button>

          <div className="flex items-center gap-3">
            <hr className="flex-1 border-border" />
            <span className="text-sm text-muted-foreground">or join with a code</span>
            <hr className="flex-1 border-border" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
            <Input
              placeholder="Room code (e.g. AB3X)"
              className="h-12 font-mono tracking-widest uppercase"
              {...register("roomCode", {
                required: "Room code is required",
                minLength: { value: 4, message: "Code must be 4 characters" },
                maxLength: { value: 4, message: "Code must be 4 characters" },
              })}
            />
            <Button type="submit" className="h-12 px-5 font-semibold">Join</Button>
          </form>
          {errors.roomCode && (
            <p className="text-red-400 text-sm -mt-2">{errors.roomCode.message}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;
