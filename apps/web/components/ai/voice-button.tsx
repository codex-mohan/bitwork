"use client";

import { Button } from "@bitwork/ui/components/button";
import { cn } from "@bitwork/ui/lib/utils";
import { Loader2, Mic, MicOff } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useVoiceRecording } from "@/components/hooks/use-voice-recording";

interface VoiceButtonProps {
  onTranscript?: (text: string) => void;
  className?: string;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
};

const iconSizes = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

export function VoiceButton({
  onTranscript,
  className,
  size = "md",
  disabled = false,
}: VoiceButtonProps) {
  const {
    state,
    duration,
    startRecording,
    stopRecording,
    cancelRecording,
    isRecording,
    isProcessing,
  } = useVoiceRecording({
    onTranscriptionComplete: (text) => {
      onTranscript?.(text);
    },
  });

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className={cn("relative", className)}>
      <AnimatePresence>
        {isRecording && (
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            className="absolute -top-12 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-destructive/10 px-3 py-1.5 font-mono text-destructive text-xs"
            exit={{ opacity: 0, scale: 0.8 }}
            initial={{ opacity: 0, scale: 0.8 }}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-destructive" />
            </span>
            {formatDuration(duration)}
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        className={cn(
          "rounded-full transition-all duration-300",
          sizeClasses[size],
          isRecording && "animate-pulse",
          disabled && "cursor-not-allowed opacity-50"
        )}
        disabled={disabled || isProcessing}
        onClick={handleClick}
        size="icon"
        variant={isRecording ? "destructive" : "outline"}
      >
        <AnimatePresence mode="wait">
          {isProcessing ? (
            <motion.div
              animate={{ opacity: 1, rotate: 360 }}
              exit={{ opacity: 0 }}
              initial={{ opacity: 0, rotate: 0 }}
              key="loading"
              transition={{
                duration: 1,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            >
              <Loader2 className={cn(iconSizes[size], "animate-spin")} />
            </motion.div>
          ) : isRecording ? (
            <motion.div
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              initial={{ scale: 0.8 }}
              key="mic-off"
            >
              <MicOff className={iconSizes[size]} />
            </motion.div>
          ) : (
            <motion.div
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              initial={{ scale: 0.8 }}
              key="mic"
            >
              <Mic className={iconSizes[size]} />
            </motion.div>
          )}
        </AnimatePresence>
      </Button>

      {isRecording && (
        <Button
          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
          onClick={cancelRecording}
          size="sm"
          variant="ghost"
        >
          <span className="sr-only">Cancel</span>
          <div className="h-3 w-0.5 rotate-45 bg-foreground" />
        </Button>
      )}
    </div>
  );
}
