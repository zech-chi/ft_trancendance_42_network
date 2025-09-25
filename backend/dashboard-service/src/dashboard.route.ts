import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { $ref } from "./dashboard.schema"
import { fetchRadarDataHandler, fetchSearchUserHandler, fetchUserHandler , fetchFriendsByStatusHandler, fetchUserByIdHandler } from './dashboard.controller';

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

     // fetch user by userId
    app.get(
        '/usersId/:userId',
        {
            schema: {
                params: $ref('fetchUserByIdParams'),
                response: {
                    200: $ref('fetchUserResponse'),
                },
            },
        },
        fetchUserByIdHandler
    );

    // search users by prefix 
    app.get(
        '/search',
        {
            schema: {
                querystring: $ref('searchUserParams'),
                response: {
                    200: $ref('searchUserResponse'),
                },
            },
        },
        fetchSearchUserHandler
    );

    // get radar charts stats by userName
    app.get(
        '/radarData/:userName',
        {
            schema: {
                params: $ref('radarStatsParams'),
                response: {
                    200: $ref('radarStatsResponse'),
                },
            },
        },
        // handler function to be implemented
        fetchRadarDataHandler
    );

    // fetch Friends by status
    app.get(
        '/friends/:userId',
        {
            schema: {
                querystring: $ref('fetchFriendsQuery'),
                params: $ref('fetchFriendsParams'),
                response: {
                    200: $ref('fetchFriendsResponse'),
                },
            },
        },
        // handler function to be implemented
        fetchFriendsByStatusHandler
    );
}

