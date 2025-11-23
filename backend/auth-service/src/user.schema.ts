// import { z } from 'zod';
// // import { buildJsonSchemas } from 'fastify-zod';


// // --- SHARED ERROR SCHEMA ---
// // We use this for 400/401/403 responses so TypeScript doesn't complain
// export const ErrorResponseSchema = z.object({
//     error: z.string().optional(),
//     message: z.string().optional(),
//     details: z.any().optional(),
// });
// export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
// // data validation schema for user registration
// export const RegisterUserSchema = z.object({
//     fullName: z.string().min(2).max(100),
//     userName: z.string().min(3).max(30),
//     email: z.string().email(),
//     password: z.string().min(8).max(100),
// });

// export type RegisterUserInput = z.infer<typeof RegisterUserSchema>;

// // response schema for user registration
// export const RegisterUserResponseSchema = z.object({
//     id: z.string(),
//     email: z.string(),
//     userName: z.string(),
//     message: z.string(),
// });
// export type RegisterUserResponse = z.infer<typeof RegisterUserResponseSchema>;

// // login schema
// export const LoginUserSchema = z.object({
//     email: z.string({ message: 'Email is required' }).email(),
//     password: z.string({ message: 'Password is required' }).min(8).max(100),
// });

// export type LoginUserInput = z.infer<typeof LoginUserSchema>;

// // response schema for user login
// export const LoginUserResponseSchema = z.object({
//     user: z.object({
//         id: z.string(),
//         email: z.string(),
//         userName: z.string(),
//         twoFARequired : z.boolean(),
//     }),
//     message: z.string(),
// });
// export type LoginUserResponse = z.infer<typeof LoginUserResponseSchema>;
    
// // verify email schema
// export const VerifyEmailSchema = z.object({
//     email: z.string().email(),
//     code: z.string().length(6),
// });

// export type VerifyEmailInput = z.infer<typeof VerifyEmailSchema>;

// // response schema for email verification
// export const VerifyEmailResponseSchema = z.object({
//     message: z.string(),
//     user: z.object({
//         id: z.string(),
//         email: z.string(),
//         userName: z.string(),
//         twoFARequired : z.boolean(),
//     }),
// });
// export type VerifyEmailResponse = z.infer<typeof VerifyEmailResponseSchema>;

// // resend verification code schema
// export const ResendVerificationCodeSchema = z.object({
//     email: z.string().email(),
// });

// export type ResendVerificationCodeInput = z.infer<typeof ResendVerificationCodeSchema>;

// // response schema for resending verification code
// export const ResendVerificationCodeResponseSchema = z.object({
//     message: z.string(),
// });
// export type ResendVerificationCodeResponse = z.infer<typeof ResendVerificationCodeResponseSchema>;

//  export const TwoFASetupSchema = z.object({
//     userId: z.number(),
// });
// export type TwoFASetupInput = z.infer<typeof TwoFASetupSchema>;
// export const TwoFASetupResponseSchema = z.object({
//     qr: z.string(),
// });
// export type TwoFASetupResponse = z.infer<typeof TwoFASetupResponseSchema>;

// export const TwoFAEnableSchema = z.object({
//     userId: z.number(),
//     otp: z.number(),
// });
// export type TwoFAEnableInput = z.infer<typeof TwoFAEnableSchema>;
// export const TwoFAEnableResponseSchema = z.object({
//     message: z.string(),
// });
// export type TwoFAEnableResponse = z.infer<typeof TwoFAEnableResponseSchema>;

// export const TwoFAVerifySchema = z.object({
//     otp: z.number(),
// });
// export type TwoFAVerifyInput = z.infer<typeof TwoFAVerifySchema>;
// export const TwoFAVerifyResponseSchema = z.object({
//     message: z.string(),
//     success: z.boolean(),
//     user : z.object({
//         id: z.string(),
//         email: z.string(),
//         userName: z.string(),
//         twoFARequired : z.boolean(),
//     }),
// });
// export type TwoFAVerifyResponse = z.infer<typeof TwoFAVerifyResponseSchema>;

// export const TwoFADisableSchema = z.object({
//     userId: z.number(),
//     otp: z.number(),
// });
// export type TwoFADisableInput = z.infer<typeof TwoFADisableSchema>;
//  export const TwoFADisableResponseSchema = z.object({
//     message: z.string(),
// });

// export type TwoFADisableResponse = z.infer<typeof TwoFADisableResponseSchema>;
//  export const TwoFAVerifyDisableSchema = z.object({
//     otp: z.number(),
// });
// export type TwoFAVerifyDisableInput = z.infer<typeof TwoFAVerifyDisableSchema>;
// export const TwoFAVerifyDisableResponseSchema = z.object({
//     message: z.string(),
//     success: z.boolean(),
// });
// export type TwoFAVerifyDisableResponse = z.infer<typeof TwoFAVerifyDisableResponseSchema>;

// // build JSON schemas for Fastify
// // const { schemas, $ref } = buildJsonSchemas({
// //     RegisterUserSchema,
// //     RegisterUserResponseSchema,
// //     LoginUserSchema,
// //     LoginUserResponseSchema,
// //     VerifyEmailSchema,
// //     VerifyEmailResponseSchema,
// //     ResendVerificationCodeSchema,
// //     ResendVerificationCodeResponseSchema,
// //     TwoFASetupSchema,
// //     TwoFASetupResponseSchema,
// //     TwoFAEnableSchema,
// //     TwoFAEnableResponseSchema,
// //     TwoFAVerifySchema,
// //     TwoFAVerifyResponseSchema,
// //     TwoFADisableSchema,
// //     TwoFADisableResponseSchema,
// //     TwoFAVerifyDisableSchema,
// //     TwoFAVerifyDisableResponseSchema,

// // });

// // export const userSchemas = { schemas, $ref };
// // export {$ref};
import { z } from 'zod';

// --- SHARED ERROR SCHEMA ---
// Used for 400/401/403 responses so TypeScript doesn't complain
export const ErrorResponseSchema = z.object({
    error: z.string().optional(),
    message: z.string().optional(),
    details: z.any().optional(),
});
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

// --- REGISTRATION ---
export const RegisterUserSchema = z.object({
    fullName: z.string().min(2).max(100),
    userName: z.string().min(3).max(30),
    email: z.string().email(),
    password: z.string().min(8).max(100),
});
export type RegisterUserInput = z.infer<typeof RegisterUserSchema>;

export const RegisterUserResponseSchema = z.object({
    id: z.string(),
    email: z.string(),
    userName: z.string(),
    message: z.string(),
});
export type RegisterUserResponse = z.infer<typeof RegisterUserResponseSchema>;

// --- LOGIN ---
export const LoginUserSchema = z.object({
    email: z.string({ message: 'Email is required' }).email(),
    password: z.string({ message: 'Password is required' }).min(8).max(100),
});
export type LoginUserInput = z.infer<typeof LoginUserSchema>;

export const LoginUserResponseSchema = z.object({
    user: z.object({
        id: z.string(),
        email: z.string(),
        userName: z.string(),
        twoFARequired : z.boolean(),
    }),
    message: z.string(),
});
export type LoginUserResponse = z.infer<typeof LoginUserResponseSchema>;
    
// --- EMAIL VERIFICATION ---
export const VerifyEmailSchema = z.object({
    email: z.string().email(),
    code: z.string().length(6),
});
export type VerifyEmailInput = z.infer<typeof VerifyEmailSchema>;

export const VerifyEmailResponseSchema = z.object({
    message: z.string(),
    user: z.object({
        id: z.string(),
        email: z.string(),
        userName: z.string(),
        twoFARequired : z.boolean(),
    }),
});
export type VerifyEmailResponse = z.infer<typeof VerifyEmailResponseSchema>;

// --- RESEND CODE ---
export const ResendVerificationCodeSchema = z.object({
    email: z.string().email(),
});
export type ResendVerificationCodeInput = z.infer<typeof ResendVerificationCodeSchema>;

export const ResendVerificationCodeResponseSchema = z.object({
    message: z.string(),
});
export type ResendVerificationCodeResponse = z.infer<typeof ResendVerificationCodeResponseSchema>;

// --- 2FA SETUP ---
export const TwoFASetupSchema = z.object({
    userId: z.number(),
});
export type TwoFASetupInput = z.infer<typeof TwoFASetupSchema>;

export const TwoFASetupResponseSchema = z.object({
    qr: z.string(),
});
export type TwoFASetupResponse = z.infer<typeof TwoFASetupResponseSchema>;

// --- 2FA ENABLE ---
export const TwoFAEnableSchema = z.object({
    userId: z.number(),
    // Allow string or number for OTP to prevent validation errors
    otp: z.union([z.string(), z.number()]), 
});
export type TwoFAEnableInput = z.infer<typeof TwoFAEnableSchema>;

export const TwoFAEnableResponseSchema = z.object({
    message: z.string(),
});
export type TwoFAEnableResponse = z.infer<typeof TwoFAEnableResponseSchema>;

// --- 2FA VERIFY ---
export const TwoFAVerifySchema = z.object({
    // Allow string or number
    otp: z.union([z.string(), z.number()]),
});
export type TwoFAVerifyInput = z.infer<typeof TwoFAVerifySchema>;

export const TwoFAVerifyResponseSchema = z.object({
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

// --- 2FA DISABLE ---
export const TwoFADisableSchema = z.object({
    userId: z.number(),
    // Allow string or number
    otp: z.union([z.string(), z.number()]),
});
export type TwoFADisableInput = z.infer<typeof TwoFADisableSchema>;

export const TwoFADisableResponseSchema = z.object({
    message: z.string(),
});
export type TwoFADisableResponse = z.infer<typeof TwoFADisableResponseSchema>;

// --- 2FA DISABLE VERIFY (Optional?) ---
export const TwoFAVerifyDisableSchema = z.object({
    // Allow string or number
    otp: z.union([z.string(), z.number()]),
});
export type TwoFAVerifyDisableInput = z.infer<typeof TwoFAVerifyDisableSchema>;

export const TwoFAVerifyDisableResponseSchema = z.object({
    message: z.string(),
    success: z.boolean(),
});
export type TwoFAVerifyDisableResponse = z.infer<typeof TwoFAVerifyDisableResponseSchema>;