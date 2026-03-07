import { sql } from "drizzle-orm";
import { sqliteTable } from "drizzle-orm/sqlite-core";
import { typeid } from "typeid-js";

export const tacosTable = sqliteTable("tacos", (t) => ({
  createdAt: t
    .integer({ mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  filling: t.text().notNull(),
  id: t
    .text()
    .primaryKey()
    .$defaultFn(() => typeid("taco").toString()),
  name: t.text().notNull(),
  notes: t.text(),
  toppings: t.text({ mode: "json" }).$type<string[]>().notNull(),
  updatedAt: t
    .integer({ mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
}));
