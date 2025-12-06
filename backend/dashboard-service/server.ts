// src/server.ts
import Fastify from "fastify";
import dotenv from "dotenv";
import { dashboardRoutes } from "./src/dashboard.route";
import { dashboardSchemas } from "./src/dashboard.schema";
import cors from '@fastify/cors';
import metricsPlugin from "fastify-metrics";

dotenv.config();
  

const fastify = Fastify({ logger: true });
fastify.register(metricsPlugin, { endpoint: "/metrics" });

// register routes
// fastify.register(routesDashboard, { prefix: "/api/auth/" });
fastify.register(dashboardRoutes, { prefix: "/api/dashboard" });

fastify.register(cors, {
  origin: ['http://localhost:3000', "https://localhost:3000" ,'http://0.0.0.0:3000'], // allow your frontend's origin
  credentials: true,               // <— important!
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // ✅ important
});

for (const schema of dashboardSchemas.schemas) {
    fastify.addSchema(schema);
}

// start server
const start = async () => {
  try {
    await fastify.listen({ port: 5002, host: "0.0.0.0" });
    fastify.log.info("Dashboard service running on port 5002");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
