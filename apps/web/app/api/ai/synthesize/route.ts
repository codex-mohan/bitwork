import { createClient } from "@/lib/supabase/server";
import { env } from "@bitwork/db/env";

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
    const { text, voice } = body;

    if (!text) {
      return new Response(JSON.stringify({ error: "Text is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const apiKey = env.OPENAI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "TTS not configured" }), {
        status: 503,
        headers: { "Content-Type": "application/json" },
      });
    }

    const response = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "tts-1",
        input: text,
        voice: voice || "alloy",
      }),
    });

    if (!response.ok) {
      throw new Error("TTS request failed");
    }

    const audioBuffer = await response.arrayBuffer();
    const base64Audio = Buffer.from(audioBuffer).toString("base64");
    const dataUrl = `data:audio/mp3;base64,${base64Audio}`;

    return Response.json({
      audio: dataUrl,
      mediaType: "audio/mp3",
    });
  } catch (error) {
    console.error("Synthesize API error:", error);
    return new Response(JSON.stringify({ error: "Speech synthesis failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
