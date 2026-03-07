import { Data } from "effect";

export class TacoNotFoundError extends Data.TaggedError("TacoNotFoundError")<{
  tacoId: string;
}> {}

export class DatabaseError extends Data.TaggedError("DatabaseError")<{
  cause: unknown;
}> {}
