import { FastifyPluginAsync } from "fastify";
import { generateSecret, verifyToken } from "../utils/twofa";
import { generateQRCode } from "../utils/qrcode";
import { sendEmail } from "../utils/mailer";
import db from "../db/db";

type UserRow = {
  twofa_secret: string | null;
  username:string
  password:string
  id:Number
};


const auth2FARoutes: FastifyPluginAsync = async (fastify) => {
    // Setup 2FA (generate secret & send QR code)
    fastify.post("/setup", async (request: any, reply: any) => {
        const { username } = request.body;
        const secret = generateSecret();
        console.log("all")
        // Save secret in DB
        db.prepare("UPDATE users SET twofa_secret = ? WHERE username = ?")
          .run(secret.base32, username);
          
        const otpAuthUrl = secret.otpauth_url!;
        const qrCodeDataUrl = await generateQRCode(otpAuthUrl);

        // Send QR code via email
        const email = username + '@gmail.com';
        await sendEmail(email, "Your 2FA QR Code", `<img src="${qrCodeDataUrl}" />`);

        reply.send({ message: "2FA setup email sent" });
    });

    // Verify 2FA code
    fastify.post("/verify", async (request: any, reply: any) => {
        const { username, token } = request.body;
        const row = db.prepare("SELECT twofa_secret FROM users WHERE username = ?").get(username) as UserRow | undefined;

        if (!row?.twofa_secret) {
            return reply.code(400).send({ error: "2FA not setup for user" });
        }

        const isValid = verifyToken(row.twofa_secret, token);

        if (isValid) {
            reply.send({ message: "2FA verified" });
        } else {
            reply.code(400).send({ error: "Invalid token" });
        }
    });
};

export default auth2FARoutes;
