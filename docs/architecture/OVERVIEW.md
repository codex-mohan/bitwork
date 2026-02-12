# System Architecture Overview

This document provides a high-level overview of the Bitwork Dashboard architecture, explaining the design decisions, component organization, and data flow patterns.

## 🏛️ Architectural Principles

### 1. **Role-Based Adaptive Design**
The application serves two distinct user types with different needs:
- **Single codebase** with conditional rendering based on user role
- **Shared components** with role-specific configurations
- **Unified data layer** with role-based access control

### 2. **Server-First Rendering**
- **Next.js App Router** for optimal performance
- **Server Components** for static/non-interactive parts
- **Client Components** only where interactivity is required
- **Server Actions** for mutations and data fetching

### 3. **Progressive Enhancement**
- Core functionality works without JavaScript
- Enhanced UX with JavaScript enabled
- Graceful degradation for older browsers

### 4. **Type Safety First**
- Full TypeScript coverage
- Runtime validation with Zod
- Database-level type safety with Drizzle ORM

## 📐 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Layer                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │    Browser   │  │   Next.js    │  │   React      │      │
│  │    (User)    │  │   (App)      │  │   (UI)       │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
└─────────┼─────────────────┼─────────────────┼──────────────┘
          │                 │                 │
          │                 │                 │
          ▼                 ▼                 ▼
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                        │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Next.js App Router                      │   │
│  │  ┌──────────────┐  ┌──────────────┐                 │   │
│  │  │   Server     │  │   Client     │                 │   │
│  │  │ Components   │  │ Components   │                 │   │
│  │  └──────┬───────┘  └──────┬───────┘                 │   │
│  └─────────┼─────────────────┼─────────────────────────┘   │
│            │                 │                              │
│            ▼                 ▼                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Server Actions                          │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │   │
│  │  │     Jobs     │  │ Applications │  │    Auth    │ │   │
│  │  └──────┬───────┘  └──────┬───────┘  └─────┬──────┘ │   │
│  └─────────┼─────────────────┼────────────────┼────────┘   │
└────────────┼─────────────────┼────────────────┼────────────┘
             │                 │                │
             ▼                 ▼                ▼
┌─────────────────────────────────────────────────────────────┐
│                     Data Layer                              │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Database (PostgreSQL)                   │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐  │   │
│  │  │ profiles │ │   jobs   │ │applications│ │notifications│ │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              ORM (Drizzle)                           │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Authentication (Supabase)               │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## 🧩 Component Architecture

### Component Hierarchy

```
RootLayout
└── DashboardProvider (Context)
    └── DashboardLayout
        ├── Sidebar (Navigation)
        │   ├── Logo
        │   ├── NavItems (role-based)
        │   └── UserMenu
        ├── Header
        │   ├── SearchCommand
        │   ├── NotificationBell
        │   └── UserAvatar
        └── MainContent
            └── PageContent (route-specific)
                ├── WelcomeHero
                ├── StatsGrid
                └── ContentArea
                    ├── JobFeed / ApplicationsKanban
                    └── SidebarWidgets
```

### Component Types

#### 1. **Layout Components**
Structural components that define the page layout:
- `DashboardLayout` - Main dashboard shell
- `Sidebar` - Navigation sidebar
- `Header` - Top navigation bar
- `MainContent` - Content wrapper

**Pattern**: Server components with minimal client-side logic

#### 2. **Feature Components**
Domain-specific components implementing business logic:
- `JobCard` - Job listing display
- `StatsCard` - Statistics widgets
- `ApplicationKanban` - Application management board
- `NotificationBell` - Notification dropdown

**Pattern**: Client components with hooks for data fetching

#### 3. **UI Components**
Reusable presentational components from `@bitwork/ui`:
- `Button`, `Card`, `Input`, `Dialog`
- `Tabs`, `Badge`, `Avatar`
- `Skeleton`, `Progress`, `Tooltip`

**Pattern**: Unstyled primitives with Tailwind styling

#### 4. **Utility Components**
Helper components for common patterns:
- `LoadingSkeleton` - Loading states
- `EmptyState` - No results view
- `ErrorBoundary` - Error handling
- `AnimatePresence` - Animation wrappers

## 🔄 Data Flow

### Server Actions Pattern

```typescript
// 1. Server Action Definition
// app/actions/jobs.ts
'use server';

export async function getJobs(filters: JobFilters) {
  // Validate input
  const validated = jobFiltersSchema.parse(filters);
  
  // Fetch from database
  const jobs = await db.query.jobs.findMany({
    where: and(
      eq(jobs.status, 'open'),
      validated.category ? eq(jobs.category, validated.category) : undefined
    ),
    orderBy: desc(jobs.createdAt),
  });
  
  // Return serialized data
  return jobs.map(job => ({
    ...job,
    budget: job.budget?.toString(),
  }));
}
```

### Client Data Fetching Pattern

```typescript
// 2. Custom Hook
// lib/hooks/use-jobs.ts
'use client';

export function useJobs(filters: JobFilters) {
  return useSWR(
    ['jobs', filters],
    () => getJobs(filters),
    {
      refreshInterval: 300000, // 5 minutes
      revalidateOnFocus: false,
    }
  );
}

// 3. Component Usage
// components/dashboard/job-feed.tsx
export function JobFeed() {
  const [filters, setFilters] = useState({});
  const { data: jobs, error, isLoading } = useJobs(filters);
  
  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorMessage error={error} />;
  
  return (
    <div className="grid gap-4">
      {jobs?.map(job => <JobCard key={job.id} job={job} />)}
    </div>
  );
}
```

## 🗄️ Database Architecture

### Schema Design Principles

1. **Normalization**: Tables are normalized to 3NF to reduce redundancy
2. **Relations**: Foreign keys with proper constraints
3. **Indexes**: Strategic indexing for query performance
4. **Soft Deletes**: Using status fields instead of hard deletes
5. **Timestamps**: createdAt and updatedAt on all tables

### Table Relationships

```
profiles (1) ───< (many) jobs
profiles (1) ───< (many) applications
profiles (1) ───< (many) notifications
profiles (1) ───< (many) saved_jobs

jobs (1) ───< (many) applications
jobs (1) ───< (many) saved_jobs

profiles (seeker) (many) >──< (many) profiles (provider) [via messages]
```

### Query Patterns

#### Job Feed Query
```sql
-- Get paginated job feed with filters
SELECT j.*, p.full_name as provider_name
FROM jobs j
JOIN profiles p ON j.provider_id = p.id
WHERE j.status = 'open'
  AND j.category = ANY($1) -- filter categories
  AND j.budget BETWEEN $2 AND $3 -- filter budget
ORDER BY j.created_at DESC
LIMIT $4 OFFSET $5;
```

#### Applications Query
```sql
-- Get applications for a provider with applicant info
SELECT a.*, p.full_name, p.avatar_url
FROM applications a
JOIN profiles p ON a.seeker_id = p.id
WHERE a.job_id = $1
ORDER BY 
  CASE a.status
    WHEN 'pending' THEN 1
    WHEN 'accepted' THEN 2
    WHEN 'rejected' THEN 3
  END,
  a.created_at DESC;
```

## 🔐 Authentication & Authorization

### Authentication Flow

1. **Sign Up/Sign In**: Supabase Auth handles authentication
2. **Session Management**: HTTP-only cookies for security
3. **Role Assignment**: Stored in user metadata and profiles table
4. **Route Protection**: Middleware checks session for protected routes

### Authorization Patterns

```typescript
// Server-side authorization
export async function updateJob(jobId: string, data: JobUpdate) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');
  
  // Check ownership
  const job = await db.query.jobs.findFirst({
    where: eq(jobs.id, jobId),
  });
  
  if (job.providerId !== user.id) {
    throw new Error('Forbidden: Not job owner');
  }
  
  // Proceed with update
  await db.update(jobs).set(data).where(eq(jobs.id, jobId));
}
```

## 🎨 State Management

### Client State (React Context)

```typescript
// contexts/dashboard-context.tsx
interface DashboardState {
  sidebarOpen: boolean;
  activeFilters: JobFilters;
  notifications: Notification[];
}

const DashboardContext = createContext<DashboardState | null>(null);
```

### Server State (SWR)

- Caching strategy: Stale-while-revalidate
- Refresh intervals: 5 minutes for jobs, 1 minute for notifications
- Optimistic updates for mutations

### URL State

- Filters persisted in URL query params
- Shareable filtered views
- Browser history integration

## ⚡ Performance Optimizations

### 1. **Component-Level**
- `React.memo` for expensive renders
- `useMemo` for computed values
- `useCallback` for event handlers
- Code splitting with dynamic imports

### 2. **Data Fetching**
- Server Components for initial data
- SWR for client-side caching
- Pagination for large lists
- Infinite scroll with virtual scrolling (future)

### 3. **Assets**
- Next.js Image optimization
- Font optimization with next/font
- CSS purging with Tailwind

### 4. **Database**
- Indexed columns for filtering
- Query result caching (Redis future)
- Connection pooling

## 🧪 Testing Strategy

### Unit Tests
- Server actions with mocked database
- Utility functions
- Custom hooks

### Integration Tests
- Component interactions
- Data fetching flows
- Form submissions

### E2E Tests
- Critical user journeys
- Authentication flows
- Role-based access

## 📱 Responsive Architecture

### Breakpoint Strategy

```typescript
// Tailwind breakpoints
const breakpoints = {
  sm: '640px',   // Mobile landscape
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px',  // Large desktop
  '2xl': '1536px' // Extra large
};
```

### Layout Adaptations

| Feature | Desktop | Tablet | Mobile |
|---------|---------|--------|--------|
| Sidebar | Fixed, expanded | Collapsible | Hidden, Sheet |
| Job Cards | 3 columns | 2 columns | 1 column |
| Navigation | Sidebar icons + text | Sidebar icons only | Bottom bar |
| Filters | Right sidebar | Collapsible | Full-screen Sheet |
| Search | Header bar | Header bar | Collapsed, expandable |

## 🔧 Development Workflow

### File Organization

```
app/
├── home/                          # Dashboard routes
│   ├── page.tsx                   # Main dashboard
│   ├── layout.tsx                 # Dashboard layout
│   ├── jobs/
│   │   └── page.tsx               # Job feed
│   ├── applications/
│   │   └── page.tsx               # Applications
│   └── ...
├── actions/                       # Server actions
│   ├── jobs.ts
│   ├── applications.ts
│   └── notifications.ts
└── api/                          # API routes (if needed)

components/
├── dashboard/                     # Dashboard-specific
│   ├── layout.tsx
│   ├── sidebar.tsx
│   ├── job-card.tsx
│   └── ...
└── providers/                     # Context providers
    └── dashboard-provider.tsx

lib/
├── hooks/                         # Custom hooks
│   ├── use-jobs.ts
│   ├── use-applications.ts
│   └── ...
└── utils/                         # Utilities
    └── dashboard-utils.ts
```

### Naming Conventions

- **Components**: PascalCase (e.g., `JobCard`, `DashboardLayout`)
- **Hooks**: camelCase with `use` prefix (e.g., `useJobs`, `useNotifications`)
- **Actions**: camelCase (e.g., `getJobs`, `createApplication`)
- **Types**: PascalCase with descriptive names (e.g., `JobFilters`, `ApplicationStatus`)
- **Files**: kebab-case (e.g., `job-card.tsx`, `use-jobs.ts`)

## 🚀 Deployment Architecture

### Infrastructure

```
Vercel (Hosting)
├── Production: bitwork.vercel.app
├── Staging: staging.bitwork.vercel.app
└── Preview: [branch-name].bitwork.vercel.app

Supabase (Backend)
├── Auth: Authentication service
├── Database: PostgreSQL
└── Storage: File uploads (future)
```

### Environment Variables

```env
# Required
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Optional
NEXT_PUBLIC_APP_URL=
REDIS_URL= # For caching (future)
```

## 📚 Related Documentation

- [Database Schema](DATABASE.md) - Detailed database documentation
- [Component Patterns](COMPONENT-ARCHITECTURE.md) - Component implementation details
- [Server Actions](../api/SERVER-ACTIONS.md) - API reference
- [Contributing Guide](../guides/CONTRIBUTING.md) - Development workflow

---

**Last Updated**: February 2025  
**Version**: 1.0.0
