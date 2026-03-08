# Hono Starter

An opinionated REST API starter built with [Hono](https://hono.dev), [Effect-TS](https://effect.website), [Drizzle ORM](https://orm.drizzle.team), and [Bun](https://bun.sh).

## Stack

| Tool                                                                                                                | Purpose                                             |
| ------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| [Hono](https://hono.dev)                                                                                            | HTTP framework                                      |
| [Effect-TS](https://effect.website)                                                                                 | Typed effects, dependency injection, error handling |
| [Drizzle ORM](https://orm.drizzle.team)                                                                             | Type-safe database access                           |
| [Bun](https://bun.sh)                                                                                               | Runtime and test runner                             |
| [Biome](https://biomejs.dev)                                                                                        | Linting and formatting                              |
| [Zod](https://zod.dev) + [`@hono/zod-openapi`](https://github.com/honojs/middleware/tree/main/packages/zod-openapi) | Validation and OpenAPI schema generation            |
| [Scalar](https://scalar.com)                                                                                        | Interactive API documentation                       |

## Features

- Typed, composable effects with Effect-TS
- Typed errors, no unhandled exceptions
- Dependency injection via Effect `Layer`s (swappable for tests)
- Auto-generated OpenAPI docs with Scalar
- In-memory SQLite layer for fast, isolated unit tests
- Security headers via `hono/secure-headers`
- CI workflow via GitHub Actions

## Architecture

Each domain resource lives in its own directory under `src/` (e.g. `src/tacos/`):

| File             | Role                               |
| ---------------- | ---------------------------------- |
| `*.schema.ts`    | Zod schemas and TypeScript types   |
| `*.api.ts`       | OpenAPI route definitions          |
| `*.repo.ts`      | Data access layer (Effect service) |
| `*.http.ts`      | Hono route handlers                |
| `*.errors.ts`    | Typed error classes                |
| `*.repo.test.ts` | Unit tests (in-memory DB layer)    |

Dependencies are injected via Effect `Layer`s: `DbLive` for production, `DbTest` (in-memory SQLite) for tests.

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) installed on your machine
- [Docker](https://www.docker.com/) (optional, for containerized deployment)

### Installation

```bash
bun install
cp .env.example .env
```

### Development

```bash
# Start development server with hot reload
bun run dev

# Open Drizzle Studio
bun run db:studio
```

Migrations and seed data run automatically on startup. The server applies any pending migrations and seeds the database if it is empty before accepting requests.

The API will be available at `http://localhost:3000`.

## Endpoints

| Method   | Path             | Description      |
| -------- | ---------------- | ---------------- |
| `GET`    | `/health`        | Health check     |
| `GET`    | `/tacos`         | List all tacos   |
| `POST`   | `/tacos`         | Create a taco    |
| `GET`    | `/tacos/:tacoId` | Get a taco by ID |
| `PATCH`  | `/tacos/:tacoId` | Update a taco    |
| `DELETE` | `/tacos/:tacoId` | Delete a taco    |

## API Documentation

Interactive API documentation is available at `/docs` when running the server.

- OpenAPI JSON: `/openapi.json`
- LLMs.txt format: `/llms.txt`

## Adding a Resource

To add a new resource (e.g. `widgets`), create `src/widgets/` with the following files:

1. `widgets.errors.ts`: typed error classes with `Data.TaggedError`
2. `widgets.schema.ts`: Zod schemas and inferred TypeScript types
3. `widgets.api.ts`: OpenAPI route definitions with `createRoute`
4. `widgets.repo.ts`: data access layer as an Effect service
5. `widgets.http.ts`: Hono handlers, discriminating typed errors
6. `widgets.repo.test.ts`: unit tests using the `DbTest` layer

Then register the routes in `src/index.ts`.

## Docker

The server runs migrations and seeds the database automatically on startup. Mount a named volume at `/app/data` to persist the SQLite database across container restarts.

### Run from GitHub Packages

The easiest way to run the API is using the pre-built image from [GitHub Packages](https://github.com/jimmy-guzman/hono-starter/pkgs/container/hono-starter):

```bash
docker run -p 3000:3000 -v hono-starter-data:/app/data ghcr.io/jimmy-guzman/hono-starter:latest
```

### Build and Run Locally

```bash
# Build the Docker image
docker build -t hono-starter .

# Build with a custom database path
docker build --build-arg DATABASE_URL=/app/data/custom.db -t hono-starter .

# Run the container
docker run -p 3000:3000 -v hono-starter-data:/app/data hono-starter
```

### With Docker Compose

```bash
# Start the service
docker compose up

# Start in detached mode
docker compose up -d

# Stop the service
docker compose down
```

Data is persisted in the `data` named volume across restarts.

## Fly.io

Requires the [Fly CLI](https://fly.io/docs/flyctl/install/) and a Fly.io account.

```bash
# First deploy
fly launch --no-deploy
fly volumes create data --size 1 --region ord
fly deploy

# Subsequent deploys
fly deploy
```

> [!NOTE]
> The `--no-deploy` flag lets you create the volume before the first deploy so the app starts with storage already attached. The volume is mounted at `/app/data` and persists the SQLite database across deployments. Migrations and seed data run automatically on startup. Update the `primary_region` in `fly.toml` and the `--region` flag to the [region](https://fly.io/docs/reference/regions/) nearest you.
>
> A `FLY_API_TOKEN` secret must be added to the repository's GitHub Actions secrets to enable continuous deployment via `.github/workflows/fly-deploy.yml`. Generate one with `fly tokens create deploy`.

## Scripts

| Script          | Description                                 |
| --------------- | ------------------------------------------- |
| `dev`           | Start development server with hot reload    |
| `start`         | Start production server                     |
| `ci`            | Run typecheck, lint, and tests (used in CI) |
| `typecheck`     | Type-check with TypeScript                  |
| `check`         | Lint and format check with Biome            |
| `check:fix`     | Auto-fix lint and format issues             |
| `lint`          | Lint with Biome                             |
| `lint:fix`      | Auto-fix lint issues                        |
| `format`        | Check formatting with Biome                 |
| `format:fix`    | Auto-fix formatting                         |
| `test`          | Run unit tests                              |
| `test:watch`    | Run tests in watch mode                     |
| `test:coverage` | Run tests with coverage report              |
| `knip`          | Find unused exports and dependencies        |
| `db:generate`   | Generate database migrations                |
| `db:migrate`    | Run database migrations                     |
| `db:push`       | Push schema changes to database             |
| `db:studio`     | Open Drizzle Studio                         |
| `db:seed`       | Seed database with sample data              |
| `deps:dedupe`   | Deduplicate dependencies                    |
| `deps:up`       | Update dependencies interactively           |
