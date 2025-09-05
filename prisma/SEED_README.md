# Database Seeding

The consolidated seed script (`prisma/seed-consolidated.ts`) provides a flexible way to populate your database with test data.

## Available Commands

### Basic Seeding
```bash
# Run the full seed (clear data, create questions, generate 50 fake responses)
pnpm seed

# Alias for the full seed
pnpm seed:all
```

### Partial Seeding
```bash
# Only create questions (no fake responses)
pnpm seed:questions

# Only add fake responses (keeps existing questions)
pnpm seed:responses
```

### Custom Options
You can use command-line arguments for more control:

```bash
# Don't clear existing data
npx tsx prisma/seed-consolidated.ts --no-clear

# Don't create questions
npx tsx prisma/seed-consolidated.ts --no-questions

# Don't create fake responses
npx tsx prisma/seed-consolidated.ts --no-responses

# Create a specific number of fake responses (default is 50)
npx tsx prisma/seed-consolidated.ts --responses 100

# Combine options
npx tsx prisma/seed-consolidated.ts --no-clear --responses 25
```

## What Gets Seeded

### Questions
- **Demographics**: Years of experience, company size, development area, location
- **AI Tools**: 18 popular AI coding assistants (GitHub Copilot, Cursor, Claude, etc.)
- **Editors**: 10 popular code editors (VS Code, IntelliJ, Vim, etc.)
- **Frameworks**: 15 popular frameworks (React, Vue, Django, etc.)
- **Opinions**: Questions about AI impact, concerns, and future predictions

### Fake Data
- User sessions with random metadata
- Weighted responses based on tool popularity
- Experience metrics and trend data
- Sample feedback comments

## Prisma Integration

The seed script is also integrated with Prisma's database workflow:

```bash
# Reset database and run seed
npx prisma migrate reset

# The seed script is automatically run after migrations
```

## Old Seed Files (Deprecated)

The following seed files have been consolidated and are no longer needed:
- `prisma/seed.ts` - Original basic seed
- `prisma/seed-responses.ts` - Response generation
- `src/lib/seed.ts` - Alternative seed implementation
- `src/lib/seed-*.ts` - Various partial seed scripts

All functionality from these files is now available in the consolidated seed script with better organization and command-line options.