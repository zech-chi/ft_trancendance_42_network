import { FastifyPluginAsync } from "fastify";
import db from "../db/db";
import bcrypt from "bcrypt";
import fastifyJwt from "@fastify/jwt";



const authRoutes: FastifyPluginAsync = async (fastify, opts) => {
        const registerSchema = {
        body: {
            type: "object",
            required: ["username", "password"],
            properties: {
                username: { type: "string", minLength: 3 },
                password: { type: "string", minLength: 6 }
            }
        }
    };

    const loginSchema = {
        body: {
            type: "object",
            required: ["username", "password"],
            properties: {
                username: { type: "string", minLength: 3 },
                password: { type: "string", minLength: 6 }
            }
        }
    };

    // REGISTER
    fastify.post("/register", { schema: registerSchema }, async (request: any, reply: any) => {
        const { username, password } = request.body as { username: string; password: string };
        try {
            const hashed = await bcrypt.hash(password, 12);
            const stmt = db.prepare("INSERT INTO users (username, password) VALUES (?, ?)");
            stmt.run(username, hashed);
            reply.code(201).send({ message: "User created" });
        } catch (err: any) {
            if (err.message.includes("UNIQUE constraint failed")) {
                return reply.code(400).send({ error: "Username already taken" });
            }
            reply.code(500).send({ error: "Internal server error" });
        }
    });

    // LOGIN
    fastify.post("/login", { schema: loginSchema }, async (request: any, reply: any) => {
        const { username, password } = request.body as { username: string; password: string };
        const row = db.prepare("SELECT * FROM users WHERE username = ?").get(username) as { id: number; username: string; password: string };

        if (!row) {
            return reply.code(400).send({ error: "Invalid username or password" });
        }

        const valid = await bcrypt.compare(password, row.password);
        if (!valid) {
            return reply.code(400).send({ error: "Invalid username or password" });
        }

        const token = fastify.jwt.sign({ id: row.id, username: row.username },{expiresIn:"1h"});
        reply.send({ token });
    });

}

export default authRoutes;