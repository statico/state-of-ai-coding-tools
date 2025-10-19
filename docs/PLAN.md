# AI Coding Tools Weekly Survey - Product Documentation

## Executive Summary

The **AI Coding Tools Weekly Survey** is a comprehensive web-based survey platform designed to track the evolving landscape of AI-powered coding tools through weekly community feedback. Built with Next.js 15, React 19, PostgreSQL, and Prisma, the platform captures developer preferences, adoption rates, and experiences across various AI coding assistants, IDEs, and LLMs, providing insights through real-time results visualization and trend analysis over time.

## Product Vision & Goals

### Primary Goals

1. **Track AI Tool Adoption**: Capture weekly snapshots of which AI coding tools developers are using, trying, or avoiding
2. **Measure Developer Sentiment**: Understand satisfaction levels and concerns about AI-assisted development
3. **Identify Trends**: Track changes in tool popularity, adoption rates, and developer preferences over time
4. **Community Insights**: Provide aggregated, anonymous feedback to help the development community make informed decisions

### Target Audience

- Software developers actively using or exploring AI coding tools
- Development teams evaluating AI tool adoption
- Product managers and researchers tracking AI development tool trends
- Community members interested in the state of AI-assisted coding

## Core Features

### 1. Password-Protected Survey Access

- **Simple Authentication**: Single shared password system (configurable via `SURVEY_PASSWORD` environment variable)
- **Session Management**: 7-day session persistence using iron-session with secure, HTTP-only cookies
- **Protected Routes**: Middleware-based protection for survey submission and question access APIs
- **No User Accounts**: Simplified access model without individual user registration

### 2. Multi-Category Tabbed Survey Interface

- **Dynamic Categories**: Survey organized into tabs fetched from database (demographics, tools, models, sentiment, etc.)
- **Category Management**: Each category has a key, label, description, order index, and active status
- **Progress Tracking**: Visual indicators show completed sections with checkmarks
- **URL Hash Navigation**: Deep-linkable tabs via URL fragments (e.g., `/survey#demographics`)
- **Smooth Navigation**: Previous/Next buttons with validation and smooth scrolling
- **Responsive Design**: Mobile-friendly layout with grid-based tab display

### 3. Diverse Question Types

#### Experience Questions (State of JS Style)

- **Single-Axis Experience Tracking**: 
- 🤷 Never heard of it / not sure what it is
- ✅ Heard of it, would like to try it
- 🚫 Heard of it, not interested
- 👍 Used it, would use again
- 👎 Used it, would not use again
- **Optional Write-In**: Additional text field for comments
- **Used For**: AI tools, editors, frameworks evaluation

#### Single Choice Questions

- **Radio Button Selection**: One option from a list
- **Smart Rendering**: Automatically switches to dropdown for >10 options
- **Use Cases**: Demographic data, primary tool selection

#### Multiple Choice Questions

- **Checkbox Selection**: Multiple options from a list
- **"Other" Option Support**: Custom text input for unlisted options
- **Use Cases**: Tool combinations, feature preferences

#### Rating Questions

- **1-5 Star Scale**: Visual star rating interface
- **Use Cases**: Satisfaction levels, feature importance

#### Text Questions

- **Open-Ended Responses**: Free-form text area
- **Use Cases**: Feedback, suggestions, concerns

#### Demographic Questions

- **Specialized Single Choice**: For user background information
- **Examples**: Years of experience, company size, development area, location

### 4. Real-Time Results Visualization

#### Results Page (`/results`)

- **Weekly View**: Display results for current or past weeks
- **Week Navigation**: Previous/next buttons to browse historical data
- **Multiple Chart Types**:
- **Pie Charts**: Single choice and demographic questions
- **Bar Charts**: Multiple choice questions
- **Rating Charts**: Average ratings with distribution
- **Experience Charts**: Stacked horizontal bar charts showing tool experience distribution
- **Category Grouping**: Results organized by question categories
- **Response Count**: Total responses displayed prominently
- **Unified Color Scheme**: Consistent Tailwind-based color palette across all visualizations

### 5. Trends Analysis

#### Trends Page (`/trends`)

- **Time-Series Visualization**: Track metrics over weeks/months
- **Configurable Time Ranges**: 4, 8, 12, 26, or 52 weeks
- **Tab-Based Navigation**: Separate tabs for overview and each category
- **Overview Tab**: 
- Total weekly responses line chart
- Summary statistics (latest week, average, peak, total)
- **Category Tabs**: 
- Line charts for experience questions (tracking each experience level over time)
- Stacked bar charts for choice questions (percentage distribution over time)
- Average rating trends for rating questions
- Text response counts over time
- **Performance Optimized**: Lazy loading of category data, client-side caching

### 6. Data Management & Analytics

#### Experience Metrics

- **Aggregated Calculations**:
- **Awareness Rate**: Percentage who have heard of the tool
- **Adoption Rate**: Percentage who have used the tool
- **Satisfaction Rate**: Percentage of users who would use again
- **Tool-Level Tracking**: Metrics calculated per tool/option
- **Distribution Snapshots**: JSON storage of full experience distribution

#### Trend Tracking

- **Monthly Snapshots**: Historical data points stored in `ExperienceTrend` table
- **Change Tracking**: Calculate change from previous period
- **Demographic Breakdown**: Store rates by demographic segments (JSON)
- **Performance Indexes**: Database indexes on category and month for fast queries

### 7. Session & Response Management

#### User Sessions

- **Anonymous Sessions**: UUID-based session IDs generated server-side
- **Progress Tracking**: JSON storage of survey completion state
- **Demographic Data**: Associated demographic responses stored with session
- **Completion Tracking**: `completedAt` timestamp for submitted surveys
- **Duplicate Prevention**: Check for existing submissions before allowing resubmission

#### Response Storage

- **Flexible Schema**: Single response table handles all question types
- **Type-Specific Fields**:
- `optionId`: For single choice selections
- `textValue`: For text responses
- `ratingValue`: For 1-5 ratings
- `writeInValue`: For optional write-in comments
- `experience`: For experience level (enum)
- **Relational Integrity**: Foreign keys with cascade delete to questions and sessions
- **Timestamps**: Created/updated tracking for all responses

## Technical Architecture

### Frontend Stack

- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4.1
- **Component Library**: Radix UI primitives (accessible, unstyled components)
- **UI Components**: shadcn/ui (customizable, copy-paste components)
- **Charts**: Recharts 3.1 (responsive, composable charts)
- **State Management**: Zustand 5.0 (lightweight, hook-based)
- **Form Handling**: React Hook Form 7.62 with Zod 4.1 validation
- **Theme**: next-themes for dark/light mode support
- **Icons**: Lucide React

### Backend Stack

- **Runtime**: Node.js 20+
- **Database**: PostgreSQL (port 5433 for local dev)
- **ORM**: Prisma 6.15 (type-safe database client)
- **Session Management**: iron-session 8.0 (encrypted, cookie-based sessions)
- **API Routes**: Next.js API routes (serverless functions)

### Development Tools

- **Package Manager**: pnpm 10+
- **Testing**: 
- Vitest 3.2 (unit/component tests)
- Playwright 1.55 (E2E tests)
- Testing Library (React component testing)
- **Code Quality**:
- ESLint (Next.js config)
- Prettier (code formatting)
- TypeScript 5.9 (strict type checking)
- Husky + lint-staged (pre-commit hooks)
- **Database Tools**: Prisma Studio (visual database browser)

### Deployment

- **Containerization**: Docker support (Dockerfile + docker-compose.yml)
- **Environment Variables**:
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: 32+ character secret for session encryption
- `SURVEY_PASSWORD`: Shared password for survey access (defaults to "secret")
- `PORT`: Server port (default 4001)

## Database Schema

### Core Tables

#### `categories`

- Dynamic survey categories with ordering and descriptions
- Fields: `id`, `key`, `label`, `description`, `order_index`, `is_active`, timestamps

#### `questions`

- Survey questions with type, category, and ordering
- Fields: `id`, `title`, `description`, `type`, `category`, `category_id`, `order_index`, `is_required`, `is_active`, timestamps
- Types: `SINGLE_CHOICE`, `MULTIPLE_CHOICE`, `RATING`, `TEXT`, `DEMOGRAPHIC`, `EXPERIENCE`, `WRITE_IN`

#### `question_options`

- Options for choice-based questions
- Fields: `id`, `question_id`, `value`, `label`, `description`, `order_index`, `is_active`, timestamps
- Cascade delete on question removal

#### `user_sessions`

- Anonymous user sessions tracking survey progress
- Fields: `id` (UUID), `demographic_data` (JSON), `progress` (JSON), `completed_at`, timestamps

#### `responses`

- Individual question responses linked to sessions
- Fields: `id`, `session_id`, `question_id`, `option_id`, `text_value`, `rating_value`, `write_in_value`, `experience`, timestamps
- Cascade delete on question/session removal

#### `experience_metrics`

- Aggregated metrics for experience questions
- Fields: `id`, `tool_name`, `category`, experience counts (never_heard, want_to_try, not_interested, would_use_again, would_not_use), derived rates (awareness, adoption, satisfaction), `total_responses`, `calculated_at`
- Unique constraint on `tool_name`

#### `experience_trends`

- Historical snapshots of experience metrics
- Fields: `id`, `tool_name`, `category`, `month`, rates (awareness, adoption, satisfaction), `change_from_prev`, `distribution` (JSON), `by_demographic` (JSON), `created_at`
- Unique constraint on `tool_name` + `month`

### Indexes

- Category ordering: `categories.order_index`
- Question organization: `questions.category_id`
- Response queries: `responses.created_at`
- Trend analysis: `experience_trends(category, month)`
- Metrics lookup: `experience_metrics.category`

## Key User Flows

### 1. First-Time Survey Participant

1. Visit homepage → Redirect to `/auth`
2. Enter shared password → Session created (7-day cookie)
3. Redirect to `/survey` → Load categories and questions
4. Complete survey tab by tab:

- Answer required questions (validation on Next button)
- Optional questions can be skipped
- Progress tracked with checkmarks

5. Submit on final tab → Create session ID, store responses
6. Redirect to `/survey/thank-you` → Confirmation page
7. Can view `/results` and `/trends` without re-authentication

### 2. Returning User (Within 7 Days)

1. Visit homepage → Check session → Redirect to `/survey`
2. Check for existing submission → Show "Already Submitted" message
3. Can still browse questions but cannot resubmit
4. Can navigate to `/results` and `/trends` freely

### 3. Administrator/Analyst

1. Access `/results` → View current week's aggregated data
2. Use week navigation to browse historical results
3. Click "View Trends" → Navigate to `/trends`
4. Select time range (4-52 weeks)
5. Browse category tabs to see specific question trends
6. Use Prisma Studio for direct database access (local dev)

## Data Seeding & Testing

### Seed Script (`prisma/seed-consolidated.ts`)

- **Full Seed**: Clear database, create questions, generate 50 fake responses
- **Partial Seeds**: Questions only, responses only
- **Configurable Options**: 
- `--no-clear`: Keep existing data
- `--no-questions`: Skip question creation
- `--no-responses`: Skip fake response generation
- `--responses N`: Generate N fake responses (default 50)

### Seed Data Includes

- **Demographics**: 4 questions (experience, company size, development area, location)
- **AI Tools**: 18 popular tools (GitHub Copilot, Cursor, Claude, ChatGPT, etc.)
- **Editors**: 10 code editors (VS Code, IntelliJ, Vim, Neovim, etc.)
- **Frameworks**: 15 frameworks (React, Vue, Django, Rails, etc.)
- **Opinions**: 5+ questions about AI impact, concerns, predictions

### Testing Strategy

- **Unit Tests**: Vitest for component testing (React Testing Library)
- **E2E Tests**: Playwright for full user flows
- `auth.spec.ts`: Authentication flow
- `survey.spec.ts`: Survey completion
- `results.spec.ts`: Results visualization
- `comprehensive.spec.ts`: End-to-end scenarios
- **Test Database**: Separate database for testing (configured in `test-db.js`)

## API Endpoints

### Authentication

- `POST /api/auth/verify`: Verify password and create session
- `POST /api/auth/logout`: Destroy session
- `GET /api/auth/session`: Check current session status

### Survey

- `GET /api/survey/categories`: Fetch active categories
- `GET /api/survey/questions`: Fetch all active questions with options (protected)
- `POST /api/survey/check-submission`: Check if session has submitted
- `POST /api/survey/submit`: Submit survey responses (protected)

### Session

- `POST /api/session/create`: Generate new session ID

### Results & Trends

- `GET /api/results?weekOffset=N`: Fetch aggregated results for a specific week
- `GET /api/trends?weeks=N&category=X`: Fetch trend data for time range and category

### Health

- `GET /api/health`: Health check endpoint

## Design Principles

### User Experience

- **Minimal Friction**: Single password, no registration, 7-day sessions
- **Progressive Disclosure**: Tabbed interface reveals questions gradually
- **Clear Progress**: Visual indicators show completion status
- **Validation Feedback**: Inline error messages for required questions
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Accessibility**: Radix UI primitives ensure WCAG compliance

### Data Privacy

- **Anonymous Sessions**: No personal identifiers collected
- **Aggregated Results**: Only aggregate data displayed publicly
- **Community-Focused**: Responses intended for private community sharing
- **No Tracking**: No third-party analytics or tracking scripts

### Performance

- **Optimized Queries**: Database indexes on frequently queried fields
- **Lazy Loading**: Category data loaded on-demand in trends page
- **Client-Side Caching**: Reduce redundant API calls
- **Efficient Charts**: Recharts with animation disabled for performance
- **Database Connection Pooling**: Prisma connection management

### Code Quality

- **Type Safety**: TypeScript throughout, Prisma-generated types
- **Component Reusability**: Shared UI components via shadcn/ui
- **Direct Imports**: No barrel files, explicit imports for clarity
- **Co-located Schemas**: Zod validation schemas with services
- **Consistent Styling**: Tailwind utility classes, no CSS files

## Development Workflow

### Local Setup

1. Clone repository
2. Install dependencies: `pnpm install`
3. Configure `.env.local` with `DATABASE_URL`, `SESSION_SECRET`, `SURVEY_PASSWORD`
4. Start PostgreSQL (port 5433)
5. Run migrations: `pnpm prisma migrate deploy`
6. Seed database: `pnpm seed`
7. Start dev server: `PORT=4001 pnpm dev`

### Database Migrations

- **Create Migration**: `pnpm prisma migrate dev --name migration-name`
- **Apply Migrations**: `pnpm prisma migrate deploy`
- **Reset Database**: `pnpm prisma migrate reset --force` (local only)
- **Generate Client**: `pnpm prisma generate`
- **Studio**: `pnpm prisma studio` (visual database browser)

### Code Quality Checks

- **Linting**: `pnpm lint` (ESLint)
- **Type Checking**: `pnpm types` (TypeScript)
- **Formatting**: `pnpm format` (Prettier)
- **Unit Tests**: `pnpm test` (Vitest)
- **E2E Tests**: `pnpm test:e2e` (Playwright)

### Git Workflow

- Commit frequently after significant features
- Descriptive commit messages
- Ensure tests pass before committing
- Pre-commit hooks run Prettier via lint-staged

## Future Enhancements (Potential Roadmap)

### Completed Items

- ✅ Trends page performance optimization
- ✅ Category consolidation (7 categories max)
- ✅ Navigation cleanup (removed Home tab)
- ✅ Color scheme unification (Tailwind colors)
- ✅ Login button flash prevention

### Pending Items

- [ ] Sort bar/pie charts by largest value first
- [ ] Add tests for results and trends data endpoints
- [ ] Export results to CSV/JSON
- [ ] Admin dashboard for question management
- [ ] Email notifications for new responses
- [ ] Multi-language support
- [ ] Custom branding per deployment
- [ ] API rate limiting
- [ ] Response editing (within time window)
- [ ] Comparison views (week-over-week, tool-vs-tool)

## Deployment Considerations

### Environment Requirements

- Node.js 20+ runtime
- PostgreSQL 14+ database
- Minimum 512MB RAM
- SSL certificate for production (secure cookies)

### Environment Variables (Production)

- `DATABASE_URL`: Production PostgreSQL connection string
- `SESSION_SECRET`: Strong 32+ character random string
- `SURVEY_PASSWORD`: Secure shared password
- `NODE_ENV`: Set to `production`
- `PORT`: Server port (default 4001)

### Security Checklist

- ✅ Secure session cookies (httpOnly, secure, sameSite)
- ✅ Environment variable validation
- ✅ SQL injection protection (Prisma parameterized queries)
- ✅ XSS protection (React escaping)
- ✅ CSRF protection (sameSite cookies)
- ⚠️ Rate limiting (not implemented - consider for production)
- ⚠️ Password strength (simple shared password - consider rotation)

### Monitoring & Maintenance

- Database backups (PostgreSQL backup strategy)
- Error logging (consider Sentry or similar)
- Performance monitoring (consider APM tool)
- Database cleanup (old sessions, archived responses)
- Migration rollback strategy

## Technology Justification

### Why Next.js?

- Server-side rendering for SEO and performance
- API routes for backend logic
- App Router for modern React patterns
- Built-in optimization (images, fonts, scripts)
- Excellent developer experience

### Why Prisma?

- Type-safe database queries
- Automatic migration generation
- Excellent TypeScript integration
- Visual database browser (Prisma Studio)
- Connection pooling and optimization

### Why PostgreSQL?

- Robust relational database
- JSON field support for flexible data
- Excellent performance for aggregations
- Wide hosting support
- Strong consistency guarantees

### Why Recharts?

- React-native chart library
- Composable, declarative API
- Responsive by default
- Good TypeScript support
- Active maintenance

## Success Metrics

### Engagement Metrics

- Weekly response count
- Survey completion rate (% who finish after starting)
- Return visitor rate (within 7-day session)
- Average time to complete survey

### Data Quality Metrics

- Response validation error rate
- Required question skip rate
- Write-in response rate (engagement indicator)
- Duplicate submission attempts

### Technical Metrics

- Page load time (< 3s target)
- API response time (< 500ms target)
- Database query performance (< 100ms target)
- Error rate (< 1% target)

## Conclusion

The AI Coding Tools Weekly Survey is a well-architected, production-ready platform for tracking developer sentiment and tool adoption in the rapidly evolving AI coding landscape. Its combination of flexible question types, real-time visualization, trend analysis, and privacy-focused design makes it an ideal tool for community-driven research and decision-making.

The platform's technical foundation—Next.js, React, PostgreSQL, and Prisma—provides scalability, maintainability, and excellent developer experience. The modular architecture allows for easy extension with new question types, visualization methods, and analytical features.

With proper deployment, monitoring, and community engagement, this platform can become a valuable resource for understanding how AI tools are reshaping software development practices.
