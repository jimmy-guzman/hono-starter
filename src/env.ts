import { Config } from "effect";

export const AppConfig = Config.all({
  databaseUrl: Config.string("DATABASE_URL"),
});
