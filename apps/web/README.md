# @bmdb/web

Next.js frontend for BMDB. It renders public movie pages on the server where practical and keeps interactive forms, filters, reviews, and admin screens as client components.

## Tech stack

- **Framework**: Next.js with App Router
- **Runtime UI**: React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4, shadcn/ui with Radix UI primitives
- **GraphQL client**: Apollo Client 4 for client-side mutations and cache updates
- **Forms**: React Hook Form v7 + Zod v3
- **HTTP client**: axios for REST auth and admin calls
- **Icons**: lucide-react

## Prerequisites

- Node.js >= 20
- pnpm >= 10
- The API must be running on `http://localhost:3001`, or set `API_URL` to a different API origin

## Environment

The web app reads environment variables from the repo root `.env`.

| Variable | Description | Default |
| --- | --- | --- |
| `API_URL` | Server-side API origin and Next rewrite target | `http://localhost:3001` |
| `FRONTEND_URL` | Frontend origin used by the API for CORS and verification links | `http://localhost:3000` |

Browser requests use same-origin paths:

- `/api/*` is rewritten to `${API_URL}/api/*`
- `/graphql` is rewritten to `${API_URL}/graphql`

This keeps the existing cookie-based auth flow working through Next.js.

## Running locally

From the monorepo root:

```bash
pnpm dev
```

From `apps/web` only:

```bash
pnpm dev
```

The web app starts at http://localhost:3000.

## Build for production

```bash
pnpm build
pnpm start
```

## SSR behavior

- `/` fetches movies and genres on the server from GraphQL, then hydrates the search and genre controls as a small client component.
- `/movies/[id]` fetches movie details on the server and hydrates only review submission/deletion behavior.
- `/verify-email` performs email verification on the server using the query token.
- `/admin/*` checks the current user from cookies on the server before rendering the admin client screens.

## Source structure

```text
src/
+-- app/             # Next App Router routes and global CSS
+-- api/             # axios REST call wrappers and GraphQL documents
+-- components/      # Shared UI components
|   +-- admin/       # Admin panel components
|   +-- ui/          # shadcn/ui generated components
+-- context/         # Auth provider
+-- hooks/           # Custom hooks
+-- lib/             # Apollo client, server API helpers, validation schemas, utilities
+-- views/           # Reused route-level page bodies
+-- types/           # Re-exports from @bmdb/types
```

## Path alias

`@/` maps to `src/`:

```ts
import { cn } from "@/lib/utils"
```
