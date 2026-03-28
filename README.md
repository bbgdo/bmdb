# BMDB — Bigdo's Movie Database

## Stack
- **Backend**: NestJS, Prisma, PostgreSQL, Apollo Server
- **Frontend**: React 19, Vite, Tailwind v4, shadcn/ui, Apollo Client
- **Auth**: JWT (httpOnly cookies), email verification

## Setup

### Prerequisites
- Node.js 20+
- pnpm
- Docker

### Install
pnpm install

### Environment
cp .env.example .env
# fill in EMAIL_* fields for registration to work
# JWT_SECRET and JWT_REFRESH_SECRET — any random strings

### Database
pnpm db:up
cd apps/api && pnpm prisma migrate dev
cd apps/api && pnpm seed

### Dev
pnpm dev

## API
- REST: http://localhost:3001/api
- GraphQL playground: http://localhost:3001/graphql

## Default admin
- Email: admin@bmdb.local
- Password: Admin1234!
