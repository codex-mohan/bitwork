"use client";

import { Button } from "@bitwork/ui/components/button";
import { cn } from "@bitwork/ui/lib/utils";
import {
  AlertCircle,
  Loader2,
  Pause,
  Play,
  Square,
  Volume2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";

interface JobReaderProps {
  title: string;
  description: string;
  budget?: string;
  location?: string;
  skills?: string[];
  className?: string;
  compact?: boolean;
  language?: "en" | "hi";
}

export function JobReader({
  title,
  description,
  budget,
  location,
  skills,
  className,
  compact = false,
  language = "en",
}: JobReaderProps) {
  const [state, setState] = useState<"idle" | "loading" | "playing" | "paused">(
    "idle"
  );
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const buildTextContent = (
    t: string,
    d: string,
    b?: string,
    l?: string,
    s?: string[],
    lang?: string
  ) => {
    const parts: string[] = [];

    if (lang === "hi") {
      parts.push(`${t}`);
      if (b) {
        parts.push(`मूल्य: ${b}`);
      }
      if (l) {
        parts.push(`स्थान: ${l}`);
      }
      parts.push(d);
      if (s && s.length > 0) {
        parts.push(`आवश्यक कौशल: ${s.join(", ")}`);
      }
    } else {
      parts.push(`Job Title: ${t}`);
      if (b) {
        parts.push(`Budget: ${b}`);
      }
      if (l) {
        parts.push(`Location: ${l}`);
      }
      parts.push(`Description: ${d}`);
      if (s && s.length > 0) {
        parts.push(`Required Skills: ${s.join(", ")}`);
      }
    }

    return parts.join(". ");
  };

  const handlePlay = useCallback(async () => {
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
    setError(null);

    try {
      const text = buildTextContent(
        title,
        description,
        budget,
        location,
        skills,
        language
      );
      const response = await fetch("/api/ai/synthesize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate audio");
      }

      const data = await response.json();
      const audio = new Audio(data.audio);
      audioRef.current = audio;

      audio.onplay = () => setState("playing");
      audio.onended = () => {
        setState("idle");
        setProgress(0);
      };
      audio.onerror = () => {
        setError("Audio playback failed");
        setState("idle");
      };
      audio.ontimeupdate = () => {
        if (audio.duration) {
          setProgress((audio.currentTime / audio.duration) * 100);
        }
      };

      await audio.play();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate audio");
      setState("idle");
    }
  }, [
    state,
    title,
    description,
    budget,
    location,
    skills,
    language,
    buildTextContent,
  ]);

  const handleStop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setState("idle");
    setProgress(0);
  }, []);

  if (compact) {
    return (
      <Button
        className={cn(
          "shrink-0",
          state === "playing" && "text-primary",
          className
        )}
        disabled={state === "loading"}
        onClick={handlePlay}
        size="icon"
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
    );
  }

  return (
    <div className={cn("rounded-lg border bg-card p-4", className)}>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Volume2 className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium text-sm">
            {language === "hi" ? "नौकरी सुनें" : "Listen to Job"}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            disabled={state === "loading"}
            onClick={handlePlay}
            size="icon"
            variant="ghost"
          >
            {state === "loading" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : state === "playing" ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
          {(state === "playing" || state === "paused") && (
            <Button onClick={handleStop} size="icon" variant="ghost">
              <Square className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          animate={{ width: `${progress}%` }}
          className="h-full bg-primary"
          transition={{ duration: 0.3 }}
        />
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            animate={{ opacity: 1, height: "auto" }}
            className="mt-2 flex items-center gap-2 text-destructive text-xs"
            exit={{ opacity: 0, height: 0 }}
            initial={{ opacity: 0, height: 0 }}
          >
            <AlertCircle className="h-3 w-3" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
