import { FastifyRequest, FastifyReply } from "fastify";

import { verifyToken } from "./utils/twofa"; // adjust import path
import { API_ROUTES } from "./utils/APIrouts";

import {setRefreshTokenCookie, setAccessTokenCookie, clearTmp2FACookie} from "./utils/auth.utils";

export default async function TwoFAVerify(req: FastifyRequest, reply: FastifyReply) {
  const { otp } = req.body as { otp: string };
  const tmp_2fa = req.cookies.tmp_2fa;

  if (!tmp_2fa) {
    return reply.code(400).send({ error: "Missing temporary 2FA token" });
  }

  try {
    // Verify temporary 2FA token
    // const payload = await req.jwtVerify<{ id: number; need2fa: boolean }>(tmp_2fa);
    const payload = await req.jwtVerify<{ id: number; need2fa: boolean }>(tmp_2fa);

    if (!payload || !payload.need2fa) {
      return reply.code(400).send({ error: "Invalid or expired temporary token" });
    }

    const userId = payload.id;

    // Retrieve user's 2FA secret
    const row = await fetch(API_ROUTES.FIND_USER_BY_ID, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: userId }),
    }).then(res => res.json());

    if (!row?.twofa_secret) {
      return reply.code(400).send({ error: "2FA not set up for this account" });
    }

    // Verify the one-time password (OTP)
    const isValid = verifyToken(row.twofa_secret, otp);
    if (!isValid) {
      return reply.code(400).send({ error: "Invalid or expired OTP code" });
    }

    // Generate access token and refresh token
    const accessToken = await reply.jwtSign(
      { id: row.id, email: row.email },
      { expiresIn: "15m" }
    );
    const refreshToken = await reply.jwtSign(
      { id: row.id, email: row.email },
      { expiresIn: "7d" }
    );
    
    setAccessTokenCookie(reply, accessToken);
    setRefreshTokenCookie(reply, refreshToken);
    clearTmp2FACookie(reply);

    return reply.code(200).send({ success: true, message: "2FA verified successfully" });
  } catch (err) {
    console.error("2FA verification failed:", err);
    return reply.code(401).send({ error: "Invalid or expired temporary token" });
  }
}
