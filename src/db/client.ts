import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { Context, Effect, Layer } from "effect";

import { AppConfig } from "@/env";

type DrizzleClient = ReturnType<typeof drizzle>;

export class DbService extends Context.Tag("DbService")<
  DbService,
  { readonly db: DrizzleClient }
>() {}

export const DbLive = Layer.effect(
  DbService,
  Effect.gen(function* () {
    const { databaseUrl } = yield* AppConfig;
    const sqlite = new Database(databaseUrl);
    const db = drizzle({ client: sqlite });

    return { db };
  }),
);

export const DbTest = Layer.effect(
  DbService,
  Effect.sync(() => {
    const sqlite = new Database(":memory:");

    sqlite.run(`
      CREATE TABLE IF NOT EXISTS tacos (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        filling TEXT NOT NULL,
        notes TEXT,
        toppings TEXT NOT NULL,
        "createdAt" INTEGER NOT NULL DEFAULT (unixepoch())
      )
    `);

    const db = drizzle({ client: sqlite });

    return { db };
  }),
);
