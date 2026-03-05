# Porchlite

A private, blog-style social app for sharing life updates with close friends. No likes, no comments — just real connection.

The name comes from the idea of leaving your porch light on: a warm signal to your friends that says *"I'm here, come talk to me."* When you post an update, your friends get notified so real conversations happen where they should — over text, email, or a phone call.

## Tech Stack

| Layer | Technology |
|---|---|
| Monorepo | [Turborepo](https://turbo.build/) + npm workspaces |
| Frontend | React + TypeScript + [Vite](https://vite.dev/) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) v4 |
| State / Data | [Redux Toolkit](https://redux-toolkit.js.org/) + RTK Query |
| Backend / DB | [Supabase](https://supabase.com/) (Auth, Postgres, Storage, Edge Functions) |

## Project Structure

```
porchlite/
├── apps/
│   └── web/              # React frontend
├── packages/
│   └── shared/           # Shared TypeScript types and utilities
├── package.json          # Root workspace config
├── turbo.json            # Turborepo task pipeline
└── tsconfig.base.json    # Shared TypeScript config
```

## Getting Started

### Prerequisites

- Node.js 22+
- npm 10+
- A [Supabase](https://supabase.com/) project (free tier works)

### Setup

```bash
# Install dependencies
npm install

# Copy the env template and add your Supabase credentials
cp apps/web/.env.example apps/web/.env

# Start the dev server
npx turbo dev
```

The app will be available at **http://localhost:5173**.

## Core Concepts

- **No vanity metrics** — no likes, no follower counts, no public comments
- **Mutual friendships** — both people agree to connect (no one-way follows)
- **Notification-driven** — friends get an email when you post, encouraging real conversation outside the app
- **Blog-style posts** — text and photos, meant to be read, not scrolled past
