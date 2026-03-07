import { Effect, Either } from "effect";

import { DbLive } from "@/db/client";
import { hono } from "@/lib/hono";

import {
  CreateTacoRoute,
  DeleteTacoRoute,
  GetTacoRoute,
  ListTacosRoute,
  UpdateTacoRoute,
} from "./tacos.api";
import * as tacosRepo from "./tacos.repo";

const app = hono();

app.openapi(ListTacosRoute, async (c) => {
  const result = await Effect.runPromise(
    tacosRepo.findAll.pipe(Effect.provide(DbLive), Effect.either),
  );

  if (Either.isLeft(result)) {
    return c.json({ message: "Internal server error", status: 500 }, 500);
  }

  return c.json(result.right, 200);
});

app.openapi(CreateTacoRoute, async (c) => {
  const body = c.req.valid("json");

  const result = await Effect.runPromise(
    tacosRepo.create(body).pipe(Effect.provide(DbLive), Effect.either),
  );

  if (Either.isLeft(result)) {
    return c.json({ message: "Internal server error", status: 500 }, 500);
  }

  return c.json(result.right, 201);
});

app.openapi(GetTacoRoute, async (c) => {
  const { tacoId } = c.req.valid("param");

  const result = await Effect.runPromise(
    tacosRepo.findById(tacoId).pipe(Effect.provide(DbLive), Effect.either),
  );

  if (Either.isLeft(result)) {
    const err = result.left;

    if (err._tag === "TacoNotFoundError") {
      return c.json({ message: `Taco ${tacoId} not found`, status: 404 }, 404);
    }

    return c.json({ message: "Internal server error", status: 500 }, 500);
  }

  return c.json(result.right, 200);
});

app.openapi(UpdateTacoRoute, async (c) => {
  const { tacoId } = c.req.valid("param");
  const patch = c.req.valid("json");

  const result = await Effect.runPromise(
    tacosRepo.update(tacoId, patch).pipe(Effect.provide(DbLive), Effect.either),
  );

  if (Either.isLeft(result)) {
    const err = result.left;

    if (err._tag === "TacoNotFoundError") {
      return c.json({ message: `Taco ${tacoId} not found`, status: 404 }, 404);
    }

    return c.json({ message: "Internal server error", status: 500 }, 500);
  }

  return c.json(result.right, 200);
});

app.openapi(DeleteTacoRoute, async (c) => {
  const { tacoId } = c.req.valid("param");

  const result = await Effect.runPromise(
    tacosRepo.remove(tacoId).pipe(Effect.provide(DbLive), Effect.either),
  );

  if (Either.isLeft(result)) {
    const err = result.left;

    if (err._tag === "TacoNotFoundError") {
      return c.json({ message: `Taco ${tacoId} not found`, status: 404 }, 404);
    }

    return c.json({ message: "Internal server error", status: 500 }, 500);
  }

  return c.body(null, 204);
});

export default app;
