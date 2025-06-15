import Fastify, { FastifyInstance } from 'fastify';

const app: FastifyInstance = Fastify({ logger: true });

interface IQueryInterface {
  username: string;
  password: string;
}

interface IHeaders {
  cookie: string;
}

interface IResponse {
  code: number;
  message: string;
  body: any;
}

app.get<{
  Querystring: IQueryInterface;
  Headers: IHeaders;
  Reply: IResponse;
}>('/', async (request, reply) => {
  const { username, password } = request.query;

  reply.send({
    code: 200,
    message: "Success",
    body: { username, password },
  });
});

app.listen({ port: 3000 }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  app.log.info(`Server listening on ${address}`);
});
