import Fastify from 'fastify';
import cors from '@fastify/cors';
import { ProfileRoutes } from './routes/settingsRoutes';
import multipart from '@fastify/multipart';
import metricsPlugin from "fastify-metrics";



// import createUploadsDir from './utils/createUploadsDir';
// import { createProfilesDir } from './utils/createProfilesDir';

const server = Fastify({
  logger: {
  }
});
server.register(metricsPlugin, { endpoint: "/metrics" });
// Create the profiles directory if it doesn't exist
// createProfilesDir();

server.register(cors, {
  origin: ['http://localhost:3000', 'https://localhost:3000'], // allow your frontend's origin
  credentials: true,               // <— important!
  methods: ['GET', 'POST', 'PATCH'], // ✅ important
});


server.register(multipart, {
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max per file
    files: 1, // Limit to 1 file per request
  }
});

server.register(ProfileRoutes, {prefix: 'api/settings'});

// server.addHook('preHandler', async (request: any, reply: any) => {
//     const userData = request.headers['x-user-data'];
    
//     if (userData) {
//       try {
//         // Parse the JSON string sent by the Gateway
//         request.user = JSON.parse(userData as string);
//       } catch (err) {
//         console.error("Failed to parse user data from gateway", err);
//         request.user = null;
//       }
//     }
// });

const PORT = 5004;

server.listen({ port: PORT, host: '0.0.0.0' }).then(() => {
  console.log(`Server running at http://localhost:${PORT}`);     
});
