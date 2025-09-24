# Memory Circle - Photo Gallery Application

## Overview

Memory Circle is a full-stack photo and video gallery application built with React and Express. The application allows users to organize their media files by year and month, providing an intuitive circular navigation interface for browsing memories. Users can upload images and videos, which are automatically organized into a chronological structure for easy browsing and viewing.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for fast development and building
- **UI Components**: Shadcn/ui component library built on Radix UI primitives for accessible, customizable components
- **Styling**: Tailwind CSS with custom design tokens and CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Animations**: Framer Motion for smooth transitions and interactive animations

### Backend Architecture
- **Framework**: Express.js with TypeScript for the REST API server
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **File Storage**: Multer for handling multipart file uploads with local filesystem storage
- **Session Management**: Express sessions with PostgreSQL store (connect-pg-simple)
- **Development**: Vite integration for hot module replacement in development

### Data Storage Solutions
- **Database**: PostgreSQL configured through Neon Database serverless driver
- **Schema**: Drizzle ORM with TypeScript-first schema definitions
- **File Storage**: Local filesystem with organized directory structure (uploads/year/month/)
- **Migrations**: Drizzle Kit for database schema migrations

### Media Management
- **Upload Processing**: Organized file storage by year and month with unique filename generation
- **File Validation**: MIME type filtering for images and videos with 100MB size limit
- **Media Organization**: Automatic categorization by upload date for chronological browsing
- **Supported Formats**: JPEG, PNG, GIF, WebP images and MP4, MOV, AVI, QuickTime videos

### API Design
- **RESTful Endpoints**: Clean API structure for media operations and metadata retrieval
- **Error Handling**: Centralized error middleware with proper HTTP status codes
- **Request Logging**: Comprehensive logging for API requests with timing and response data
- **File Serving**: Static file serving for uploaded media with proper content types

## External Dependencies

### Core Technologies
- **@neondatabase/serverless**: PostgreSQL serverless database connection
- **drizzle-orm**: Type-safe ORM for database operations
- **@tanstack/react-query**: Server state management and caching
- **multer**: File upload handling middleware
- **express**: Web application framework for Node.js

### UI and Styling
- **@radix-ui/***: Accessible UI primitive components
- **tailwindcss**: Utility-first CSS framework
- **framer-motion**: Animation library for React
- **lucide-react**: Icon library with consistent design

### Development Tools
- **vite**: Fast build tool and development server
- **typescript**: Static type checking
- **@replit/vite-plugin-***: Replit-specific development enhancements
- **drizzle-kit**: Database migration and schema management tools

### Validation and Forms
- **zod**: Runtime type validation
- **drizzle-zod**: Zod schema generation from Drizzle schemas
- **@hookform/resolvers**: Form validation resolvers for React Hook Form

### Utilities
- **date-fns**: Date manipulation and formatting
- **clsx**: Conditional className utility
- **class-variance-authority**: Component variant management
- **nanoid**: Unique ID generation