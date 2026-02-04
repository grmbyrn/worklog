# Worklog

A time-tracking and invoicing application built for freelancers to manage billable hours across multiple clients.

**🔗 Live Demo:** [Coming soon - Vercel deployment in progress]

## Overview

Worklog helps freelancers track their time, manage client information, and generate professional invoices. The app provides a simple interface for starting and stopping timers per client, viewing time entries, and calculating billable hours.

## Features (MVP)

- **Authentication** — Secure GitHub OAuth login with NextAuth
- **Client Management** — Add, view, edit, and delete client information
- **Time Tracking** — Start/stop timers for specific clients to track billable hours
- **Dashboard** — View recent activity and time summaries
- **Invoice Generation** — Generate and download invoices based on tracked hours

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Authentication:** NextAuth v4 (GitHub OAuth)
- **Database:** PostgreSQL (Prisma Cloud) + Prisma ORM v7
- **PDF Generation:** jsPDF
- **Deployment:** Vercel (planned)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- GitHub OAuth App credentials

### Installation

1. Clone the repository:
```bash
git clone https://github.com/grmbyrn/worklog.git
cd worklog
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory:
```env
DATABASE_URL=your-postgresql-connection-string
AUTH_SECRET=your-auth-secret
AUTH_GITHUB_ID=your-github-oauth-client-id
AUTH_GITHUB_SECRET=your-github-oauth-client-secret
```

To generate `AUTH_SECRET`:
```bash
npx auth secret
```

To get GitHub OAuth credentials:
- Go to GitHub Settings → Developer Settings → OAuth Apps
- Create a new OAuth App
- Set Homepage URL to `http://localhost:3000`
- Set Authorization callback URL to `http://localhost:3000/api/auth/callback/github`

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
worklog/
├── app/
│   ├── api/auth/[...nextauth]/   # NextAuth API routes
│   ├── components/               # React components
│   ├── clients/                  # Client management page
│   ├── dashboard/                # Dashboard page
│   ├── invoices/                 # Invoice management page
│   ├── timer/                    # Time tracking page
│   └── login/                    # Login page
├── auth.ts                       # NextAuth configuration
├── middleware.ts                 # Route protection middleware
└── .env.local                    # Environment variables (not committed)
```

## API Routes

- `GET/POST /api/clients` - List and create clients
- `PUT/DELETE /api/clients/[id]` - Update and delete clients
- `POST /api/timer` - Save time entries
- `GET /api/dashboard` - Fetch earnings analytics (total, weekly, monthly, by client)
- `GET/POST /api/invoices` - List and generate invoices
- `GET /api/invoices/[id]` - Fetch invoice details for PDF generation

All routes are protected with session-based authentication via middleware.

## Roadmap

- [x] Authentication with NextAuth
- [x] Landing page and navigation
- [x] Database setup with Prisma
- [x] Client CRUD operations
- [x] Timer functionality
- [x] Dashboard with time summaries
- [x] Invoice generation and PDF export
- [ ] Deployment to Vercel

## Why This Project?

This project demonstrates:
- Modern Next.js patterns (App Router, Server Components)
- OAuth authentication flow
- Protected routes with middleware
- Type-safe development with TypeScript
- Responsive UI with Tailwind CSS
- Full-stack application architecture

Built as a portfolio piece to showcase production-ready code and best practices.

## Key Learnings

**Authentication & Security:**
- Implemented OAuth flow with GitHub and NextAuth
- Protected routes using Next.js middleware
- Session management with server-side validation

**Database & Backend:**
- Designed relational schema with proper foreign keys and cascade deletes
- Used Prisma ORM with PostgreSQL adapter pattern (v7)
- Handled user upsert pattern (session exists before User record)

**Full-Stack Patterns:**
- RESTful API design with proper HTTP methods
- Server components vs client components in Next.js App Router
- Type-safe development with TypeScript and Prisma

**UI/UX:**
- Responsive design with Tailwind CSS v4
- Mobile-first navigation with hamburger menu
- Client-side PDF generation with jsPDF

**Challenges Solved:**
- Next.js 16 async params breaking Prisma queries (awaited params)
- Prisma Client regeneration after schema changes
- Temporal dead zone errors in React hooks
- Calculating time-based earnings across multiple models
