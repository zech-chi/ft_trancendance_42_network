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
    message: z.string(),
});

// login schema
const LoginUserSchema = z.object({
    email: z.string({ required_error: 'Email is required' }).email(),
    password: z.string({ required_error: 'Password is required' }).min(8).max(100),
});

export type LoginUserInput = z.infer<typeof LoginUserSchema>;

// response schema for user login
const LoginUserResponseSchema = z.object({
    user: z.object({
        id: z.string(),
        email: z.string(),
        userName: z.string(),
        twoFARequired : z.boolean(),
    }),
    message: z.string(),
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
    user: z.object({
        id: z.string(),
        email: z.string(),
        userName: z.string(),
        twoFARequired : z.boolean(),
    }),
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

const TwoFASetupSchema = z.object({
    userId: z.number(),
});
export type TwoFASetupInput = z.infer<typeof TwoFASetupSchema>;
const TwoFASetupResponseSchema = z.object({
    qr: z.string(),
});
export type TwoFASetupResponse = z.infer<typeof TwoFASetupResponseSchema>;

const TwoFAEnableSchema = z.object({
    userId: z.number(),
    otp: z.number(),
});
export type TwoFAEnableInput = z.infer<typeof TwoFAEnableSchema>;
const TwoFAEnableResponseSchema = z.object({
    message: z.string(),
});
export type TwoFAEnableResponse = z.infer<typeof TwoFAEnableResponseSchema>;

const TwoFAVerifySchema = z.object({
    otp: z.number(),
});
export type TwoFAVerifyInput = z.infer<typeof TwoFAVerifySchema>;
const TwoFAVerifyResponseSchema = z.object({
    message: z.string(),
    success: z.boolean(),
    user : z.object({
        id: z.string(),
        email: z.string(),
        userName: z.string(),
        twoFARequired : z.boolean(),
    }),
});
export type TwoFAVerifyResponse = z.infer<typeof TwoFAVerifyResponseSchema>;

const TwoFADisableSchema = z.object({
    userId: z.number(),
    otp: z.number(),
});
export type TwoFADisableInput = z.infer<typeof TwoFADisableSchema>;
const TwoFADisableResponseSchema = z.object({
    message: z.string(),
});


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
    TwoFASetupSchema,
    TwoFASetupResponseSchema,
    TwoFAEnableSchema,
    TwoFAEnableResponseSchema,
    TwoFAVerifySchema,
    TwoFAVerifyResponseSchema,
    TwoFADisableSchema,
    TwoFADisableResponseSchema,
});

export const userSchemas = { schemas, $ref };
export {$ref};