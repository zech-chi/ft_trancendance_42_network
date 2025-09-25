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



// search user by prefix schema
const searchUserParams = z.object({
    prefix: z.string().min(1).max(100),
});

// search user response schema
const searchUserResponse = z.object({
    users: z.array(fetchUserResponse),
});

// type search user request 
export type SearchUserParams = z.infer<typeof searchUserParams>;
// type search user response
export type SearchUserResponse = z.infer<typeof searchUserResponse>;

const { schemas, $ref } = buildJsonSchemas({
   fetchUserParams,
    fetchUserResponse,
    searchUserParams,
    searchUserResponse,
});

export const dashboardSchemas = { schemas, $ref };
export {$ref};