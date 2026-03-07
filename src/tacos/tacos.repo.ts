import { eq } from "drizzle-orm";
import { Effect } from "effect";

import { DbService } from "@/db/client";
import { tacosTable } from "@/db/schemas/tacos";
import { DatabaseError, TacoNotFoundError } from "./tacos.errors";
import type { NewTacoBody, UpdateTacoBody } from "./tacos.schema";

export const findAll = Effect.gen(function* () {
  const { db } = yield* DbService;

  return yield* Effect.tryPromise({
    catch: (cause) => new DatabaseError({ cause }),
    try: () => db.select().from(tacosTable),
  });
});

export const findById = (id: string) =>
  Effect.gen(function* () {
    const { db } = yield* DbService;

    const [taco] = yield* Effect.tryPromise({
      catch: (cause) => new DatabaseError({ cause }),
      try: () =>
        db.select().from(tacosTable).where(eq(tacosTable.id, id)).limit(1),
    });

    if (!taco) {
      return yield* Effect.fail(new TacoNotFoundError({ tacoId: id }));
    }

    return taco;
  });

export const create = (data: NewTacoBody) =>
  Effect.gen(function* () {
    const { db } = yield* DbService;

    const [created] = yield* Effect.tryPromise({
      catch: (cause) => new DatabaseError({ cause }),
      try: () => db.insert(tacosTable).values(data).returning(),
    });

    if (!created) {
      return yield* Effect.fail(
        new DatabaseError({ cause: new Error("Insert returned no rows") }),
      );
    }

    return created;
  });

export const update = (id: string, data: UpdateTacoBody) =>
  Effect.gen(function* () {
    const { db } = yield* DbService;

    const [updated] = yield* Effect.tryPromise({
      catch: (cause) => new DatabaseError({ cause }),
      try: () =>
        db
          .update(tacosTable)
          .set(data)
          .where(eq(tacosTable.id, id))
          .returning(),
    });

    if (!updated) {
      return yield* Effect.fail(new TacoNotFoundError({ tacoId: id }));
    }

    return updated;
  });

export const remove = (id: string) =>
  Effect.gen(function* () {
    const { db } = yield* DbService;

    const [deleted] = yield* Effect.tryPromise({
      catch: (cause) => new DatabaseError({ cause }),
      try: () => db.delete(tacosTable).where(eq(tacosTable.id, id)).returning(),
    });

    if (!deleted) {
      return yield* Effect.fail(new TacoNotFoundError({ tacoId: id }));
    }

    return deleted;
  });
