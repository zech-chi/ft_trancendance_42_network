

import { FastifyInstance, FastifyRequest, FastifyReply} from "fastify";

export async function PongPlugin(fastify: FastifyInstance) 
{
  
  
  fastify.get("/friends/:userId", async (request :FastifyRequest, reply:FastifyReply) => {
    try {
    
    const { userId } = request.params as { userId: number };
    if (!userId) {
        reply.code(401);
        return { success: false, error: "Not authenticated" };
    }

    const response = await fetch(`http://db-service:5000/api/pong/friends/${userId}`);
    if (!response.ok) {
        reply.status(400).send({ success: false, error: "Failed to fetch friends" });
        return;
    }
    const data = await response.json();
    return data;

    } catch(err) {
      console.error(err);
      reply.code(400);
      return { success: false, error: "something went wrong try again later!" };
    }
  });


  // get user by id
  fastify.get("/get-user/:id", async (request :FastifyRequest, reply:FastifyReply) => {
    const { id } = request.params as { id: number };
    if (!id) {
      reply.code(400);
      return { success: false, error: "User ID is required" };
    }

    try {
      // now fetch user from db localhost:5000/api/pong/user/:id
      const response = await fetch(`http://db-service:5000/api/pong/user/${id}`);
      if (!response.ok) {
        reply.status(400).send({ success: false, error: "Failed to fetch user" });
        return;
      }
      const data = await response.json();
      return data;
    } catch (error) {
      reply.code(400);
      return { success: false, error: "something went wrong try again later!" };
    }
  });

};


export default PongPlugin;
