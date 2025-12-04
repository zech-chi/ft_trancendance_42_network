import { FastifyPluginAsync } from 'fastify';
import { rooms } from '../game/GameManager';
import { ApidataBase } from '../utils/ApiDatabase';


const parchisiRoutes: FastifyPluginAsync = async (fastify, opts) => {

   fastify.get("/online/rooms", async () => {
   const availableRooms = Array.from(rooms.values()).map(room => ({
      id: room.id,
      players: room.players.length,
      status: room.gamestarted ? "started" : "waiting",
    }));

    return availableRooms;
  }
 );

  fastify.get("/users/:username", async (request:any, reply:any) => {
    const { username } = request.params as { username: string };
    const resp = await fetch(ApidataBase.getuserdata+username);
    
    if (!resp.ok) {
      reply.status(404).send({ error: 'User not found at all' });
      return;
    }
    const userData = await resp.json();
    return{ username: userData.userName, avatar: userData.imageUrl, id: userData.id, fullname: userData.fullName  };

  } );

}

export default parchisiRoutes;