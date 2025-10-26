import { FastifyReply, FastifyRequest } from "fastify";
import { API_ROUTES } from "./utils/APIrouts";

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

    // Check code and expiration
    if (codeData.code !== code)
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
      return reply.code(500).send({ message: "Failed to verify email" });

    return reply.code(200).send({ message: "Email verified successfully" });
  } catch (err) {
    console.error("Email verification error:", err);
    return reply.code(500).send({ message: "Something went wrong" });
  }
}
