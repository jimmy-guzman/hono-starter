import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dbCredentials: {
    // biome-ignore lint/style/noNonNullAssertion: drizzle-kit runs outside of Effect runtime
    url: process.env.DATABASE_URL!,
  },
  dialect: "sqlite",
  out: "./drizzle",
  schema: "./src/db/schemas",
});
