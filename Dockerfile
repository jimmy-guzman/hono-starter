ARG DATABASE_URL=/app/data/app.db

FROM oven/bun:1 AS base
WORKDIR /app

FROM base AS install

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM base AS build

COPY --from=install /app/node_modules ./node_modules
COPY . .

RUN bun build src/index.ts --target bun --outfile dist/index.js

FROM base AS release
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

COPY --from=build /app/dist ./dist
COPY --from=build /app/drizzle ./drizzle

USER bun
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

ENTRYPOINT ["bun", "run", "dist/index.js"]
