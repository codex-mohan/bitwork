"use client";

import { Button } from "@bitwork/ui/components/button";
import { Card } from "@bitwork/ui/components/card";
import { Input } from "@bitwork/ui/components/input";
import { Label } from "@bitwork/ui/components/label";
import { Switch } from "@bitwork/ui/components/switch";
import {
  Bell,
  Eye,
  Mail,
  Moon,
  Shield,
  Smartphone,
  Trash2,
  User,
} from "lucide-react";
import { Suspense, useState } from "react";
import {
  AnimatedCard,
  FadeInUp,
  PageTransition,
  StaggerContainer,
} from "./animations";

interface SettingsViewProps {
  user: {
    id: string;
    email?: string;
    fullName?: string | null;
    avatarUrl?: string | null;
    role?: string | null;
  };
}

function SettingsSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          className="h-48 animate-pulse rounded-lg bg-muted"
          // biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton elements don't reorder
          key={`skeleton-${i}`}
        />
      ))}
    </div>
  );
}

function SettingsContent({ user }: SettingsViewProps) {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    applications: true,
    messages: true,
    marketing: false,
  });

  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showEmail: false,
    showPhone: false,
  });

  return (
    <StaggerContainer className="space-y-6">
      {/* Account Settings */}
      <AnimatedCard index={0}>
        <Card className="p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Account Information</h3>
              <p className="text-muted-foreground text-sm">
                Manage your account details
              </p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-muted-foreground text-xs">Email</Label>
              <Input className="mt-1" disabled value={user.email} />
              <p className="mt-1 text-muted-foreground text-xs">
                Contact support to change your email
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground text-xs">
                Account Type
              </Label>
              <Input
                className="mt-1 capitalize"
                disabled
                value={user.role ?? "Member"}
              />
            </div>
          </div>
          <div className="mt-4">
            <Button variant="outline">Change Password</Button>
          </div>
        </Card>
      </AnimatedCard>

      {/* Notification Settings */}
      <AnimatedCard index={1}>
        <Card className="p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Notifications</h3>
              <p className="text-muted-foreground text-sm">
                Choose how you want to be notified
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium text-sm">Email Notifications</p>
                  <p className="text-muted-foreground text-xs">
                    Receive updates via email
                  </p>
                </div>
              </div>
              <Switch
                checked={notifications.email}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, email: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium text-sm">Push Notifications</p>
                  <p className="text-muted-foreground text-xs">
                    Receive push notifications on your device
                  </p>
                </div>
              </div>
              <Switch
                checked={notifications.push}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, push: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium text-sm">Application Updates</p>
                  <p className="text-muted-foreground text-xs">
                    Get notified about application status changes
                  </p>
                </div>
              </div>
              <Switch
                checked={notifications.applications}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, applications: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium text-sm">Marketing Emails</p>
                  <p className="text-muted-foreground text-xs">
                    Receive tips and promotional content
                  </p>
                </div>
              </div>
              <Switch
                checked={notifications.marketing}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, marketing: checked })
                }
              />
            </div>
          </div>
        </Card>
      </AnimatedCard>

      {/* Privacy Settings */}
      <AnimatedCard index={2}>
        <Card className="p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Privacy</h3>
              <p className="text-muted-foreground text-sm">
                Control your privacy settings
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium text-sm">Public Profile</p>
                  <p className="text-muted-foreground text-xs">
                    Make your profile visible to others
                  </p>
                </div>
              </div>
              <Switch
                checked={privacy.profileVisible}
                onCheckedChange={(checked) =>
                  setPrivacy({ ...privacy, profileVisible: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium text-sm">Show Email</p>
                  <p className="text-muted-foreground text-xs">
                    Display your email on your profile
                  </p>
                </div>
              </div>
              <Switch
                checked={privacy.showEmail}
                onCheckedChange={(checked) =>
                  setPrivacy({ ...privacy, showEmail: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium text-sm">Show Phone</p>
                  <p className="text-muted-foreground text-xs">
                    Display your phone number on your profile
                  </p>
                </div>
              </div>
              <Switch
                checked={privacy.showPhone}
                onCheckedChange={(checked) =>
                  setPrivacy({ ...privacy, showPhone: checked })
                }
              />
            </div>
          </div>
        </Card>
      </AnimatedCard>

      {/* Appearance Settings */}
      <AnimatedCard index={3}>
        <Card className="p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Moon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Appearance</h3>
              <p className="text-muted-foreground text-sm">
                Customize how the app looks
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Moon className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium text-sm">Dark Mode</p>
                <p className="text-muted-foreground text-xs">
                  Use dark theme for the interface
                </p>
              </div>
            </div>
            <Switch />
          </div>
        </Card>
      </AnimatedCard>

      {/* Danger Zone */}
      <AnimatedCard index={4}>
        <Card className="border-destructive/20 p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-lg bg-destructive/10 p-2">
              <Trash2 className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Danger Zone</h3>
              <p className="text-muted-foreground text-sm">
                Irreversible actions for your account
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button variant="outline">Deactivate Account</Button>
            <Button variant="destructive">Delete Account</Button>
          </div>
        </Card>
      </AnimatedCard>
    </StaggerContainer>
  );
}

export function SettingsView({ user }: SettingsViewProps) {
  return (
    <PageTransition className="space-y-6">
      <FadeInUp>
        <div>
          <h1 className="font-bold text-3xl tracking-tight">Settings</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your account preferences
          </p>
        </div>
      </FadeInUp>

      <Suspense fallback={<SettingsSkeleton />}>
        <SettingsContent user={user} />
      </Suspense>
    </PageTransition>
  );
}
