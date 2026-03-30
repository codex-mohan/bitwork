"use client";

import { Button } from "@bitwork/ui/components/button";
import { cn } from "@bitwork/ui/lib/utils";
import {
  ArrowUp,
  Bot,
  Loader2,
  Maximize2,
  Minimize2,
  SendHorizontal,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useChat } from "@/components/hooks/use-chat";
import { VoiceButton } from "./voice-button";

interface ChatAssistantProps {
  variant?: "floating" | "embedded";
  className?: string;
  language?: "en" | "hi";
}

const SUGGESTIONS = {
  en: [
    "Find plumbing jobs in Mumbai",
    "What jobs are available near me?",
    "Show me tutoring jobs",
    "Help me apply to electrical work",
  ],
  hi: [
    "मुंबई में प्लंबिंग की नौकरियां खोजें",
    "मेरे पास कौन सी नौकरियां हैं?",
    "मुझे ट्यूशन की नौकरियां दिखाएं",
    "इलेक्ट्रिकल वर्क के लिए आवेदन करने में मदद करें",
  ],
};

export function ChatAssistant({
  variant = "floating",
  className,
  language = "en",
}: ChatAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { messages, isLoading, error, sendMessage, stop, clearMessages } =
    useChat({ language });

  const suggestions = language === "hi" ? SUGGESTIONS.hi : SUGGESTIONS.en;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) {
      return;
    }
    await sendMessage(input);
    setInput("");
  };

  const handleVoiceTranscript = async (text: string) => {
    await sendMessage(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (variant === "embedded") {
    return (
      <div className={cn("flex h-full flex-col", className)}>
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold">Bitwork Assistant</h2>
              <p className="text-muted-foreground text-xs">
                AI-powered job discovery
              </p>
            </div>
          </div>
          <Button onClick={clearMessages} size="icon" variant="ghost">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {messages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Bot className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold">
                {language === "hi"
                  ? "मैं आपकी कैसे मदद कर सकता हूं?"
                  : "How can I help you?"}
              </h3>
              <p className="mb-6 text-muted-foreground text-sm">
                {language === "hi"
                  ? "नीचे सुझावों में से चुनें या अपना प्रश्न पूछें"
                  : "Choose from suggestions below or ask your question"}
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {suggestions.map((suggestion) => (
                  <Button
                    className="text-xs"
                    key={suggestion}
                    onClick={() => sendMessage(suggestion)}
                    size="sm"
                    variant="outline"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message) => (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex gap-3",
                message.role === "user" && "flex-row-reverse"
              )}
              initial={{ opacity: 0, y: 10 }}
              key={message.id}
            >
              {message.role === "assistant" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-2",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                <p className="whitespace-pre-wrap text-sm">{message.content}</p>
              </div>
            </motion.div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div className="rounded-2xl bg-muted px-4 py-3">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <form className="border-t p-4" onSubmit={handleSubmit}>
          <div className="flex items-end gap-2">
            <div className="relative flex-1">
              <textarea
                className="w-full resize-none rounded-lg border bg-background px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  language === "hi" ? "संदेश लिखें..." : "Type a message..."
                }
                ref={inputRef}
                rows={1}
                value={input}
              />
              <VoiceButton
                className="absolute right-2 bottom-2"
                onTranscript={handleVoiceTranscript}
                size="sm"
              />
            </div>
            <Button
              disabled={!input.trim() || isLoading}
              size="icon"
              type="submit"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <SendHorizontal className="h-4 w-4" />
              )}
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className={cn(
              "fixed right-4 bottom-24 z-50 flex flex-col overflow-hidden rounded-2xl border bg-background shadow-2xl",
              isExpanded ? "h-[600px] w-full max-w-lg" : "max-h-[500px] w-80",
              className
            )}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between border-b p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold">Bitwork Assistant</h2>
                  <p className="text-muted-foreground text-xs">
                    {language === "hi" ? "AI से बात करें" : "Chat with AI"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  onClick={() => setIsExpanded(!isExpanded)}
                  size="icon"
                  variant="ghost"
                >
                  {isExpanded ? (
                    <Minimize2 className="h-4 w-4" />
                  ) : (
                    <Maximize2 className="h-4 w-4" />
                  )}
                </Button>
                <Link href="/home/assistant">
                  <Button size="icon" variant="ghost">
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                </Link>
                <Button
                  onClick={() => setIsOpen(false)}
                  size="icon"
                  variant="ghost"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              {messages.length === 0 && (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Bot className="h-6 w-6 text-primary" />
                  </div>
                  <p className="mb-4 text-muted-foreground text-sm">
                    {language === "hi"
                      ? "मैं आपके लिए नौकरियां खोज सकता हूं, आवेदन करने में मदद कर सकता हूं, और बहुत कुछ!"
                      : "I can find jobs for you, help with applications, and more!"}
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {suggestions.slice(0, 2).map((suggestion) => (
                      <Button
                        className="text-xs"
                        key={suggestion}
                        onClick={() => sendMessage(suggestion)}
                        size="sm"
                        variant="outline"
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex gap-2",
                    message.role === "user" && "flex-row-reverse"
                  )}
                  initial={{ opacity: 0, y: 10 }}
                  key={message.id}
                >
                  {message.role === "assistant" && (
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Bot className="h-3 w-3 text-primary" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[85%] rounded-xl px-3 py-2 text-sm",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <div className="flex gap-2">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Bot className="h-3 w-3 text-primary" />
                  </div>
                  <div className="rounded-xl bg-muted px-3 py-2">
                    <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <form className="border-t p-3" onSubmit={handleSubmit}>
              <div className="flex items-end gap-2">
                <div className="relative flex-1">
                  <input
                    className="w-full rounded-lg border bg-background px-3 py-2 pr-16 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    disabled={isLoading}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={
                      language === "hi" ? "संदेश..." : "Type a message..."
                    }
                    type="text"
                    value={input}
                  />
                  <div className="absolute right-1 bottom-1">
                    <VoiceButton
                      disabled={isLoading}
                      onTranscript={handleVoiceTranscript}
                      size="sm"
                    />
                  </div>
                </div>
                <Button
                  disabled={!input.trim() || isLoading}
                  size="icon"
                  type="submit"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ArrowUp className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        animate={{ scale: 1 }}
        className="fixed right-4 bottom-4 z-50"
        initial={{ scale: 0 }}
      >
        <Button
          className="h-14 w-14 rounded-full shadow-lg"
          onClick={() => setIsOpen(!isOpen)}
          size="lg"
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Sparkles className="h-6 w-6" />
          )}
        </Button>
      </motion.div>
    </>
  );
}
