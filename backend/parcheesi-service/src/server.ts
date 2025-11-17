import { Server } from 'socket.io';
import socketManager from './plugins/socketManager';
import { PORT } from './config';
import {buildApp} from "./app"



async function start()
{
  //i have to connect the db befaure start the server

  const app = await buildApp();
  app.listen({ port: PORT, host: "0.0.0.0" }, (err: Error | null, address: string | undefined) => {
  if (err)
  {
    app.log.error(err);
    process.exit(1);
  }

  const io = new Server(app.server, {
    cors: { origin: ["http://localhost:3000", "https://localhost:3000" ,"http://10.13.1.16:3000"],
      methods: ['GET', 'POST'],
     },
  });
      //test
  socketManager(io);
  console.log(`🚀 Server running on ${address}`);
});
}

start();
