import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { Config, Context, Effect, Layer, Redacted } from "effect";

type DrizzleClient = ReturnType<typeof drizzle>;

export class DbService extends Context.Tag("DbService")<
  DbService,
  { readonly db: DrizzleClient }
>() {}

export const DbLive = Layer.effect(
  DbService,
  Effect.gen(function* () {
    const databaseUrl = yield* Config.redacted("DATABASE_URL");
    const sqlite = new Database(Redacted.value(databaseUrl));
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
        "createdAt" INTEGER NOT NULL DEFAULT (unixepoch()),
        "updatedAt" INTEGER NOT NULL DEFAULT (unixepoch())
      )
    `);

    const db = drizzle({ client: sqlite });

    return { db };
  }),
);

export const runMigrations = Effect.gen(function* () {
  const { db } = yield* DbService;

  yield* Effect.promise(() =>
    Promise.resolve(migrate(db, { migrationsFolder: "./drizzle" })),
  );
});
