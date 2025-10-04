import { FastifyPluginAsync } from "fastify";
import authRoutes from "../routes/authRoutes";
import auth2FARoutes from "../routes/auth2FARoutes"

const auth2FaPlugin: FastifyPluginAsync = async (fastify, opts) => {
    fastify.register(authRoutes, { prefix: "/auth" }); // normal authentication (login/register)
    fastify.register(auth2FARoutes, { prefix: "/2fa" }); // 2FA routes (setup, verify, etc.)

};

export default auth2FaPlugin;
