<div align="center">

<img src="apps/web/public/bitwork.svg" width="80" height="80" alt="Bitwork Logo">

![Bitwork](https://capsule-render.vercel.app/api?type=waving&color=7aa2f7&height=200&section=header&text=bitwork&fontSize=80&fontAlignY=35&desc=A%20modern%20job%20board%20platform%20built%20with%20Next.js&descAlignY=55&descSize=20&fontColor=24283b)

<p>
  <a href="https://github.com/codex-mohan/bitwork/stargazers">
    <img src="https://img.shields.io/github/stars/codex-mohan/bitwork?color=f7768e&label=STARS&style=for-the-badge&labelColor=24283b&logo=github&logoColor=f7768e" alt="Stars">
  </a>
  <a href="https://github.com/codex-mohan/bitwork/network/members">
    <img src="https://img.shields.io/github/forks/codex-mohan/bitwork?color=9ece6a&label=FORKS&style=for-the-badge&labelColor=24283b&logo=github&logoColor=9ece6a" alt="Forks">
  </a>
  <a href="https://github.com/codex-mohan/bitwork/issues">
    <img src="https://img.shields.io/github/issues/codex-mohan/bitwork?color=e0af68&label=ISSUES&style=for-the-badge&labelColor=24283b&logo=github&logoColor=e0af68" alt="Issues">
  </a>
</p>

<p>
  <img src="https://img.shields.io/badge/NEXT.JS-16.1-7aa2f7?style=for-the-badge&logo=next.js&logoColor=white&labelColor=24283b" alt="Next.js">
  <img src="https://img.shields.io/badge/REACT-19-61DAFB?style=for-the-badge&logo=react&logoColor=white&labelColor=24283b" alt="React">
  <img src="https://img.shields.io/badge/TYPESCRIPT-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white&labelColor=24283b" alt="TypeScript">
  <img src="https://img.shields.io/badge/TAILWIND-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white&labelColor=24283b" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/BUN-1.3-f472b6?style=for-the-badge&logo=bun&logoColor=white&labelColor=24283b" alt="Bun">
</p>

<p>
  <img src="https://img.shields.io/badge/DRIZZLE-ORM-C5F015?style=for-the-badge&logo=drizzle&logoColor=white&labelColor=24283b" alt="Drizzle ORM">
  <img src="https://img.shields.io/badge/TURBOREPO-2.8-7B68EE?style=for-the-badge&logo=turborepo&logoColor=white&labelColor=24283b" alt="Turborepo">
  <img src="https://img.shields.io/badge/BIOME-2.3-60A5FA?style=for-the-badge&logo=biome&logoColor=white&labelColor=24283b" alt="Biome">
</p>

</div>

---

## 🚀 About The Project

**Bitwork** is a modern, full-stack job board platform designed to streamline the hiring process for companies and job seekers alike. Built with cutting-edge technologies, it offers a seamless experience for posting jobs, applying to positions, and managing applications.

This monorepo project leverages the power of **Turborepo** for efficient task orchestration across multiple packages and applications, ensuring scalable development practices and optimal build performance.

### ✨ Why Bitwork?

- 🎯 **Developer Experience**: Built with modern tooling and best practices
- ⚡ **Performance**: Optimized for speed with Next.js 16 and Turborepo
- 🎨 **Beautiful UI**: Custom UI component library with smooth animations
- 📊 **Type Safe**: Full TypeScript support across the entire codebase
- 🔧 **Maintainable**: Clean architecture with shared configurations

---

## 🏗️ Architecture

```
bitwork/
├── apps/
│   └── web/                    # Next.js 16 web application
│       ├── app/               # Next.js app router
│       ├── components/        # Application-specific components
│       ├── lib/              # Utilities and helpers
│       └── public/           # Static assets
├── packages/
│   ├── ui/                   # Shared UI component library
│   │   ├── src/components/   # Reusable UI components (40+)
│   │   ├── src/hooks/       # Custom React hooks
│   │   └── src/lib/         # Utilities and styling
│   ├── db/                   # Database package with Drizzle ORM
│   │   ├── src/schema.ts    # Database schema definitions
│   │   └── src/index.ts     # Database exports
│   └── configs/             # Shared configuration files
├── scripts/                  # Build and setup scripts
├── turbo.json               # Turborepo configuration
└── bun.lockb               # Bun lockfile
```

---

## 🛠️ Technology Stack

### Core Technologies

| Category | Technologies |
|----------|-------------|
| **Framework** | ![Next.js](https://img.shields.io/badge/Next.js-16.1-7aa2f7?style=flat-square&logo=next.js&logoColor=white&labelColor=24283b) |
| **UI Library** | ![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white&labelColor=24283b) |
| **Language** | ![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white&labelColor=24283b) |
| **Styling** | ![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white&labelColor=24283b) |
| **Runtime** | ![Bun](https://img.shields.io/badge/Bun-1.3-f472b6?style=flat-square&logo=bun&logoColor=white&labelColor=24283b) |

### Monorepo & Tooling

| Tool | Purpose | Version |
|------|---------|---------|
| **Turborepo** | Monorepo task runner | 2.8.7 |
| **Biome** | Linting & formatting | 2.3.14 |
| **Ultracite** | Zero-config code quality | 7.1.5 |
| **Lefthook** | Git hooks | 2.1.0 |
| **Turbo** | Build system | 2.8.7 |

### Database & Backend

| Technology | Purpose |
|-----------|---------|
| **Drizzle ORM** | Type-safe SQL ORM |
| **Drizzle Kit** | Database migrations & studio |
| **Zod** | Schema validation |
| **@t3-oss/env-core** | Environment validation |

### UI Components & Libraries

The `@bitwork/ui` package includes a comprehensive set of 40+ UI components:

**Form Controls**: Button, Input, Textarea, Select, Checkbox, Radio Group, Switch, Slider
**Overlays**: Dialog, Drawer, Sheet, Popover, Tooltip, Hover Card, Alert Dialog
**Navigation**: Tabs, Breadcrumb, Pagination, Navigation Menu, Command, Menubar
**Data Display**: Table, Card, Badge, Avatar, Accordion, Collapsible, Calendar
**Feedback**: Alert, Progress, Skeleton, Spinner, Sonner (toasts)
**Layout**: Separator, Resizable Panels, Scroll Area, Sidebar
**Advanced**: Carousel, Chart (Recharts), Data Table

### Additional Dependencies

- **Base UI** - Unstyled, accessible components
- **Lenis** - Smooth scrolling
- **Lucide React** - Icon library
- **Next Themes** - Dark/light mode
- **Vaul** - Drawer component
- **Recharts** - Data visualization
- **Embla Carousel** - Carousel functionality

---

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) 1.3.9 or later
- Node.js 20+ (for some tooling compatibility)
- Git

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/bitwork.git
cd bitwork
```

2. **Install dependencies**

```bash
bun install
```

3. **Set up environment variables**

```bash
bun run env
```

4. **Set up the database**

```bash
# Generate database schema
bun run db:gen

# Push schema to database
bun run db:push
```

5. **Start the development server**

```bash
bun run dev
```

The application will be available at `http://localhost:3000`

---

## 📜 Available Scripts

### Root Level Scripts

```bash
# Development - Start all apps in watch mode
bun run dev

# Build - Build all apps and packages
bun run build

# Type checking - Check TypeScript types across monorepo
bun run check-types

# Lint & Format - Fix code style issues
bun run check

# Environment setup - Configure environment variables
bun run env

# Database operations
bun run db:gen      # Generate Drizzle migrations
bun run db:push     # Push schema changes to database
```

### App-Specific Scripts

```bash
# From apps/web/
bun run dev         # Start Next.js dev server
bun run build       # Build for production
bun run start       # Start production server
bun run check-types # Type check Next.js app
```

### Database Package Scripts

```bash
# From packages/db/
bun run push        # Push schema changes
bun run generate    # Generate migrations
bun run migrate     # Run migrations
bun run studio      # Open Drizzle Studio
```

---

## 🎯 Project Structure Details

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

## 🎨 Design System

Bitwork uses a custom design system built on:

- **Typography**: Inter & Instrument Sans fonts
- **Colors**: Custom color palette with dark mode support
- **Spacing**: Consistent spacing scale
- **Animations**: Smooth transitions and micro-interactions
- **Icons**: Lucide React for consistent iconography

---

## 🔧 Development Workflow

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

## 📦 Workspace Dependencies

```
bitwork (root)
├── apps/web
│   ├── @bitwork/ui (workspace:*)
│   ├── @bitwork/db (workspace:*)
│   └── @bitwork/configs (workspace:*)
├── packages/ui
│   └── (peer dependencies: react, react-dom)
├── packages/db
│   └── @bitwork/configs (workspace:*)
└── packages/configs
```

---

## 🌟 Features

### For Job Seekers

- 🔍 **Browse Jobs**: Search and filter job listings
- 📝 **Easy Applications**: Streamlined application process
- 📊 **Track Applications**: Monitor application status
- 🔔 **Notifications**: Get updates on application progress

### For Employers

- 📝 **Post Jobs**: Create detailed job listings
- 👥 **Manage Applications**: Review and manage candidates
- 📈 **Analytics**: Track listing performance
- 🎯 **Targeted Reach**: Connect with qualified candidates

### Technical Features

- ⚡ **Fast Performance**: Next.js 16 with App Router
- 📱 **Responsive**: Mobile-first design
- 🌙 **Dark Mode**: Automatic theme switching
- ♿ **Accessible**: WCAG compliant components
- 🔒 **Type Safe**: Full TypeScript coverage
- 🎨 **Beautiful UI**: Custom component library

---

## 📚 Dashboard System

Bitwork features a comprehensive, role-based dashboard system that provides distinct experiences for Service Seekers and Skill Providers.

### Dashboard Features

- **Adaptive Interface**: Automatically adjusts based on user role (seeker/provider)
- **Real-time Notifications**: Live updates on applications, messages, and job activity
- **Smart Job Matching**: Visual indicators for job compatibility
- **Quick Actions**: Streamlined workflows for common tasks
- **Analytics**: Performance insights for providers
- **Responsive Design**: Optimized for desktop, tablet, and mobile

### Documentation

Comprehensive documentation is available in the `/docs` directory:

- **[Dashboard Overview](docs/README.md)** - Complete documentation index
- **[Architecture](docs/architecture/OVERVIEW.md)** - System architecture and patterns
- **[Database Schema](docs/architecture/DATABASE.md)** - Database structure and queries
- **[Component Guide](docs/architecture/COMPONENT-ARCHITECTURE.md)** - Component patterns
- **[Feature Documentation](docs/features/)** - Detailed feature guides

### Quick Links for Developers

- [Setup Guide](docs/guides/SETUP.md) - Local development setup
- [Contributing Guide](docs/guides/CONTRIBUTING.md) - How to contribute
- [API Reference](docs/api/SERVER-ACTIONS.md) - Server actions documentation

---

## 🚧 Roadmap

- [ ] User authentication with OAuth providers
- [ ] Real-time notifications with WebSockets
- [ ] Advanced job search with filters
- [ ] Resume parsing and analysis
- [ ] Email notifications
- [ ] Admin dashboard
- [ ] API documentation
- [ ] Mobile app (React Native)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please make sure to:

- Run `bun run check` before committing
- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Contact

**Your Name** - [@yourtwitter](https://twitter.com/yourtwitter) - your.email@example.com

Project Link: [https://github.com/yourusername/bitwork](https://github.com/yourusername/bitwork)

---

<div align="center">

<p>
  <img src="https://img.shields.io/badge/MADE%20WITH-♡-f7768e?style=for-the-badge&labelColor=24283b" alt="Made with love">
</p>

<p><i>Built with the Tokyo Night color palette 🌃</i></p>

<p>If you found this project helpful, please consider giving it a ⭐</p>

</div>
