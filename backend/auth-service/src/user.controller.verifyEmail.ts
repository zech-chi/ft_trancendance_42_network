import { FastifyReply, FastifyRequest } from "fastify";
import { API_ROUTES } from "./utils/APIrouts";
import { setAccessTokenCookie, setRefreshTokenCookie } from "./utils/auth.utils";

export async function verifyEmail(
  req: FastifyRequest<{ Body: { email: string; code: string } }>,
  reply: FastifyReply
) {
  const { email, code } = req.body;

  try {
    // Get user by email
    const userRes = await fetch(API_ROUTES.FIND_USER_BY_EMAIL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!userRes.ok) return reply.code(400).send({ message: "Invalid email" });
    const user = await userRes.json();

    // Get code record
    const codeRes = await fetch(API_ROUTES.GET_VERIFICATION_CODE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id }),
    });

    if (!codeRes.ok)
      return reply.code(400).send({ message: "No verification code found" });

    const codeData = await codeRes.json();

    if (codeData.verificationCode !== code)
      return reply.code(400).send({ message: "Invalid code" });
    if (Date.now() > codeData.expiresAt)
      return reply.code(400).send({ message: "Code expired" });

    // Update user
    const updateRes = await fetch(API_ROUTES.VERIFY_USER_EMAIL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id }),
    });

    if (!updateRes.ok)
      return reply.code(400).send({ message: updateRes.statusText });
    // Success set access and refresh tokens

    const accessToken = await reply.jwtSign(
      {
        id: user.id,
        email: user.email,
        tokenType: "access",
        jti: crypto.randomUUID(),
      },
      {
        expiresIn: "15m",
      }
    );
    
    const refreshToken = await reply.jwtSign(
      {
        id: user.id,
        email: user.email,
        tokenType: "refresh",
        jti: crypto.randomUUID(),
      },
      {
        expiresIn: "7d",
      }
    );

    // 6️⃣ Set cookies
    setAccessTokenCookie(reply, accessToken);
    setRefreshTokenCookie(reply, refreshToken);

    return reply.code(200).send({ message: "Email verified successfully", user: { id: user.id, email: user.email, userName: user.userName, twoFARequired: false}});
  } catch (err) {
    console.error("Email verification error:", err);
    return reply.code(400).send({ message: "Something went wrong" });
  }
}
