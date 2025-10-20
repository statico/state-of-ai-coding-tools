# AI Coding Tools Weekly Survey - Product Documentation

## Executive Summary

The **AI Coding Tools Weekly Survey** is a comprehensive web-based survey platform designed to track the evolving landscape of AI-powered coding tools through weekly community feedback. The platform captures developer preferences, adoption rates, and experiences across various AI coding assistants, IDEs, and LLMs, providing insights through real-time results visualization and trend analysis over time.

## Product Vision & Goals

### Primary Goals

1. **Track AI tool adoption over time**: Capture weekly snapshots of which AI coding tools developers are using, trying, or avoiding
2. **Measure developer sentiment over time**: Understand satisfaction levels and concerns about AI-assisted development
3. **Identify trends**: Track changes in tool popularity, adoption rates, and developer preferences over time
4. **Provide community insights**: Provide aggregated, anonymous feedback to help the development community make informed decisions
5. **Evolve as tools change**: Tools and questions, and sections may change over time, and the platform should be able to handle it gracefully

### Target Audience

Access will be limited to a large but semi-private community of engineering leaders and technology-focused professionals (product managers, executives, graphic designers, etc.). Within this community, the tool will be used to track the adoption of AI coding tools and the sentiment of the community towards them.

## Core Features

### 1. Simple Access

A single shared password system (configurable via `SURVEY_PASSWORD` environment variable) will be used to access the survey on the home page. No information will be shared publicly, and the survey will be accessible to anyone who knows the password.

Every user will be given a unique session ID stored in a permanent cookie. The session ID will be used to track their responses, which will be combined with the ISO year and ISO week to preserve the history of the survey. Users could theoretically reset their session to game responses, but we expect this to not be common since doing so would ruin the survey for everyone. Responses will be anonymous and cannot be linked to a specific user.

### 2. Weekly Cadence

The survey will be conducted on a rolling, weekly basis, and will reset every Monday at 12:00AM UTC (ISO weeks). During the week, users will be able to access the survey and submit their responses. Users will be able to access the survey and view the results at any time, but any responses submitted will count towards the current week's results. An admin will review the responses and update the database accordingly.

### 3. Survey & Reporting Interface

The survey interface will be a simple, single-page app that will be easy to use and navigate. It will be responsive and mobile-friendly. It will have a clean, modern design with a focus on readability and usability.

Users will be able to access results and trends for the current week, as well as historical results.

### 4. Sections and Questions

The survey will be organized into sections and questions. Each section will have a title and a description. Each question will have a type, title, description, and type. Sections and questions can be activated or deactivated as the survey evolves. Questions may be required or optional. Questions may allow free-form text input as write-in responses. Responses will be tied to a session ID and ISO year + ISO week tuple.

Responses will be tied to a session ID and ISO year + ISO week tuple in order to preserve the history of the survey. Returning users will have their previous responses automatically pre-filled from the previous week's survey.

Questions and options will have a label and optional description. Questions will also have a way for users to provide feedback about the question or options. Questions can also be skipped by the user. Labels and descriptions will support Markdown formatting.

Sections will have a title and optional description. Titles and descriptions will also support Markdown formatting.

#### Question Types

- Single Choice - Automatically includes "Other" option for write-in responses
- Multiple Choice - Automatically includes "Other" option for write-in responses
- Experience - A single choice question with preset UI options:
  - "Never heard of it" -> "Interested" / "Not interested"
  - "Heard of it" -> "Interested" / "Not interested"
  - "Used it" -> "Positive experience" / "Negative experience"
- Numeric response - A numeric input field with a minimum and maximum value
- Single write-in response
- Multiple write-in responses
- Free-form text input

### 5. Reporting & Analytics

Users will be able to view results for the current week and all previous weeks. Users will also be able to view trends over time for each question type.

Details TBD. No exports (JSON/CSV) are planned.

## Data Model

### Code as Source of Truth

Section, question, and option data will be stored in the database. However, the source of this data will be a YAML file checked in as `config.yml`. At startup, the data will be be validated and parsed from the YAML. Section, question, and option configurations will be upserted, and any options missing will be marked as inactive. This allows for survey members to submit changes to the survey configuration via pull request without needing to update the database.

### Best Effort

Since this is a survey, we should not expect 100% completion rate. We should therefore be prepared to handle missing responses and incomplete surveys.

All responses will be saved to the database as the survey is completed. If a user starts the survey at 11:59PM UTC on Sunday and finishes minutes later, some responses may be counted towards the previous week's results. This doesn't seem like a major issue but we might consider fixing this in the future.

### Public vs Private Data

Demographic data will only be shown in aggregate reports. Individual responses will not be shown.

User feedback via comments will not be in the report, but can be viewed by admins in order to improve the survey configuration.

PII such as names or IP addresses will not be stored. (IP addresses may be stored in a server logging system and saved for 30+ days.)

Admins will access the database directly as there is no need for an extensive admin interface.

### YAML Config Schema

Missing sections, questions, and options will be marked as inactive automatically. All questions are required and skippable by default.

- *`sections`* - A list of sections
  - *`slug`* - The unique slug of the section
  - *`title`* - The title of the section
  - *`description`* - The description of the section

- *`questions`* - A list of questions
  - *`section`* - The slug of the section the question belongs to
  - *`slug`* - The unique slug of the question
  - *`title`* - The title of the question
  - *`description`* - The description of the question
  - *`type`* - The type of the question
    - `single`
    - `multiple`
    - `experience`
    - `numeric`
    - `single-freeform`
    - `multiple-freeform`
    - `freeform`
  - *`options`* - A list of options for single, multiple, single-freeform, and multiple-freeform questions (experience questions use preset UI values). Single and multiple choice questions automatically include an "Other" option for write-in responses.
    - *`slug`* - The unique slug of the option
    - *`label`* - The label of the option
    - *`description`* - The description of the option
  - *`multiple_max`* - The maximum number of options that can be selected for multiple choice questions (integer, nullable)

### SQL Schema

- *`sessions`*
  - *`id`* - The unique ID of the session (UUID, primary key)
  - *`created_at`* - The timestamp of the session creation (timestamp with time zone, not null)
  - *`updated_at`* - The timestamp of the session last update (timestamp with time zone, not null)

- *`sections`*
  - *`slug`* - The unique slug of the section (text, primary key, not null)
  - *`title`* - The title of the section (text, not null)
  - *`description`* - The description of the section (text, nullable)
  - *`active`* - Whether the section is active (boolean, not null, default true)
  - *`order`* - The display order of the section (integer, not null)

- *`questions`*
  - *`slug`* - The unique slug of the question (text, primary key, not null)
  - *`section_slug`* - The slug of the section the question belongs to (text, foreign key to sections.slug, not null)
  - *`title`* - The title of the question (text, not null)
  - *`description`* - The description of the question (text, nullable)
  - *`type`* - The type of the question (text, not null)
  - *`active`* - Whether the question is active (boolean, not null, default true)
  - *`order`* - The display order of the question within the section (integer, not null)
  - *`multiple_max`* - The maximum number of options that can be selected for multiple choice questions (integer, nullable)

- *`options`*
  - *`slug`* - The unique slug of the option (text, primary key, not null) - When converting from YAML, this will be stored as `<question_slug>_<option_slug>` to ensure global uniqueness
  - *`question_slug`* - The slug of the question the option belongs to (text, foreign key to questions.slug, not null, index)
  - *`label`* - The label of the option (text, not null)
  - *`description`* - The description of the option (text, nullable)
  - *`active`* - Whether the option is active (boolean, not null, default true)
  - *`order`* - The display order of the option within the question (integer, not null)

- *`responses`*
  - Primary key: `(session_id, iso_week, iso_year, question_slug)` - This ensures that each question can only be answered once per week per session
  - *`session_id`* - The ID of the session (UUID, foreign key to sessions.id, not null)
  - *`iso_week`* - The ISO week of the session (integer, not null)
  - *`iso_year`* - The ISO year of the session (integer, not null)
  - *`question_slug`* - The slug of the question the response belongs to (text, foreign key to questions.slug, not null)
  - *`skipped`* - Whether the question was explicitly skipped by the user (boolean, not null, default false)
  - *`single_option_slug`* - The slug of the selected option (text, foreign key to options.slug, nullable)
  - *`single_writein_response`* - The write-in response for single choice questions when "Other" option is selected (text, nullable)
  - *`multiple_option_slugs`* - The slugs of the selected options (text[], nullable, foreign key check will be application-level)
  - *`multiple_writein_responses`* - The write-in responses for multiple choice questions when "Other" option is selected (text[], nullable)
  - *`experience_awareness`* - The awareness of the experience (integer, nullable, values: `0` (never heard of it), `1` (heard of it), `2` (used it))
  - *`experience_sentiment`* - The sentiment of the experience (integer, nullable, values: `-1` (negative), `1` (positive)) - `0` or `null` if the user did not answer the question
  - *`freeform_response`* - Free-form text response (text, nullable)
  - *`numeric_response`* - Numeric response (numeric, nullable)
  - *`comment`* - The comment text (text, nullable)
