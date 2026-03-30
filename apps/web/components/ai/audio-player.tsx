"use client";

import { Button } from "@bitwork/ui/components/button";
import { cn } from "@bitwork/ui/lib/utils";
import { Loader2, Pause, Square, Volume2 } from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";

interface AudioPlayerProps {
  text: string;
  className?: string;
  compact?: boolean;
  language?: "en" | "hi";
}

export function AudioPlayer({
  text,
  className,
  compact = false,
}: AudioPlayerProps) {
  const [state, setState] = useState<"idle" | "loading" | "playing" | "paused">(
    "idle"
  );
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlay = async () => {
    if (state === "playing") {
      audioRef.current?.pause();
      setState("paused");
      return;
    }

    if (state === "paused" && audioRef.current) {
      await audioRef.current.play();
      setState("playing");
      return;
    }

    setState("loading");

    try {
      const response = await fetch("/api/ai/synthesize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error("Failed to synthesize");
      }

      const data = await response.json();
      const audio = new Audio(data.audio);
      audioRef.current = audio;

      audio.onplay = () => setState("playing");
      audio.onended = () => {
        setState("idle");
        setProgress(0);
      };
      audio.ontimeupdate = () => {
        if (audio.duration) {
          setProgress((audio.currentTime / audio.duration) * 100);
        }
      };

      await audio.play();
    } catch (error) {
      console.error("Playback error:", error);
      setState("idle");
    }
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setState("idle");
    setProgress(0);
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button
        className={cn(
          "shrink-0 rounded-full",
          state === "playing" && "text-primary"
        )}
        disabled={state === "loading"}
        onClick={handlePlay}
        size={compact ? "icon" : "sm"}
        variant="ghost"
      >
        {state === "loading" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : state === "playing" ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Volume2 className="h-4 w-4" />
        )}
      </Button>

      {!compact && (
        <div className="flex-1">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <motion.div
              animate={{ width: `${progress}%` }}
              className="h-full bg-primary"
              initial={{ width: 0 }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}

      {!compact && (state === "playing" || state === "paused") && (
        <Button
          className="h-8 w-8 shrink-0"
          onClick={handleStop}
          size="icon"
          variant="ghost"
        >
          <Square className="h-3 w-3 fill-current" />
        </Button>
      )}
    </div>
  );
}
