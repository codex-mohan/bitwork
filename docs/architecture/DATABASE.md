# Database Schema Documentation

Complete documentation of the Bitwork database schema, including tables, relationships, indexes, and query patterns.

## 📊 Schema Overview

The Bitwork database uses **PostgreSQL** with **Drizzle ORM** for type-safe database operations. The schema is designed to support a two-sided marketplace with job postings and applications.

## 🗃️ Tables

### 1. `profiles`

Extended user profile information linked to Supabase Auth.

**Purpose**: Store additional user data beyond authentication

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| `id` | `uuid` | PRIMARY KEY | - | References `auth.users.id` from Supabase |
| `fullName` | `text` | - | NULL | User's full display name |
| `role` | `text` | - | NULL | User role: 'provider' or 'seeker' |
| `location` | `text` | - | NULL | User's city or area |
| `avatarUrl` | `text` | - | NULL | Profile picture URL |
| `phone` | `text` | - | NULL | Contact phone number |
| `bio` | `text` | - | NULL | User bio/description |
| `skills` | `text[]` | - | NULL | Array of skills (for providers) |
| `availability` | `text` | - | NULL | Availability schedule |
| `createdAt` | `timestamp` | NOT NULL | `now()` | Profile creation time |
| `updatedAt` | `timestamp` | NOT NULL | `now()` | Last update time |

**Indexes**:
```sql
CREATE INDEX profiles_role_idx ON profiles(role);
CREATE INDEX profiles_location_idx ON profiles(location);
```

**Relations**:
- One-to-One with `auth.users` (via `id`)
- One-to-Many with `jobs` (as provider)
- One-to-Many with `applications` (as seeker)
- One-to-Many with `notifications`

---

### 2. `jobs`

Job/service postings created by providers.

**Purpose**: Store job listings with all relevant details

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| `id` | `uuid` | PRIMARY KEY | `gen_random_uuid()` | Unique job identifier |
| `providerId` | `uuid` | FOREIGN KEY → profiles.id | NOT NULL | Job poster's profile ID |
| `title` | `text` | NOT NULL | - | Job title |
| `description` | `text` | NOT NULL | - | Detailed job description |
| `category` | `text` | - | NULL | Job category (e.g., 'plumbing', 'tutoring') |
| `budget` | `integer` | - | NULL | Fixed budget amount (INR) |
| `hourlyRate` | `integer` | - | NULL | Hourly rate (if applicable) |
| `state` | `text` | - | NULL | Indian state |
| `city` | `text` | - | NULL | City/area |
| `duration` | `text` | - | NULL | Expected duration |
| `hasTimeline` | `boolean` | - | `false` | Whether job has strict deadline |
| `skills` | `text[]` | - | NULL | Required skills |
| `status` | `text` | NOT NULL | `'open'` | Job status: open, closed, in_progress, completed |
| `viewCount` | `integer` | NOT NULL | `0` | Number of views |
| `createdAt` | `timestamp` | NOT NULL | `now()` | Creation time |
| `updatedAt` | `timestamp` | NOT NULL | `now()` | Last update time |

**Indexes**:
```sql
CREATE INDEX jobs_provider_id_idx ON jobs(provider_id);
CREATE INDEX jobs_status_idx ON jobs(status);
CREATE INDEX jobs_category_idx ON jobs(category);
CREATE INDEX jobs_location_idx ON jobs(state, city);
CREATE INDEX jobs_created_at_idx ON jobs(created_at DESC);
CREATE INDEX jobs_budget_idx ON jobs(budget);
```

**Relations**:
- Many-to-One with `profiles` (provider)
- One-to-Many with `applications`
- One-to-Many with `saved_jobs`

---

### 3. `applications`

Job applications submitted by seekers.

**Purpose**: Track job applications and their status

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| `id` | `uuid` | PRIMARY KEY | `gen_random_uuid()` | Unique application ID |
| `jobId` | `uuid` | FOREIGN KEY → jobs.id | NOT NULL | Job being applied to |
| `seekerId` | `uuid` | FOREIGN KEY → profiles.id | NOT NULL | Applicant's profile ID |
| `coverLetter` | `text` | - | NULL | Application message |
| `proposedRate` | `integer` | - | NULL | Proposed budget/rate |
| `availability` | `text` | - | NULL | When applicant is available |
| `status` | `text` | NOT NULL | `'pending'` | Status: pending, accepted, rejected, withdrawn |
| `createdAt` | `timestamp` | NOT NULL | `now()` | Application time |
| `updatedAt` | `timestamp` | NOT NULL | `now()` | Last status update |

**Indexes**:
```sql
CREATE INDEX applications_job_id_idx ON applications(job_id);
CREATE INDEX applications_seeker_id_idx ON applications(seeker_id);
CREATE INDEX applications_status_idx ON applications(status);
CREATE INDEX applications_created_at_idx ON applications(created_at DESC);
-- Composite index for provider dashboard
CREATE INDEX applications_provider_status_idx ON applications(job_id, status);
```

**Relations**:
- Many-to-One with `jobs`
- Many-to-One with `profiles` (seeker)

**Constraints**:
```sql
-- Prevent duplicate applications
UNIQUE(job_id, seeker_id);
```

---

### 4. `saved_jobs`

Jobs bookmarked by users for later reference.

**Purpose**: Allow users to save interesting jobs

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| `id` | `uuid` | PRIMARY KEY | `gen_random_uuid()` | Unique save ID |
| `userId` | `uuid` | FOREIGN KEY → profiles.id | NOT NULL | User who saved the job |
| `jobId` | `uuid` | FOREIGN KEY → jobs.id | NOT NULL | Saved job ID |
| `createdAt` | `timestamp` | NOT NULL | `now()` | When job was saved |

**Indexes**:
```sql
CREATE INDEX saved_jobs_user_id_idx ON saved_jobs(user_id);
CREATE INDEX saved_jobs_job_id_idx ON saved_jobs(job_id);
```

**Relations**:
- Many-to-One with `profiles` (user)
- Many-to-One with `jobs`

**Constraints**:
```sql
-- Prevent duplicate saves
UNIQUE(user_id, job_id);
```

---

### 5. `notifications`

User notifications for various events.

**Purpose**: Keep users informed about activity

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| `id` | `uuid` | PRIMARY KEY | `gen_random_uuid()` | Unique notification ID |
| `userId` | `uuid` | FOREIGN KEY → profiles.id | NOT NULL | Recipient user ID |
| `type` | `text` | NOT NULL | - | Type: application, message, system, job |
| `title` | `text` | NOT NULL | - | Notification title |
| `message` | `text` | NOT NULL | - | Notification body |
| `relatedJobId` | `uuid` | FOREIGN KEY → jobs.id | NULL | Related job (optional) |
| `relatedApplicationId` | `uuid` | FOREIGN KEY → applications.id | NULL | Related application (optional) |
| `isRead` | `boolean` | NOT NULL | `false` | Read status |
| `createdAt` | `timestamp` | NOT NULL | `now()` | Notification time |

**Indexes**:
```sql
CREATE INDEX notifications_user_id_idx ON notifications(user_id);
CREATE INDEX notifications_is_read_idx ON notifications(is_read);
CREATE INDEX notifications_created_at_idx ON notifications(created_at DESC);
-- Composite for unread count query
CREATE INDEX notifications_user_unread_idx ON notifications(user_id, is_read) WHERE is_read = false;
```

**Relations**:
- Many-to-One with `profiles` (recipient)
- Many-to-One with `jobs` (optional)
- Many-to-One with `applications` (optional)

---

### 6. `messages`

Conversations between users (future feature).

**Purpose**: Enable direct communication

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| `id` | `uuid` | PRIMARY KEY | `gen_random_uuid()` | Message ID |
| `senderId` | `uuid` | FOREIGN KEY → profiles.id | NOT NULL | Message sender |
| `receiverId` | `uuid` | FOREIGN KEY → profiles.id | NOT NULL | Message recipient |
| `jobId` | `uuid` | FOREIGN KEY → jobs.id | NULL | Related job |
| `content` | `text` | NOT NULL | - | Message content |
| `isRead` | `boolean` | NOT NULL | `false` | Read status |
| `createdAt` | `timestamp` | NOT NULL | `now()` | Sent time |

**Indexes**:
```sql
CREATE INDEX messages_sender_id_idx ON messages(sender_id);
CREATE INDEX messages_receiver_id_idx ON messages(receiver_id);
CREATE INDEX messages_conversation_idx ON messages(sender_id, receiver_id, created_at DESC);
```

---

### 7. `user_preferences`

User settings and preferences.

**Purpose**: Store user-configurable settings

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| `userId` | `uuid` | PRIMARY KEY, FOREIGN KEY → profiles.id | - | User ID |
| `emailNotifications` | `boolean` | NOT NULL | `true` | Email notification preference |
| `pushNotifications` | `boolean` | NOT NULL | `true` | Push notification preference |
| `theme` | `text` | - | `'system'` | UI theme: light, dark, system |
| `defaultFilters` | `jsonb` | - | NULL | Saved filter preferences |
| `updatedAt` | `timestamp` | NOT NULL | `now()` | Last update |

---

## 🔗 Entity Relationship Diagram

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   profiles   │         │     jobs     │         │ applications │
├──────────────┤         ├──────────────┤         ├──────────────┤
│ PK id        │◄────────┤ FK providerId│◄────────┤ FK jobId     │
│ fullName     │         │ title        │         │ FK seekerId──┼──►┌──────────────┐
│ role         │         │ description  │         │ coverLetter  │   │   profiles   │
│ location     │         │ budget       │         │ status       │   │   (seeker)   │
│ avatarUrl    │         │ status       │         │ createdAt    │   └──────────────┘
└──────────────┘         └──────────────┘         └──────────────┘
        │                        │                        │
        │                        │                        │
        ▼                        ▼                        ▼
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│notifications │         │  saved_jobs  │         │   messages   │
├──────────────┤         ├──────────────┤         ├──────────────┤
│ PK id        │         │ PK id        │         │ PK id        │
│ FK userId    │         │ FK userId    │         │ FK senderId  │
│ type         │         │ FK jobId     │         │ FK receiverId│
│ title        │         │ createdAt    │         │ FK jobId     │
│ isRead       │         └──────────────┘         │ content      │
└──────────────┘                                  └──────────────┘
```

## 🔍 Common Query Patterns

### Job Feed Query

```typescript
// Get paginated job feed with filters
const jobs = await db.query.jobs.findMany({
  where: and(
    eq(jobs.status, 'open'),
    filters.category ? eq(jobs.category, filters.category) : undefined,
    filters.minBudget ? gte(jobs.budget, filters.minBudget) : undefined,
    filters.maxBudget ? lte(jobs.budget, filters.maxBudget) : undefined,
    filters.city ? eq(jobs.city, filters.city) : undefined
  ),
  orderBy: [desc(jobs.createdAt)],
  limit: pageSize,
  offset: (page - 1) * pageSize,
  with: {
    provider: {
      columns: {
        fullName: true,
        avatarUrl: true,
      }
    }
  }
});
```

### Provider Dashboard Stats

```typescript
// Get statistics for provider dashboard
const stats = await db.transaction(async (tx) => {
  const activeJobs = await tx
    .select({ count: count() })
    .from(jobs)
    .where(and(
      eq(jobs.providerId, userId),
      eq(jobs.status, 'open')
    ));
  
  const totalApplications = await tx
    .select({ count: count() })
    .from(applications)
    .innerJoin(jobs, eq(applications.jobId, jobs.id))
    .where(eq(jobs.providerId, userId));
  
  const newApplications = await tx
    .select({ count: count() })
    .from(applications)
    .innerJoin(jobs, eq(applications.jobId, jobs.id))
    .where(and(
      eq(jobs.providerId, userId),
      eq(applications.status, 'pending')
    ));
  
  return {
    activeJobs: activeJobs[0].count,
    totalApplications: totalApplications[0].count,
    newApplications: newApplications[0].count,
  };
});
```

### Applications with Details

```typescript
// Get applications for a job with seeker details
const jobApplications = await db.query.applications.findMany({
  where: eq(applications.jobId, jobId),
  orderBy: [
    sql`CASE 
      WHEN ${applications.status} = 'pending' THEN 1
      WHEN ${applications.status} = 'accepted' THEN 2
      WHEN ${applications.status} = 'rejected' THEN 3
      ELSE 4
    END`,
    desc(applications.createdAt)
  ],
  with: {
    seeker: {
      columns: {
        fullName: true,
        avatarUrl: true,
        location: true,
      }
    }
  }
});
```

### Saved Jobs for User

```typescript
// Get user's saved jobs with full job details
const savedJobsList = await db
  .select({
    savedJob: savedJobs,
    job: jobs,
    provider: {
      fullName: profiles.fullName,
      avatarUrl: profiles.avatarUrl,
    }
  })
  .from(savedJobs)
  .innerJoin(jobs, eq(savedJobs.jobId, jobs.id))
  .innerJoin(profiles, eq(jobs.providerId, profiles.id))
  .where(eq(savedJobs.userId, userId))
  .orderBy(desc(savedJobs.createdAt));
```

### Unread Notifications Count

```typescript
// Get unread notification count
const unreadCount = await db
  .select({ count: count() })
  .from(notifications)
  .where(and(
    eq(notifications.userId, userId),
    eq(notifications.isRead, false)
  ));
```

## 📝 Schema Migrations

### Migration Script

```typescript
// packages/db/src/migrations/001_initial_schema.ts
import { sql } from 'drizzle-orm';
import { pgTable, uuid, text, timestamp, boolean, integer, jsonb, index, unique } from 'drizzle-orm/pg-core';

export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey().references(() => sql`auth.users(id)`),
  fullName: text('full_name'),
  role: text('role'),
  location: text('location'),
  avatarUrl: text('avatar_url'),
  phone: text('phone'),
  bio: text('bio'),
  skills: text('skills').array(),
  availability: text('availability'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  roleIdx: index('profiles_role_idx').on(table.role),
  locationIdx: index('profiles_location_idx').on(table.location),
}));

// ... other tables
```

### Running Migrations

```bash
# Generate migrations
bun run db:gen

# Push to database
bun run db:push

# Open Drizzle Studio
bun run db:studio
```

## 🔄 Data Seeding

### Development Seed Data

```typescript
// packages/db/src/seed.ts
export async function seed() {
  // Create sample providers
  const providers = await db.insert(profiles).values([
    {
      id: 'provider-1',
      fullName: 'Amit Sharma',
      role: 'provider',
      location: 'Mumbai, Maharashtra',
      skills: ['Plumbing', 'Electrical'],
    },
    // ... more providers
  ]).returning();
  
  // Create sample jobs
  await db.insert(jobs).values([
    {
      title: 'Need help moving furniture',
      description: 'Moving to a new flat...',
      budget: 1500,
      city: 'Mumbai',
      state: 'Maharashtra',
      providerId: providers[0].id,
      category: 'moving',
    },
    // ... more jobs
  ]);
}
```

## 📊 Performance Considerations

### Query Optimization

1. **Use indexes** for all filter columns
2. **Limit result sets** with pagination
3. **Select only needed columns** instead of `*`
4. **Use joins** instead of N+1 queries
5. **Materialized views** for complex aggregations (future)

### Index Strategy

```sql
-- High-cardinality columns (good for indexing)
category, status, provider_id, created_at

-- Composite indexes for common query patterns
CREATE INDEX idx_jobs_provider_status ON jobs(provider_id, status);
CREATE INDEX idx_applications_job_status ON applications(job_id, status);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read) WHERE is_read = false;
```

## 🔐 Security

### Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Jobs: providers can only see/edit their own jobs
CREATE POLICY "Providers can manage their own jobs"
  ON jobs FOR ALL
  USING (provider_id = auth.uid());

-- Jobs: seekers can view all open jobs
CREATE POLICY "Seekers can view open jobs"
  ON jobs FOR SELECT
  USING (status = 'open');

-- Applications: users can only see their own applications
CREATE POLICY "Users can view own applications"
  ON applications FOR SELECT
  USING (seeker_id = auth.uid() OR 
         job_id IN (SELECT id FROM jobs WHERE provider_id = auth.uid()));
```

## 📚 Related Documentation

- [Architecture Overview](OVERVIEW.md) - System architecture
- [Server Actions](../api/SERVER-ACTIONS.md) - Database operations in code
- [Contributing Guide](../guides/CONTRIBUTING.md) - Development workflow

---

**Last Updated**: February 2025  
**Schema Version**: 1.0.0
