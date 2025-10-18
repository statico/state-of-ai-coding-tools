# AGENTS.md

- This project uses Next.js, Kysely, shadcn/ui, Tailwind v4, and Postgres for the database
- Tech stack: TypeScript, React, Next.js, tRPC, Tanstack Query, PostgreSQL, Kysely, shadcn/ui, Tailwind CSS v4, pnpm, Vitest, Prettier, ESLint
- If available, use the Exa search tool to find information and up-to-date API documentation.

## Setup

- NEVER use `npm` or `yarn`. ALWAYS use `pnpm`.
- Install dependencies: `pnpm install`
- Run ESLint to check code quality: `pnpm lint`
- Run TypeScript type checking: `pnpm types`
- Run test suite with Vitest: `pnpm test`
- NEVER run `pnpm build` during development. It interferes with the dev server.
- NEVER run `pnpm dev` or `pnpm worker` since the user is already doing this. Ask the user to check changes instead.

## Testing

- Assume the user is already running the server on http://localhost:3000/
- Visit http://localhost:3000/debug-login to be automatically logged in as a test user

## Database

- Run database migrations: `pnpm db:latest`
- Run a single migration: `pnpm db:up`
- Rollback a single migration: `pnpm db:down`
- Seed database with sample data: `pnpm db:seed`
- Generate Kysely types from database schema: `pnpm db:codegen`
- Export database schema to docs/schema.sql: `pnpm db:schema`
- NEVER modify existing migrations. ALWAYS create new migrations.

## Architecture

- Next.js app router pages in `src/app/`
- Most server-side logic in `src/server/`
- tRPC API routes in `src/server/trpc/`
- External service clients in `src/server/services/external/`
- Database migrations in `src/server/db/migrations/`

## Code Style

- NEVER use barrel files -- import directly from source modules, don't create index.ts files
- Direct imports: Use `import { service } from "@/server/services/external/service"`
- Co-locate schemas: Put Zod schemas in the same file as the service that uses them
- No proxy layers: Don't create wrapper functions that just call other services
- Direct service usage: Use external services directly where needed
- Consolidate functionality: Combine related functionality into single endpoints/files

## Database Guidelines

### Kysely Migrations

- Each migration should have `up` and `down` functions that accept a `Kysely<any>` parameter
- Always make migrations reversible when possible
- Primary keys MUST be explicitly marked as `not null`
- Use descriptive names that indicate what the migration does
- Always specify `onDelete` behavior for foreign keys
- Use `cascade` or `set null` as appropriate
- Add indexes when appropriate

## Testing Guidelines

### Frontend Component Testing

**IMPORTANT**: We do NOT create frontend component tests in this project.

- ❌ Don't create `.test.tsx` or `.test.jsx` files
- ❌ Don't add `@testing-library/react` or `@testing-library/jest-dom` dependencies
- ✅ Test server-side business logic (`src/server/**/*.test.ts`)
- ✅ Test database operations, API endpoints, and external integrations

### Test Setup

- Use `setupTestData()` helper to create test environment
- Each test runs in isolation with a fresh database state
- NEVER mock the global `fetch()` function
- Use MSW for HTTP request mocking in tests

### Mocking Environment Variables

```typescript
vi.mock("@/server/env", () => ({
  getEnv: vi.fn(() => "test-api-key"),
  hasEnv: vi.fn(() => false),
  __TEST__: true, // Important: include this
}));
```

## External Services

### Service Client Design

- Create service clients in `src/server/services/external/`
- Each service gets its own file
- Co-locate Zod schemas in the same file as the service
- Use Zod for runtime type validation of external service responses
