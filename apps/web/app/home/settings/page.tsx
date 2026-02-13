import { db, profiles } from "@bitwork/db";
import { createServerClient } from "@supabase/ssr";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/layout";
import { SettingsView } from "@/components/dashboard/settings-view";

export const metadata = {
  title: "Settings | Bitwork",
  description: "Manage your account settings",
};

async function getUser() {
  const cookieStore = await cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!(supabaseUrl && supabaseKey)) {
    throw new Error("Supabase credentials not configured");
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll() {
        // No-op for server component
      },
    },
  });

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

async function getProfile(userId: string) {
  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, userId));

  return profile;
}

export default async function SettingsPage() {
  const user = await getUser();

  if (!user) {
    redirect("/");
  }

  const profile = await getProfile(user.id);

  const userData = {
    id: user.id,
    email: user.email,
    fullName: profile?.fullName,
    avatarUrl: profile?.avatarUrl,
    role: profile?.role,
  };

  return (
    <DashboardLayout user={userData}>
      <SettingsView user={userData} />
    </DashboardLayout>
  );
}
