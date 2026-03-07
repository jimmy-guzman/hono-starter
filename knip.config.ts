import type { KnipConfig } from "knip";

const config = {
  entry: ["src/**/*.test.ts"],
  project: ["src/**/*.ts", "scripts/**/*.ts"],
} satisfies KnipConfig;

export default config;
