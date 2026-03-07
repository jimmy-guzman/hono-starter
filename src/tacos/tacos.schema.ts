import { z } from "@hono/zod-openapi";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

import { tacosTable } from "@/db/schemas/tacos";

export const Taco = createSelectSchema(tacosTable, {
  filling: (s) => s.openapi({ example: "nopales" }),
  id: (s) => s.openapi({ example: "taco_01h2xcejqtf2nbrexx3vqjhp41" }),
  name: (s) => s.openapi({ example: "Al Pastor Perfection" }),
  notes: (s) => s.openapi({ example: "Extra crispy, light on the salt" }),
  toppings: (s) => s.openapi({ example: ["cilantro", "onion", "lime"] }),
}).openapi("Taco");

export type Taco = z.infer<typeof Taco>;

export const NewTacoBody = createInsertSchema(tacosTable, {
  filling: (s) => s.min(1).openapi({ example: "nopales" }),
  name: (s) => s.min(1).openapi({ example: "Al Pastor Perfection" }),
  notes: (s) => s.openapi({ example: "Extra crispy, light on the salt" }),
  toppings: (s) => s.openapi({ example: ["cilantro", "onion", "lime"] }),
})
  .pick({
    filling: true,
    name: true,
    notes: true,
    toppings: true,
  })
  .openapi("NewTacoBody");

export type NewTacoBody = z.infer<typeof NewTacoBody>;

export const UpdateTacoBody = createUpdateSchema(tacosTable, {
  filling: (s) => s.min(1).openapi({ example: "carnitas" }),
  name: (s) => s.min(1).openapi({ example: "Al Pastor Perfection" }),
  notes: (s) => s.openapi({ example: "Updated notes" }),
  toppings: (s) => s.openapi({ example: ["cilantro", "onion"] }),
})
  .pick({
    filling: true,
    name: true,
    notes: true,
    toppings: true,
  })
  .partial()
  .openapi("UpdateTacoBody");

export type UpdateTacoBody = z.infer<typeof UpdateTacoBody>;

export const ApiError = z
  .object({
    details: z.unknown().optional(),
    message: z
      .string()
      .openapi({ example: "Your request did not match the expected schema." }),
    status: z.number().int().min(100).max(599).openapi({ example: 422 }),
  })
  .openapi("ApiError");
