import { FastifyPluginAsync } from 'fastify';
import parchisiRoutes from "../routes/parchisiRoutes"

const parchisiPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.register(parchisiRoutes, { prefix: '/api/parchisi' });
};

export default parchisiPlugin;
