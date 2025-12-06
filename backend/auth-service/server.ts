// src/server.ts
import Fastify from "fastify";
import dotenv from "dotenv";
import { authRoutes } from "./src/user.route";
import { userSchemas } from './src/user.schema';
import cookie, { fastifyCookie } from '@fastify/cookie';
import cors from '@fastify/cors';
import fastifyOauth2 from '@fastify/oauth2';
import fastifySession from '@fastify/session';
import crypto from 'crypto';
import fastifyJwt from "@fastify/jwt";
import metricsPlugin from "fastify-metrics";

dotenv.config();
 
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_CALLBACK || !process.env.JWT_SECRETS || !process.env.HOST) {
  throw new Error('Missing required Google OAuth environment variables: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK');
}

const fastify = Fastify({ logger: true });
fastify.register(metricsPlugin, { endpoint: "/metrics" });


// cookie + session 
fastify.register(cookie, {
    secret: "zech-chi"
});

// OAuth plugin
fastify.register(fastifyOauth2, {
  name: 'googleOAuth2',
  scope: ['profile', 'email'],
  credentials: {
    client: {
      id: process.env.GOOGLE_CLIENT_ID,
      secret: process.env.GOOGLE_CLIENT_SECRET
    },
    auth: fastifyOauth2.GOOGLE_CONFIGURATION
  },
  callbackUri: process.env.GOOGLE_CALLBACK
});


fastify.register(cors, {
  origin: ['http://localhost:3000', "https://localhost:3000", `${process.env.HOST}:3000`], // allow your frontend's origin
  credentials: true,               // <— important!
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // important
});

fastify.register(fastifyJwt, {
  secret: process.env.JWT_SECRETS
});

for (const schema of userSchemas.schemas) {
    fastify.addSchema(schema);
}

// register routes
fastify.register(authRoutes, { prefix: "/api/auth" });

// start server
const start = async () => {
  try {
    await fastify.ready();
    await fastify.listen({ port: 5001, host: "0.0.0.0" });
    fastify.log.info("auth service running on port 5001");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
