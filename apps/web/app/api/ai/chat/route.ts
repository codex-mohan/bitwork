import { groq, LLM_MODEL } from "@bitwork/ai/providers";
import { chatMessages, chatSessions, db } from "@bitwork/db";
import { streamText } from "ai";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const ASSISTANT_SYSTEM_PROMPT = `You are a helpful AI assistant for Bitwork, a job board platform that connects informal workers (like plumbers, electricians, tutors) with households and small businesses in India.

You can help users:
- Search for jobs by keywords, location, category, or budget
- Get details about specific jobs
- Find nearby jobs based on location
- Learn about their profile and preferences
- Save jobs they're interested in
- Apply to jobs they're qualified for

Always be helpful, concise, and friendly. If you don't know something, say so honestly.
`;

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string(),
  metadata: z.any().optional(),
});

const requestSchema = z.object({
  sessionId: z.string().optional(),
  messages: z.array(messageSchema),
  language: z.enum(["en", "hi"]).optional(),
});

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { sessionId, messages, language } = requestSchema.parse(body);

    let currentSessionId: string | undefined = sessionId;
    let systemPrompt = ASSISTANT_SYSTEM_PROMPT;

    if (language === "hi") {
      systemPrompt = `आप Bitwork AI Assistant हैं। कृपया हिंदी में उत्तर दें।\n\n${ASSISTANT_SYSTEM_PROMPT}`;
    }

    if (!currentSessionId) {
      const newSession = await db
        .insert(chatSessions)
        .values({
          userId: user.id,
          title: messages.at(-1)?.content.slice(0, 50) || "New Chat",
        })
        .returning()
        .then((rows) => rows[0]);

      if (newSession) {
        currentSessionId = newSession.id;
      }
    }

    const sessionIdForCallback = currentSessionId;

    const result = streamText({
      model: groq(LLM_MODEL),
      system: systemPrompt,
      messages: messages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      onFinish: async ({ text }) => {
        if (!sessionIdForCallback) {
          return;
        }
        try {
          const lastMessage = messages.at(-1);
          await db.insert(chatMessages).values({
            sessionId: sessionIdForCallback,
            role: "user",
            content: lastMessage?.content || "",
          });

          await db.insert(chatMessages).values({
            sessionId: sessionIdForCallback,
            role: "assistant",
            content: text || "I processed your request.",
          });

          await db
            .update(chatSessions)
            .set({ updatedAt: new Date() })
            .where(eq(chatSessions.id, sessionIdForCallback));
        } catch (error) {
          console.error("Error saving chat history:", error);
        }
      },
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ error: "Invalid request", details: error.issues }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");

    const sessions = await db
      .select()
      .from(chatSessions)
      .where(eq(chatSessions.userId, user.id))
      .orderBy(chatSessions.updatedAt);

    if (sessionId) {
      const messages = await db
        .select()
        .from(chatMessages)
        .where(eq(chatMessages.sessionId, sessionId))
        .orderBy(chatMessages.createdAt);

      return Response.json({
        sessions,
        currentSession: { id: sessionId, messages },
      });
    }

    return Response.json({ sessions });
  } catch (error) {
    console.error("Get chat error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
