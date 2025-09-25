import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';

// fetch user request schema
const fetchUserParams = z.object({
    userName: z.string(),
});


// fetch user response schema
const fetchUserResponse = z.object({
    id: z.number(),
    fullName: z.string(),
    userName: z.string(),
    email: z.string().email(),
    bio: z.string(),
    imageUrl: z.string(),
    rank: z.number(),
    last_seen: z.number(),
    level: z.number(),
    progress: z.number(),
    online: z.number(),
});


// type fetch user request 
export type FetchUserParams = z.infer<typeof fetchUserParams>;
// type fetch user response
export type FetchUserResponse = z.infer<typeof fetchUserResponse>;

const { schemas, $ref } = buildJsonSchemas({
   fetchUserParams,
    fetchUserResponse,
});

export const dashboardSchemas = { schemas, $ref };
export {$ref};