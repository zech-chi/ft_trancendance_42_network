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
// import jwt from '@fastify/jwt';

dotenv.config();
 
// prnint the secret from env
console.log("==========>> DB_SECRET:", process.env.JWT_SECRETS);  

const fastify = Fastify({ logger: true });
fastify.register(metricsPlugin, { endpoint: "/metrics" });

// get session secret from env (must be >= 32 chars); if not present, generate one (dev only)
const SESSION_SECRET = process.env.SESSION_SECRET && process.env.SESSION_SECRET.length >= 32
  ? process.env.SESSION_SECRET
  : crypto.randomBytes(64).toString('hex');

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
      id: process.env.GOOGLE_CLIENT_ID || '',
      secret: process.env.GOOGLE_CLIENT_SECRET || ''
    },
    auth: fastifyOauth2.GOOGLE_CONFIGURATION
  },
  // startRedirectPath: '/login/google',
  //  startRedirectPath: '/api/auth/login/google',
  callbackUri: process.env.GOOGLE_CALLBACK ||  'http://localhost/api/auth/login/google/callback'
});


fastify.register(cors, {
  origin: ['http://localhost:3000', 'http://0.0.0.0:3000', "https://localhost:3000"], // allow your frontend's origin
  credentials: true,               // <— important!
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // ✅ important
});


// // register jwt and cookie plugins
// fastify.register(cookie, {
//     secret: "zech-chi" // this should be come from env variable
// });

// register session (requires cookie registered first)
// register the plugin cookie first

// fastify.register(jwt, {
//     secret: "zech-chi", // this should be come from env variable
// });

fastify.register(fastifyJwt, {
  secret: process.env.JWT_SECRETS || "super-realy-secret-key"
});

for (const schema of userSchemas.schemas) {
    fastify.addSchema(schema);
}

// register routes
// fastify.register(routesDashboard, { prefix: "/api/auth/" });
fastify.register(authRoutes, { prefix: "/api/auth" });


// fastify.get('/api/auth/login/google', async (req, reply) => {
//   // if already logged in, redirect to profile
//   // const user = (req.session as any).user;
//   // if (user) return reply.redirect('/profile'); // already logged in

//   const fastifyAny = fastify as any;

//   // manually generate Google OAuth URL
//   fastifyAny.googleOAuth2.generateAuthorizationUri(req, reply, (err: any, uri: string) => {
//     if (err) {
//       fastifyAny.log.error('Error generating authorization URI:', err);
//       return reply.status(400).send('Could not generate authorization URI');
//     }
//     return reply.redirect(uri);
//   });
// });

// // callback route
// fastify.get('/api/auth/login/google/callback', async (req, reply) => {

//   const fastifyAny = fastify as any;
//   const token = await fastifyAny.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(req);
//   const accessToken = token.token.access_token;

//   console.log('Access Token =======>> ', accessToken);

//   // fetch user info
//   const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
//     headers: { Authorization: `Bearer ${accessToken}` }
//   }).then(res => res.json());

//   console.log('User info =======>> ', userInfo);
//   console.log("request session =======>> ", req.session);

//   // to remove that shite later
//   (req.session as any).user = {
//     id: userInfo.sub,
//     email: userInfo.email,
//     name: userInfo.name,
//     picture: userInfo.picture
//   };

//   return reply.send(userInfo);
// });


// fastify.get("/api/auth/login/google", async (req, reply) => {
//   // if already logged in, redirect to profile
//   // const user = (req.session as any).user;
//   // if (user) {
//   //   return reply.redirect('/profile');
//   // }
//   // not logged in, start OAuth flow

//   //  if already logged in, redirect to profile
//     // const user = (req.session as any).user;
//     // if (user) return reply.redirect('/profile'); // already logged in
//     console.log('BEFORE REDIRECT session ID:=======>', req.session.sessionId);
//     const fastifyAny = fastify as any;

//     // manually generate Google OAuth URL
//     fastifyAny.googleOAuth2.generateAuthorizationUri(req, reply, (err: any, uri: string) => {
      
//       if (err) {
//         fastifyAny.log.error('Error generating authorization URI:', err);
//           return reply.status(400).send('Could not generate authorization URI');
//         }
//         return reply.redirect(uri);
//       });
// });

// fastify.get('/api/auth/google/callback', async (req, reply) => {
//   try {
//     console.log('IN CALLBACK session ID:=======>', req.session.sessionId);
//     const fastifyAny = fastify as any;
//     const token = await fastifyAny.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(req);
//     const accessToken = token.token.access_token;

//     // fetch user info
//     const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
//       headers: { Authorization: `Bearer ${accessToken}` }
//     }).then(res => res.json());

//     // store user info in session
//     (req.session as any).user = {
//       id: userInfo.sub,
//       email: userInfo.email,
//       name: userInfo.name,
//       picture: userInfo.picture
//     };

//     // send the data to the db later !

//     // redirect or respond with user info
//     return reply.send(userInfo);
//   } catch (err) {
//     console.error('Error in Google OAuth callback:', err);
//     return reply.status(400).send('something went wrong');
//   }
// });



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
