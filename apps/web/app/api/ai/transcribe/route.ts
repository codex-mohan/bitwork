import Groq from "groq-sdk";
import { createClient } from "@/lib/supabase/server";
import { env } from "@bitwork/db/env";

let groqClient: Groq | null = null;

function getGroqClient() {
  if (!groqClient) {
    groqClient = new Groq({ apiKey: env.GROQ_API_KEY });
  }
  return groqClient;
}

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

    const formData = await req.formData();
    const audioFile = formData.get("audio") as File | null;
    const language = formData.get("language") as string | null;

    if (!audioFile) {
      return new Response(JSON.stringify({ error: "Audio file is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const audioBuffer = await audioFile.arrayBuffer();
    const audioBase64 = Buffer.from(audioBuffer).toString("base64");

    const transcription = await getGroqClient().audio.transcriptions.create({
      file: `data:audio/webm;base64,${audioBase64}` as unknown as File,
      model: "whisper-large-v3",
      language: language || undefined,
      response_format: "json",
      temperature: 0,
    });

    return Response.json({
      text: transcription.text,
    });
  } catch (error) {
    console.error("Transcribe API error:", error);
    return new Response(JSON.stringify({ error: "Transcription failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
