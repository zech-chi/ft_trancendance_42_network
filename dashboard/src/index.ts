import Fasitify from 'fastify';

const server = Fasitify(
    {
        logger: true,
    }
);

server.get('/', async (request, response) => {
    return {
        message: 'Hello this is a message',
    };
});


const startServer = async () => {
    try {
        await server.listen( { port: 8080, host: '0.0.0.0' } );
        console.log('🚀 Server ready at http://10.13.100.25:8080');
    } catch (err) {
        server.log.error(err);
    }
}

startServer();