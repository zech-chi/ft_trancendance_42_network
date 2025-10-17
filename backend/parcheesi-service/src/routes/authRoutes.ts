import { FastifyPluginAsync } from "fastify";
import db, { EmailCode, User, RefreshToken } from "../db/db";
import bcrypt from "bcrypt";
import { sendEmail} from "../utils/mailer";
import { signAccessToken } from "../utils/jwt";
import crypto from "crypto";


const authRoutes: FastifyPluginAsync = async (fastify) => {
  // register
  fastify.post("/register", async (request: any, reply: any) => {
    const { username, email, password } = request.body;
    if (!username || !email || !password) return reply.code(400).send({ error: "missing fields" });

    const hashed = await bcrypt.hash(password, 12);
    try {
      const stmt = db.prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
      const res = stmt.run(username, email, hashed);
      const userId = res.lastInsertRowid;

      // generate email verification code (6 digits)
      const code = (Math.floor(100000 + Math.random() * 900000)).toString();
      const expiresAt = new Date(Date.now() + 1000 * 60 * 15).toISOString(); // 15 min

      db.prepare("INSERT INTO email_codes (user_id, email, code, purpose, expires_at) VALUES (?, ?, ?, ?, ?)")
        .run(userId, email, code, "email_verification", expiresAt);

      await sendEmail(email, "Verify your email", `<p>Your verification code: <b>${code}</b></p>`);

      return reply.code(201).send({ message: "user created, verification email sent" });
    } catch (err: any) {
      if (err.message.includes("UNIQUE constraint failed")) return reply.code(400).send({ error: "user exists" });
      throw err;
    }
  });

  // verify email
  fastify.post("/verify-email", async (request: any, reply: any) => {
    const { email, code } = request.body;
    if (!email || !code) return reply.code(400).send({ error: "missing fields" });

    const row = db.prepare("SELECT * FROM email_codes WHERE email = ? AND purpose='email_verification' AND used = 0 ORDER BY created_at DESC").get(email) as EmailCode;
    if (!row) return reply.code(400).send({ error: "code not found" });

    if (row.expires_at < new Date()) return reply.code(400).send({ error: "code expired" });
    if (row.code !== code) return reply.code(400).send({ error: "invalid code" });

    db.prepare("UPDATE users SET email_verified = 1 WHERE id = ?").run(row.user_id);
    db.prepare("UPDATE email_codes SET used = 1 WHERE id = ?").run(row.id);

    reply.send({ message: "email verified" });
  });

  // login
  fastify.post("/login", async (request: any, reply: any) => {
    const { username, password } = request.body;
    if (!username || !password) return reply.code(400).send({ error: "missing" });

    const row = db.prepare("SELECT id, username, password, twofa_enabled, email FROM users WHERE username = ?").get(username) as User; 
    if (!row) return reply.code(401).send({ error: "invalid" });

    const ok = await bcrypt.compare(password, row.password);
    if (!ok) return reply.code(401).send({ error: "invalid" });

    if (row.email_verified === false) {
      return reply.code(403).send({ error: "email not verified" });
    }

    if (row.twofa_enabled) {
      // generate temporary 2FA session token (short lived) — we use a JWT claim need2fa:true
      const tempToken = fastify.jwt.sign({ sub: row.id, need2fa: true }, { expiresIn: "5m" });
      // optionally, send email OTP as default fallback:
      const code = (Math.floor(100000 + Math.random() * 900000)).toString();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();
      db.prepare("INSERT INTO email_codes (user_id, email, code, purpose, expires_at) VALUES (?, ?, ?, ?, ?)")
        .run(row.id, row.email, code, "login_otp", expiresAt);
      await sendEmail(row.email, "Your login code", `<p>Your login code: <b>${code}</b></p>`);

      return reply.send({
        need2fa: true,
        methods: ["totp", "email"],
        temp_token: tempToken
      });
    } else {
      // issue access + refresh tokens
      const accessToken = fastify.jwt.sign({ sub: row.id, username: row.username });
      const refreshTokenRaw = crypto.randomBytes(64).toString("hex");
      const refreshHash = crypto.createHash("sha256").update(refreshTokenRaw).digest("hex");
      const expiresAt = new Date(Date.now() + Number(process.env.REFRESH_EXPIRES_DAYS || 7) * 24 * 3600 * 1000).toISOString();

      db.prepare("INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)")
        .run(row.id, refreshHash, expiresAt);

      return reply.send({ accessToken, refreshToken: refreshTokenRaw });
    }
  });

  // refresh token
  fastify.post("/refresh", async (request: any, reply: any) => {
    const { refreshToken } = request.body;
    if (!refreshToken) return reply.code(400).send({ error: "missing" });
    const refreshHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
    const tokenRow = db.prepare("SELECT * FROM refresh_tokens WHERE token_hash = ? AND revoked = 0").get(refreshHash) as RefreshToken;
    if (!tokenRow) return reply.code(401).send({ error: "invalid" });
    if (tokenRow.expires_at < new Date()) return reply.code(401).send({ error: "expired"});

    const userRow = db.prepare("SELECT id, username FROM users WHERE id = ?").get(tokenRow.user_id) as User;
    const accessToken = fastify.jwt.sign({ sub: userRow.id, username: userRow.username });
    return reply.send({ accessToken });
  });

};

export default authRoutes;
