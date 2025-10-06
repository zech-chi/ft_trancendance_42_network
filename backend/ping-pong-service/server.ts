import Fastify from 'fastify';
import cors from '@fastify/cors';
import fs from 'fs/promises';
import path from 'path';
import { createServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import db from "./DataBase/db"
import authPlugin from './plugins/authPlugin';
import fastifyCookie from "@fastify/cookie";
import fastifyJwt from '@fastify/jwt';
import {SocketFunction} from "./socket"
import metricsPlugin from "fastify-metrics";

const fastify = Fastify({ logger: false });

fastify.register(metricsPlugin, { endpoint: "/metrics" });


fastify.register(cors, {
  origin: ["http://localhost:3000"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
});

fastify.register(fastifyCookie, {
  secret:"my-cookie-secret-key",
  hook: "onRequest",
});
fastify.register(fastifyJwt, {
  secret: "super-secret-jwt-key-12345",
});

// Plugin d'authentification
fastify.register(authPlugin, {
  secret: "super-secret-jwt-key-12345",
  cookieName: "auth-token",
});

fastify.get('/', async () => {
  return { message: 'Bienvenue sur Fastify avec TypeScript 🎉' };
});

const start = async () => {
  try {
    console.log("🚀 Starting Fastify server...");
    await fastify.ready();
    console.log("✅ Fastify ready, initializing socket...");
    SocketFunction(fastify);
    console.log("✅ Socket initialized, starting server...");
    fastify.listen({port:5500, host: "0.0.0.0"},() =>{console.log('🚀 Serveur lancé sur http://localhost:5500');});
  } catch (err) {
   console.error("❌ Server startup error:", err);
   fastify.log.error(err);
    process.exit(1);
  }
};

start();


