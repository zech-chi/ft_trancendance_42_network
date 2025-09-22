// src/server.ts
import Fastify from "fastify";
import db from "./db/connectionDb";
import type { Database } from "better-sqlite3";
import routes from "./routes/routesChat";
import dotenv from "dotenv";

dotenv.config();

// extend FastifyInstance to include db
declare module "fastify" {
  interface FastifyInstance {
    db: Database;
  }
}

// prnint the secret from env
console.log("==========>> DB_SECRET:", process.env.SECRET_KEY);  

const fastify = Fastify({ logger: true });

// decorate with db instance
fastify.decorate("db", db);

// register routes
// fastify.register(routes);
fastify.register(routes, { prefix: "/api/chat" });

// start server
const start = async () => {
  try {
    await fastify.listen({ port: 3600, host: "0.0.0.0" });
    fastify.log.info("DB service running on port 3600");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
