import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Trophy,
  Clock,
  Cpu,
  Database,
  RotateCcw,
  Home,
  ChevronRight,
} from "lucide-react";
const MatchResults = ({ matchData }) => {
  const data = matchData || {
    status: "VICTORY",
    message: "You successfully optimized the target algorithm.",
    runtime: "42 ms",
    memory: "16.4 MB",
    testCases: { passed: 120, total: 120 },
    runtimePercentile: "94.2%",
    memoryPercentile: "88.1%",
    players: [
      { name: "You", time: "08:24", isWinner: true, avatar: null },
      { name: "Opponent_X", time: "11:05", isWinner: false, avatar: null },
    ],
  };
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-6 bg-background text-foreground animate-in fade-in duration-500">
      {" "}
      {/* Result Header */}{" "}
      <div className="text-center mb-12">
        {" "}
        <h1 className="text-6xl font-black tracking-tighter mb-4 italic uppercase">
          {" "}
          {data.status}{" "}
        </h1>{" "}
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          {" "}
          {data.message}{" "}
        </p>{" "}
      </div>{" "}
      {/* Main Stats Grid */}{" "}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {" "}
        {/* Execution Stats */}{" "}
        <Card className="border-border bg-card/50">
          {" "}
          <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-4">
            {" "}
            <Cpu className="w-4 h-4 text-primary" />{" "}
            <CardTitle className="text-sm font-semibold uppercase tracking-wider">
              Execution Stats
            </CardTitle>{" "}
          </CardHeader>{" "}
          <CardContent className="space-y-6">
            {" "}
            <div className="grid grid-cols-2 gap-4">
              {" "}
              <div>
                {" "}
                <p className="text-xs text-muted-foreground mb-1 uppercase">
                  Runtime
                </p>{" "}
                <div className="flex items-baseline gap-2">
                  {" "}
                  <span className="text-2xl font-bold">
                    {data.runtime}
                  </span>{" "}
                </div>{" "}
                <p className="text-[10px] text-green-500 font-medium mt-1 uppercase">
                  {" "}
                  Beats {data.runtimePercentile}{" "}
                </p>{" "}
              </div>{" "}
              <div>
                {" "}
                <p className="text-xs text-muted-foreground mb-1 uppercase">
                  Memory
                </p>{" "}
                <div className="flex items-baseline gap-2">
                  {" "}
                  <span className="text-2xl font-bold">{data.memory}</span>{" "}
                </div>{" "}
                <p className="text-[10px] text-green-500 font-medium mt-1 uppercase">
                  {" "}
                  Beats {data.memoryPercentile}{" "}
                </p>{" "}
              </div>{" "}
            </div>{" "}
            <div className="space-y-2">
              {" "}
              <div className="flex justify-between items-center text-xs">
                {" "}
                <span className="text-muted-foreground uppercase">
                  Test Cases
                </span>{" "}
                <span className="font-mono font-bold">
                  {data.testCases.passed}/{data.testCases.total}
                </span>{" "}
              </div>{" "}
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                {" "}
                <div
                  className="h-full bg-primary transition-all duration-1000"
                  style={{
                    width: `${(data.testCases.passed / data.testCases.total) * 100}%`,
                  }}
                />{" "}
              </div>{" "}
            </div>{" "}
          </CardContent>{" "}
        </Card>{" "}
        {/* Matchup Comparison */}{" "}
        <Card className="border-border bg-card/50">
          {" "}
          <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-4">
            {" "}
            <Trophy className="w-4 h-4 text-primary" />{" "}
            <CardTitle className="text-sm font-semibold uppercase tracking-wider">
              Matchup
            </CardTitle>{" "}
          </CardHeader>{" "}
          <CardContent className="flex flex-col gap-3">
            {" "}
            {data.players.map((player, idx) => (
              <React.Fragment key={player.name}>
                {" "}
                <div
                  className={`flex items-center justify-between p-3 rounded-lg border ${player.isWinner ? "bg-primary/5 border-primary/20" : "bg-transparent border-transparent"}`}
                >
                  {" "}
                  <div className="flex items-center gap-3">
                    {" "}
                    <Avatar className="h-8 w-8 border border-border">
                      {" "}
                      <AvatarImage src={player.avatar} />{" "}
                      <AvatarFallback className="text-[10px]">
                        {player.name[0]}
                      </AvatarFallback>{" "}
                    </Avatar>{" "}
                    <span
                      className={`font-medium ${player.isWinner ? "text-primary" : "text-foreground"}`}
                    >
                      {" "}
                      {player.name}{" "}
                    </span>{" "}
                  </div>{" "}
                  <span className="font-mono text-lg font-bold">
                    {player.time}
                  </span>{" "}
                </div>{" "}
                {idx === 0 && (
                  <div className="flex items-center justify-center gap-4 py-1">
                    {" "}
                    <Separator className="flex-1" />{" "}
                    <span className="text-[10px] font-black text-muted-foreground italic">
                      VS
                    </span>{" "}
                    <Separator className="flex-1" />{" "}
                  </div>
                )}{" "}
              </React.Fragment>
            ))}{" "}
          </CardContent>{" "}
        </Card>{" "}
      </div>{" "}
      {/* Action Buttons */}{" "}
      <div className="flex flex-col sm:flex-row gap-4 mt-12 w-full max-w-md">
        {" "}
        <Button className="flex-1 h-12 gap-2 text-base font-bold uppercase tracking-tight">
          {" "}
          <RotateCcw className="w-4 h-4" /> Rematch{" "}
        </Button>{" "}
        <Button
          variant="outline"
          className="flex-1 h-12 gap-2 text-base font-bold uppercase tracking-tight"
        >
          {" "}
          <Home className="w-4 h-4" /> Return to Lobby{" "}
        </Button>{" "}
      </div>{" "}
    </div>
  );
};
export default MatchResults;
