"use client";

import {
  ChevronRight,
  Globe,
  MessageSquare,
  Mic,
  Sparkles,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

interface AssistantTriggerProps {
  className?: string;
}

const _FEATURES = {
  en: [
    {
      icon: MessageSquare,
      title: "Natural Conversation",
      description: "Chat naturally about jobs",
    },
    {
      icon: Globe,
      title: "Hindi & English",
      description: "Communicate in your preferred language",
    },
    {
      icon: Mic,
      title: "Voice Input",
      description: "Speak instead of typing",
    },
  ],
  hi: [
    {
      icon: MessageSquare,
      title: "सहज बातचीत",
      description: "नौकरियों के बारे में आसानी से बात करें",
    },
    {
      icon: Globe,
      title: "हिंदी और अंग्रेजी",
      description: "अपनी पसंदीदा भाषा में संवाद करें",
    },
    {
      icon: Mic,
      title: "आवाज़ इनपुट",
      description: "टाइप करने के बजाय बोलें",
    },
  ],
};

export function AssistantTrigger({ className }: AssistantTriggerProps) {
  return (
    <Link className={className} href="/home/assistant">
      <motion.div
        className="flex items-center gap-3 rounded-xl border bg-card p-3 shadow-sm transition-shadow hover:shadow-md"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Sparkles className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold">AI Assistant</h3>
          <p className="text-muted-foreground text-xs">Find jobs with voice</p>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </motion.div>
    </Link>
  );
}
