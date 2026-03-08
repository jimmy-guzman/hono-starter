# AGENTS.md

Guidance for AI agents working in this repository.

## Setup

```sh
cp .env.example .env
bun install
bun run db:migrate
```

## Commands

| Command               | Purpose                           |
| --------------------- | --------------------------------- |
| `bun dev`             | Start dev server with watch mode  |
| `bun start`           | Start server (no watch)           |
| `bun test`            | Run all tests                     |
| `bun run typecheck`   | TypeScript type checking          |
| `bun run check`       | Biome lint + format check         |
| `bun run check:fix`   | Auto-fix lint and format issues   |
| `bun run ci`          | Full CI: typecheck + check + test |
| `bun run db:generate` | Generate Drizzle migrations       |
| `bun run db:migrate`  | Apply migrations                  |
| `bun run db:seed`     | Seed the database                 |

Run `bun run ci` before considering any task complete.

## Architecture

- **Hono** — HTTP routing; routes defined with `@hono/zod-openapi` for schema-first OpenAPI
- **Effect-TS** — all side effects (DB, errors) modelled as Effects; services injected via layers (`DbLive` in prod, `DbTest` for tests)
- **Drizzle ORM** — type-safe SQLite access; schemas in `src/db/schemas/`
- **Zod** — request/response validation; schemas drive both runtime validation and OpenAPI docs

## Domain resource convention

Each resource lives in its own directory under `src/` and follows this file pattern (see `src/tacos/` as the reference):

| File          | Purpose                          |
| ------------- | -------------------------------- |
| `*.schema.ts` | Zod schemas and TypeScript types |
| `*.errors.ts` | Typed error classes              |
| `*.api.ts`    | OpenAPI route definitions        |
| `*.repo.ts`   | Data access (Effect service)     |
| `*.http.ts`   | Hono route handlers              |

Register new routes in `src/index.ts`.

## Code style

- **Biome** handles all linting and formatting — do not use ESLint or Prettier
- ESM only (`"type": "module"`)
- TypeScript strict mode; no `any`
- File names: `kebab-case`; domain files use the `<resource>.<layer>.ts` convention above
- Arrow functions always use braces around the body: `(x) => { return x }` not `(x) => x`
