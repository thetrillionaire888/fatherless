# CONTINUE.md — Project Guide

## Project Overview

**Rumah Buah Hati** is a charity website for helping fatherless children in Indonesia. It's a bilingual (English/Indonesian) single-page application with an admin panel, API routes, and database-backed features including donor management, prayer requests, visit tracking, and donation scheduling.

### Key Technologies
- **Framework:** Next.js 16 (App Router, Client Components)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 + shadcn/ui (Radix UI primitives)
- **Database:** Prisma ORM with **SQLite**
- **Auth:** NextAuth.js
- **State:** Zustand (client state), React Query (server state)
- **Runtime:** Bun (package manager & production server)
- **Animations:** Framer Motion
- **i18n:** next-intl

### High-Level Architecture
- **SPA-style navigation** — The main page uses client-side view switching (`HomeView`, `CalendarView`, `MapView`, `GalleryView`, `DonationView`) with Framer Motion transitions, rather than separate Next.js routes.
- **API layer** — RESTful API routes under `/src/app/api/` for donors, prayers, visits, donation schedules, and admin operations.
- **Admin panel** — A dedicated `/admin` page for managing data.
- **Auth** — NextAuth.js with JWT-based sessions; protected routes via middleware.

---

## Getting Started

### Prerequisites
- **Node.js** 18+ (or Bun)
- **Bun** (recommended — used as package manager and production runtime)

### Installation
```bash
# Install dependencies
bun install

# Generate Prisma client
bun run db:generate

# Push schema to database (SQLite)
bun run db:push
```

### Running the Development Server
```bash
bun run dev
```
The server starts on **port 3000** with Webpack. Output is also logged to `dev.log`.

### Running Tests
No test framework is currently configured. Consider adding Vitest or Jest for unit/integration tests.

---

## Project Structure

```
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── admin/              # Admin dashboard page
│   │   ├── api/                # API routes
│   │   │   ├── admin/          # Admin operations
│   │   │   ├── auth/[...nextauth]  # NextAuth endpoints
│   │   │   ├── donors/         # Donor CRUD
│   │   │   ├── prayers/        # Prayer request CRUD
│   │   │   ├── visits/         # Visit tracking
│   │   │   ├── donation-schedules/  # Donation scheduling
│   │   │   ├── reset-donors/   # Reset donor data
│   │   │   └── seed/           # Seed database
│   │   ├── login/              # Login page
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Main SPA entry point
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── views/              # Page-level view components
│   │   └── *.tsx               # Shared components (header, footer, etc.)
│   ├── hooks/                  # Custom React hooks
│   └── lib/
│       ├── auth.ts             # Auth configuration
│       ├── data.ts             # Data types & constants
│       ├── db.ts               # Prisma client instance
│       ├── i18n.ts             # Language/i18n setup (Zustand store)
│       └── utils.ts            # Utility functions
├── prisma/                     # Database schema & migrations
├── public/                     # Static assets
├── components.json             # shadcn/ui configuration
├── next.config.ts              # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── Caddyfile                   # Caddy reverse proxy config (production)
```

### Key Files
| File | Purpose |
|------|---------|
| `src/app/page.tsx` | Main SPA entry — view router with Framer Motion transitions |
| `src/lib/db.ts` | Prisma client singleton |
| `src/lib/auth.ts` | NextAuth.js configuration |
| `src/lib/i18n.ts` | Zustand store for language state (EN/ID) |
| `src/lib/data.ts` | Shared types, constants, and view definitions |
| `prisma/schema.prisma` | Database schema definition (SQLite) |

---

## Development Workflow

### Coding Standards
- **TypeScript** with strict mode enabled
- **ESLint** configured via `eslint.config.mjs` (Next.js + custom rules)
- **Tailwind CSS** for styling — use utility classes; avoid inline styles
- **shadcn/ui** components for consistent UI — extend from `src/components/ui/`
- **Client components** (`"use client"`) are used extensively since the app is SPA-style

### Testing
No test suite is currently in place. Recommended: add Vitest with React Testing Library.

### Build & Deployment
```bash
# Build for production (standalone output)
bun run build

# Start production server
bun run start
```
The build produces a **standalone** Next.js output (`.next/standalone/`) suitable for containerized deployment. A `Caddyfile` is provided for reverse proxy setup.

### Contribution Guidelines
1. Create a feature branch from `main`
2. Make changes and commit with descriptive messages
3. Run `bun run lint` before pushing
4. Open a pull request

---

## Key Concepts

### Domain Terminology
- **Donor** — A person or organization that donates to Rumah Buah Hati
- **Prayer Request** — A prayer request submitted by visitors
- **Visit** — A recorded visit to the orphanage
- **Donation Schedule** — A recurring donation plan

### Core Abstractions
- **ViewName** — Enum-like type defining the SPA views: `home`, `calendar`, `map`, `gallery`, `donation`
- **Language Store** — Zustand store managing `lang` state (`"en"` | `"id"`) for bilingual content
- **Prisma Client** — Singleton instance in `src/lib/db.ts` for database access

### Design Patterns
- **SPA with client-side routing** — Single page with view state managed via React state
- **Zustand for global state** — Lightweight state management for language and other shared state
- **React Query for server state** — Data fetching and caching for API calls
- **Compound components** — shadcn/ui pattern for flexible, composable UI

---

## Common Tasks

### Adding a New View
1. Create the view component in `src/components/views/`
2. Add the view name to the `ViewName` type in `src/lib/data.ts`
3. Add navigation entry in `SiteHeader`
4. Add the view case in `src/app/page.tsx` with Framer Motion wrapper

### Adding a New API Route
1. Create the route file under `src/app/api/<resource>/route.ts` (or subdirectory)
2. Use Prisma client from `src/lib/db.ts` for database operations
3. Return JSON responses with appropriate status codes

### Adding a New Database Model
1. Define the model in `prisma/schema.prisma`
2. Run `bun run db:push` to apply changes
3. Run `bun run db:generate` to regenerate the Prisma client

### Adding a New UI Component
1. Use `npx shadcn@latest add <component>` for shadcn components
2. Or create custom components in `src/components/` following the existing pattern

---

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Prisma client not found | Run `bun run db:generate` |
| Database connection errors | Verify SQLite file exists; check `DATABASE_URL` in `.env` |
| Port 3000 already in use | Kill the existing process or change port in `package.json` dev script |
| Tailwind styles not applying | Ensure `globals.css` imports Tailwind directives; check `tailwind.config.ts` content paths |
| Auth session not persisting | Check NextAuth configuration in `src/lib/auth.ts`; verify `NEXTAUTH_SECRET` is set |

### Debugging Tips
- Dev server output is also logged to `dev.log` — check for errors there
- Use browser DevTools Network tab to inspect API route responses
- Prisma Studio: run `bunx prisma studio` for a visual database explorer

---

## References

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Zustand Documentation](https://docs.pmnd.rs/zustand)
- [Framer Motion Documentation](https://www.framer.com/motion/)

---

> **Note:** This guide was auto-generated. Review and update as the project evolves. Additional `rules.md` files can be placed in subdirectories for component-specific documentation.