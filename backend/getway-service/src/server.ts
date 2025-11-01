import Fastify from "fastify";
import fastifyHttpProxy from "@fastify/http-proxy";
import * as jwt from "jsonwebtoken";
// import { SERVICES } from "./config/services";

export const  SERVICES = {
  auth_service: "http://auth-service:5001",
  chat_service: "http://chat-service:5003",
  dashboard_service: "http://dashboard-service:5002",
  ping_pong_service: "http://ping-pong-service:5500",
  parcheesi_service: "http://parcheesi-service:5555",
  user_service: "http://user-service:5004",
};


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


// Helper for proxy error handling
const proxyErrorHandler = (serviceName: string) => (reply: any, error: any) => {
  fastify.log.error(`Proxy error on ${serviceName}: ${error.message}`);
  reply.code(200).send({ code: 0, message: `${serviceName} unavailable` });
};

// add a preHandler to log incoming requests
fastify.addHook("preHandler", async (request, reply) => {
  // add colors to the log output
  const color = (text: string) => `\x1c[36m${text}\x1b[0m`; // Cyan color
  fastify.log.info(`Incoming request: ${color(request.method)} ${color(request.url)}`);
});

// JWT verification preHandler - protects API and websocket routes
// fastify.addHook("preHandler", async (request, reply) => {
//   // No-op for public assets or the frontend
  // const publicPaths = ["/", "/favicon.ico", "/api/auth/login", "/api/auth/register"];
  // if (publicPaths.some((p) => request.url.startsWith(p))) return;

//   // Only protect API and socket routes
  // if (!request.url.startsWith("/api") && !request.url.startsWith("/socket.io")) return;

  // const authHeader = request.headers["authorization"] as string | undefined;
  // if (!authHeader || !authHeader.startsWith("Bearer ")) {
  //   reply.code(401).send({ code: 400, message: "Unauthorized" });
  //   return;
  // }

//   const token = authHeader.slice(7);
//   const secret = process.env.JWT_SECRET || "change-me";

//   try {
//     const decoded = jwt.verify(token, secret, { algorithms: ["HS256"] });
//     // attach user info to request for downstream handlers
//     (request as any).user = decoded;
//   } catch (err) {
//     fastify.log.warn({ err, url: request.url }, "JWT verification failed");
//     reply.code(401).send({ code: 0, message: "Unauthorized" });
//   }
// });

// auth service proxy
fastify.register(fastifyHttpProxy, {
  upstream: SERVICES.auth_service,
  prefix: "/api/auth",
  rewritePrefix: "/api/auth",
  replyOptions: {
    onError: proxyErrorHandler("Auth service unavailable")
  }
});

// chat service proxy
fastify.register(fastifyHttpProxy, {
  upstream: SERVICES.chat_service,
  prefix: "/api/chat",
  rewritePrefix: "/api/chat",
  replyOptions: {
    onError: proxyErrorHandler("Uploads")
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


// ping-pong service later
// parcheesi service later

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
  upstream: SERVICES.parcheesi_service,
  prefix: "/api/parcheesi",
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
    console.log("🚀 Gateway running at http://localhost:8080");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
