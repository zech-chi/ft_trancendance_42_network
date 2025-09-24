// src/server.ts
import Fastify from "fastify";
import dotenv from "dotenv";
import { authRoutes } from "./src/user.route";
import { userSchemas } from './src/user.schema';
import cookie from '@fastify/cookie';
import jwt from '@fastify/jwt';
import cors from '@fastify/cors';

dotenv.config();

// prnint the secret from env
console.log("==========>> DB_SECRET:", process.env.SECRET_KEY);  

const fastify = Fastify({ logger: true });


// register routes
// fastify.register(routesDashboard, { prefix: "/api/auth/" });
fastify.register(authRoutes, { prefix: "/api/auth" });

fastify.register(cors, {
  origin: ['http://localhost:3000', 'http://0.0.0.0:3000'], // allow your frontend's origin
  credentials: true,               // <— important!
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // ✅ important
});

// register jwt and cookie plugins
fastify.register(cookie, {
    secret: "zech-chi" // this should be come from env variable
});

fastify.register(jwt, {
    secret: "zech-chi", // this should be come from env variable
    cookie: {
    cookieName: 'token',
    signed: false
    }
});

for (const schema of userSchemas.schemas) {
    fastify.addSchema(schema);
}

// start server
const start = async () => {
  try {
    await fastify.listen({ port: 5001, host: "0.0.0.0" });
    fastify.log.info("auth service running on port 5001");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
