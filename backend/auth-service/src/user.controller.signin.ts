import { FastifyReply, FastifyRequest } from "fastify";
import { LoginUserInput } from "./user.schema"
import bcrypt from "bcryptjs";
import { API_ROUTES } from "./utils/APIrouts";
import { setAccessTokenCookie, setRefreshTokenCookie, setTmp2FACookie } from "./utils/auth.utils";
import { verifyEmail } from "./user.controller.verifyEmail";

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
        if (!user.email_verified) {
        return reply.code(403).send({ message: "Email not verified", verifyEmail: true });
        }
        // lj9: check if email is verified
        // twofa_enabled ??? 
         if (user.twofa_enabled) {
      const tmpToken = await reply.jwtSign(
        { id: user.id, email: user.email },
        { expiresIn: "5m" }
      );
      setTmp2FACookie(reply, tmpToken);
      return reply.code(200).send({ message: "2FA required" });
    }
  // === Normal login ===
    const accessToken = await reply.jwtSign({ id: user.id, email: user.email }, { expiresIn: "15min" });
    const refreshToken = await reply.jwtSign({ id: user.id }, { expiresIn: "7d" });

    setRefreshTokenCookie(reply, refreshToken);
    setAccessTokenCookie(reply, accessToken);

    return reply.code(200).send({
      message: "Login successful",
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    console.error(error);
    return reply.code(500).send({ message: "Something went wrong" });
  }
}