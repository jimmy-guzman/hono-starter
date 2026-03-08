import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { tacosTable } from "@/db/schemas/tacos";
import { generateTacos } from "@/db/seed";

// biome-ignore lint/style/noNonNullAssertion: seed script runs outside Effect runtime
const db = drizzle({ client: new Database(process.env.DATABASE_URL!) });

async function seed() {
  // biome-ignore lint/suspicious/noConsole: this is a script
  console.log("🌮 Seeding tacos...");

  const tacos = generateTacos();

  await db.insert(tacosTable).values(tacos);

  // biome-ignore lint/suspicious/noConsole: this is a script
  console.log(`✅ Seeded ${tacos.length} tacos`);
}

seed()
  .catch((error) => {
    // biome-ignore lint/suspicious/noConsole: this is a script
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
