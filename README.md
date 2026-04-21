# BMDB

A full-stack movie database application. Users can browse movies, write reviews, and manage accounts. Admins can manage the full catalog via a dedicated panel.

The project is a pnpm monorepo with two applications: a NestJS API and a Next.js frontend, plus a shared `packages/types` package.

## Repository structure

```text
bmdb/
+-- apps/
|   +-- api/          # NestJS backend (REST + GraphQL)
|   +-- web/          # Next.js frontend
+-- packages/
|   +-- types/        # Shared TypeScript types
+-- docker-compose.yml
+-- .env.example
+-- package.json
```

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js, React 19, Tailwind CSS v4, shadcn/ui |
| Backend | NestJS 10, Apollo Server 4, GraphQL |
| Database | PostgreSQL 16, Prisma 5 |
| Auth | JWT access and refresh cookies, Passport.js |
| Package manager | pnpm 10 workspaces |

## Local setup

### Prerequisites

- Node.js >= 20
- pnpm >= 10 (`npm i -g pnpm`)
- Docker for PostgreSQL

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Set `JWT_SECRET` and `JWT_REFRESH_SECRET` to random strings. Configure `EMAIL_HOST`, `EMAIL_USER`, and `EMAIL_PASS` if you want registration emails to be sent.

By default, the API runs on `http://localhost:3001`, the web app runs on `http://localhost:3000`, and the Next.js app proxies `/api/*` and `/graphql` to the API through `API_URL`.

### 3. Start the database

```bash
pnpm db:up
```

### 4. Run migrations and seed

```bash
cd apps/api
pnpm prisma:migrate
pnpm seed
```

### 5. Start both apps

```bash
pnpm dev
```

- API: http://localhost:3001
- Web: http://localhost:3000
- GraphQL Playground: http://localhost:3001/graphql

### Default admin credentials

- Email: `admin@bmdb.local`
- Password: `Admin1234!`

## App-specific docs

- [Backend (apps/api)](apps/api/README.md)
- [Frontend (apps/web)](apps/web/README.md)
