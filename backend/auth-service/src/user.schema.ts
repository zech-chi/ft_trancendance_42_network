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

// verify email schema
const VerifyEmailSchema = z.object({
    email: z.string().email(),
    code: z.string().length(6),
});

export type VerifyEmailInput = z.infer<typeof VerifyEmailSchema>;

// response schema for email verification
const VerifyEmailResponseSchema = z.object({
    message: z.string(),
});
export type VerifyEmailResponse = z.infer<typeof VerifyEmailResponseSchema>;

// resend verification code schema
const ResendVerificationCodeSchema = z.object({
    email: z.string().email(),
});

export type ResendVerificationCodeInput = z.infer<typeof ResendVerificationCodeSchema>;

// response schema for resending verification code
const ResendVerificationCodeResponseSchema = z.object({
    message: z.string(),
});
export type ResendVerificationCodeResponse = z.infer<typeof ResendVerificationCodeResponseSchema>;

// build JSON schemas for Fastify
const { schemas, $ref } = buildJsonSchemas({
    RegisterUserSchema,
    RegisterUserResponseSchema,
    LoginUserSchema,
    LoginUserResponseSchema,
    VerifyEmailSchema,
    VerifyEmailResponseSchema,
    ResendVerificationCodeSchema,
    ResendVerificationCodeResponseSchema,
});

export const userSchemas = { schemas, $ref };
export {$ref};