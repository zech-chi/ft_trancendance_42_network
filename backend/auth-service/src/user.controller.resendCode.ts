import { sendEmail } from "./utils/mailer";
import { API_ROUTES } from "./utils/APIrouts";
import { FastifyReply, FastifyRequest } from "fastify";

export async function resendVerificationCode(
  req: FastifyRequest<{ Body: { email: string } }>,
  reply: FastifyReply
) {
  const { email } = req.body;

  try {
    // Get user by email
    const userRes = await fetch(API_ROUTES.FIND_USER_BY_EMAIL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!userRes.ok) return reply.code(400).send({ message: "Invalid email" });
    const user = await userRes.json();

    // Generate new code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes

    // Store code
    const storeRes = await fetch(API_ROUTES.UPDATE_VERIFICATION_CODE, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, code, expiresAt}),
    });

    if (!storeRes.ok)
      return reply.code(400).send({ message: "Failed to store verification code" });
    // Send email
    await sendEmail(email, "Verify your email", `<p>Your verification code: <b>${code}</b></p>`);
    
    return reply.code(200).send({ message: "Verification code resent" });
  } catch (err) {
    //console.error("Resend verification code error:", err);
    return reply.code(400).send({ message: "Something went wrong" });
  }
}  
