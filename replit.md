# IP Tracker Application

## Overview

This is a full-stack IP tracking application built with React and Express. The application provides comprehensive IP address information including geolocation, ISP details, and security analysis. It features a modern, responsive UI built with shadcn/ui components and utilizes a PostgreSQL database with Drizzle ORM.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for development and production builds
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ESM modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: Connect-pg-simple for PostgreSQL session store
- **Build Tool**: esbuild for server bundling

## Key Components

### Frontend Components
1. **IP Tracker Page** (`client/src/pages/ip-tracker.tsx`): Main interface displaying IP information
2. **UI Components**: Complete shadcn/ui component library in `client/src/components/ui/`
3. **Hooks**: Custom hooks for mobile detection and toast notifications
4. **Query Client**: Centralized API request handling with TanStack Query

### Backend Components
1. **Express Server** (`server/index.ts`): Main application server with middleware
2. **Routes Handler** (`server/routes.ts`): API endpoint definitions
3. **Storage Layer** (`server/storage.ts`): Data access abstraction with in-memory implementation
4. **Vite Integration** (`server/vite.ts`): Development server with hot module replacement

### Shared Components
1. **Schema Definitions** (`shared/schema.ts`): Zod schemas for data validation
2. **Type Definitions**: TypeScript interfaces for IP information and user data

## Data Flow

1. **Client Request**: User accesses the IP tracker page
2. **API Call**: Frontend makes request to `/api/ip-info` endpoint
3. **IP Detection**: Server extracts client IP from request headers
4. **External API**: Server fetches IP information from external geolocation services
5. **Data Processing**: Server processes and validates response data
6. **Response**: Formatted IP information sent back to client
7. **UI Update**: Frontend displays comprehensive IP details with copy-to-clipboard functionality

## External Dependencies

### Frontend Dependencies
- **UI Framework**: Radix UI primitives for accessible components
- **Styling**: Tailwind CSS with class-variance-authority for component variants
- **Icons**: Lucide React for consistent iconography
- **Date Handling**: date-fns for date formatting
- **Carousel**: Embla Carousel for interactive components

### Backend Dependencies
- **Database**: Neon Database serverless PostgreSQL
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Development**: tsx for TypeScript execution in development
- **Build**: esbuild for production bundling

### Development Tools
- **TypeScript**: Full type safety across the stack
- **Vite**: Fast development server with HMR
- **PostCSS**: CSS processing with Tailwind CSS
- **ESLint**: Code linting and formatting

## Deployment Strategy

### Development
- **Command**: `npm run dev`
- **Process**: Runs server with tsx and enables Vite development mode
- **Features**: Hot module replacement, error overlays, and development banners

### Production Build
- **Frontend**: `vite build` compiles React app to static assets
- **Backend**: `esbuild` bundles server code for Node.js production
- **Output**: Optimized bundles in `dist/` directory

### Production Deployment
- **Command**: `npm start`
- **Process**: Runs compiled server code with static asset serving
- **Environment**: Requires `DATABASE_URL` environment variable

### Database Management
- **Schema**: Defined in `shared/schema.ts` with Drizzle ORM
- **Migrations**: Generated in `migrations/` directory
- **Push**: `npm run db:push` syncs schema to database

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- July 05, 2025. Initial setup complete with IP tracker application
- July 05, 2025. Updated branding to "Your IP" with magnifying glass on globe icon
- July 05, 2025. Added Google Ads placeholder spaces on left and right sides (160x600 format)
- July 05, 2025. Added dark mode support for better accessibility
- July 05, 2025. Added PostgreSQL database integration with IP lookup history tracking
- July 05, 2025. Added Recent Lookups component to display database-stored IP lookup history
- July 05, 2025. Added Docker configuration with Dockerfile, docker-compose.yml, and deployment documentation
- July 05, 2025. Enhanced ad placeholders with colorful gradients, animations, and clear visibility
- July 05, 2025. Redesigned UI to match Alinta Energy style with professional navigation and modern cards
- July 05, 2025. Added interactive location map component with Google Maps, Apple Maps, and OpenStreetMap integration
- July 05, 2025. Comprehensive SEO optimization with meta tags, structured data, sitemap, robots.txt, and content sections
- July 05, 2025. Fixed Docker build process to properly handle dev dependencies during build stage while maintaining minimal production image
- July 06, 2025. Successfully migrated project from Replit Agent to Replit environment with PostgreSQL database setup
- July 06, 2025. Fixed Docker production build issues by creating production-ready server and optimized build process
- July 06, 2025. Updated README.md with comprehensive Docker deployment instructions and troubleshooting guide