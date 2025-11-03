import { generateQRCode } from "./utils/qrcode";
import { generateSecret } from "./utils/twofa";
import { API_ROUTES } from "./utils/APIrouts";
import fastify, { FastifyRequest, FastifyReply } from 'fastify'



export default async function TwoFASetup  (req: FastifyRequest, reply: FastifyReply){
    const { userId } = req.body;
    const accessToken =  req.cookies.accessToken;

    //check token
    if (!accessToken) return reply.code(401).send({ error: "unauthorized" });
  try {
      // Verify JWT token (from cookie)
      const payload = await req.jwtVerify(accessToken) as { id: string };
      
      // Optional: check if payload.id matches userId in body
      if (payload.id !== userId) return reply.code(403).send({ error: "Forbidden" });
  
    } catch (err) {
      return reply.code(401).send({ error: "Invalid or expired token" });
    }

    if (!userId) return reply.code(400).send({ error: "missing" });

    const secret = generateSecret();
    // Save secret temporarily (optionally store in a 'pending_twofa' column until user verifies)
    
    const rst  = await fetch(`${API_ROUTES.SAVE_INIT_OTP}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, twofa_secret: secret.base32 }),
    }
    );
    if (!rst.ok) {
      return reply.code(500).send({ error: "failed to save secret" });
    }
    const otpAuthUrl = secret.otpauth_url!;
    const qr = await generateQRCode(otpAuthUrl);

    // return qr and secret to frontend so user can scan right away (securely)
    reply.send({ qr});
  };