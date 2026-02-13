"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@bitwork/ui/components/avatar";
import { Button } from "@bitwork/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@bitwork/ui/components/dropdown-menu";
import { Input } from "@bitwork/ui/components/input";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@bitwork/ui/components/sheet";
import { cn } from "@bitwork/ui/lib/utils";
import {
  Briefcase,
  Home,
  LogOut,
  Menu,
  MessageSquare,
  Search,
  Settings,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { NotificationBell } from "./notification-bell";

interface DashboardLayoutProps {
  children: ReactNode;
  user: {
    id: string;
    email?: string;
    fullName?: string | null;
    avatarUrl?: string | null;
    role?: string | null;
  };
}

const seekerNavItems = [
  { href: "/home", label: "Dashboard", icon: Home },
  { href: "/home/jobs", label: "Browse Jobs", icon: Search },
  { href: "/home/applications", label: "My Applications", icon: Briefcase },
  { href: "/home/saved", label: "Saved Jobs", icon: Briefcase },
];

const providerNavItems = [
  { href: "/home", label: "Dashboard", icon: Home },
  { href: "/home/jobs", label: "My Jobs", icon: Briefcase },
  { href: "/home/applications", label: "Applications", icon: User },
  { href: "/home/analytics", label: "Analytics", icon: Briefcase },
];

export function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const pathname = usePathname();
  const isProvider = user.role === "provider";
  const navItems = isProvider ? providerNavItems : seekerNavItems;

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 border-border border-r bg-card lg:block">
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center border-border border-b px-6">
            <Link className="flex items-center gap-2" href="/home">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground">
                B
              </div>
              <span className="font-heading font-semibold text-xl">
                Bitwork
              </span>
            </Link>
          </div>

          <nav className="flex-1 space-y-1 px-4 py-6">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href || pathname?.startsWith(`${item.href}/`);
              return (
                <Link
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-4 py-3 font-medium text-sm transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                  href={item.href}
                  key={item.href}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-border border-t p-4">
            <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.avatarUrl ?? undefined} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user.fullName?.charAt(0) ?? user.email?.charAt(0) ?? "U"}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-sm">
                  {user.fullName ?? "User"}
                </p>
                <p className="truncate text-muted-foreground text-xs capitalize">
                  {user.role ?? "Member"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col lg:pl-64">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-border border-b bg-card/80 px-4 backdrop-blur-sm lg:px-8">
          <div className="flex items-center gap-4 lg:hidden">
            <Sheet>
              <SheetTrigger render={<Button size="icon" variant="ghost" />}>
                <Menu className="h-5 w-5" />
              </SheetTrigger>
              <SheetContent className="w-64 p-0" side="left">
                <div className="flex h-full flex-col">
                  <div className="flex h-16 items-center border-border border-b px-6">
                    <Link className="flex items-center gap-2" href="/home">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground">
                        B
                      </div>
                      <span className="font-heading font-semibold text-xl">
                        Bitwork
                      </span>
                    </Link>
                  </div>
                  <nav className="flex-1 space-y-1 px-4 py-6">
                    {navItems.map((item) => {
                      const isActive =
                        pathname === item.href ||
                        pathname?.startsWith(`${item.href}/`);
                      return (
                        <Link
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-4 py-3 font-medium text-sm transition-all",
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:bg-muted"
                          )}
                          href={item.href}
                          key={item.href}
                        >
                          <item.icon className="h-5 w-5" />
                          {item.label}
                        </Link>
                      );
                    })}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
            <span className="font-heading font-semibold text-lg lg:hidden">
              Bitwork
            </span>
          </div>

          <div className="hidden max-w-md flex-1 lg:block">
            <div className="relative">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="border-none bg-muted pl-10"
                placeholder="Search jobs..."
                type="search"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-4">
            <NotificationBell userId={user.id} />

            <Button className="relative" size="icon" variant="ghost">
              <MessageSquare className="h-5 w-5" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    className="relative h-9 w-9 rounded-full"
                    variant="ghost"
                  />
                }
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user.avatarUrl ?? undefined} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                    {user.fullName?.charAt(0) ?? user.email?.charAt(0) ?? "U"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center gap-2 p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatarUrl ?? undefined} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {user.fullName?.charAt(0) ?? user.email?.charAt(0) ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <p className="font-medium text-sm">
                      {user.fullName ?? "User"}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {user.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <Link href="/home/profile">
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                </Link>
                <Link href="/home/settings">
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
