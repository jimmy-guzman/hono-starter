import { z } from "@hono/zod-openapi";
import { createSchemaFactory } from "drizzle-orm/zod";

import { tacosTable } from "@/db/schemas/tacos";

const { createInsertSchema, createSelectSchema, createUpdateSchema } =
  createSchemaFactory({ zodInstance: z });

const toppings = z
  .array(z.string())
  .openapi({ example: ["cilantro", "onion", "lime"] });

export const Taco = createSelectSchema(tacosTable, {
  filling: z.string().openapi({ example: "nopales" }),
  id: z.string().openapi({ example: "taco_01h2xcejqtf2nbrexx3vqjhp41" }),
  name: z.string().openapi({ example: "Al Pastor Perfection" }),
  notes: z
    .string()
    .nullable()
    .openapi({ example: "Extra crispy, light on the salt" }),
  toppings,
}).openapi("Taco");

export type Taco = z.infer<typeof Taco>;

export const NewTacoBody = createInsertSchema(tacosTable, {
  filling: z.string().min(1).openapi({ example: "nopales" }),
  name: z.string().min(1).openapi({ example: "Al Pastor Perfection" }),
  notes: z
    .string()
    .nullable()
    .optional()
    .openapi({ example: "Extra crispy, light on the salt" }),
  toppings,
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
  filling: z.string().min(1).openapi({ example: "carnitas" }),
  name: z.string().min(1).openapi({ example: "Al Pastor Perfection" }),
  notes: z.string().nullable().optional().openapi({ example: "Updated notes" }),
  toppings: z.array(z.string()).openapi({ example: ["cilantro", "onion"] }),
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
