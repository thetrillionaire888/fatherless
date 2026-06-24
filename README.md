# Rumah Buah Hati 🍎

A charity website for helping fatherless children in Indonesia. Built with Next.js, TypeScript, and Prisma ORM.

## Features

- 🌐 **Bilingual** — English & Indonesian language support
- 📅 **Calendar View** — Track visits and events
- 🗺️ **Map View** — Location information
- 📸 **Gallery** — Photo gallery of activities
- 💝 **Donation Management** — Donor tracking and scheduling
- 🙏 **Prayer Requests** — Submit and manage prayer requests
- 🔐 **Admin Panel** — Full CRUD operations for all data

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Database:** SQLite with Prisma ORM
- **Auth:** NextAuth.js
- **State:** Zustand + React Query
- **Animations:** Framer Motion
- **i18n:** next-intl

## Getting Started

### Prerequisites

- Node.js 18+ or [Bun](https://bun.sh/) (recommended)

### Installation

```bash
# Install dependencies
bun install

# Generate Prisma client
bun run db:generate

# Push schema to database
bun run db:push
```

### Development

```bash
bun run dev
```

The server starts on **http://localhost:3000**.

### Production

```bash
# Build
bun run build

# Start production server
bun run start
```

## Project Structure

```
src/
├── app/                # Next.js App Router
│   ├── admin/          # Admin dashboard
│   ├── api/            # API routes
│   └── page.tsx        # Main SPA entry
├── components/
│   ├── ui/             # shadcn/ui components
│   └── views/          # Page-level views
├── hooks/              # Custom React hooks
└── lib/                # Utilities, auth, db, i18n
```

## Database

- **Schema:** `prisma/schema.prisma`
- **Studio:** `bunx prisma studio` (visual database explorer)
- **Push changes:** `bun run db:push`
- **Generate client:** `bun run db:generate`

## License

This project is open source and available under the [MIT License](LICENSE).