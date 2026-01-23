# KidsSafe Tube - YouTube Content Analyzer

## Overview

KidsSafe Tube is a child safety application that helps parents determine if YouTube videos are appropriate for children. Users can search for YouTube videos, analyze their content using AI, and receive safety ratings, age recommendations, and alternative suggestions for inappropriate content. The app maintains a history of analyzed videos for future reference.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state and caching
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Animations**: Framer Motion for page transitions and UI animations
- **Build Tool**: Vite with React plugin

The frontend follows a pages-based structure with reusable components. Custom hooks in `client/src/hooks/` handle API interactions and abstract data fetching logic.

### Backend Architecture
- **Framework**: Express.js 5 running on Node.js
- **Language**: TypeScript with ESM modules
- **API Pattern**: RESTful endpoints defined in `shared/routes.ts` with Zod validation schemas
- **Build**: esbuild for production bundling with selective dependency bundling for cold start optimization

The server uses a service-oriented pattern with dedicated services for YouTube API integration and AI content analysis.

### Data Storage
- **Database**: PostgreSQL via `pg` driver
- **ORM**: Drizzle ORM with type-safe schema definitions
- **Schema Location**: `shared/schema.ts` contains table definitions shared between client and server
- **Migrations**: Drizzle Kit for schema migrations stored in `/migrations`

Key tables:
- `searches` - Stores search queries
- `video_analysis` - Stores analyzed video results with safety ratings, tags, and alternative suggestions

### External Service Integration
- **YouTube Data API v3**: Video search and metadata retrieval
- **OpenAI API**: AI-powered content analysis for child safety assessment (via Replit AI Integrations)

### Shared Code Pattern
The `shared/` directory contains code used by both frontend and backend:
- `schema.ts` - Database schemas and Zod validation types
- `routes.ts` - API route definitions with input/output schemas

### Development vs Production
- Development: Vite dev server with HMR, proxied through Express
- Production: Static files served from `dist/public`, built via custom build script

## External Dependencies

### APIs and Services
- **YouTube Data API v3**: Requires `YOUTUBE_API_KEY` environment variable for video search and details
- **OpenAI API**: Requires `AI_INTEGRATIONS_OPENAI_API_KEY` and `AI_INTEGRATIONS_OPENAI_BASE_URL` for content analysis
- **PostgreSQL**: Requires `DATABASE_URL` environment variable for database connection

### Key Libraries
- **drizzle-orm / drizzle-kit**: Database ORM and migration tooling
- **zod**: Runtime type validation for API requests/responses
- **@tanstack/react-query**: Client-side data fetching and caching
- **shadcn/ui + Radix UI**: Accessible component primitives
- **framer-motion**: Animation library for React

### Replit Integrations
The project includes pre-built Replit integration modules in `server/replit_integrations/` for:
- Audio/voice chat capabilities
- Image generation
- Chat functionality with conversation persistence
- Batch processing utilities

These integrations are scaffolded but not actively used in the current application flow.