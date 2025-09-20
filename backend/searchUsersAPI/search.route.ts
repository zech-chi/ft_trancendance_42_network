import { FastifyInstance } from "fastify";
import { $ref } from "./search.schema";
import { searchUsersController } from "./search.controller";

export async function searchUsersRoutes(app: FastifyInstance) {
  app.get(
    "/",
    {
      schema: {
        querystring: $ref("searchUsersQuerySchema"),
        response: {
          200: $ref("searchUsersResponseSchema"),
        },
      },
    },
    searchUsersController
  );
}
