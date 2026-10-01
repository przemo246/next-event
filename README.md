# Next event

A search engine for events in Poland.

## Tech stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- React Aria Components
- Lucide
- Supabase
- Playwright
- ESLint, Husky, commitlint
- pnpm

## Getting started

### Requirements

- Node.js `>= 24.11.0`
- pnpm `>= 10.17.1`
- Docker

### Steps

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Start local Supabase:

   ```bash
   pnpm db:start
   ```

3. Copy `.env.example` to `.env.local` and fill in the Supabase values from `pnpm db:status`.

4. Start the dev server:

   ```bash
   pnpm dev
   ```

   The app runs at [http://localhost:3000](http://localhost:3000). Local emails are available in Mailpit at [http://localhost:54324](http://localhost:54324).

### Scripts

| Command                | Description                          |
| ---------------------- | ------------------------------------ |
| `pnpm build`           | Production build                     |
| `pnpm start`           | Run the production build             |
| `pnpm lint`            | Lint with ESLint                     |
| `pnpm typecheck`       | Type-check with TypeScript           |
| `pnpm test:unit`       | Run unit tests (Vitest)              |
| `pnpm test:unit:watch` | Run unit tests in watch mode         |
| `pnpm test:e2e`        | Run end-to-end tests (Playwright)    |
| `pnpm db:stop`         | Stop local Supabase                  |
| `pnpm db:reset`        | Reset the local database             |
| `pnpm db:diff`         | Generate a migration from the schema |

### Tests

Unit tests (`__tests__/`, Vitest) cover the pure validation and routing rules
in isolation: no Supabase, no Mailpit, no dev server. Each spec lives in a
`__tests__` folder next to the code it covers, e.g.
`modules/create-event/__tests__/validation.test.ts` tests
`modules/create-event/helpers/validation.ts`.

End-to-end tests (`e2e/`, Playwright) need `pnpm db:start` and a dev server, so
they are the slow layer and cover only the flows that genuinely need a browser
and a real auth session.

Pure logic that would otherwise be trapped inside a `"use server"` action lives
in a sibling `helpers/validation.ts` (or, for the auth routes,
`app/auth/safe-path.ts`) so it can be unit tested without stubbing
`next/navigation` or the Supabase client.
