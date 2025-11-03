import 'fastify';

declare module 'fastify' {
  interface FastifyInstance {
    // your custom manual token verification function
    verifyToken(token: string): any; // replace `any` with your JWT payload type if you want
  }
}
