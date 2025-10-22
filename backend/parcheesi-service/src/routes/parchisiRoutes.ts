import { FastifyPluginAsync } from 'fastify';
import { rooms } from '../game/GameManager';
import { ApidataBase } from '../utils/ApiDatabase';


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
  fastify.get("/users/:username", async (request:any, reply:any) => {
    const { username } = request.params as { username: string };
    //fetch user data from database
    const resp = await fetch(ApidataBase.getuserdata+username);
    
    if (!resp.ok) {
      reply.status(404).send({ error: 'User not found 2 l' });
      return;
    }
    const userData = await resp.json();
    return{ username: userData.userName, avatar: userData.imageUrl, id: userData.id, fullname: userData.fullName  };

  } );

}

export default parchisiRoutes;