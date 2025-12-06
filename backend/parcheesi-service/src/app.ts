import { FastifyRequest, FastifyReply } from 'fastify';
import fastify from 'fastify';
import parchisiPlugin from './plugins/parchisiPlugin';
import fastifyCors from "@fastify/cors";
import metricsPlugin from "fastify-metrics";



export async function buildApp()
{
    const app = fastify();
    app.register(metricsPlugin, { endpoint: "/metrics" });
    app.register( fastifyCors,{
        origin: ["http://localhost:3000", "http://10.13.1.16:3000", "https://localhost:3000"],
        methods: ['GET', 'POST'],
        credentials: true});
        
        app.register(parchisiPlugin);

    return app;
}