import fastify from 'fastify';
import parchisiPlugin from './plugins/parchisiPlugin';
import fastifyCors from "@fastify/cors";
import metricsPlugin from "fastify-metrics";

export async function buildApp()
{
    const app = fastify();
    app.register(metricsPlugin, { endpoint: "/metrics" });
    app.addHook('preHandler', async (request: any, reply: any) => {
        const userData = request.headers['x-user-data'];
        
        if (userData) {
          try {
            // Parse the JSON string sent by the Gateway
            request.user = JSON.parse(userData as string);
          } catch (err) {
            console.error("Failed to parse user data from gateway", err);
            request.user = null;
          }
        }
      });

    app.register( fastifyCors,{
        origin: ["http://localhost:3000", "http://10.13.1.16:3000", "https://localhost:3000"],
        methods: ['GET', 'POST'],
        credentials: true});
        
        app.register(parchisiPlugin);

    return app;
}