// Import the framework and instantiate it
import Fastify, { fastify, FastifyInstance } from 'fastify';
import { chatRoutes } from './routes/chatRoutes';
import multipart from '@fastify/multipart';
import { MAX_FILE_SIZE_IN_BYTES } from './utils/constants';
import cors from '@fastify/cors';
import { ProfileRoutes } from './routes/settingsRoutes';
import { setupSocket } from './socket/socket';
import { Server as HttpServer } from 'http';
import { ApidataBase } from './utils/ApiDataBase';
import metricsPlugin from "fastify-metrics";
// Create a server instance
const fastifyServer: FastifyInstance = Fastify({
  logger: {
    level: 'debug', // Enable debug logs
  },
  // https: {
  //   key: './certs/key.pem',  // Path to your SSL key file
  //   cert: './certs/cert.pem' // Path to your SSL certificate file
  // }
});
fastifyServer.register(metricsPlugin, { endpoint: "/metrics" });
// Register the multipart plugin for handling file uploads
// fastifyServer.register(fastifyMultipart, {
//   throwFileSizeLimit: true, // Throw an error if the file size exceeds the limit
//   limits: {
//      fileSize: MAX_FILE_SIZE_IN_BYTES, // Set a limit of 150 MB for file uploads
//      files: 1, // Limit to 1 file per request
//   },
// });

fastifyServer.register(multipart, {
  limits: {
    fileSize: MAX_FILE_SIZE_IN_BYTES // 100MB max per file 
  }
});


fastifyServer.setErrorHandler(function (error, request, reply) {
  // Check for file size limit error
  // if (error.code === 'FST_MULTIPART_LIMIT_FILE_SIZE') {
  //   return reply.status(413).send({
  //     error: 'Payload Too Large',
  //     message: `File exceeds the maximum allowed size of ${MAX_FILE_SIZE_IN_BYTES / (1024 * 1024)}MB.`
  //   });
  // }
  
  // --- THIS IS THE PROTECTION YOU ASKED FOR ---
  // Check for file count limit error
  // if (error.code === 'FST_MULTIPART_LIMIT_FILES') {
  //   return reply.status(400).send({ // 400 Bad Request is appropriate
  //     error: 'Bad Request',
  //     message: 'Cannot upload more than one file in a single request.1'
  //   });
  // }


  // if (error.code === 'FST_FILES_LIMIT') {
  //   return reply.status(400).send({
  //     error: 'Bad Request',
  //     message: 'Cannot upload more than one file in a single request.2',
  //   });
  // }

  fastifyServer.log.error(error);
  // for any other error, send a generic error response
  reply.status(400).send({
    error: 'Bad Request',
    message: 'An unexpected error occurred. Please try again later.'
  });
});

// Register CORS to allow cross-origin requests
fastifyServer.register(cors, {
  // Put your options here
  origin: ["http://localhost:3000", "https://localhost:3000"], // Allow requests from frontend's origin
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Allow these HTTP methods
});

// Define a basic route
// fastifyServer.register(ProfileRoutes, {prefix: 'api/settings'});
fastifyServer.register(chatRoutes, {prefix: 'api/chat'});

// fastifyServer.get('/users', async (request, reply) => {

//   const response = await fetch(ApidataBase.hello);
//   if (!response.ok) {
//     reply.status(400).send({ error: 'Failed to fetch users from DB service' });
//     return;
//   }
//   const data = await response.json();
//   const { users } = data;
//   return { users };
// });

// add a prehanlder to atach the user to the request
fastifyServer.addHook('preHandler', async (request: any, reply: any) => {
    const userData = request.headers['x-user-data'];
    
    if (userData) {
      try {
        // Parse the JSON string sent by the Gateway
        request.user = JSON.parse(userData as string);
        console.log("User data attached to request:", request.user);
      } catch (err) {
        console.error("Failed to parse user data from gateway", err);
        request.user = null;
      }
    }
});

// Create a function to start the server
const start = async () => {
  try {

     // Wait for all Fastify plugins and routes to be ready
    await fastifyServer.ready();
    // Create the native Node.js HTTP server, passing Fastify's request handler
    const httpServer: HttpServer = fastifyServer.server;

    // Setup socket.io on the HTTP server
    setupSocket(httpServer);

    httpServer.listen({ port: 5003, host: '0.0.0.0' }, () => {
      console.log(`Server is running on http://localhost:5003`);
    });

  } catch (err) {
    fastifyServer.log.error(err);
    process.exit(1);
  }
};

// Start the server
start(); 