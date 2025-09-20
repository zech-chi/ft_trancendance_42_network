import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const searchUsersQuerySchema = z.object({
  prefix: z.string().min(1).max(50),
});

const searchUsersResponseSchema = z.object({
  users: z.array(
    z.object({
      id: z.number(),
      userName: z.string(),
      imageUrl: z.string(),
    })
  ),
});

const { schemas, $ref } = buildJsonSchemas(
  { searchUsersQuerySchema, searchUsersResponseSchema },
  { $id: "SearchUsersSchema" }
);

export const searchUsersSchemas = { schemas, $ref };
export { $ref };
