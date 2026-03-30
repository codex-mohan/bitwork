"use client";

import { useCallback, useRef, useState } from "react";

export interface UseVoiceRecordingOptions {
  language?: string;
  onTranscriptionComplete?: (text: string) => void;
  onError?: (error: string) => void;
}

export type RecordingState = "idle" | "recording" | "processing";

export function useVoiceRecording(options: UseVoiceRecordingOptions = {}) {
  const [state, setState] = useState<RecordingState>("idle");
  const [duration, setDuration] = useState(0);
  const [transcript, setTranscript] = useState<string>("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        setState("processing");

        try {
          const formData = new FormData();
          formData.append("audio", audioBlob, "recording.webm");
          formData.append("language", options.language || "en");

          const response = await fetch("/api/ai/transcribe", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error("Transcription failed");
          }

          const data = await response.json();
          setTranscript(data.text);
          options.onTranscriptionComplete?.(data.text);
        } catch (err) {
          options.onError?.(
            err instanceof Error ? err.message : "Transcription failed"
          );
        } finally {
          setState("idle");
          stream.getTracks().forEach((track) => track.stop());
        }
      };

      mediaRecorder.start(100);
      setState("recording");
      setDuration(0);

      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      options.onError?.(
        err instanceof Error ? err.message : "Failed to access microphone"
      );
    }
  }, [options]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && state === "recording") {
      mediaRecorderRef.current.stop();
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [state]);

  const cancelRecording = useCallback(() => {
    if (mediaRecorderRef.current && state === "recording") {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setState("idle");
      setDuration(0);
    }
  }, [state]);

  const reset = useCallback(() => {
    setTranscript("");
    setDuration(0);
    setState("idle");
  }, []);

  return {
    state,
    duration,
    transcript,
    startRecording,
    stopRecording,
    cancelRecording,
    reset,
    isRecording: state === "recording",
    isProcessing: state === "processing",
  };
}
