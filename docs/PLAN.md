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

A single shared password system (configurable via `SURVEY_PASSWORD` environment variable) will be used to access the survey. No information will be shared publicly, and the survey will be accessible to anyone who knows the password. Every user will be given a unique, permanent session ID that will be used to track their responses. Users could theoretically reset their session to game responses, but we expect this to not be common since doing so would ruin the survey for everyone. Responses will be anonymous and cannot be linked to a specific user.

### 2. Weekly Cadence

The survey will be conducted on a rolling, weekly basis, and will reset every Monday at 12:00AM UTC (ISO weeks). During the week, users will be able to access the survey and submit their responses. Users will be able to access the survey and view the results at any time, but any responses submitted will count towards the current week's results. An admin will review the responses and update the database accordingly.

### 3. Survey & Reporting Interface

The survey interface will be a simple, single-page app that will be easy to use and navigate. It will be responsive and mobile-friendly. It will have a clean, modern design with a focus on readability and usability.

Users will be able to access results and trends for the current week, as well as historical results.

### 4. Sections and Questions

The survey will be organized into sections and questions. Each section will have a title and a description. Each question will have a type, title, description, and type. Sections and questions can be activated or deactivated as the survey evolves. Questions may be required or optional. Questions may allow free-form text input as write-in responses. Responses will be tied to a session ID and ISO year + ISO week tuple.

Some questions will be tied to users instead of questions. These questions will be used to collect optional demographic data about the user for reporting purposes. Responses will also be tied to a session ID and ISO year + ISO week tuple in order to preserve the history of the survey. Returning users will have their demographic data pre-filled from the previous week's survey.

Questions and options will have a label and optional description. Questions will also have a way for users to provide feedback about the question or options. Questions can also be skipped by the user. Labels and descriptions will support Markdown formatting.

Sections will have a title and optional description. Titles and descriptions will also support Markdown formatting.

#### Question Types

- Single Choice - Can include "None" and "Other" options
- Multiple Choice - Can include "None" and "Other" options
- Awareness/Sentiment - A single choice question with options:
  - "Never heard of it" -> "Interested" / "Not interested"
  - "Heard of it" -> "Interested" / "Not interested"
  - "Used it" -> "Positive experience" / "Negative experience"
- Numeric response - A numeric input field with a minimum and maximum value
- Single write-in response
- Multiple write-in responses
- Free-form text input

### 5. Reporting & Analytics

Users will be able to view results for the current week and all previous weeks. Users will also be able to view trends over time for each question type.
