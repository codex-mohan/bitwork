import { createGroq } from "@ai-sdk/groq";
import { env } from "@bitwork/db/env";

let groqInstance: ReturnType<typeof createGroq> | null = null;

export function getGroq() {
  if (!groqInstance) {
    if (!env.GROQ_API_KEY) {
      throw new Error(
        "GROQ_API_KEY is not set. Please add it to your environment variables."
      );
    }
    groqInstance = createGroq({
      apiKey: env.GROQ_API_KEY,
    });
  }
  return groqInstance;
}

export function groq(model: string) {
  return getGroq()(model);
}

export function createGroqProvider() {
  return getGroq();
}

export const LLM_MODEL = "llama-3.3-70b-versatile";
export const FAST_MODEL = "llama-3.1-8b-instant";
export const WHISPER_MODEL = "whisper-large-v3";
