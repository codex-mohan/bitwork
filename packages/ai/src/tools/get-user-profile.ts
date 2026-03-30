import { db, profiles } from "@bitwork/db";
import { eq } from "drizzle-orm";
import type { GetUserProfileParams, UserProfileResult } from "./types";

export async function getUserProfile(
  params: GetUserProfileParams,
  userId?: string
): Promise<UserProfileResult | null> {
  const targetUserId = params.userId ?? userId;

  if (!targetUserId) {
    return null;
  }

  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, targetUserId));

  if (!profile) {
    return null;
  }

  return {
    id: profile.id,
    fullName: profile.fullName,
    role: profile.role,
    location: profile.location,
    avatarUrl: profile.avatarUrl,
    bio: profile.bio,
    skills: profile.skills,
    availability: profile.availability,
  };
}
