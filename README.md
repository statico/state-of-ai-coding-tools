# State of AI Coding Tools Survey System

A modern, responsive survey platform built with Next.js and shadcn/ui for collecting insights about AI coding tool usage and preferences in private Slack communities.

## 🌟 Features

- **Beautiful UI** - Built with shadcn/ui components and Tailwind CSS for a modern, accessible interface
- **Multiple Question Types** - Support for single choice, multiple choice, rating, and text responses
- **Secure Access** - Password-protected surveys with configurable weekly passwords
- **Real-time Navigation** - Easy navigation between survey sections with persistent navigation bar
- **Response Validation** - Built-in validation for required questions with helpful error messages
- **Results Visualization** - Interactive charts and graphs for viewing aggregated survey results
- **LocalStorage Persistence** - Honor-system user tracking with response history
- **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile devices

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm package manager
- PostgreSQL database (or SQLite for development)

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/state-of-ai-coding-tools.git
cd state-of-ai-coding-tools
```

2. **Install dependencies:**
```bash
pnpm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env.local
```

Edit `.env.local` and configure:
```env
# Database connection
DATABASE_URL="postgresql://user:password@localhost:5432/survey_db"

# Survey password (required for survey access)
SURVEY_PASSWORD="your-secure-password-here"
```

4. **Set up the database:**
```bash
# Push the schema to your database
pnpm db:push

# Seed with sample questions (optional)
pnpm seed
```

5. **Start the development server:**
```bash
PORT=4001 pnpm dev
```

Visit `http://localhost:4001` to see the application.

## 🔐 Password Configuration

### Setting the Survey Password

The survey requires a password for access. This can be configured in several ways:

1. **Environment Variable (Recommended):**
   - Set `SURVEY_PASSWORD` in your `.env.local` file for development
   - Set it in your hosting platform's environment settings for production

2. **Default Password:**
   - If no password is set, the system defaults to `survey2024`
   - **Important:** Always set a custom password in production

### Changing the Password

1. **Local Development:**
   - Edit the `SURVEY_PASSWORD` value in `.env.local`
   - Restart the development server

2. **Production (Vercel):**
   - Go to your Vercel project settings
   - Navigate to Environment Variables
   - Update the `SURVEY_PASSWORD` value
   - Redeploy your application

3. **Production (Other Platforms):**
   - Update the environment variable in your platform's settings
   - Restart or redeploy as required by your platform

### Weekly Password Rotation

For weekly rotating passwords in Slack communities:
1. Update the `SURVEY_PASSWORD` environment variable weekly
2. Share the new password in your Slack channel
3. Previous survey responses remain accessible

## 🗂️ Project Structure

```
src/
├── app/                  # Next.js app router pages
│   ├── api/              # API routes
│   ├── auth/             # Authentication page
│   ├── survey/           # Survey pages
│   ├── results/          # Results visualization
│   └── page.tsx          # Home page
├── components/           # React components
│   ├── ui/               # shadcn/ui components
│   └── Navigation.tsx    # Main navigation
├── lib/                  # Utilities and services
│   ├── auth-context.tsx  # Authentication context
│   ├── db.ts             # Database connection
│   └── services/         # Business logic
└── prisma/
    └── schema.prisma      # Database schema
```

## 🧑‍💻 Development

### Available Scripts

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server

# Code Quality
pnpm lint             # Run ESLint
pnpm types            # Check TypeScript types
pnpm format           # Format code with Prettier

# Testing
pnpm test             # Run unit tests
pnpm test:e2e         # Run end-to-end tests
pnpm test:e2e:ui      # Run e2e tests with UI

# Database
pnpm db:push          # Push schema changes
pnpm db:migrate       # Run migrations
pnpm db:studio        # Open Prisma Studio
pnpm seed             # Seed the database
```

### Tech Stack

- **Framework:** Next.js 15 (App Router)
- **UI Components:** shadcn/ui
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** Custom password-based system
- **State Management:** Zustand + LocalStorage
- **Forms:** React Hook Form with Zod validation
- **Charts:** Recharts
- **Testing:** Vitest + Playwright

## 🎯 Testing

### Unit Tests

```bash
# Run all unit tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Run tests with coverage
pnpm test --coverage
```

### End-to-End Tests

```bash
# Run e2e tests headlessly
pnpm test:e2e

# Run e2e tests with UI
pnpm test:e2e:ui

# Run specific test file
pnpm test:e2e tests/survey.spec.ts
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Configure environment variables:
   - `DATABASE_URL`
   - `SURVEY_PASSWORD`
4. Deploy

### Docker

```bash
# Build the image
docker build -t survey-app .

# Run the container
docker run -p 4001:4001 \
  -e DATABASE_URL="your-db-url" \
  -e SURVEY_PASSWORD="your-password" \
  survey-app
```

### Manual Deployment

```bash
# Build the application
pnpm build

# Set environment variables
export DATABASE_URL="your-db-url"
export SURVEY_PASSWORD="your-password"

# Start the server
pnpm start
```

## 📊 Survey Management

### Question Types

The system supports various question types:
- **Single Choice** - Radio button selection
- **Multiple Choice** - Checkbox selection
- **Rating** - 1-5 star rating
- **Text** - Open-ended text responses
- **Demographic** - Special single-choice for demographic data

### Managing Questions

Questions persist over time while options can be added or marked inactive:

1. **Adding Questions:** Use the seed script or Prisma Studio
2. **Managing Options:** Mark tools/frameworks as inactive when obsolete
3. **Historical Data:** All responses preserved for trend analysis

## 🔄 Data Flow

1. **Survey Creation** - Admin creates surveys and manages questions
2. **Authentication** - Users enter weekly password to access
3. **Response Collection** - Answers saved to database + localStorage
4. **Results Compilation** - Real-time aggregation and visualization
5. **Historical Analysis** - Trend tracking across survey periods

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔒 Security

- Never commit `.env.local` or any files containing sensitive information
- Always use environment variables for passwords and API keys
- Regularly update dependencies to patch security vulnerabilities
- Use strong, unique passwords for production deployments
- Rotate passwords weekly for Slack community surveys

## 💬 Support

For issues, questions, or suggestions, please:
- Open an issue on GitHub
- Check existing issues for similar problems
- Provide reproduction steps for bugs

## 🎨 Design Philosophy

This survey system follows the design philosophy of State of JavaScript:
- Clean, modern interface with excellent UX
- Progressive disclosure of information
- Mobile-first responsive design
- Accessible to all users
- Fast, lightweight, and performant