import Fastify from "fastify";
import { writeFileSync } from "fs";
import { registerSwagger } from "./config/swagger";
import { feedRoutes } from "./routes";

const app = Fastify({ ajv: { customOptions: { keywords: ["example"] } } });

(async () => {
  await registerSwagger(app);
  await app.register(feedRoutes);
  await app.ready();
  writeFileSync(process.argv[2], JSON.stringify(app.swagger()));
  process.exit(0);
})();
