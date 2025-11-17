import { verifyToken } from "./utils/twofa";
import { API_ROUTES } from "./utils/APIrouts";
import fastify, { FastifyRequest, FastifyReply } from 'fastify'


export default async function TwoFAEnable  (req: FastifyRequest, reply: FastifyReply)
 {
    const { userId, otp } = req.body;
    const accessToken =  req.cookies.accessToken;

    //check token
    if (!accessToken) return reply.code(401).send({ error: "unauthorized" });
  try {
      // Verify JWT token (from cookie)
      const payload = await req.jwtVerify<{ id: number; email: string }>(accessToken);
      
      // Optional: check if payload.id matches userId in body
      if (payload.id !== userId) return reply.code(403).send({ error: "Forbidden" });
  
    } catch (err) {
      return reply.code(401).send({ error: "Invalid or expired token" });
    }
    // const row = db.prepare("SELECT twofa_secret FROM users WHERE id = ?").get(userId) as User;
    const row = await fetch(API_ROUTES.FIND_USER_BY_ID, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: userId }),
    }).then(res => res.json());
    if (!row || !row.twofa_secret) return reply.code(400).send({ error: "no secret" });

    if (row.twofa_enabled) return reply.code(400).send({ error: "2FA already enabled" });

    const ok = verifyToken(row.twofa_secret, otp);
    if (!ok) return reply.code(400).send({ error: "invalid token" });

    const res = await fetch(API_ROUTES.TWOFA_ENABLE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: userId }),
    });
    if (!res.ok) {
      const errorData = await res.json();
      return reply.code(400).send({ error: "failed to enable 2FA", details: errorData });
    }
    reply.send({ message: "2FA enabled" });
  };