import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';

// fetch user request schema
const fetchUserParams = z.object({
    userName: z.string(),
});

const fetchUserByIdParams = z.object({
    userId: z.number(),
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
// type fetch user by id request
export type FetchUserByIdParams = z.infer<typeof fetchUserByIdParams>;



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

// request radar charts stats params schema
export const radarStatsParams = z.object({
    userName: z.string(),
});


// data from db service:  {
//   Quick_Reflexes: 40,
//   Strategic_Thinking: 50,
//   Precision_Shots: 55,
//   Pattern_Recognition: 45,
//   Anticipating_Moves: 60,
//   Board_Control: 50,
//   Adaptive_Playstyle: 40,
//   Risk_Management: 35,
//   Mind_Games: 30
// }

// radar charts stats schema
const radarStatsResponse = z.object({
    Quick_Reflexes: z.number(),
    Strategic_Thinking: z.number(),
    Precision_Shots: z.number(),
    Pattern_Recognition: z.number(),
    Anticipating_Moves: z.number(),
    Board_Control: z.number(),
    Adaptive_Playstyle: z.number(),
    Risk_Management: z.number(),
    Mind_Games: z.number(),
});

// type radar charts stats request
export type RadarStatsParams = z.infer<typeof radarStatsParams>;
// type radar charts stats response
export type RadarStatsResponse = z.infer<typeof radarStatsResponse>;


// params schema
const fetchFriendsParams = z.object({
  userId: z.number(),
});

// query schema
const fetchFriendsQuery = z.object({
  status: z.enum(["accepted", "pending", "blocked"]),
});

// fetch Friends by status response schema
const fetchFriendsResponse = z.object({
    friends: z.array(z.object({
      id: z.number(),
      sender_id: z.number(),
      receiver_id: z.number(),
      status: z.enum(['accepted', 'pending', 'blocked']),
      blocked_by: z.number().nullable()
    })),
});

export type fetchFriendsParams = z.infer<typeof fetchFriendsParams>;
export type fetchFriendsResponse = z.infer<typeof fetchFriendsResponse>;
export type fetchFriendsQuery = z.infer<typeof fetchFriendsQuery>;


// friend parameters
const friendParams = z.object({
    sender_id: z.number(),
    receiver_id: z.number(),
});

export type FriendParams = z.infer<typeof friendParams>;



// charts data shema request
const chartsDataParams = z.object({
    userId: z.number(),
});

// chart data shema query
const chartsDataQuery = z.object({
    game: z.enum(['pong', 'parcheesi']),
});


export type ChartsDataParams = z.infer<typeof chartsDataParams>;
export type ChartsDataQuery = z.infer<typeof chartsDataQuery>;

// response schema for charts data
export const StatsSchema = z.object({
  id: z.number().int(),
  userId: z.number().int(),
  game: z.string(),
  totalGamesWithAi: z.number().int(),
  gamesWithAiEasy: z.number().int(),
  gamesWithAiMedium: z.number().int(),
  gamesWithAiHard: z.number().int(),
  totalWins: z.number().int(),
  easyWins: z.number().int(),
  mediumWins: z.number().int(),
  hardWins: z.number().int(),
  friendsWins: z.number().int(),
  friendsLosses: z.number().int(),
  friendsTotalGames: z.number().int(),
});

export const chartsDataResponse = z.object({
  status: z.string(),
  stats: StatsSchema,
});

// inferred TS types
export type Stats = z.infer<typeof StatsSchema>;
export type ChartsDataResponse = z.infer<typeof chartsDataResponse>;

// friendship qery
export const friendshipQuery = z.object({
  userId1: z.string(),
  userId2: z.string(),
});

// type friendship query
export type FriendshipQuery = z.infer<typeof friendshipQuery>;

// friendship response
export const friendshipResponse = z.object({
  status: z.enum(['accepted', 'pending', 'blocked', 'self', 'no-friendship']),
  blocked_by: z.number().nullable(),
});

// type friendship response
export type FriendshipResponse = z.infer<typeof friendshipResponse>;


// build and export the json schemas
const { schemas, $ref } = buildJsonSchemas({
   fetchUserParams,
    fetchUserResponse,
    searchUserParams,
    searchUserResponse,
    radarStatsParams,
    radarStatsResponse,
    fetchFriendsParams,
    fetchFriendsResponse,
    fetchFriendsQuery,
    fetchUserByIdParams,
    friendParams,
    chartsDataParams,
    chartsDataQuery,
    chartsDataResponse,
    friendshipQuery,
    friendshipResponse,
});

export const dashboardSchemas = { schemas, $ref };
export {$ref};