# @bmdb/web

React frontend for BMDB. Communicates with the API via GraphQL (Apollo Client) for data fetching and REST (axios) for auth mutations.

## Tech stack

- **Framework**: React 19
- **Build tool**: Vite 8
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4, shadcn/ui (Radix UI primitives)
- **GraphQL client**: Apollo Client 4
- **Server state**: TanStack Query v5
- **Table**: TanStack Table v8
- **Routing**: React Router v7
- **Forms**: React Hook Form v7 + Zod v3
- **HTTP client**: axios
- **Icons**: lucide-react

## Prerequisites

- Node.js >= 20
- pnpm >= 10
- The API must be running on `http://localhost:3001` (or adjust the proxy in `vite.config.ts`)

## Installation

```bash
pnpm install
```

## Running locally

```bash
pnpm dev
```

Starts the dev server at http://localhost:5173.

Vite proxies `/api` and `/graphql` requests to `http://localhost:3001`, so no CORS configuration is needed during development.

## Build for production

```bash
pnpm build
```

Output goes to `dist/`. To preview the production build locally:

```bash
pnpm preview
```

## Source structure

```
src/
├── api/             # axios REST call wrappers (auth, admin)
├── components/      # Shared UI components
│   ├── admin/       # Admin panel components
│   └── ui/          # shadcn/ui generated components
├── context/         # React context providers
├── hooks/           # Custom hooks (e.g. useDebounce)
├── lib/             # Apollo client, axios instance, validation schemas, utilities
├── pages/           # Route-level page components
│   └── admin/       # Admin pages
├── types/           # Frontend-specific TypeScript types
└── main.tsx         # App entry point
```

## Path alias

`@/` maps to `src/`. Use it for all internal imports:

```ts
import { cn } from "@/lib/utils"
```
