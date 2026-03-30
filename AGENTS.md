# Bitwork Agent Guidelines

> **Repository**: https://github.com/codex-mohan/bitwork

This document provides guidance for agents working on the Bitwork project.

---

# Project Overview

**Bitwork** is a modern job board platform designed to connect informal workers (plumbers, electricians, tutors, etc.) with households and small businesses needing short-duration, task-specific work in India.

### Key Features
- Two-sided marketplace: Service **providers** post jobs, **seekers** apply
- Location-based job discovery
- Application tracking and management
- Real-time notifications
- Portable reputation system

### Current State
- Early development stage
- Core features: landing page, dashboard, job posting, applications
- Database schema defined, partial implementation
- Authentication via Supabase

---

# Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5.9 |
| Styling | Tailwind CSS v4 |
| Database | **Supabase** (PostgreSQL) |
| ORM | Drizzle ORM |
| Runtime | Bun |
| Monorepo | Turborepo |
| UI Components | Custom `@bitwork/ui` package |
| Auth | Supabase Auth |

---

# Project Structure

```
bitwork/
├── apps/
│   └── web/                 # Next.js web application
│       ├── app/             # App Router pages
│       │   ├── home/        # Dashboard routes
│       │   ├── post-job/    # Job creation
│       │   └── contact/     # Contact page
│       ├── components/
│       │   ├── dashboard/   # Dashboard components
│       │   ├── landing/     # Landing page components
│       │   └── *.tsx        # Shared components
│       ├── lib/             # Utilities and helpers
│       │   └── supabase/    # Supabase client/server setup
│       └── public/          # Static assets
├── packages/
│   ├── ui/                  # Shared UI component library
│   │   └── src/components/  # shadcn/ui-style components
│   ├── db/                  # Database package
│   │   └── src/
│   │       ├── schema.ts   # Drizzle schema definitions
│   │       └── env.ts      # Environment validation
│   └── configs/             # Shared TypeScript configs
├── docs/
│   └── architecture/        # Architecture documentation
│       ├── OVERVIEW.md     # System architecture
│       └── DATABASE.md     # Database schema docs
└── scripts/                # Setup and utility scripts
```

---

# Database Schema (Neon DB)

The database uses PostgreSQL via Neon DB with Drizzle ORM.

### Tables
- **profiles** - User profiles (name, role, location, skills, availability)
- **jobs** - Job postings (title, description, budget, location, status)
- **applications** - Job applications (status: pending/accepted/rejected)
- **saved_jobs** - User bookmarks
- **notifications** - User notifications
- **messages** - Direct messages (future feature)
- **user_preferences** - User settings

### Database Operations
```bash
bun run db:gen    # Generate migrations
bun run db:push   # Push schema changes to Supabase
```

---

# Development Commands

```bash
bun run dev          # Start development server (http://localhost:3000)
bun run build        # Build for production
bun run check-types  # TypeScript type checking
bun run check       # Lint & format code (Ultracite)
bun run env          # Set up environment variables
bun run db:gen       # Generate Drizzle migrations
bun run db:push      # Push schema to database
```

---

# Code Style & Quality

This project uses **Ultracite** (Biome-based) for code quality.

## Quick Reference

- **Format code**: `bun x ultracite fix`
- **Check for issues**: `bun x ultracite check`
- **Diagnose setup**: `bun x ultracite doctor`

---

## Core Principles

Write code that is **accessible, performant, type-safe, and maintainable**. Focus on clarity and explicit intent over brevity.

### Type Safety & Explicitness

- Use explicit types for function parameters and return values when they enhance clarity
- Prefer `unknown` over `any` when the type is genuinely unknown
- Use const assertions (`as const`) for immutable values and literal types
- Leverage TypeScript's type narrowing instead of type assertions
- Use meaningful variable names instead of magic numbers - extract constants with descriptive names

### Modern JavaScript/TypeScript

- Use arrow functions for callbacks and short functions
- Prefer `for...of` loops over `.forEach()` and indexed `for` loops
- Use optional chaining (`?.`) and nullish coalescing (`??`) for safer property access
- Prefer template literals over string concatenation
- Use destructuring for object and array assignments
- Use `const` by default, `let` only when reassignment is needed, never `var`

### Async & Promises

- Always `await` promises in async functions - don't forget to use the return value
- Use `async/await` syntax instead of promise chains for better readability
- Handle errors appropriately in async code with try-catch blocks
- Don't use async functions as Promise executors

### React & JSX

- Use function components over class components
- Call hooks at the top level only, never conditionally
- Specify all dependencies in hook dependency arrays correctly
- Use the `key` prop for elements in iterables (prefer unique IDs over array indices)
- Nest children between opening and closing tags instead of passing as props
- Don't define components inside other components
- Use semantic HTML and ARIA attributes for accessibility:
  - Provide meaningful alt text for images
  - Use proper heading hierarchy
  - Add labels for form inputs
  - Include keyboard event handlers alongside mouse events
  - Use semantic elements (`<button>`, `<nav>`, etc.) instead of divs with roles
- Use framer motion if available for smooth animations.

### Error Handling & Debugging

- Remove `console.log`, `debugger`, and `alert` statements from production code
- Throw `Error` objects with descriptive messages, not strings or other values
- Use `try-catch` blocks meaningfully - don't catch errors just to rethrow them
- Prefer early returns over nested conditionals for error cases

### Code Organization

- Keep functions focused and under reasonable cognitive complexity limits
- Extract complex conditions into well-named boolean variables
- Use early returns to reduce nesting
- Prefer simple conditionals over nested ternary operators
- Group related code together and separate concerns

### Security

- Add `rel="noopener"` when using `target="_blank"` on links
- Avoid `dangerouslySetInnerHTML` unless absolutely necessary
- Don't use `eval()` or assign directly to `document.cookie`
- Validate and sanitize user input

### Performance

- Avoid spread syntax in accumulators within loops
- Use top-level regex literals instead of creating them in loops
- Prefer specific imports over namespace imports
- Avoid barrel files (index files that re-export everything)
- Use proper image components (e.g., Next.js `<Image>`) over `<img>` tags

### Framework-Specific Guidance

**Next.js:**
- Use Next.js `<Image>` component for images
- Use `next/head` or App Router metadata API for head elements
- Use Server Components for async data fetching instead of async Client Components

**React 19+:**
- Use ref as a prop instead of `React.forwardRef`

**Solid/Svelte/Vue/Qwik:**
- Use `class` and `for` attributes (not `className` or `htmlFor`)

---

## Testing

- Write assertions inside `it()` or `test()` blocks
- Avoid done callbacks in async tests - use async/await instead
- Don't use `.only` or `.skip` in committed code
- Keep test suites reasonably flat - avoid excessive `describe` nesting

## When Biome Can't Help

Biome's linter will catch most issues automatically. Focus your attention on:

1. **Business logic correctness** - Biome can't validate your algorithms
2. **Meaningful naming** - Use descriptive names for functions, variables, and types
3. **Architecture decisions** - Component structure, data flow, and API design
4. **Edge cases** - Handle boundary conditions and error states
5. **User experience** - Accessibility, performance, and usability considerations
6. **Documentation** - Add comments for complex logic, but prefer self-documenting code

---

# Naming Conventions

| Item | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `JobCard`, `DashboardLayout` |
| Hooks | `use` prefix + camelCase | `useJobs`, `useNotifications` |
| Server Actions | camelCase | `getJobs`, `createApplication` |
| Types/Interfaces | PascalCase | `JobFilters`, `ApplicationStatus` |
| Database Tables | snake_case | `user_profiles`, `job_listings` |
| Files | kebab-case | `job-card.tsx`, `use-jobs.ts` |
| Environment Variables | SCREAMING_SNAKE_CASE | `DATABASE_URL`, `SUPABASE_KEY` |

---

# Component Patterns

### Role-Based Components
The dashboard adapts based on user role (`provider` or `seeker`):
- **Providers**: Post jobs, manage applications, view analytics
- **Seekers**: Browse jobs, apply to jobs, track applications

### Server vs Client Components
- Use **Server Components** for data fetching and static content
- Use **Client Components** (`'use client'`) only when interactivity is needed
- Keep client boundaries minimal for better performance

### UI Package
Reusable components live in `@bitwork/ui`:
- Base components (Button, Card, Input, etc.)
- Styled with Tailwind CSS
- Located in `packages/ui/src/components/`

---

# Database Operations

### Environment Variables Required
```env
DATABASE_URL=          # Supabase connection string
```

### Schema Updates
1. Modify `packages/db/src/schema.ts`
2. Run `bun run db:gen` to generate migrations
3. Run `bun run db:push` to apply changes to Supabase

### Type Generation
Drizzle generates TypeScript types from schema:
```typescript
import type { Job, Profile, Application } from '@bitwork/db';
```

---

# Version Control & Collaboration

## Committing Changes

**Always commit and push functional features to GitHub.** Do not leave completed, working features uncommitted. Follow these guidelines:

1. **Run code quality checks before committing**:
   ```bash
   bun run check       # Lint & format code
   bun run check-types # TypeScript type checking
   bun run build       # Verify build succeeds
   ```

2. **Commit message format**:
   ```
   <type>(<scope>): <short description>

   [Optional body text for complex changes]
   ```

   Types: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`

   Scope: `web`, `packages/db`, `packages/ui`, `packages/ai`, or `packages/others`

   Examples:
   - `feat(web): add job posting form`
   - `fix(web): resolve authentication redirect loop`
   - `feat(packages/ai): add AI chat with Groq integration`
   - `chore(packages/db): add chat tables for persistence`
   - `feat(web): integrate AI assistant into dashboard`

3. **Commit timing**:
   - Commit functional features as soon as they are complete and tested
   - Do not accumulate multiple unrelated changes in one commit
   - Use atomic commits (one logical change per commit)
   - Commit and push immediately after completing a feature

## Pushing to Remote

- Push to the remote repository after every functional commit
- Always push to your feature branch first, then create a PR
- Never force push to `main` or `master`
- Keep your feature branches up to date with the base branch

## Branch Naming

- Feature branches: `feature/<short-description>`
- Bug fixes: `fix/<short-description>`
- Documentation: `docs/<short-description>`
- Examples: `feature/job-posting`, `fix/auth-redirect`, `docs/api-reference`

---

# Important Notes

1. **Run `bun x ultracite fix` before committing** to ensure code compliance
2. **Use Server Components** where possible for better performance
3. **Keep bundle sizes small** - avoid importing entire libraries
4. **Test database changes locally** before pushing to production
5. **Check existing components** before creating new ones - reuse from `@bitwork/ui`
6. **Commit and push functional features immediately** - do not leave working code uncommitted

---

# Documentation References

- [Technical Documentation](docs/TECHNICAL.md) - Detailed tech stack info
- [Architecture Overview](docs/architecture/OVERVIEW.md) - System design
- [Database Schema](docs/architecture/DATABASE.md) - Table definitions

---

# Self-Evolution & Continuous Improvement

This AGENTS.md file defines the agent's behavior and should evolve alongside the project.

## Feedback Loop

**Agents should proactively update this file when:**

1. **New patterns emerge** - Document successful approaches discovered during development
2. **Conventions change** - Add or modify naming, structure, or architectural patterns
3. **Tools are adopted** - Include new libraries, frameworks, or development practices
4. **Common issues arise** - Add warnings or best practices to prevent repeated mistakes
5. **Project evolves** - Update project state, tech stack, or structural information

## How to Improve AGENTS.md

When working on features, if you discover:
- A better way to organize code or components
- Useful utilities or patterns not documented
- Common pitfalls that should be avoided
- Missing context that would help future agents

**Propose an update** to AGENTS.md as part of your work. Include:
- Clear explanation of what to add/change
- The reasoning behind the change
- Examples where applicable

## Example Updates

```markdown
## Common Patterns
Add new section documenting discovered patterns...

## Gotchas
Add warning about a common mistake...

## Tool Usage
Update commands or add new tooling documentation...
```

This creates a self-improving system where each agent makes the project easier for the next agent to work on.
