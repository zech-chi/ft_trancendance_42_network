import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import fastifyHttpProxy from "@fastify/http-proxy";
import * as jwt from "jsonwebtoken";
import metricsPlugin from "fastify-metrics";
import { SERVICES } from "./config/services";
import cors from '@fastify/cors';
import fastifyCookie from "@fastify/cookie";
import dotenv from "dotenv"

dotenv.config();

if (!process.env.JWT_SECRETS) {
  //console.error("JWT_SECRETS is not defined in environment variables.");
  process.exit(1);
}

declare module "fastify" {
  interface FastifyRequest {
    user?: any;
  }
}


const fastify = Fastify({
  logger: {
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "SYS:standard", // show readable time
        // ignore: "pid,hostname"        // cleaner logs
        // some other options:
        singleLine: true               // compact mode
 
      }
    } 
  }
});

// Register CORS to allow cross-origin requests
fastify.register(cors, {
  origin: ["http://localhost:3000", "https://localhost:3000"], // Allow requests from frontend's origin
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Allow these HTTP methods
  credentials: true,   //  allow cookies
});

fastify.register(fastifyCookie);

fastify.register(metricsPlugin, { endpoint: "/metrics" });
// Helper for proxy error handling
const proxyErrorHandler = (serviceName: string) => (reply: any, error: any) => {
  fastify.log.error(`Proxy error on ${serviceName}: ${error.message}`);
  reply.code(200).send({ code: 0, message: `${serviceName} unavailable` });
};


// JWT verification preHandler - protects API and websocket routes
fastify.addHook("preHandler", async (request: FastifyRequest, reply: FastifyReply) => {
  const publicPaths = [
    "/api/auth/",
    "/api/chat/uploads",
    "/api/settings/profileImage"
  ];

  const url = request.url;

  if (publicPaths.some((p) => url.startsWith(p))) return;

  // 2. Only protect API routes & websocket upgrades
  const isApi = url.startsWith("/api");
  const isSocket = url.startsWith("/socket.io");

  if (!isApi && !isSocket) return;

  // 3. Read token from cookies
  const secret = process.env.JWT_SECRETS as string;
  const access = request.cookies.access_token;
  const refresh = request.cookies.refresh_token;

  if (access) {
    try {
      const decoded = jwt.verify(access, secret);
      request.headers['x-user-data'] = JSON.stringify(decoded);
      return; // access OK
    } catch (err) {
      fastify.log.info("Access token expired, trying refresh token...");
    }
  }

   // 2️⃣ If access expired or missing, try REFRESH TOKEN
   if (!refresh) {
    reply.code(401).send({ message: "Unauthorized: No tokens" });
    return;
  }

  try {
    const decoded = jwt.verify(refresh, secret);
    request.headers['x-user-data'] = JSON.stringify(decoded);
  } catch (err) {
    fastify.log.warn({ err, url }, "JWT verification failed");
    reply.code(401).send({ code: 401, message: "Unauthorized: Invalid token" });
    return;
  }
});

// auth service proxy
fastify.register(fastifyHttpProxy, {
  upstream: SERVICES.auth_service,
  prefix: "/api/auth",
  rewritePrefix: "/api/auth",
  replyOptions: {
    onError: proxyErrorHandler("Auth service unavailable")
  }
});

//

// chat service proxy
fastify.register(fastifyHttpProxy, {
  upstream: SERVICES.chat_service,
  prefix: "/api/chat",
  rewritePrefix: "/api/chat",
  replyOptions: {
    onError: proxyErrorHandler("chat service unavailable")
  }
});

// dashboard service proxy
fastify.register(fastifyHttpProxy, {
  upstream: SERVICES.dashboard_service,
  prefix: "/api/dashboard",
  rewritePrefix: "/api/dashboard",
  replyOptions: {
    onError: proxyErrorHandler("dashboard service unavailable")
  }
});

// user service proxy
fastify.register(fastifyHttpProxy, {
  upstream: SERVICES.user_service,
  prefix: "api/settings",
  rewritePrefix: "api/settings",
  replyOptions: {
    onError: proxyErrorHandler("user service unavailable")
  }
});


// ping-pong service
fastify.register(fastifyHttpProxy, {
  upstream: SERVICES.ping_pong_service,
  prefix: "api/pong",
  rewritePrefix: "api/pong",
  replyOptions: {
    onError: proxyErrorHandler("pong service unavailable")
  }
});

// parcheesi service
fastify.register(fastifyHttpProxy, {
  upstream: SERVICES.parcheesi_service,
  prefix: "api/parchisi",
  rewritePrefix: "api/parchisi",
  replyOptions: {
    onError: proxyErrorHandler("user service unavailable")
  }
});


// START WebSockets (Socket.IO) proxy

// chat service WebSocket proxy
fastify.register(fastifyHttpProxy, {
  upstream: SERVICES.chat_service,  
  prefix: "/socket.io/chat",
  rewritePrefix: "/socket.io",
  websocket: true,
  replyOptions: {
    onError: proxyErrorHandler("chat service WebSocket unavailable")
  }
});

// ping-pong service WebSocket proxy
fastify.register(fastifyHttpProxy, {
  upstream: SERVICES.ping_pong_service,  
  prefix: "/socket.io/ping-pong",
  rewritePrefix: "/socket.io",
  websocket: true,
  replyOptions: {
    onError: proxyErrorHandler("ping-pong service WebSocket unavailable")
  }
});


// parcheesi service WebSocket proxy
fastify.register(fastifyHttpProxy, {
  preHandler: (request, reply, done) => {
    // rewrite the prefix for parcheesi namespaces
    const namespace = request.url.split("/")[3]; // e.g., "online" or "local"
    //console.log("Parcheesi namespace requested:", namespace);
    //console.log("Original URL:", request.url);
    done();
  },
  upstream: SERVICES.parcheesi_service,
  prefix: "/socket.io/parchisi",
  rewritePrefix: "/socket.io",
  websocket: true,
  replyOptions: {
    onError: proxyErrorHandler("parcheesi service WebSocket proxy unavailable")
  }
});


// END WebSockets (Socket.IO) proxy

// Start server
const start = async () => {
  try {
    await fastify.listen({ port: 5006, host: "0.0.0.0" });
    //console.log("🚀 Gateway running at http://localhost:8080");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

// ! we should add the cors orginal for this service also to avoid issues when frontend will try to connect
