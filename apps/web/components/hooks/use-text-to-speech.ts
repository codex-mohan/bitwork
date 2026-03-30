"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface UseTextToSpeechOptions {
  voice?: string;
  speed?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
}

export type TTSState = "idle" | "loading" | "playing" | "paused";

export function useTextToSpeech(options: UseTextToSpeechOptions = {}) {
  const [state, setState] = useState<TTSState>("idle");
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTextRef = useRef<string>("");

  const speak = useCallback(
    async (text: string) => {
      if (!text.trim()) {
        return;
      }

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      setState("loading");
      currentTextRef.current = text;

      try {
        const response = await fetch("/api/ai/synthesize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text,
            voice: options.voice || "alloy",
            speed: options.speed || 1.0,
          }),
        });

        if (!response.ok) {
          throw new Error("Speech synthesis failed");
        }

        const data = await response.json();
        const audio = new Audio(data.audio);
        audioRef.current = audio;

        audio.onplay = () => {
          setState("playing");
          options.onStart?.();
        };

        audio.onended = () => {
          setState("idle");
          setProgress(100);
          options.onEnd?.();
        };

        audio.onerror = () => {
          setState("idle");
          options.onError?.("Audio playback failed");
        };

        audio.ontimeupdate = () => {
          if (audio.duration) {
            setProgress((audio.currentTime / audio.duration) * 100);
          }
        };

        await audio.play();
      } catch (err) {
        setState("idle");
        options.onError?.(
          err instanceof Error ? err.message : "Speech synthesis failed"
        );
      }
    },
    [options]
  );

  const pause = useCallback(() => {
    if (audioRef.current && state === "playing") {
      audioRef.current.pause();
      setState("paused");
    }
  }, [state]);

  const resume = useCallback(() => {
    if (audioRef.current && state === "paused") {
      audioRef.current.play();
      setState("playing");
    }
  }, [state]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setState("idle");
    setProgress(0);
  }, []);

  const toggle = useCallback(() => {
    if (state === "playing") {
      pause();
    } else if (state === "paused") {
      resume();
    }
  }, [state, pause, resume]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  return {
    state,
    progress,
    speak,
    pause,
    resume,
    stop,
    toggle,
    isLoading: state === "loading",
    isPlaying: state === "playing",
    isPaused: state === "paused",
    isIdle: state === "idle",
  };
}
