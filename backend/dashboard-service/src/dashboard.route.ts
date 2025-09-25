import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { $ref, FetchUserParams, FetchUserResponse} from "./dashboard.schema"
import { fetchUserHandler } from './dashboard.controller';

export async function dashboardRoutes(app: FastifyInstance) {
    // for testing
    app.get('/', (req: FastifyRequest, res: FastifyReply) => {
        res.code(200).send("auth work");
    });

    // fetch user by userName
    app.get(
        '/users/:userName',
        {
            schema: {
                params: $ref('fetchUserParams'),
                response: {
                    200: $ref('fetchUserResponse'),
                },
            },
        },
        fetchUserHandler
    );
}