import { FastifyPluginAsync } from 'fastify';
import parchisiRoutes from "../routes/parchisiRoutes"

const parchisiPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.register(parchisiRoutes, {perfix:"/"})
};

export default parchisiPlugin;
