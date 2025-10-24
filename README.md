# AI Coding Tools Weekly Survey

A weekly survey for a private community on use, adoption, and experiences with AI coding tools. Heavily influenced by the [State of JS surveys](https://stateofjs.com/).

<img width="300" alt="screenshot of intro page and welcome" src="https://github.com/user-attachments/assets/79816fab-686f-41f8-987b-00e0a2c2caba" />
<img width="300" alt="screenshot of awareness/experience questions" src="https://github.com/user-attachments/assets/28da240b-a9fb-4697-b7f-ebff694e9cd4" />
<img width="300" alt="screenshot of results page showing awareness/experience breakdown" src="https://github.com/user-attachments/assets/c3e56d1f-5043-4a00-942c-79494e9c293e" />

## Setup

### Prerequisites

- Node.js 24+
- pnpm package manager
- PostgreSQL database (Postgres.app or Docker)

### Installation

1. **Create environment file:**

   ```bash
   cp .env.example .env
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Run database migrations:**

   ```bash
   pnpm db:latest
   ```

4. **Sync survey configuration:**

   ```bash
   pnpm db:sync
   ```

5. **Seed database with sample data:**

   ```bash
   pnpm db:seed
   ```

6. **Start development server:**

   ```bash
   pnpm dev
   ```

...and access the survey at http://localhost:3000/

## Development

### Config Changes

When modifying `config.yml`, simply update the config and run `pnpm db:sync` to apply changes. The sync process is designed to migrate questions as the survey evolves over time without creating duplicate data.

### Database Changes

When making database schema changes:

1. Create a new Kysely migration in `src/server/db/migrations/`
2. Apply migrations: `pnpm db:latest`
3. Generate TypeScript types: `pnpm db:codegen`
4. Export schema documentation: `pnpm db:schema`

## License

[MIT License](LICENSE)
