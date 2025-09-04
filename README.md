# State of AI Coding Tools

A survey system for gauging interest and usage of AI coding tools in private Slack communities.

This survey system is similar to the [State of JavaScript](https://stateofjs.com/) and related surveys. Users are asked for demographic information and then asked to answer a series of questions about their usage of AI coding tools, frameworks, libraries, platforms, and other related tools.

Every week, a new survey will be posted in the channel with a link to the survey, and participants will be able to visit the site and respond to the survey as well as view the results. Access is protected by a weekly rotating password system for privacy.

## Implementation Plan

### Core Features

1. **Evolving Survey Questions**: Questions persist over time, but answer options can be added/removed based on tool popularity
2. **Historical Data Preservation**: Maintain historical options for tools/frameworks that may become obsolete
3. **LocalStorage Persistence**: Honor-system user tracking with localStorage for response history
4. **Weekly Password Authentication**: Simple rotating password system for access control
5. **Results Visualization**: Interactive charts and data visualization similar to State of JS
6. **CLI Management**: Command-line tools for survey and question management
7. **Docker Deployment**: Containerized deployment for easy hosting

### Architecture

#### Tech Stack

- **Frontend**: Next.js 15 with App Router
- **Database**: Prisma with PostgreSQL for type-safe queries and migrations
- **Styling**: Tailwind CSS + Shadcn UI components
- **Charts**: Recharts for data visualization
- **State Management**: Zustand (only if needed), localStorage for user persistence
- **Deployment**: Docker containers

#### Database Schema

- `surveys` - Survey metadata and weekly passwords
- `questions` - Question definitions (persist over time)
- `question_options` - Historical options for each question (never deleted, can be marked inactive)
- `responses` - Individual user responses linked to questions
- `user_sessions` - LocalStorage-based user tracking

#### Key Components

1. **Authentication** (`/auth`)

   - Weekly password entry form
   - Session management with localStorage

2. **Survey Interface** (`/survey`)

   - Progressive survey form with localStorage persistence
   - Skip/resume functionality
   - Responsive design matching State of JS aesthetic

3. **Results Dashboard** (`/results`)

   - Interactive Recharts visualizations
   - Historical trend analysis
   - Filter by time periods/surveys

4. **CLI Tools**

   - Survey creation and management commands
   - Question and option management
   - Password generation utilities

5. **API Routes**
   - `/api/auth` - Password verification
   - `/api/surveys` - Survey data retrieval
   - `/api/responses` - Submit and retrieve responses

#### Data Flow

1. CLI tools used to create surveys and manage questions/options
2. Users access site with weekly password
3. Survey responses saved to localStorage + database
4. Results compiled and visualized in real-time
5. Historical data preserved, inactive options maintained for trends

#### Authentication Strategy

- Weekly rotating passwords stored in database
- Simple password form on entry
- Session stored in localStorage with expiration
- No user accounts or complex auth system

### Development Phases

1. **Phase 1**: Project setup, database schema, CLI tools
2. **Phase 2**: Basic authentication system with weekly passwords
3. **Phase 3**: Survey-taking interface with localStorage persistence
4. **Phase 4**: Results visualization with Recharts
5. **Phase 5**: Docker configuration and deployment setup
