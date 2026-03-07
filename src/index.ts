import { Scalar } from "@scalar/hono-api-reference";
import { createMarkdownFromOpenApi } from "@scalar/openapi-to-markdown";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";

import { openapi } from "./config/docs";
import { hono } from "./lib/hono";
import tacos from "./tacos/tacos.http";

const api = hono();

api.use(logger());
api.use(prettyJSON());
api.use(cors());

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

export default api;
