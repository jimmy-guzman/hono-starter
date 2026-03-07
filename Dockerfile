FROM oven/bun:1 AS base
WORKDIR /app

FROM base AS install

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM base AS build
COPY --from=install /app/node_modules ./node_modules
COPY . .

RUN mkdir -p /app/data
ENV DATABASE_URL=/app/data/app.db
RUN bun run db:push
RUN bun run db:seed

FROM base AS release
COPY --from=install /app/node_modules ./node_modules
COPY --from=build /app .

USER bun
EXPOSE 3000

ENV DATABASE_URL=/app/data/app.db

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

ENTRYPOINT ["bun", "run", "src/index.ts"]
