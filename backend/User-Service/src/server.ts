import Fastify from 'fastify';
import cors from '@fastify/cors';
import { ProfileRoutes } from './routes/settingsRoutes';
import multipart from '@fastify/multipart';



// import createUploadsDir from './utils/createUploadsDir';
// import { createProfilesDir } from './utils/createProfilesDir';

const server = Fastify({
  logger: {
  }
});

// Create the profiles directory if it doesn't exist
// createProfilesDir();

server.register(cors, {
  origin: ['http://localhost:3000', 'http://localhost:5004'], // allow your frontend's origin
  credentials: true,               // <— important!
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // ✅ important
});


server.register(multipart, {
  limits: {
    fileSize: 6 * 1024 * 1024 // 6MB max per file
  }
});

server.register(ProfileRoutes, {prefix: 'api/settings'});

server.get('/', async () => {
  return { message: 'Hello World!' };
});

const PORT = 5004;

server.listen({ port: PORT, host: '0.0.0.0' }).then(() => {
  console.log(`Server running at http://localhost:${PORT}`);     
});
