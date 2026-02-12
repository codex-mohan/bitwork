"use client";

import type { Notification } from "@bitwork/db";
import { Button } from "@bitwork/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@bitwork/ui/components/dropdown-menu";
import { ScrollArea } from "@bitwork/ui/components/scroll-area";
import { cn } from "@bitwork/ui/lib/utils";

// Date formatting utility - simple relative time
function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) {
    return "just now";
  }
  if (diffMins < 60) {
    return `${diffMins}m ago`;
  }
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }
  if (diffDays < 7) {
    return `${diffDays}d ago`;
  }
  return new Date(date).toLocaleDateString();
}

import { Bell, CheckCheck } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getNotifications,
  getUnreadCount,
  markAllAsRead,
  markAsRead,
} from "@/app/actions/notifications";

interface NotificationBellProps {
  userId: string;
}

export function NotificationBell({ userId }: NotificationBellProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      const [notifs, count] = await Promise.all([
        getNotifications(userId, 10, false),
        getUnreadCount(userId),
      ]);
      setNotifications(notifs);
      setUnreadCount(count);
    };

    fetchNotifications();

    const interval = setInterval(fetchNotifications, 30_000);

    return () => clearInterval(interval);
  }, [userId]);

  const handleMarkAsRead = async (notificationId: string) => {
    const result = await markAsRead(notificationId, userId);
    if (result.success) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  };

  const handleMarkAllAsRead = async () => {
    const result = await markAllAsRead(userId);
    if (result.success) {
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    }
  };

  const getNotificationLink = (notification: Notification) => {
    if (notification.relatedJobId) {
      return `/home/jobs/${notification.relatedJobId}`;
    }
    return "/home/notifications";
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "application":
        return "📋";
      case "message":
        return "💬";
      case "job":
        return "💼";
      default:
        return "🔔";
    }
  };

  return (
    <DropdownMenu onOpenChange={setIsOpen} open={isOpen}>
      <DropdownMenuTrigger>
        <Button className="relative" size="icon" variant="ghost">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="zoom-in-50 absolute -top-1 -right-1 flex h-5 w-5 animate-in items-center justify-center rounded-full bg-destructive font-bold text-destructive-foreground text-xs duration-200">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              className="h-auto px-2 py-1 text-xs"
              onClick={handleMarkAllAsRead}
              size="sm"
              variant="ghost"
            >
              <CheckCheck className="mr-1 h-3 w-3" />
              Mark all read
            </Button>
          )}
        </div>
        <ScrollArea className="h-[300px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Bell className="mb-2 h-8 w-8 text-muted-foreground" />
              <p className="text-muted-foreground text-sm">
                No notifications yet
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <DropdownMenuItem
                  className={cn(
                    "flex cursor-pointer items-start gap-3 p-4",
                    !notification.isRead && "bg-muted/50"
                  )}
                  key={notification.id}
                  onClick={() =>
                    !notification.isRead && handleMarkAsRead(notification.id)
                  }
                >
                  <Link
                    className="flex flex-1 items-start gap-3"
                    href={getNotificationLink(notification)}
                  >
                    <span className="text-xl">
                      {getNotificationIcon(notification.type)}
                    </span>
                    <div className="flex-1 space-y-1">
                      <p
                        className={cn(
                          "font-medium text-sm",
                          !notification.isRead && "font-semibold"
                        )}
                      >
                        {notification.title}
                      </p>
                      <p className="line-clamp-2 text-muted-foreground text-xs">
                        {notification.message}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {formatRelativeTime(notification.createdAt)}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <div className="mt-1.5 h-2 w-2 rounded-full bg-primary" />
                    )}
                  </Link>
                </DropdownMenuItem>
              ))}
            </div>
          )}
        </ScrollArea>
        <DropdownMenuSeparator />
        <Link
          className="cursor-pointer justify-center font-medium text-sm"
          href="/home/notifications"
        >
          <DropdownMenuItem>View all notifications</DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
