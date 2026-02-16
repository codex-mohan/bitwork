# Technical Documentation

Comprehensive technical reference for developers working with the Bitwork codebase.

---

## Architecture

```
bitwork/
|-- apps/
|   `-- web/                    # Next.js 16 web application
|       |-- app/               # Next.js app router
|       |-- components/        # Application-specific components
|       |-- lib/              # Utilities and helpers
|       `-- public/           # Static assets
|-- packages/
|   |-- ui/                   # Shared UI component library
|   |   |-- src/components/   # Reusable UI components (40+)
|   |   |-- src/hooks/       # Custom React hooks
|   |   `-- src/lib/         # Utilities and styling
|   |-- db/                   # Database package with Drizzle ORM
|   |   |-- src/schema.ts    # Database schema definitions
|   |   `-- src/index.ts     # Database exports
|   `-- configs/             # Shared configuration files
|-- scripts/                  # Build and setup scripts
|-- turbo.json               # Turborepo configuration
`-- bun.lockb               # Bun lockfile
```

---

## Technology Stack

### Core Technologies

| Category | Technologies |
|----------|-------------|
| **Framework** | Next.js 16.1 |
| **UI Library** | React 19 |
| **Language** | TypeScript 5.9 |
| **Styling** | Tailwind CSS v4 |
| **Runtime** | Bun 1.3 |

### Monorepo & Tooling

| Tool | Purpose | Version |
|------|---------|---------|
| **Turborepo** | Monorepo task runner | 2.8.9 |
| **Biome** | Linting & formatting | 2.3.14 |
| **Ultracite** | Zero-config code quality | 7.2.2 |
| **Lefthook** | Git hooks | 2.1.1 |

### Database & Backend

| Technology | Purpose |
|-----------|---------|
| **Drizzle ORM** | Type-safe SQL ORM |
| **Drizzle Kit** | Database migrations & studio |
| **Zod** | Schema validation |
| **@t3-oss/env-core** | Environment validation |

---

## UI Components

The `@bitwork/ui` package includes 40+ reusable UI components:

### Form Controls
Button, Input, Textarea, Select, Checkbox, Radio Group, Switch, Slider

### Overlays
Dialog, Drawer, Sheet, Popover, Tooltip, Hover Card, Alert Dialog

### Navigation
Tabs, Breadcrumb, Pagination, Navigation Menu, Command, Menubar

### Data Display
Table, Card, Badge, Avatar, Accordion, Collapsible, Calendar

### Feedback
Alert, Progress, Skeleton, Spinner, Sonner (toasts)

### Layout
Separator, Resizable Panels, Scroll Area, Sidebar

### Advanced
Carousel, Chart (Recharts), Data Table

### Additional Dependencies

- **Base UI** - Unstyled, accessible components
- **Lenis** - Smooth scrolling
- **Lucide React** - Icon library
- **Next Themes** - Dark/light mode
- **Vaul** - Drawer component
- **Recharts** - Data visualization
- **Embla Carousel** - Carousel functionality

---

## Project Structure Details

### Apps

#### `@bitwork/web` - Main Web Application

The primary Next.js 16 application featuring:

- **Landing Page**: Hero section, features, testimonials, workflow, CTA
- **Authentication**: Login/signup with modern auth forms
- **Job Management**: Post jobs, view listings, apply to positions
- **Dashboard**: Application tracking and management
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Smooth Animations**: Lenis smooth scrolling and transition effects

### Packages

#### `@bitwork/ui` - Shared UI Library

A comprehensive component library with:

- 40+ reusable UI components
- Consistent theming with Tailwind CSS v4
- Full TypeScript support
- Accessibility-first design
- Dark mode support via next-themes

**Usage Example:**

```tsx
import { Button } from '@bitwork/ui/components/button';
import { Card } from '@bitwork/ui/components/card';

export default function MyComponent() {
  return (
    <Card>
      <Button>Click me</Button>
    </Card>
  );
}
```

#### `@bitwork/db` - Database Package

Type-safe database operations with Drizzle ORM:

- Schema definitions with TypeScript
- Environment validation with Zod
- Migration management
- Drizzle Studio for database inspection

**Usage Example:**

```typescript
import { db } from '@bitwork/db';
import { users } from '@bitwork/db/schema';

const allUsers = await db.select().from(users);
```

#### `@bitwork/configs` - Shared Configurations

Centralized configuration files for:

- TypeScript configurations
- Tailwind configurations
- Build settings

---

## Design System

Bitwork uses a custom design system built on:

- **Typography**: Inter & Instrument Sans fonts
- **Colors**: Custom color palette with dark mode support
- **Spacing**: Consistent spacing scale
- **Animations**: Smooth transitions and micro-interactions
- **Icons**: Lucide React for consistent iconography

---

## Development Workflow

### Code Quality

This project uses **Ultracite** (powered by Biome) for code quality:

- Automatic formatting on save
- Linting with strict rules
- Type safety enforcement
- Pre-commit hooks via Lefthook

### Git Hooks

Lefthook is configured to run:

- Code formatting on staged files
- Lint checks before commits
- Type checking on pre-push

### Turborepo Pipeline

The monorepo is optimized with Turborepo for:

- Parallel task execution
- Intelligent caching
- Incremental builds
- Remote caching support

---

## Workspace Dependencies

```
bitwork (root)
|-- apps/web
|   |-- @bitwork/ui (workspace:*)
|   |-- @bitwork/db (workspace:*)
|   `-- @bitwork/configs (workspace:*)
|-- packages/ui
|   `-- (peer dependencies: react, react-dom)
|-- packages/db
|   `-- @bitwork/configs (workspace:*)
`-- packages/configs
```

---

## Dashboard System

Bitwork features a comprehensive, role-based dashboard system that provides distinct experiences for Service Seekers and Skill Providers.

### Dashboard Features

- **Adaptive Interface**: Automatically adjusts based on user role (seeker/provider)
- **Real-time Notifications**: Live updates on applications, messages, and job activity
- **Smart Job Matching**: Visual indicators for job compatibility
- **Quick Actions**: Streamlined workflows for common tasks
- **Analytics**: Performance insights for providers
- **Responsive Design**: Optimized for desktop, tablet, and mobile

---

## Roadmap

- [ ] User authentication with OAuth providers
- [ ] Real-time notifications with WebSockets
- [ ] Advanced job search with filters
- [ ] Resume parsing and analysis
- [ ] Email notifications
- [ ] Admin dashboard
- [ ] API documentation
- [ ] Mobile app (React Native)

---

## Additional Documentation

- **[Architecture Overview](architecture/OVERVIEW.md)** - System architecture and patterns
- **[Database Schema](architecture/DATABASE.md)** - Database structure and queries