# Worklog

A time-tracking and invoicing application built for freelancers to manage billable hours across multiple clients.

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
- **Database:** PostgreSQL + Prisma (planned)
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

## Roadmap

- [x] Authentication with NextAuth
- [x] Landing page and navigation
- [ ] Database setup with Prisma
- [ ] Client CRUD operations
- [ ] Timer functionality
- [ ] Dashboard with time summaries
- [ ] Invoice generation and PDF export
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
