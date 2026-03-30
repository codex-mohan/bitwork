"use client";

import { useCallback, useRef, useState } from "react";

export interface UseChatOptions {
  sessionId?: string;
  language?: "en" | "hi";
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt?: Date;
}

export function useChat(options: UseChatOptions = {}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessionId, setSessionId] = useState<string | undefined>(
    options.sessionId
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) {
        return;
      }

      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: content.trim(),
        createdAt: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);

      try {
        abortControllerRef.current = new AbortController();

        const response = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            messages: [...messages, userMessage],
            language: options.language,
          }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to send message");
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error("No response body");
        }

        const decoder = new TextDecoder();
        let assistantMessage = "";
        const currentMessageId = crypto.randomUUID();

        setMessages((prev) => [
          ...prev,
          {
            id: currentMessageId,
            role: "assistant",
            content: "",
            createdAt: new Date(),
          },
        ]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }

          const chunk = decoder.decode(value);
          assistantMessage += chunk;

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === currentMessageId
                ? { ...msg, content: assistantMessage }
                : msg
            )
          );
        }

        if (response.headers.get("X-Session-Id")) {
          setSessionId(response.headers.get("X-Session-Id") || undefined);
        }
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          setError("Request cancelled");
        } else {
          setError(
            err instanceof Error ? err.message : "Failed to send message"
          );
        }
        setMessages((prev) => prev.slice(0, -1));
      } finally {
        setIsLoading(false);
      }
    },
    [messages, sessionId, isLoading, options.language]
  );

  const stop = useCallback(() => {
    abortControllerRef.current?.abort();
    setIsLoading(false);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setSessionId(undefined);
  }, []);

  const loadSession = useCallback(async (targetSessionId: string) => {
    try {
      const response = await fetch(`/api/ai/chat?sessionId=${targetSessionId}`);
      if (!response.ok) {
        throw new Error("Failed to load session");
      }

      const data = await response.json();
      setMessages(data.currentSession?.messages || []);
      setSessionId(targetSessionId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load session");
    }
  }, []);

  return {
    messages,
    sessionId,
    isLoading,
    error,
    sendMessage,
    stop,
    clearMessages,
    loadSession,
  };
}
