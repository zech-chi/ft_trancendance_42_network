import Fastify from "fastify";
import fastifyHttpProxy from "@fastify/http-proxy";
import * as jwt from "jsonwebtoken";

const app = Fastify({
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
// const proxyErrorHandler = (serviceName: string) => (reply: any, error: any) => {
//   app.log.error(`Proxy error on ${serviceName}: ${error.message}`);
//   reply.code(200).send({ code: 0, message: `${serviceName} unavailable` });
// };

// add a preHandler to log incoming requests
app.addHook("preHandler", async (request, reply) => {
  // add colors to the log output
  const color = (text: string) => `\x1c[36m${text}\x1b[0m`; // Cyan color
  app.log.info(`Incoming request: ${color(request.method)} ${color(request.url)}`);
});

// JWT verification preHandler - protects API and websocket routes
app.addHook("preHandler", async (request, reply) => {
  // No-op for public assets or the frontend
  const publicPaths = ["/", "/favicon.ico", "/api/auth/login", "/api/auth/register"];
  if (publicPaths.some((p) => request.url.startsWith(p))) return;

  // Only protect API and socket routes
  if (!request.url.startsWith("/api") && !request.url.startsWith("/socket.io")) return;

  const authHeader = request.headers["authorization"] as string | undefined;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    reply.code(401).send({ code: 400, message: "Unauthorized" });
    return;
  }

  const token = authHeader.slice(7);
  const secret = process.env.JWT_SECRET || "change-me";

  try {
    const decoded = jwt.verify(token, secret, { algorithms: ["HS256"] });
    // attach user info to request for downstream handlers
    (request as any).user = decoded;
  } catch (err) {
    app.log.warn({ err, url: request.url }, "JWT verification failed");
    reply.code(401).send({ code: 0, message: "Unauthorized" });
  }
});


// ! when running locally (without Docker), use localhost

// ! when using Docker, replace `host.docker.internal` with the service name defined in your Docker Compose file
// Proxy frontend (React/Next.js)
app.register(fastifyHttpProxy, {
  upstream: "http://host.docker.internal:3000",
  prefix: "/",
  rewritePrefix: "/"
});

// Proxy backend API
app.register(fastifyHttpProxy, {
  upstream: "http://host.docker.internal:5000",
  prefix: "/api",
  rewritePrefix: "/api"
});

// Proxy uploads
app.register(fastifyHttpProxy, {
  upstream: "http://host.docker.internal:5000",
  prefix: "/api/chat/uploads",
  rewritePrefix: "/api/chat/uploads"
});

// Proxy WebSockets (Socket.IO)
app.register(fastifyHttpProxy, {
  upstream: "http://host.docker.internal:5000",
  prefix: "/socket.io",
  rewritePrefix: "/socket.io",
  websocket: true
});

// // Proxy frontend (React/Next.js dev server on :3000)
// app.register(fastifyHttpProxy, {
//   upstream: "http://localhost:3000",
//   prefix: "/",
//   rewritePrefix: "/",
//   // replyOptions: {
//   //   onError: proxyErrorHandler("Frontend")
//   // }
// });

// // Proxy backend API (Fastify/Express backend on :5000)
// app.register(fastifyHttpProxy, {
//   upstream: "http://localhost:5000",
//   prefix: "/api",
//   rewritePrefix: "/api",
//   // replyOptions: {
//   //   onError: proxyErrorHandler("Backend API")
//   // }
// });

// // Proxy uploads
// app.register(fastifyHttpProxy, {
//   upstream: "http://localhost:5000",
//   prefix: "/api/chat/uploads",
//   rewritePrefix: "/api/chat/uploads",
//   // replyOptions: {
//   //   onError: proxyErrorHandler("Uploads")
//   // }
// });

// // Proxy WebSockets (Socket.IO)
// app.register(fastifyHttpProxy, {
//   upstream: "http://localhost:5000",  
//   prefix: "/socket.io",
//   rewritePrefix: "/socket.io",
//   websocket: true,
//   // replyOptions: {
//   //   onError: proxyErrorHandler("WebSocket")
//   // }
// });

// Start server
const start = async () => {
  try {
    await app.listen({ port: 8080, host: "0.0.0.0" });
    console.log("🚀 Gateway running at http://localhost:8080");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
