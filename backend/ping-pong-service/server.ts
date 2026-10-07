import Fastify from 'fastify';
import cors from '@fastify/cors';
import fs from 'fs/promises';
import path from 'path';
import { createServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import PongPlugin from './plugins/pongPlugin';
import {SocketFunction} from "./socket"
import metricsPlugin from "fastify-metrics";

const fastify = Fastify({ logger: false });

fastify.register(metricsPlugin, { endpoint: "/metrics" });


fastify.register(cors, {
  origin: ["http://localhost:3000", "https://localhost:3000"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
});

// Plugin d'authentification
fastify.register(PongPlugin, {
  prefix: '/api/pong',
});

fastify.get('/', async () => {
  return { message: 'Bienvenue sur Fastify avec TypeScript 🎉' };
});

const start = async () => {
  try {
    //console.log("🚀 Starting Fastify server...");
    await fastify.ready();
    //console.log("✅ Fastify ready, initializing socket...");
    SocketFunction(fastify);
    //console.log("✅ Socket initialized, starting server...");
    await fastify.listen({ port: 5500, host: "0.0.0.0" });
  } catch (err) {
   //console.error("❌ Server startup error:", err);
   fastify.log.error(err);
    process.exit(1);
  }
};

start();

