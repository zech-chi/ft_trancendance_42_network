import fastify from "fastify";

export function signAccessToken(fastifyInstance: any, payload: object) {
  return fastifyInstance.jwt.sign(payload, { expiresIn: process.env.JWT_EXPIRES_IN || "15m" });
}
