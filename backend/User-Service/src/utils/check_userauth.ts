import { FastifyReply } from 'fastify';

export function checkAuthenticatedUser(
  reply: FastifyReply,
  from: string | number,
  authenticatedUserId: string | number | undefined
): boolean {
  if (from != authenticatedUserId) {
    reply.status(403).send({
      status: 'error',
      message: 'Forbidden. User does not match authenticated user.'
    });
    return false;
  }
  return true;
}