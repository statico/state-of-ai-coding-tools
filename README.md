# Ian's Stack (2025 Edition)

[![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/statico/ian-stack-2025/tests.yml?label=tests)](https://github.com/statico/ian-stack-2025/actions/workflows/tests.yml)
[![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/statico/ian-stack-2025/docker.yml?label=Docker+build)](https://github.com/statico/ian-stack-2025/actions/workflows/docker.yml)
[![GitHub License](https://img.shields.io/github/license/statico/ian-stack-2025)](LICENSE)

A full stack web application example using my current favorite tech stack.

Clone it with your favorite AI-assisted coding tool to get started quickly. Send complaints and nitpicks via [Bluesky](https://bsky.app/profile/statico.bsky.social) and [Mastodon](https://mastodon.social/@statico).

<img height="400" alt="Screenshot of this TODO app" src="https://github.com/user-attachments/assets/569c90a8-6fa0-4287-896b-873962da4de1" />

## Goals

- **Flexible** - It should be easy and quick to add functionality
- **Strong typing** - Types should be available at all layers, frontend and backend
- **Best practices** - Use Prettier and ESLint to automatically enforce code uniformity
- **Testable** - The app should be testable with unit tests and E2E browser tests
- **Maintainable** - Use migrations for database changes and minimize dependencies
- **Updateable** - Keeping the dependencies up to date should be easy
- **GitHub-ready** - Integrates with GitHub Actions for CI/CD
- **Dockerizable** - The entire app should fit nicely inside a Docker container
- **AI-ready** - AI coding agents should be able to modify the codebase with ease

## Tech Stack

- [**TypeScript**](https://www.typescriptlang.org/) - A decent typed language that can be used on both frontend and backend
- [**React**](https://react.dev/) - A great frontend framework when used responsibly with a strong ecosystem
- [**Next.js**](https://nextjs.org/) - Still the best option to get a full-stack React app -- but I have strong reservations about its complexity
- [**tRPC**](https://trpc.io/) with [**Tanstack Query**](https://tanstack.com/query/latest) for end-to-end typesafe APIs, which is less error-prone than REST APIs and less of a headache than React Server Components
- [**PostgreSQL**](https://www.postgresql.org/) - The best choice for a general-purpose OLTP database
- [**PGLite**](https://github.com/electric-sql/pglite) - For an in-memory PostgreSQL database for testing
- [**Kysely**](https://kysely.dev/) - Type-safe SQL query builder and database migration tool
- [**shadcn/ui**](https://ui.shadcn.com/) and [**Tailwind CSS v4**](https://tailwindcss.com/) - Solid UI choices with shadcn's smart vendored approach means performance plus maintainability
- [**pnpm**](https://pnpm.io/) - A fast and reliable package manager
- [**Vitest**](https://vitest.dev/) - Super fast unit testing
- [**Playwright**](https://playwright.dev/) - E2E browser testing (not currently included because I can't get it to work with PGLite)
- [**Prettier**](https://prettier.io/) and [**ESLint**](https://eslint.org/) - Automatic code formatting and linting on save (in VS Code and Cursor) and on commit (via Husky)
- [**AGENTS.md**](https://agents.md/) - "A simple, open format for guiding coding agents"

_Next.js note:_ I'm on the lookout for a Next.js replacement due to its increasing complexity and size. Astro is wonderful for static sites but requires more setup for dynamic sites.

_Prettier and ESLint note:_ I'm strongly considering [Oxc](https://oxc.rs/) and/or [Biome](https://biomejs.dev/) to replace Prettier and ESLint. ESLint is slow and difficult to maintain. Fast, single-executable tools are probably the right direction for TypeScript tooling.

## Setup

You'll need to install Postgres. I suggest [Docker](https://hub.docker.com/_/postgres) or [Postgres.app](https://postgresapp.com/) on macOS. Then:

1. Create a `.env` file in the root directory and set the `DATABASE_URL` to `postgresql://localhost:5432` or wherever your Postgres server is running.
1. Get `Node.js 24+` and [pnpm](https://pnpm.io/) installed.
1. Run `pnpm install` to install dependencies
1. Run `pnpm db:latest` to initialize the database
1. Run `pnpm dev` to start the development server
1. Visit [http://localhost:3000](http://localhost:3000) to see the app

## Directory Structure

```
ian-stack-2025/
├── src/
│   ├── app/                          # Next.js app router pages
│   │   ├── api/trpc/[trpc]/route.ts  # tRPC API handler
│   │   ├── globals.css               # Global styles (part of shadcn/ui)
│   │   ├── layout.tsx                # Root layout component
│   │   └── page.tsx                  # Home page
│   ├── components/                   # Reusable UI components
│   │   ├── theme-provider.tsx       # Theme context provider
│   │   └── ui/                      # shadcn/ui components
│   ├── lib/                         # Utility libraries for frontend and sometimes backend
│   │   ├── trpc/                    # tRPC client setup
│   ├── server/                      # Server-side code
│   │   ├── db/                      # Database configuration
│   │   │   ├── index.ts             # Database connection
│   │   │   ├── migrate.ts           # Migration runner
│   │   │   ├── migrations/          # Database migrations
│   │   │   └── types.ts             # Generated Kysely types from pnpm db:codegen
│   │   ├── models/                  # Database models
│   │   │   ├── todos.ts             # Todo model
│   │   │   └── todos.test.ts        # Todo model tests
│   │   ├── trpc/                    # tRPC server setup
│   │   │   ├── routers/             # API route handlers
│   │   │   │   ├── index.ts         # Main router
│   │   │   │   └── todos.ts         # Todo routes
│   │   │   └── trpc.ts              # tRPC configuration
│   │   ├── env.ts                   # Environment var helper
│   │   └── logging.ts               # Simple logging utility
│   └── test/                        # Test utilities
├── docs/                            # Documentation
│   └── schema.sql                   # Database schema export from pnpm db:schema
├── public/                          # Static assets
├── patches/                         # Package patches made with `pnpm patch`
├── AGENTS.md                        # AI agent guidelines
├── CLAUDE.md                        # Symlink to AGENTS.md for Claude Code
├── components.json                  # shadcn/ui configuration
├── Dockerfile                       # Container configuration
```

### Key Directories

- **`src/app/`** - Next.js app router pages and API routes
- **`src/components/`** - Reusable React components, including shadcn/ui components
- **`src/lib/`** - Utility functions and client-side libraries
- **`src/server/`** - Server-side code including database models, tRPC routers, and business logic
- **`src/server/db/`** - Database configuration, migrations, and generated types
- **`src/server/trpc/`** - tRPC API route definitions and server setup
- **`src/test/`** - Test utilities and setup configuration

## Common Tasks

### Creating a database migration

Create a new [Kysely migration](https://kysely.dev/docs/migrations) file in `src/server/db/migrations/`. Then run:

1. `pnpm db:latest` to apply the migration
1. `pnpm db:codegen` to generate the Kysely types
1. `pnpm db:schema` to export the database schema to `docs/schema.sql` (this helps AI tools)

Consider also `pnpm db:down` to undo the migration

### Running tests

Simply run `pnpm test`

## Preferred Ways to Extend

- **Authentication** - [Clerk](https://clerk.com/) is fantastic with a generous free tier.
- **Authorization** - Use [Clerk public metadata](https://clerk.com/docs/guides/users/extending) to add custom user roles and permissions, and extend the tRPC server with a `userProcedure` that performs checks
- **Postgres extensions** - Check out [PostGIS](https://postgis.net/) for geography functions, [pgvector](https://github.com/pgvector/pgvector) for vector search, and [TimescaleDB](https://www.timescale.com/) for storing event data in columnar format
- **Playwright** - Use [Playwright](https://playwright.dev/) for E2E browser testing
- **AI** - [BAML](https://docs.boundaryml.com/home) is a fantastic way to manage AI prompts and models with type safety and structured output
- **Documentation** - The `@next/mdx` makes it easy to embed documentation in a site using MDX
- **Blogging** - Use `next-mdx-remote` with `smartypants`, `grey-matter` and the `rss` module to generate a blog
- **Queues** - Consider [pg-boss](https://github.com/timgit/pg-boss) and a separate worker script (run with `tsx`) for a lightweight background processing solution, though larger workloads will require something more robust
- **Client-side global state** - Consider [Zustand](https://zustand.docs.pmnd.rs/) for any client-size global state management needs, like filter views
- **Mocking external services** - Use [MSW](https://mswjs.io/) for mocking external services in tests
- **Type-safe pattern matching** - Use [ts-pattern](https://github.com/gvergnaud/ts-pattern) for type-safe pattern matching in TypeScript
- **ORMs** - I'm not a big fan of ORMs and find query builders to be far superior. But if I had to choose one, I'd probably go with [Prisma](https://www.prisma.io/).

## Things to Avoid

- Modules with a large dependency tree - prefer NPM modules with zero or very few dependencies
- `lodash` which is mostly unnecessary with TypeScript, though `es-toolkit` has some useful functions
- Emotion and Styled Components, which reduce performance as apps get larger
- NextAuth.js is messy and difficult to use (sorry)

## License

[MIT License](LICENSE)
