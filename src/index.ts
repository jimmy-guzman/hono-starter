import { Scalar } from "@scalar/hono-api-reference";
import { createMarkdownFromOpenApi } from "@scalar/openapi-to-markdown";
import { Config, Effect } from "effect";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { secureHeaders } from "hono/secure-headers";

import { DbLive, runMigrations } from "./db/client";
import { hono } from "./lib/hono";
import { openapi } from "./openapi";
import tacos from "./tacos/tacos.http";

const api = hono();

api.use(secureHeaders());
api.use(logger());
api.use(prettyJSON());
api.use(cors());

api.get("/health", (c) => c.json({ status: "ok" }));

api.route("/", tacos);

const apiSchema = api.getOpenAPI31Document({
  info: openapi.info,
  openapi: openapi.version,
});

const apiMarkdown = await createMarkdownFromOpenApi(JSON.stringify(apiSchema));

api.get(
  "/docs",
  Scalar({
    pageTitle: openapi.info.title,
    sources: [
      {
        content: apiSchema,
        title: openapi.info.title,
      },
    ],
  }),
);

api.get("/openapi.json", (c) => c.json(apiSchema));

api.get("/llms.txt", (c) => {
  c.header("Content-Type", "text/plain; charset=utf-8");

  return c.text(apiMarkdown);
});

api.get("/", (c) => c.redirect("/docs", 301));

api.notFound((c) => c.json({ message: "Not found", status: 404 }, 404));

api.onError((err, c) => c.json({ message: err.message, status: 500 }, 500));

await Effect.runPromise(
  Effect.gen(function* () {
    yield* runMigrations;

    const port = yield* Config.integer("PORT").pipe(Config.withDefault(3000));

    Bun.serve({ fetch: api.fetch, hostname: "0.0.0.0", port });
  }).pipe(Effect.provide(DbLive)),
);
