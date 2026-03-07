import { describe, expect, test } from "bun:test";
import { Effect, Either } from "effect";

import { DbTest } from "@/db/client";
import * as tacosRepo from "./tacos.repo";
import type { NewTacoBody } from "./tacos.schema";

const sampleTaco: NewTacoBody = {
  filling: "carnitas",
  name: "Test Taco",
  notes: "Very tasty",
  toppings: ["cilantro", "onion"],
};

describe("tacosRepo", () => {
  describe("findAll", () => {
    test("returns empty array when no tacos exist", async () => {
      const result = await Effect.runPromise(
        tacosRepo.findAll.pipe(Effect.provide(DbTest)),
      );

      expect(result).toEqual([]);
    });

    test("returns all tacos after inserting", async () => {
      const result = await Effect.runPromise(
        Effect.gen(function* () {
          yield* tacosRepo.create(sampleTaco);
          yield* tacosRepo.create({ ...sampleTaco, name: "Second Taco" });

          return yield* tacosRepo.findAll;
        }).pipe(Effect.provide(DbTest)),
      );

      expect(result).toHaveLength(2);
    });
  });

  describe("create", () => {
    test("creates and returns a taco with a generated id", async () => {
      const taco = await Effect.runPromise(
        tacosRepo.create(sampleTaco).pipe(Effect.provide(DbTest)),
      );

      expect(taco.id).toMatch(/^taco_/);
      expect(taco.name).toBe("Test Taco");
      expect(taco.filling).toBe("carnitas");
      expect(taco.toppings).toEqual(["cilantro", "onion"]);
    });
  });

  describe("findById", () => {
    test("returns the taco when it exists", async () => {
      const result = await Effect.runPromise(
        Effect.gen(function* () {
          const created = yield* tacosRepo.create(sampleTaco);

          return yield* tacosRepo.findById(created.id);
        }).pipe(Effect.provide(DbTest)),
      );

      expect(result.name).toBe("Test Taco");
    });

    test("fails with TacoNotFoundError when id does not exist", async () => {
      const result = await Effect.runPromise(
        tacosRepo
          .findById("taco_doesnotexist")
          .pipe(Effect.provide(DbTest), Effect.either),
      );

      expect(Either.isLeft(result)).toBe(true);

      if (Either.isLeft(result)) {
        expect(result.left._tag).toBe("TacoNotFoundError");
      }
    });
  });

  describe("update", () => {
    test("updates and returns the modified taco", async () => {
      const result = await Effect.runPromise(
        Effect.gen(function* () {
          const created = yield* tacosRepo.create(sampleTaco);

          return yield* tacosRepo.update(created.id, { name: "Updated Taco" });
        }).pipe(Effect.provide(DbTest)),
      );

      expect(result.name).toBe("Updated Taco");
      expect(result.filling).toBe("carnitas");
    });

    test("fails with TacoNotFoundError when id does not exist", async () => {
      const result = await Effect.runPromise(
        tacosRepo
          .update("taco_doesnotexist", { name: "Ghost" })
          .pipe(Effect.provide(DbTest), Effect.either),
      );

      expect(Either.isLeft(result)).toBe(true);

      if (Either.isLeft(result)) {
        expect(result.left._tag).toBe("TacoNotFoundError");
      }
    });
  });

  describe("remove", () => {
    test("deletes an existing taco and returns it", async () => {
      const result = await Effect.runPromise(
        Effect.gen(function* () {
          const created = yield* tacosRepo.create(sampleTaco);

          return yield* tacosRepo.remove(created.id);
        }).pipe(Effect.provide(DbTest)),
      );

      expect(result.name).toBe("Test Taco");
    });

    test("fails with TacoNotFoundError when id does not exist", async () => {
      const result = await Effect.runPromise(
        tacosRepo
          .remove("taco_doesnotexist")
          .pipe(Effect.provide(DbTest), Effect.either),
      );

      expect(Either.isLeft(result)).toBe(true);

      if (Either.isLeft(result)) {
        expect(result.left._tag).toBe("TacoNotFoundError");
      }
    });

    test("taco is no longer findable after deletion", async () => {
      const result = await Effect.runPromise(
        Effect.gen(function* () {
          const created = yield* tacosRepo.create(sampleTaco);

          yield* tacosRepo.remove(created.id);

          return yield* tacosRepo.findById(created.id).pipe(Effect.either);
        }).pipe(Effect.provide(DbTest)),
      );

      expect(Either.isLeft(result)).toBe(true);
    });
  });
});
