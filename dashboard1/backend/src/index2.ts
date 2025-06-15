import Fastify from 'fastify';

const server = Fastify({
    logger: {
      level: 'info',
      transport: {
        target: 'pino-pretty'
      }
    }
});
  
  

server.get('/', async (request, response) => {
    return {
        message: 'Hello this is a message',
    };
});


const startServer = async () => {
    try {
        await server.listen( { port: 8080, host: '0.0.0.0' } );
        console.log('🚀 Server ready at http://127.0.0.1:8080');
    } catch (err) {
        server.log.error(err);
    }
}

startServer();