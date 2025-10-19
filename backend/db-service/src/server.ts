// src/server.ts
import Fastify from "fastify";
import db from "./db/connectionDb";
import type { Database } from "better-sqlite3";
import routesChat from "./routes/routesChat";
import routesDashboard from "./routes/routesDashboard";
import routesAuth from "./routes/routesAuth";
import routesPong from "./routes/routesPong";
import dotenv from "dotenv";
import metricsPlugin from "fastify-metrics";
import routesSettings from "./routes/routesSettings";
import routesParchisi from "./routes/routesParchisi";
// import cors from '@fastify/cors';

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
fastify.register(metricsPlugin, { endpoint: "/metrics" });
// fastify.register(cors, {
//   origin: ['http://localhost:3000', 'http://0.0.0.0:3000'], // allow your frontend's origin
//   credentials: true,               // <— important!
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // ✅ important
// });
// decorate with db instance
fastify.decorate("db", db);

// register routes
// fastify.register(routes);
fastify.register(routesChat, { prefix: "/api/chat" });
fastify.register(routesAuth, { prefix: "api/auth" });
fastify.register(routesDashboard, { prefix: "/api/dashboard" });
fastify.register(routesPong, { prefix: "/api/pong" });
fastify.register(routesSettings, { prefix: "/api/settings" });
fastify.register(routesParchisi, { prefix: "/api/parchisi" });

// start server
const start = async () => {
  try {
    await fastify.listen({ port: 5000, host: "0.0.0.0" });
    fastify.log.info("DB service running on port 5000");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start(); 