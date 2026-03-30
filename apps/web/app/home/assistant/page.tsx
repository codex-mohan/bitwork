import { db, profiles } from "@bitwork/db";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { ChatAssistant } from "@/components/ai/chat-assistant";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "AI Assistant | Bitwork",
  description: "Get help finding jobs with our AI assistant",
};

export default async function AssistantPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, user.id));

  const language = profile?.availability?.includes("hi") ? "hi" : "en";

  return (
    <div className="container mx-auto h-[calc(100vh-8rem)] py-6">
      <div className="mx-auto h-full max-w-4xl">
        <div className="mb-6">
          <h1 className="font-bold text-3xl tracking-tight">AI Assistant</h1>
          <p className="mt-1 text-muted-foreground">
            {language === "hi"
              ? "AI से बात करके नौकरियां खोजें"
              : "Chat with AI to discover jobs"}
          </p>
        </div>
        <div className="h-[calc(100%-4rem)] overflow-hidden rounded-2xl border bg-background shadow-lg">
          <ChatAssistant language={language} variant="embedded" />
        </div>
      </div>
    </div>
  );
}
