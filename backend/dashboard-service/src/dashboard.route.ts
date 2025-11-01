import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { $ref, gameHistoryResponse } from "./dashboard.schema"
import { fetchRadarDataHandler, fetchSearchUserHandler, fetchUserHandler , fetchFriendsByStatusHandler, fetchUserByIdHandler, friendRejectHandler, friendAcceptHandler, friendUnblockHandler, fetchFriendsBySentHandler, friendRequestHandler, fetchChartsDataHandler, fetchGamesHandler } from './dashboard.controller';
import { fetchFriendshipStatusHandler, fetchRankDataHandler } from './dashboard.controller';
import { z } from 'zod';


export async function dashboardRoutes(app: FastifyInstance) {
    // for testing
    app.get('/', (req: FastifyRequest, res: FastifyReply) => {
        res.code(200).send("dashborad work");
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

    // fetch Sent friend requests
    app.get(
        '/friends/sentrequest/:userId',
        {
            schema: {
                params: $ref('fetchFriendsParams'),
                response: {
                    200: $ref('fetchFriendsResponse'),
                },
            },
        },
        // handler function to be implemented
        fetchFriendsBySentHandler
    );


    // reject friend request
    app.delete(
        '/friends/reject',
        {
            schema: {
                body: $ref('friendParams'),
            },
        },
        friendRejectHandler
    );

    // accept friend request
    app.put(
        '/friends/accept',
        {
            schema: {
                body: $ref('friendParams'),
            },
        },
        friendAcceptHandler
    );

    // unblock friend request
    app.put(
        '/friends/unblock',
        {
            schema: {
                body: $ref('friendParams'),
            },
        },
        friendUnblockHandler
    );

    // friend request handler
    app.post(
        '/friends/requestfriend',
        {
            schema: {
                body: $ref('friendParams'),
            },
        },
        friendRequestHandler
    );


    // get charts data handler
    app.get(
        '/chartsdata/:userId',
        {
            schema: {
                params: $ref('chartsDataParams'),
                querystring: $ref('chartsDataQuery'),
                response: {
                    200: $ref('chartsDataResponse'),
                },
            },
        },
        // handler function to be implemented
        fetchChartsDataHandler
    );

     // get friendship status handler
     app.get(
        '/friends/status',
        {
            schema: {
                querystring: $ref('friendshipQuery'),
                response: {
                    200: $ref('friendshipResponse'),
                },
            },
        },
        // handler function to be implemented
        fetchFriendshipStatusHandler
    );

    // add rank route
    app.get(
        '/rank',
        {
            schema: {
                response: {
                    200: $ref('rankListResponse'),
                },
            },
        },
        fetchRankDataHandler
    );

    // game history
    app.get(
        '/Games/:userId',
        {
          schema: {
            params: $ref('gameHistoryParams'),
            querystring: $ref('gameHistoryQuery'),
            response: {
              200: z.array(gameHistoryResponse), // <- array
            },
          },
        },
        fetchGamesHandler
      );
}

