# 🌮 Tacos API

A simple REST API built with [Hono](https://hono.dev), [Bun](https://bun.sh), [Drizzle ORM](https://orm.drizzle.team), and [Effect-TS](https://effect.website).

## Features

- Typed, composable effects with Effect-TS
- Typed errors — no unhandled exceptions
- Dependency injection via Effect Layers (swappable for tests)
- Fast and lightweight HTTP layer with Hono
- Auto-generated OpenAPI documentation with Scalar
- Database management with Drizzle ORM
- Code quality with Biome
- Docker support

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

Dependencies are injected via Effect `Layer`s — `DbLive` for production, `DbTest` (in-memory SQLite) for tests.

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) installed on your machine
- [Docker](https://www.docker.com/) (optional, for containerized deployment)

### Installation

```bash
# Install dependencies
bun install
```

### Development

```bash
# Start development server
bun run dev

# Run database migrations
bun run db:push

# Seed database
bun run db:seed

# Open Drizzle Studio
bun run db:studio
```

The API will be available at `http://localhost:3000` (or your configured port).

## Docker

### Run from GitHub Packages

The easiest way to run the API is using the pre-built image from [GitHub Packages](https://github.com/jimmy-guzman/tacos-api/pkgs/container/tacos-api):

```bash
docker run -p 3000:3000 ghcr.io/jimmy-guzman/tacos-api:latest
```

### Build and Run Locally

```bash
# Build the Docker image
docker build -t tacos-api .

# Run the container
docker run -p 3000:3000 tacos-api
```

The API will be available at `http://localhost:3000`.

### With Docker Compose

```bash
# Start the service
docker compose up

# Start in detached mode
docker compose up -d

# Stop the service
docker compose down
```

The Dockerfile includes:

- Multi-stage build for optimized image size
- Automatic database setup and seeding
- Runs on port 3000 by default

## API Documentation

Interactive API documentation is available at `/docs` when running the server.

- OpenAPI JSON: `/openapi.json`
- LLMs.txt format: `/llms.txt`

## Scripts

- `dev` - Start development server with hot reload
- `db:generate` - Generate database migrations
- `db:migrate` - Run database migrations
- `db:push` - Push schema changes to database
- `db:studio` - Open Drizzle Studio
- `db:seed` - Seed database with sample data
- `lint` - Lint code with Biome
- `lint:fix` - Fix linting issues
- `format` - Check code formatting
- `format:fix` - Fix code formatting
- `typecheck` - Type check with TypeScript
- `test` - Run unit tests
