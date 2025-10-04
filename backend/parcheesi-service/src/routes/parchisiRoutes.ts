import { FastifyPluginAsync } from 'fastify';
import { rooms } from '../game/GameManager';


const parchisiRoutes: FastifyPluginAsync = async (fastify, opts) => {

      fastify.get('/local', async () => {
    return { message: 'Welcome to the Local game!' };
  });

   fastify.get("/online/rooms", async () => {
   const availableRooms = Array.from(rooms.values()).map(room => ({
      id: room.id,
      players: room.players.length,
      status: room.gamestarted ? "started" : "waiting",
    }));

    return availableRooms;
  }
 );

  fastify.get("/player/:id", async (request:any, reply:any) => {
    const { id } = request.params as { id: string };
    // this is real application, i have to fetch player data from a database
    // return { id, name: "Player " + id, photo: "/avatars/default.png" };
  });

}

export default parchisiRoutes;