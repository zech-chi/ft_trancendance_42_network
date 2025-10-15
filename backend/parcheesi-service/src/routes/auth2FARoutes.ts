import { FastifyPluginAsync } from "fastify";
import db from "../db/db";
import { generateSecret, verifyToken } from "../utils/twofa";
import { generateQRCode } from "../utils/qrcode";
import { sendEmail } from "../utils/mailer";

const auth2fa: FastifyPluginAsync = async (fastify) => {
  // Setup TOTP (return secret + qr)
  fastify.post("/2fa/setup-totp", async (request: any, reply: any) => {
    const { userId } = request.body;
    if (!userId) return reply.code(400).send({ error: "missing" });

    const secret = generateSecret();
    // Save secret temporarily (optionally store in a 'pending_twofa' column until user verifies)
    db.prepare("UPDATE users SET twofa_secret = ? WHERE id = ?").run(secret.base32, userId);

    const otpAuthUrl = secret.otpauth_url!;
    const qr = await generateQRCode(otpAuthUrl);

    // return qr and secret to frontend so user can scan right away (securely)
    reply.send({ qr, secret: secret.base32, otpAuthUrl });
  });

  // Enable TOTP after verifying a code
  fastify.post("/2fa/enable-totp", async (request: any, reply: any) => {
    const { userId, token } = request.body;
    const row = db.prepare("SELECT twofa_secret FROM users WHERE id = ?").get(userId);
    if (!row || !row.twofa_secret) return reply.code(400).send({ error: "no secret" });

    const ok = verifyToken(row.twofa_secret, token);
    if (!ok) return reply.code(400).send({ error: "invalid token" });

    db.prepare("UPDATE users SET twofa_enabled = 1 WHERE id = ?").run(userId);
    reply.send({ message: "2FA enabled" });
  });

  // Verify login email OTP (when login returned need2fa)
  fastify.post("/2fa/verify-email-code", async (request: any, reply: any) => {
    const { temp_token, code } = request.body;
    try {
      const payload = fastify.jwt.verify(temp_token) as any;
      if (!payload || !payload.need2fa) return reply.code(400).send({ error: "invalid temp token" });

      const userId = payload.sub;
      const row = db.prepare("SELECT * FROM email_codes WHERE user_id = ? AND purpose='login_otp' AND used=0 ORDER BY created_at DESC").get(userId);
      if (!row) return reply.code(400).send({ error: "no code" });
      if (row.code !== code) return reply.code(400).send({ error: "invalid code" });
      if (row.expires_at < new Date().toISOString()) return reply.code(400).send({ error: "expired" });

      // mark used
      db.prepare("UPDATE email_codes SET used = 1 WHERE id = ?").run(row.id);

      // issue final access & refresh tokens
      const userRow = db.prepare("SELECT id, username FROM users WHERE id = ?").get(userId);
      const accessToken = fastify.jwt.sign({ sub: userRow.id, username: userRow.username });
      const refreshTokenRaw = require("crypto").randomBytes(64).toString("hex");
      const refreshHash = require("crypto").createHash("sha256").update(refreshTokenRaw).digest("hex");
      const expiresAt = new Date(Date.now() + Number(process.env.REFRESH_EXPIRES_DAYS || 7) * 24*3600*1000).toISOString();
      db.prepare("INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)")
        .run(userRow.id, refreshHash, expiresAt);

      return reply.send({ accessToken, refreshToken: refreshTokenRaw });
    } catch (err) {
      return reply.code(400).send({ error: "invalid token" });
    }
  });

  // Verify login TOTP (client sends temp_token + totp)
  fastify.post("/2fa/verify-totp", async (request: any, reply: any) => {
    const { temp_token, token } = request.body;
    try {
      const payload = fastify.jwt.verify(temp_token) as any;
      if (!payload || !payload.need2fa) return reply.code(400).send({ error: "invalid temp token" });

      const userId = payload.sub;
      const row = db.prepare("SELECT twofa_secret FROM users WHERE id = ?").get(userId);
      if (!row || !row.twofa_secret) return reply.code(400).send({ error: "no twofa" });

      const ok = verifyToken(row.twofa_secret, token);
      if (!ok) return reply.code(400).send({ error: "invalid token" });

      // success → issue access + refresh tokens (same code as above)
      const userRow = db.prepare("SELECT id, username FROM users WHERE id = ?").get(userId);
      const accessToken = fastify.jwt.sign({ sub: userRow.id, username: userRow.username });
      const refreshTokenRaw = require("crypto").randomBytes(64).toString("hex");
      const refreshHash = require("crypto").createHash("sha256").update(refreshTokenRaw).digest("hex");
      const expiresAt = new Date(Date.now() + Number(process.env.REFRESH_EXPIRES_DAYS || 7) * 24*3600*1000).toISOString();
      db.prepare("INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)")
        .run(userRow.id, refreshHash, expiresAt);

      return reply.send({ accessToken, refreshToken: refreshTokenRaw });
    } catch (err) {
      return reply.code(400).send({ error: "invalid temp token" });
    }
  });

  // send a login email OTP on demand
  fastify.post("/2fa/send-email-otp", async (request: any, reply: any) => {
    const { username } = request.body;
    const userRow = db.prepare("SELECT id, email FROM users WHERE username = ?").get(username);
    if (!userRow) return reply.code(404).send({ error: "not found" });

    const code = (Math.floor(100000 + Math.random() * 900000)).toString();
    const expiresAt = new Date(Date.now() + 5*60*1000).toISOString();

    db.prepare("INSERT INTO email_codes (user_id, email, code, purpose, expires_at) VALUES (?, ?, ?, ?, ?)")
      .run(userRow.id, userRow.email, code, "login_otp", expiresAt);

    await sendEmail(userRow.email, "Your login code", `<p>Your login code: <b>${code}</b></p>`);

    reply.send({ message: "sent" });
  });

};

export default auth2fa;
