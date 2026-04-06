# @bmdb/api

NestJS backend serving both a REST API and a GraphQL endpoint. Handles authentication, movie catalog, reviews, and email verification.

## Tech stack

- **Framework**: NestJS 10
- **Language**: TypeScript 5
- **Database ORM**: Prisma 5 (PostgreSQL)
- **API**: REST (`/api/*`) + GraphQL (`/graphql`) via Apollo Server 4
- **Auth**: JWT access/refresh tokens, Passport.js, bcrypt
- **Validation**: class-validator, class-transformer
- **Security**: Helmet, @nestjs/throttler
- **Email**: Nodemailer

## Prerequisites

- Node.js >= 20
- pnpm >= 10
- PostgreSQL 16 (or run via Docker from the repo root: `pnpm db:up`)

## Installation

```bash
pnpm install
```

## Environment

The API reads environment variables from `.env` in the **repo root**. See `.env.example` for all keys.

Key variables:

| Variable                | Description                        | Default                |
|-------------------------|------------------------------------|------------------------|
| `DATABASE_URL`          | PostgreSQL connection string       | (see .env.example)     |
| `API_PORT`              | Port the server listens on         | `3001`                 |
| `FRONTEND_URL`          | Allowed CORS origin                | `http://localhost:5173`|
| `JWT_SECRET`            | Access token signing key           | —                      |
| `JWT_REFRESH_SECRET`    | Refresh token signing key          | —                      |
| `JWT_EXPIRES_IN`        | Access token TTL                   | `15m`                  |
| `JWT_REFRESH_EXPIRES_IN`| Refresh token TTL                  | `7d`                   |
| `EMAIL_HOST/PORT/USER/PASS` | SMTP credentials               | —                      |

## Database

### Run migrations

```bash
pnpm prisma:migrate
```

### Generate Prisma client (after schema changes)

```bash
pnpm prisma:generate
```

### Seed the database

```bash
pnpm seed
```

Seeds movies, actors, directors, genres, and a default admin account:
- Email: `admin@bmdb.local`
- Password: `Admin1234!`

## Running locally

```bash
pnpm dev
```

Server starts on `http://localhost:3001`.

## Build for production

```bash
pnpm build   # compiles TypeScript to dist/
pnpm start   # runs dist/main.js
```

## Source structure

```
src/
├── actors/          # Actors module (REST + GraphQL)
├── auth/            # Authentication (JWT, guards, strategies)
├── common/          # Shared filters, guards, pagination utilities
├── config/          # Env validation schema
├── directors/       # Directors module
├── genres/          # Genres module
├── graphql/         # GraphQL resolvers, types, inputs
├── mail/            # Email service (nodemailer)
├── movies/          # Movies module
├── prisma/          # PrismaService wrapper
├── reviews/         # Reviews module
├── seed.ts          # Database seeder
└── main.ts          # Bootstrap
prisma/
└── schema.prisma    # Database schema
```

## API overview

### REST — prefix `/api`

| Method | Path                     | Auth     | Description             |
|--------|--------------------------|----------|-------------------------|
| POST   | `/api/auth/register`     | Public   | Register + send verify email |
| POST   | `/api/auth/login`        | Public   | Login, set refresh cookie |
| POST   | `/api/auth/refresh`      | Cookie   | Rotate access token     |
| POST   | `/api/auth/logout`       | JWT      | Clear refresh token     |
| GET    | `/api/auth/verify-email` | Public   | Verify email token      |
| GET    | `/api/movies`            | Public   | List movies (paginated) |
| POST   | `/api/movies`            | Admin    | Create movie            |
| PATCH  | `/api/movies/:id`        | Admin    | Update movie            |
| DELETE | `/api/movies/:id`        | Admin    | Delete movie            |
| ...    | `/api/actors`, `/api/directors`, `/api/genres`, `/api/reviews` | Various | CRUD |

### GraphQL — `/graphql`

Queries and mutations for movies, actors, directors, genres, and reviews. The schema is auto-generated at `src/schema.gql` on startup (code-first approach).
