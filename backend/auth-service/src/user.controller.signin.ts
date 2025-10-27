import { FastifyReply, FastifyRequest } from "fastify";
import { LoginUserInput } from "./user.schema";
import bcrypt from "bcryptjs";
import { API_ROUTES } from "./utils/APIrouts";
import {
  setAccessTokenCookie,
  setRefreshTokenCookie,
  setTmp2FACookie,
} from "./utils/auth.utils";

// helper function
export async function findUserByEmail(email: string): Promise<any> {
  const response = await fetch(API_ROUTES.FIND_USER_BY_EMAIL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return response.json();
}

export async function LoginUser(
  req: FastifyRequest<{ Body: LoginUserInput }>,
  reply: FastifyReply
) {
  const { email, password } = req.body;

  try {
    // 1️⃣ Find user
    const user = await findUserByEmail(email);
    if (!user) {
      return reply.code(400).send({ message: "Invalid email or password" });
    }

    // 2️⃣ Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return reply.code(400).send({ message: "Invalid email or password" });
    }

    // 3️⃣ Check email verification
    if (!user.email_verified) {
      return reply.code(403).send({
        message: "Email not verified",
        verifyEmail: true,
      });
    }

    // 4️⃣ Two-factor check
    console.log("User 2FA status:", user);
    if (user.twofa_enabled) {
      const tmpToken = await reply.jwtSign(
        { id: user.id, need2fa: true },
        { expiresIn: "5m" }
      );
      setTmp2FACookie(reply, tmpToken);
      return reply.code(200).send({ message: "2FA required" });
    }

    // 5️⃣ Normal login
    const accessToken = await reply.jwtSign(
      { id: user.id, email: user.email },
      { expiresIn: "15m" }
    );
    const refreshToken = await reply.jwtSign(
      { id: user.id},
      { expiresIn: "7d" }
    );

    // 6️⃣ Set cookies
    setAccessTokenCookie(reply, accessToken);
    setRefreshTokenCookie(reply, refreshToken);

    return reply.code(200).send({
      message: "Login successful",
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    console.error("Login error:", error);
    return reply.code(500).send({ message: "Something went wrong" });
  }
}
