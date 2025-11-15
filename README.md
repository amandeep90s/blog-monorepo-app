# Blog Monorepo Application

A full-stack blog application built with NestJS, Next.js, GraphQL, Prisma, and PostgreSQL in a Turborepo monorepo setup.

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Testing](#testing)
- [Project Structure](#project-structure)

## 🎯 Overview

This is a modern, full-stack blog application featuring:

- **Backend**: NestJS with GraphQL API, Prisma ORM, and PostgreSQL
- **Frontend**: Next.js 14+ with App Router, React 19, TanStack Query
- **Monorepo**: Turborepo for efficient build orchestration
- **Testing**: Comprehensive unit and integration tests

## 🛠 Tech Stack

### Backend (apps/api)

- **NestJS**: Progressive Node.js framework
- **GraphQL**: API query language with Apollo Server
- **Prisma**: Next-generation ORM
- **PostgreSQL**: Relational database
- **JWT**: Authentication
- **Jest**: Testing framework

### Frontend (apps/web)

- **Next.js 14+**: React framework with App Router
- **React 19**: UI library
- **TanStack Query**: Data fetching and caching
- **Tailwind CSS**: Utility-first CSS
- **shadcn/ui**: Re-usable components
- **Jest + RTL**: Testing framework

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm 9+
- PostgreSQL

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd blog-monorepo-app
```

2. Install dependencies

```bash
pnpm install
```

3. Set up environment variables

**For API (apps/api/.env):**

```env
DATABASE_URL="postgresql://user:password@localhost:5432/blog_db"
JWT_SECRET="your-secret-key"
```

**For Web (apps/web/.env.local):**

```env
NEXT_PUBLIC_API_URL="http://localhost:3001/graphql"
```

4. Run database migrations

```bash
cd apps/api
pnpm prisma migrate dev
pnpm db:seed  # Optional: Seed the database
```

5. Start development servers

```bash
# From root directory
pnpm dev

# Or individually
cd apps/api && pnpm dev      # API runs on http://localhost:3001
cd apps/web && pnpm dev      # Web runs on http://localhost:3000
```

## 🧪 Testing

This project includes comprehensive testing for both applications.

### Quick Start

```bash
# Run all tests (from root)
pnpm test

# Run API tests
cd apps/api
pnpm test              # Unit tests
pnpm test:watch        # Watch mode
pnpm test:cov          # With coverage
pnpm test:e2e          # E2E tests

# Run Web tests
cd apps/web
pnpm test              # All tests
pnpm test:watch        # Watch mode
pnpm test:coverage     # With coverage
```

### Test Coverage

- **Backend**: Unit tests for services, resolvers, and E2E tests for GraphQL operations
- **Frontend**: Component tests, utility tests, and integration tests for server actions

For detailed testing documentation, see [TESTING.md](./TESTING.md)

## 📁 Project Structure

```
blog-monorepo-app/
├── apps/
│   ├── api/                 # NestJS GraphQL API
│   │   ├── prisma/         # Database schema and migrations
│   │   ├── src/            # Source code
│   │   │   ├── auth/       # Authentication module
│   │   │   ├── post/       # Post module
│   │   │   ├── user/       # User module
│   │   │   ├── comment/    # Comment module
│   │   │   └── like/       # Like module
│   │   └── test/           # E2E tests
│   │
│   └── web/                # Next.js frontend
│       ├── app/            # App router pages
│       ├── components/     # React components
│       │   ├── ui/         # UI components
│       │   └── app/        # App-specific components
│       ├── lib/            # Utilities and helpers
│       └── types/          # TypeScript types
│
├── packages/
│   ├── eslint-config/      # Shared ESLint configs
│   └── typescript-config/  # Shared TypeScript configs
│
├── TESTING.md              # Testing documentation
└── turbo.json              # Turborepo configuration
```

You can build a specific package by using a [filter](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters):

```
# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo build --filter=docs

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo build --filter=docs
yarn exec turbo build --filter=docs
pnpm exec turbo build --filter=docs
```

### Develop

To develop all apps and packages, run the following command:

```
cd my-turborepo

# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo dev

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo dev
yarn exec turbo dev
pnpm exec turbo dev
```

You can develop a specific package by using a [filter](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters):

```
# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo dev --filter=web

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo dev --filter=web
yarn exec turbo dev --filter=web
pnpm exec turbo dev --filter=web
```

### Remote Caching

> [!TIP]
> Vercel Remote Cache is free for all plans. Get started today at [vercel.com](https://vercel.com/signup?/signup?utm_source=remote-cache-sdk&utm_campaign=free_remote_cache).

Turborepo can use a technique known as [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup?utm_source=turborepo-examples), then enter the following commands:

```
cd my-turborepo

# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo login

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo login
yarn exec turbo login
pnpm exec turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```
# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo link

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo link
yarn exec turbo link
pnpm exec turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turborepo.com/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.com/docs/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters)
- [Configuration Options](https://turborepo.com/docs/reference/configuration)
- [CLI Usage](https://turborepo.com/docs/reference/command-line-reference)
