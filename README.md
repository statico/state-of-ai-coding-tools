# AI Coding Tools Weekly Survey

A comprehensive weekly survey platform for tracking AI coding tool adoption and preferences in the development community. Built with Next.js with real-time results visualization.

This survey platform aims to capture the evolving landscape of AI-powered coding tools by collecting weekly data on developer preferences, adoption rates, and experiences across various AI coding assistants, IDEs, and LLMs. The project provides insights into tool effectiveness, developer sentiment, and emerging trends in AI-assisted development through aggregated community feedback and trend analysis over time.

> [!NOTE]
> This project has been almost entirely vibe coded with Claude Code.

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

## Database Operations

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

**TypeScript errors:**
```bash
pnpm prisma generate  # Regenerate Prisma types
pnpm types           # Check for type errors
```

## License

Unlicense - see [LICENSE](LICENSE) file for details.