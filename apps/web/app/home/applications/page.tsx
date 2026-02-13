import { db, profiles } from "@bitwork/db";
import { createServerClient } from "@supabase/ssr";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getApplications } from "@/app/actions/applications";
import { ApplicationsView } from "@/components/dashboard/applications-view";
import { DashboardLayout } from "@/components/dashboard/layout";

export const metadata = {
  title: "Applications | Bitwork",
  description: "Manage your applications",
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

export default async function ApplicationsPage() {
  const user = await getUser();

  if (!user) {
    redirect("/");
  }

  const profile = await getProfile(user.id);
  const isProvider = profile?.role === "provider";

  const userData = {
    id: user.id,
    email: user.email,
    fullName: profile?.fullName,
    avatarUrl: profile?.avatarUrl,
    role: profile?.role,
  };

  // Fetch applications on the server
  const applications = await getApplications(
    user.id,
    isProvider ? "provider" : "seeker"
  );

  return (
    <DashboardLayout user={userData}>
      <ApplicationsView
        initialApplications={applications}
        role={profile?.role}
        userId={user.id}
      />
    </DashboardLayout>
  );
}
