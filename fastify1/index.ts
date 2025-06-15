import Fastify, { FastifyInstance } from 'fastify';

const app: FastifyInstance = Fastify({
    logger: true,
});

app.get('/', async (request, response) => {
    return {message: "hello"};
});

app.listen({ port: 3000 }, (err, address) => {
    if (err) {
        app.log.error(err);
        process.exit(1);
    }
    app.log.info(`server listening on ${address}`);
});
