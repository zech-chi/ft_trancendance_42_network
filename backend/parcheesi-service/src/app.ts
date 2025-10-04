import { FastifyRequest, FastifyReply } from 'fastify';
import fastify from 'fastify';
import parchisiPlugin from './plugins/parchisiPlugin';
import auth2FaPlugin from './plugins/auth2FaPlugin';
import fastifyCors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import dotenv from "dotenv";
dotenv.config();



export async function buildApp()
{
    const app = fastify();

    app.register(fastifyJwt,{
            secret: process.env.SECRET_KEY || "super_code"});
    app.decorate('auth', async (request: any, reply: any) => {
        try {
            await request.jwtVerify();
        } catch (error) {
            reply.send(error);
        }
    });
    app.register( fastifyCors,{
        origin: ["http://localhost:3000", "http://10.13.1.16:3000"],
        methods: ['GET', 'POST'],
        credentials: true});

    app.register(auth2FaPlugin,{prefix: "/auth"} );
    app.register(parchisiPlugin, {prefix:"/games/parchisi"});
    app.get("/protected", {
        preHandler: [app.auth]
    }, async (req:any, reply:any) => {
        return { message: "This is protected" };
    })
    return app;
}