# AI Coding Tools Weekly Survey

A comprehensive weekly survey platform for tracking AI coding tool adoption and preferences in the development community. Built with Next.js with real-time results visualization.

This survey platform aims to capture the evolving landscape of AI-powered coding tools by collecting weekly data on developer preferences, adoption rates, and experiences across various AI coding assistants, IDEs, and LLMs. The project provides insights into tool effectiveness, developer sentiment, and emerging trends in AI-assisted development through aggregated community feedback and trend analysis over time.

> [!NOTE]
> This project has been almost entirely vibe coded with Claude Code.

## Data Structure

**Question Types:**
- `EXPERIENCE`: State of JS-style tool experience tracking (Never heard/Want to try/Not interested/Would use again/Would not use)
- `SINGLE_CHOICE`: Radio button selection for one option
- `MULTIPLE_CHOICE`: Checkbox selection for multiple options
- `RATING`: 1-5 star rating scale
- `TEXT`: Open-ended text responses
- `DEMOGRAPHIC`: Single-choice demographic questions
- `WRITE_IN`: Optional custom text entries

**Data Storage:**
- **Questions**: Stored with title, description, type, category, and ordering
- **Responses**: Linked to user sessions and questions, storing selected options, ratings, text values, and experience levels
- **Sessions**: Track user progress through the survey with demographic data and completion status
- **Metrics**: Aggregated experience metrics calculate awareness, adoption, and satisfaction rates per tool
- **Trends**: Monthly snapshots of tool metrics for tracking changes over time

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 10+
- PostgreSQL database

### Installation

1. **Clone and install dependencies:**
```bash
git clone https://github.com/statico/state-of-ai-coding-tools.git
cd state-of-ai-coding-tools
pnpm install
```

2. **Set up environment variables:**
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
DATABASE_URL="postgresql://user:password@localhost:5433/survey_db"
SESSION_SECRET="your-secret-at-least-32-characters-long"
SURVEY_PASSWORD="secret"  # Optional, defaults to "secret" if not set
```

3. **Set up the database:**
```bash
# Apply existing migrations to the database
pnpm prisma migrate deploy

# Seed the database with questions and sample data
pnpm seed
```

4. **Start the development server:**
```bash
PORT=4001 pnpm dev
```

Visit `http://localhost:4001`

## Database Management

### Seeding Data

The consolidated seed script provides flexible options for populating your database:

**Basic Seeding:**
```bash
# Full seed (clear data, create questions, generate 50 fake responses)
pnpm seed

# Only create questions (no fake responses)
pnpm seed:questions

# Only add fake responses (keeps existing questions)
pnpm seed:responses
```

**Custom Options:**
```bash
# Don't clear existing data
npx tsx prisma/seed-consolidated.ts --no-clear

# Create a specific number of fake responses (default is 50)
npx tsx prisma/seed-consolidated.ts --responses 100

# Combine options
npx tsx prisma/seed-consolidated.ts --no-clear --responses 25
```

**What Gets Seeded:**
- **Demographics**: Years of experience, company size, development area, location
- **AI Tools**: 18 popular AI coding assistants (GitHub Copilot, Cursor, Claude, etc.)
- **Editors**: 10 popular code editors (VS Code, IntelliJ, Vim, etc.)
- **Frameworks**: 15 popular frameworks (React, Vue, Django, etc.)
- **Opinions**: Questions about AI impact, concerns, and future predictions
- **Fake Data**: Weighted responses based on tool popularity, experience metrics, and trend data

### Database Operations

```bash
# Open Prisma Studio to view/edit data
pnpm prisma studio

# Reset database (CAUTION: destroys all data)
pnpm prisma migrate reset --force

# Generate Prisma client after schema changes
pnpm prisma generate

# Create a new migration
pnpm prisma migrate dev --name your-migration-name
```

## Development Workflow

### Running the Application

```bash
# Development mode with hot reload
PORT=4001 pnpm dev

# Production build
pnpm build
pnpm start

# Run tests
pnpm test

# Type checking
pnpm types

# Linting
pnpm lint
```

### Project Structure

```
src/
├── app/                  # Next.js app router
│   ├── api/             # API endpoints
│   ├── auth/            # Authentication page
│   ├── survey/          # Survey interface
│   └── results/         # Results visualization
├── components/          # React components
│   └── ui/             # shadcn/ui components
├── lib/                # Utilities and services
│   ├── services/       # Business logic
│   ├── password-manager.ts  # Weekly password system
│   └── session.ts      # Session configuration
└── prisma/
    └── schema.prisma   # Database schema
```

## Modifying the Survey

### Adding New Questions

1. **Update the seed script** (`prisma/seed-consolidated.ts`):
```typescript
const aiTools = [
  'GitHub Copilot',
  'Cursor',
  'New AI Tool', // Add your tool here
  // ...
]
```

2. **Re-run the seed:**
```bash
# Clear and re-seed everything
pnpm seed

# Or just add to existing data
npx tsx prisma/seed-consolidated.ts --no-clear
```

### Question Types

- `EXPERIENCE` - State of JS style experience tracking
- `SINGLE_CHOICE` - Radio button selection
- `MULTIPLE_CHOICE` - Checkbox selection
- `RATING` - 1-5 star rating
- `TEXT` - Open-ended text
- `DEMOGRAPHIC` - Demographic single-choice
- `WRITE_IN` - Optional custom entries

### Modifying Existing Questions

Use Prisma Studio for quick edits:
```bash
pnpm prisma studio
```

Or modify via SQL/migrations for production changes.

## Deployment

### Docker

```bash
# Build the image
docker build -t state-of-ai-coding-tools .

# Run with environment variables
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e SESSION_SECRET="..." \
  state-of-ai-coding-tools
```

### Docker Compose

For a complete local development setup with PostgreSQL:

1. **Create `docker-compose.yml`:**
```yaml
version: '3.8'

services:
  db:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_DB: survey_db
      POSTGRES_USER: survey_user
      POSTGRES_PASSWORD: survey_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5433:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U survey_user -d survey_db"]
      interval: 10s
      timeout: 5s
      retries: 5

  app:
    build: .
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: "postgresql://survey_user:survey_password@db:5432/survey_db"
      SESSION_SECRET: "your-secret-at-least-32-characters-long-change-this"
      NODE_ENV: production
    depends_on:
      db:
        condition: service_healthy
    command: >
      sh -c "
        npx prisma migrate deploy &&
        node server.js
      "

volumes:
  postgres_data:
```

2. **Create `.env` file for Docker Compose:**
```env
# .env (for docker-compose)
POSTGRES_DB=survey_db
POSTGRES_USER=survey_user
POSTGRES_PASSWORD=changeme123
SESSION_SECRET=your-production-secret-at-least-32-chars
```

3. **Run the stack:**
```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Run migrations (first time only)
docker-compose exec app npx prisma migrate deploy

# Seed the database
docker-compose exec app npx tsx prisma/seed-consolidated.ts

# Stop services
docker-compose down

# Stop and remove volumes (CAUTION: destroys data)
docker-compose down -v
```

### Development with Docker Compose

For development with hot reload:

```yaml
# docker-compose.dev.yml
version: '3.8'

services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: survey_db
      POSTGRES_USER: survey_user
      POSTGRES_PASSWORD: survey_password
    ports:
      - "5433:5432"
    volumes:
      - postgres_dev_data:/var/lib/postgresql/data

  app:
    image: node:20-alpine
    working_dir: /app
    volumes:
      - .:/app
      - node_modules:/app/node_modules
    ports:
      - "4001:4001"
    environment:
      DATABASE_URL: "postgresql://survey_user:survey_password@db:5432/survey_db"
      SESSION_SECRET: "development-secret-at-least-32-characters-long"
      PORT: 4001
    depends_on:
      - db
    command: sh -c "npm install -g pnpm && pnpm install && pnpm dev"

volumes:
  postgres_dev_data:
  node_modules:
```

Run development environment:
```bash
docker-compose -f docker-compose.dev.yml up
```

### Environment Variables

Required for production:
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - At least 32 characters for session encryption

Optional:
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Set to "production" for production builds

### Database Migrations in Production

```bash
# Apply pending migrations
pnpm prisma migrate deploy

# Check migration status
pnpm prisma migrate status
```

## Password System

The survey uses a simple password system configured via environment variable:

- Set `SURVEY_PASSWORD` in your `.env.local` file
- If not set, defaults to `"secret"`
- The password is displayed in the Share Survey modal for easy sharing
## Testing

```bash
# Run all tests
pnpm test

# Run with coverage
pnpm test -- --coverage

# Watch mode for development
pnpm test -- --watch
```

## Troubleshooting

### Common Issues

**Port already in use:**
```bash
PORT=4002 pnpm dev  # Use a different port
```

**Database connection issues:**
- Ensure PostgreSQL is running
- Check DATABASE_URL format
- Verify database exists

**Session errors during build:**
- The `BUILDING=1` environment variable is set during Docker builds
- SESSION_SECRET is not required for build time

**TypeScript errors:**
```bash
pnpm prisma generate  # Regenerate Prisma types
pnpm types           # Check for type errors
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) file for details.