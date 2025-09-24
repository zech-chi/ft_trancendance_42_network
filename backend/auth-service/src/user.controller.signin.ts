import { FastifyReply, FastifyRequest } from "fastify";
import { LoginUserInput } from "./user.schema"
import bcrypt from "bcryptjs";
import { API_ROUTES } from "./utils/APIrouts";

// function to find user by email
export async function findUserByEmail(email: string): Promise<any> {
    const user = await fetch(API_ROUTES.FIND_USER_BY_EMAIL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
    }).then(res => res.json());
    return user;
}

export async function LoginUser(
    req: FastifyRequest<{
        Body: LoginUserInput
    }>,
    reply: FastifyReply,
) {
    const { email, password } = req.body;
    try {
        // find user by email
        const user = await findUserByEmail(email);
        if (!user) {
            return reply.code(400).send({ message: "Invalid email or password" });
        }
        // compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return reply.code(400).send({ message: "Invalid email or password" });
        }

        // generate JWT token
        const token = await reply.jwtSign({ id: user.id, email: user.email });
        // set token in cookie
        reply.setCookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax', // for development, use 'strict' in production
            path: '/',
            maxAge: 54 * 60 * 60 // 1 day
        });
        return reply.code(200).send({ message: "Login successful", token: token });
    } catch (error) {
        console.error(error);
        return reply.code(400).send({ message: "Something went wrong" });
    }
}
