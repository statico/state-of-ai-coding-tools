# AGENTS.md

## Setup

- NEVER use `npm` or `yarn`. ALWAYS use `pnpm`.
- Install dependencies: `pnpm install`
- Run ESLint to check code quality: `pnpm lint`
- Run TypeScript type checking: `pnpm types`
- Run test suite with Vitest: `pnpm test`
- NEVER run `pnpm build` during development. It interferes with the dev server.
- NEVER run `pnpm dev` or `pnpm worker` since the user is already doing this. Ask the user to check changes instead.

## Port Configuration

- Run the server on a high port beacuse we are using 3000 for other projects: `PORT=4001 pnpm dev`
- Configure PostgreSQL to run on high ports (e.g., 5433 or higher) to avoid conflicts

## Architecture

- Next.js app router pages in `src/app/`
- Utility functions in `src/lib/`

## Code Style

- NEVER use barrel files -- import directly from source modules, don't create index.ts files
- Direct imports: Use `import { service } from "@/server/services/external/service"`
- Co-locate schemas: Put Zod schemas in the same file as the service that uses them
- No proxy layers: Don't create wrapper functions that just call other services
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