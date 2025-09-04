# AI Coding Tools Weekly Survey

A comprehensive weekly survey platform for tracking AI coding tool adoption and preferences in the development community. Built with Next.js, featuring automatic password rotation, State of JS style questions, and real-time results visualization.

## 🌟 Features

- **Weekly Password Rotation** - Automatic password rotation every Monday at 00:00 UTC with 3 years of pre-generated passwords
- **State of JS Style Questions** - 4-option experience scale (Never heard / Heard not interested / Used won't use again / Used would use again)
- **Tabbed Survey Interface** - Multi-section survey organized into Demographics, AI Tools, Preferences, Challenges, and Feedback
- **Server-Side Authentication** - Secure iron-session based authentication with middleware protection
- **Share Functionality** - Built-in share modal with current week's password for easy distribution
- **Write-in Support** - Optional custom tool entries for experience questions
- **Beautiful UI** - Built with shadcn/ui components and Tailwind CSS
- **Real-time Results** - Interactive charts for viewing aggregated survey data
- **Progressive Disclosure** - Tab-based navigation with validation between sections
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
DATABASE_URL="your-db-url" pnpm db:push

# Seed with sample questions
DATABASE_URL="your-db-url" SURVEY_PASSWORD="initial-password" pnpm seed

# Generate weekly passwords (3 years worth)
DATABASE_URL="your-db-url" pnpm tsx src/lib/seed-passwords.ts
```

5. **Start the development server:**
```bash
PORT=4001 pnpm dev
```

Visit `http://localhost:4001` to see the application.

## 🔐 Password System

### Automatic Weekly Password Rotation

The system automatically rotates passwords every Monday at 00:00 UTC:

1. **Initial Setup:**
```bash
# Generate 3 years of weekly passwords
DATABASE_URL="your-db-url" pnpm tsx src/lib/seed-passwords.ts
```

2. **Password Management:**
   - Passwords are stored in the `weekly_passwords` table
   - Current week's password is automatically activated
   - Use faker.js to generate readable, memorable passwords

3. **Sharing Passwords:**
   - Click the "Share Survey" button in the survey interface
   - Modal displays current URL and weekly password
   - One-click copy for both URL and password

4. **Session Management:**
   - Uses iron-session for secure server-side sessions
   - Sessions persist for 7 days
   - Middleware protects API routes

### Manual Password Override (Optional)

For custom passwords, you can still use environment variables:
- Set `SURVEY_PASSWORD` in `.env.local` for development
- This will override the weekly password system if needed

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
- **Experience** - State of JS style 4-option scale with optional write-in
- **Single Choice** - Radio button selection
- **Multiple Choice** - Checkbox selection  
- **Rating** - 1-5 star rating
- **Text** - Open-ended text responses
- **Demographic** - Special single-choice for demographic data
- **Write-in** - Optional custom entries for tools not listed

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
- Progressive disclosure through tabbed sections
- State of JS style experience questions
- Mobile-first responsive design
- Accessible to all users
- Fast, lightweight, and performant

## 📋 Survey Structure

The survey is organized into 5 progressive sections:

1. **Demographics Tab**
   - Background information
   - Experience level
   - Role and company size

2. **AI Tools Tab**
   - Tool usage and experience ratings
   - State of JS style 4-option scale
   - Optional write-in for custom tools

3. **Preferences Tab**
   - Workflow preferences
   - Integration preferences
   - Feature priorities

4. **Challenges Tab**
   - Pain points
   - Adoption obstacles
   - Missing features

5. **Feedback Tab**
   - Open feedback
   - Suggestions
   - Final submit button