import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';

// data validation schema for user registration
const RegisterUserSchema = z.object({
    fullName: z.string().min(2).max(100),
    userName: z.string().min(3).max(30),
    email: z.string().email(),
    password: z.string().min(8).max(100),
});

export type RegisterUserInput = z.infer<typeof RegisterUserSchema>;

// response schema for user registration
const RegisterUserResponseSchema = z.object({
    id: z.string(),
    email: z.string(),
    userName: z.string(),
});

// login schema
const LoginUserSchema = z.object({
    email: z.string({ required_error: 'Email is required' }).email(),
    password: z.string({ required_error: 'Password is required' }).min(8).max(100),
});

export type LoginUserInput = z.infer<typeof LoginUserSchema>;

// response schema for user login
const LoginUserResponseSchema = z.object({
    accessToken: z.string(),
    user: z.object({
        id: z.string(),
        email: z.string(),
        userName: z.string(),
    }),
});

// build JSON schemas for Fastify
const { schemas, $ref } = buildJsonSchemas({
    RegisterUserSchema,
    RegisterUserResponseSchema,
    LoginUserSchema,
    LoginUserResponseSchema,
});

export const userSchemas = { schemas, $ref };
export {$ref};