"use server";

import { db, type Notification, notifications } from "@bitwork/db";
import { and, count, desc, eq } from "drizzle-orm";

export async function getNotifications(
  userId: string,
  limit = 20,
  onlyUnread = false
): Promise<Notification[]> {
  const whereConditions = [eq(notifications.userId, userId)];

  if (onlyUnread) {
    whereConditions.push(eq(notifications.isRead, false));
  }

  return await db
    .select()
    .from(notifications)
    .where(and(...whereConditions))
    .orderBy(desc(notifications.createdAt))
    .limit(limit);
}

export async function getUnreadCount(userId: string): Promise<number> {
  const [result] = await db
    .select({ count: count() })
    .from(notifications)
    .where(
      and(eq(notifications.userId, userId), eq(notifications.isRead, false))
    );

  return result?.count ?? 0;
}

export async function markAsRead(
  notificationId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const [notification] = await db
      .select()
      .from(notifications)
      .where(eq(notifications.id, notificationId));

    if (!notification) {
      return { success: false, error: "Notification not found" };
    }

    if (notification.userId !== userId) {
      return { success: false, error: "Unauthorized" };
    }

    await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, notificationId));

    return { success: true };
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update notification",
    };
  }
}

export async function markAllAsRead(
  userId: string
): Promise<{ success: boolean; count: number; error?: string }> {
  try {
    const unreadNotifications = await db
      .select()
      .from(notifications)
      .where(
        and(eq(notifications.userId, userId), eq(notifications.isRead, false))
      );

    if (unreadNotifications.length === 0) {
      return { success: true, count: 0 };
    }

    await db
      .update(notifications)
      .set({ isRead: true })
      .where(
        and(eq(notifications.userId, userId), eq(notifications.isRead, false))
      );

    return { success: true, count: unreadNotifications.length };
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return {
      success: false,
      count: 0,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update notifications",
    };
  }
}

export async function deleteNotification(
  notificationId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const [notification] = await db
      .select()
      .from(notifications)
      .where(eq(notifications.id, notificationId));

    if (!notification) {
      return { success: false, error: "Notification not found" };
    }

    if (notification.userId !== userId) {
      return { success: false, error: "Unauthorized" };
    }

    await db.delete(notifications).where(eq(notifications.id, notificationId));

    return { success: true };
  } catch (error) {
    console.error("Error deleting notification:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to delete notification",
    };
  }
}
