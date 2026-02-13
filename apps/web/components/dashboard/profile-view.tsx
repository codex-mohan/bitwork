"use client";

import type { profiles } from "@bitwork/db";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@bitwork/ui/components/avatar";
import { Badge } from "@bitwork/ui/components/badge";
import { Button } from "@bitwork/ui/components/button";
import { Card } from "@bitwork/ui/components/card";
import { Input } from "@bitwork/ui/components/input";
import { Label } from "@bitwork/ui/components/label";
import { Textarea } from "@bitwork/ui/components/textarea";
import { Camera, Check, Edit2, MapPin, Save, User, X } from "lucide-react";
import { Suspense, useState } from "react";
import {
  AnimatedCard,
  FadeInUp,
  PageTransition,
  StaggerContainer,
} from "./animations";

interface ProfileViewProps {
  user: {
    id: string;
    email?: string;
    fullName?: string | null;
    avatarUrl?: string | null;
    role?: string | null;
  };
  profile: typeof profiles.$inferSelect | undefined;
}

interface FormData {
  fullName: string;
  bio: string;
  location: string;
  phone: string;
  skills: string[];
  availability: string;
}

function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-48 animate-pulse rounded-lg bg-muted" />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="h-96 animate-pulse rounded-lg bg-muted" />
        <div className="h-96 animate-pulse rounded-lg bg-muted lg:col-span-2" />
      </div>
    </div>
  );
}

function calculateCompletion(
  profile: typeof profiles.$inferSelect | undefined
): number {
  if (!profile) {
    return 0;
  }

  const fields = [
    profile.fullName,
    profile.bio,
    profile.location,
    profile.phone,
    profile.skills && profile.skills.length > 0,
    profile.availability,
  ];

  const completed = fields.filter(Boolean).length;
  return Math.round((completed / fields.length) * 100);
}

function CompletionItem({
  label,
  isComplete,
}: {
  label: string;
  isComplete: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex h-5 w-5 items-center justify-center rounded-full ${
          isComplete ? "bg-primary" : "bg-muted"
        }`}
      >
        {isComplete && <Check className="h-3 w-3 text-primary-foreground" />}
      </div>
      <span
        className={isComplete ? "text-sm" : "text-muted-foreground text-sm"}
      >
        {label}
      </span>
    </div>
  );
}

interface ProfileHeaderProps {
  user: ProfileViewProps["user"];
  profile: ProfileViewProps["profile"];
  isEditing: boolean;
  onSave: () => void;
  onCancel: () => void;
  onEdit: () => void;
}

function ProfileHeader({
  user,
  profile,
  isEditing,
  onSave,
  onCancel,
  onEdit,
}: ProfileHeaderProps) {
  return (
    <AnimatedCard index={0}>
      <Card className="overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-accent/20" />
        <div className="relative px-6 pb-6">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end">
            <div className="relative -mt-16">
              <Avatar className="h-28 w-28 border-4 border-card shadow-lg">
                <AvatarImage src={profile?.avatarUrl ?? undefined} />
                <AvatarFallback className="bg-primary text-2xl text-primary-foreground">
                  {profile?.fullName?.charAt(0) ?? user.email?.charAt(0) ?? "U"}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button
                  className="absolute -right-1 -bottom-1 rounded-full"
                  size="icon"
                  variant="secondary"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="flex-1 pt-4 sm:pt-0">
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-2xl">
                  {profile?.fullName ?? "User"}
                </h2>
                <Badge className="capitalize" variant="secondary">
                  {profile?.role ?? "Member"}
                </Badge>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-muted-foreground text-sm">
                {profile?.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {profile.location}
                  </span>
                )}
                {user.email && (
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {user.email}
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button onClick={onSave}>
                    <Save className="mr-2 h-4 w-4" />
                    Save
                  </Button>
                  <Button onClick={onCancel} variant="outline">
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                </>
              ) : (
                <Button onClick={onEdit} variant="outline">
                  <Edit2 className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </AnimatedCard>
  );
}

interface ContactInfoProps {
  email?: string;
  phone: string;
  location: string;
  isEditing: boolean;
  onPhoneChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  profilePhone?: string | null;
  profileLocation?: string | null;
}

function ContactInfo({
  email,
  phone,
  location,
  isEditing,
  onPhoneChange,
  onLocationChange,
  profilePhone,
  profileLocation,
}: ContactInfoProps) {
  return (
    <AnimatedCard index={1}>
      <Card className="p-6">
        <h3 className="mb-4 font-semibold">Contact Information</h3>
        <div className="space-y-4">
          <div>
            <Label className="text-muted-foreground text-xs">Email</Label>
            <p className="mt-1 font-medium text-sm">{email}</p>
          </div>
          <div>
            <Label className="text-muted-foreground text-xs">Phone</Label>
            {isEditing ? (
              <Input
                className="mt-1"
                onChange={(e) => onPhoneChange(e.target.value)}
                placeholder="Add phone number"
                value={phone}
              />
            ) : (
              <p className="mt-1 font-medium text-sm">
                {profilePhone ?? "Not provided"}
              </p>
            )}
          </div>
          <div>
            <Label className="text-muted-foreground text-xs">Location</Label>
            {isEditing ? (
              <Input
                className="mt-1"
                onChange={(e) => onLocationChange(e.target.value)}
                placeholder="Add location"
                value={location}
              />
            ) : (
              <p className="mt-1 font-medium text-sm">
                {profileLocation ?? "Not provided"}
              </p>
            )}
          </div>
        </div>
      </Card>
    </AnimatedCard>
  );
}

interface SkillsSectionProps {
  skills: string[];
  isEditing: boolean;
  onSkillsChange: (value: string[]) => void;
  profileSkills?: string[] | null;
}

function SkillsSection({
  skills,
  isEditing,
  onSkillsChange,
  profileSkills,
}: SkillsSectionProps) {
  return (
    <AnimatedCard index={2}>
      <Card className="p-6">
        <h3 className="mb-4 font-semibold">Skills</h3>
        {isEditing ? (
          <Input
            onChange={(e) =>
              onSkillsChange(e.target.value.split(",").map((s) => s.trim()))
            }
            placeholder="Enter skills separated by commas"
            value={skills?.join(", ") ?? ""}
          />
        ) : (
          <div className="flex flex-wrap gap-2">
            {profileSkills && profileSkills.length > 0 ? (
              profileSkills.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">
                No skills added yet
              </p>
            )}
          </div>
        )}
      </Card>
    </AnimatedCard>
  );
}

interface AvailabilitySectionProps {
  availability: string;
  isEditing: boolean;
  onAvailabilityChange: (value: string) => void;
  profileAvailability?: string | null;
}

function AvailabilitySection({
  availability,
  isEditing,
  onAvailabilityChange,
  profileAvailability,
}: AvailabilitySectionProps) {
  return (
    <AnimatedCard index={3}>
      <Card className="p-6">
        <h3 className="mb-4 font-semibold">Availability</h3>
        {isEditing ? (
          <Input
            onChange={(e) => onAvailabilityChange(e.target.value)}
            placeholder="e.g., Weekdays, Weekends, Flexible"
            value={availability}
          />
        ) : (
          <p className="text-muted-foreground text-sm">
            {profileAvailability ?? "Not specified"}
          </p>
        )}
      </Card>
    </AnimatedCard>
  );
}

interface AboutSectionProps {
  bio: string;
  isEditing: boolean;
  onBioChange: (value: string) => void;
  profileBio?: string | null;
}

function AboutSection({
  bio,
  isEditing,
  onBioChange,
  profileBio,
}: AboutSectionProps) {
  return (
    <AnimatedCard index={1}>
      <Card className="p-6">
        <h3 className="mb-4 font-semibold">About</h3>
        {isEditing ? (
          <Textarea
            className="min-h-32"
            onChange={(e) => onBioChange(e.target.value)}
            placeholder="Tell us about yourself..."
            value={bio}
          />
        ) : (
          <p className="whitespace-pre-line text-muted-foreground">
            {profileBio ??
              "No bio provided yet. Click 'Edit Profile' to add one."}
          </p>
        )}
      </Card>
    </AnimatedCard>
  );
}

interface ProfileCompletionProps {
  profile: ProfileViewProps["profile"];
}

function ProfileCompletion({ profile }: ProfileCompletionProps) {
  return (
    <AnimatedCard index={2}>
      <Card className="p-6">
        <h3 className="mb-4 font-semibold">Profile Completion</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">
              Complete your profile to get better matches
            </span>
            <span className="font-medium text-sm">
              {calculateCompletion(profile)}%
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${calculateCompletion(profile)}%` }}
            />
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <CompletionItem
              isComplete={!!profile?.fullName}
              label="Full name"
            />
            <CompletionItem isComplete={!!profile?.bio} label="Bio" />
            <CompletionItem isComplete={!!profile?.location} label="Location" />
            <CompletionItem
              isComplete={!!profile?.phone}
              label="Phone number"
            />
            <CompletionItem
              isComplete={!!(profile?.skills && profile.skills.length > 0)}
              label="Skills"
            />
            <CompletionItem
              isComplete={!!profile?.availability}
              label="Availability"
            />
          </div>
        </div>
      </Card>
    </AnimatedCard>
  );
}

function ProfileContent({ user, profile }: ProfileViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: profile?.fullName ?? "",
    bio: profile?.bio ?? "",
    location: profile?.location ?? "",
    phone: profile?.phone ?? "",
    skills: profile?.skills ?? [],
    availability: profile?.availability ?? "",
  });

  const handleSave = () => {
    // In a real app, this would save to the database
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      fullName: profile?.fullName ?? "",
      bio: profile?.bio ?? "",
      location: profile?.location ?? "",
      phone: profile?.phone ?? "",
      skills: profile?.skills ?? [],
      availability: profile?.availability ?? "",
    });
    setIsEditing(false);
  };

  const updateFormData = (key: keyof FormData, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <StaggerContainer className="space-y-6">
      <ProfileHeader
        isEditing={isEditing}
        onCancel={handleCancel}
        onEdit={() => setIsEditing(true)}
        onSave={handleSave}
        profile={profile}
        user={user}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6">
          <ContactInfo
            email={user.email}
            isEditing={isEditing}
            location={formData.location}
            onLocationChange={(v) => updateFormData("location", v)}
            onPhoneChange={(v) => updateFormData("phone", v)}
            phone={formData.phone}
            profileLocation={profile?.location}
            profilePhone={profile?.phone}
          />

          <SkillsSection
            isEditing={isEditing}
            onSkillsChange={(v) => updateFormData("skills", v)}
            profileSkills={profile?.skills}
            skills={formData.skills}
          />

          <AvailabilitySection
            availability={formData.availability}
            isEditing={isEditing}
            onAvailabilityChange={(v) => updateFormData("availability", v)}
            profileAvailability={profile?.availability}
          />
        </div>

        <div className="space-y-6 lg:col-span-2">
          <AboutSection
            bio={formData.bio}
            isEditing={isEditing}
            onBioChange={(v) => updateFormData("bio", v)}
            profileBio={profile?.bio}
          />

          <ProfileCompletion profile={profile} />
        </div>
      </div>
    </StaggerContainer>
  );
}

export function ProfileView({ user, profile }: ProfileViewProps) {
  return (
    <PageTransition className="space-y-6">
      <FadeInUp>
        <div>
          <h1 className="font-bold text-3xl tracking-tight">Profile</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your personal information
          </p>
        </div>
      </FadeInUp>

      <Suspense fallback={<ProfileSkeleton />}>
        <ProfileContent profile={profile} user={user} />
      </Suspense>
    </PageTransition>
  );
}
