import fastify, { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { $ref, RegisterUserInput, LoginUserInput } from "./user.schema"
import { RegisterUser, addNewChartsDataRows, addNewRadarDataRow, createUser, findUserIfExists } from './user.controller.register';
import { LoginUser } from './user.controller.signin';
import { findUserByEmail } from './user.controller.signin';
import bcrypt from "bcryptjs";
import { API_ROUTES } from "./utils/APIrouts";
import { verifyEmail } from './user.controller.verifyEmail';
import { resendVerificationCode } from './user.controller.resendCode';
import { clearAccessTokenCookie, clearTmp2FACookie, clearRefreshTokenCookie,  setAccessTokenCookie, setRefreshTokenCookie, setTmp2FACookie } from './utils/auth.utils';
// import TwoFASetup from './user.controller.TwoFASetup';
// import TwoFAEnable from './user.controller.TwoFAEnable';
// import TwoFAVerify from './user.controller.TwoFAVerify';
import { generateQRCode } from "./utils/qrcode";
import { generateSecret, verifyToken } from "./utils/twofa";

interface JwtPayload {
  email: string;
  id: number;
}

async function findUserById(id: number): Promise<any> {
  const response = await fetch(API_ROUTES.FIND_USER_BY_ID, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: id }),
  });
  return response.json();
}
export async function authRoutes(app: FastifyInstance) {
    // for testing
    app.get('/', (req: FastifyRequest, res: FastifyReply) => {
        res.code(200).send("auth work");
    });

     // verify email
     app.post(
      "/verify-email",
      {
          schema: {
          body: $ref("VerifyEmailSchema"),
          response: {
              200: $ref("VerifyEmailResponseSchema"),
          },
          },
      },
      verifyEmail
  );

  app.put(
      "/resend-code",
      {
          schema: {
              body: $ref("ResendVerificationCodeSchema"),
              response: {
                  200: $ref("ResendVerificationCodeResponseSchema"),
              },
          },
      },
      resendVerificationCode
  );

    // register
    app.post(
        "/register",
        {
            schema: {
            body: $ref("RegisterUserSchema"),
            response: {
                201: $ref("RegisterUserResponseSchema"),
            },
            },
        },
        RegisterUser
    )

    // login
    app.post(
        "/login",
        {
            schema: {
                body: $ref("LoginUserSchema"),
                response: {
                201: $ref("LoginUserResponseSchema"),
                },
            },
        },
        LoginUser
    );

    // logout
    app.delete('/logout', (req: FastifyRequest, reply: FastifyReply) => {
      // reply.clearCookie('access_token', {
      //   path: '/',          // must match cookie creation path
      //   httpOnly: true,
      //   sameSite: 'lax',
      //   secure: process.env.NODE_ENV === "production" || false       // true if HTTPS
      // });
    
      // reply.clearCookie('refresh_token', {
      //   path: '/api/auth/refresh',
      //   httpOnly: true,
      //   sameSite: 'lax',
      //   secure: process.env.NODE_ENV === "production" || false
      // });
      clearAccessTokenCookie(reply);
      clearRefreshTokenCookie(reply);


      reply.code(200).send({ message: 'Logged out successfully' });
    });

    // refresh token
    app.post('/refresh', async (req: FastifyRequest, reply: FastifyReply) => {
      const refreshToken = req.cookies.refresh_token;
      console.log("Refresh token cookie: ", refreshToken);
      if (!refreshToken) return reply.code(401).send({ message: 'No refresh token' });
    
      try {
        const decoded =  app.jwt.verify<JwtPayload>(refreshToken);
        console.log("Decoded refresh token: ", decoded);
        const user = await findUserById(decoded.id);
        if (!user) return reply.code(401).send({ message: 'Invalid refresh token' });
    
        const newAccessToken = await reply.jwtSign({
          id: user.id,
          email: user.email,
          tokenType: "access",
          jti: crypto.randomUUID(),
        },
        {
          expiresIn: "2d",
        }
      );
        setAccessTokenCookie(reply, newAccessToken);
    
        return reply.send({ message: 'Access token refreshed' });
      } catch {
        return reply.code(401).send({ message: 'Invalid refresh token' });
      }
    });

    // get session
    app.get('/session', async (req: FastifyRequest, reply: FastifyReply) => {
      const accessToken = req.cookies.access_token;
      const tmp_2fa = req.cookies.tmp_2fa;
    
      if (!accessToken && !tmp_2fa) {
        return reply.code(401).send({ message: 'No tokens' });
      }
    
      try {
        // try verifying access token
        if (accessToken) {
          const decoded =  app.jwt.verify<JwtPayload>(accessToken);
          const user = await findUserByEmail(decoded.email);
          if (!user || !user.email_verified || (user &&  user.email !== decoded.email)) {
              return reply.code(401).send({ message: 'Invalid token' });
        }
          // distract only username , id  and return it 
          const userData = { id : user.id, userName: user.userName};
          return reply.send(userData);
        }
        else if (tmp_2fa) {
          // try verifying tmp_2fa token
          const decoded =  app.jwt.verify<{ id: number; need2fa: boolean }>(tmp_2fa);
          if (!decoded.need2fa) {
            return reply.code(401).send({ message: 'token dont need twofa' });
          }
          const user = await fetch(API_ROUTES.FIND_USER_BY_ID, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: decoded.id }),
          }).then(res => res.json());
          if (!user) return reply.code(401).send({ message: 'Invalid token' });
          return reply.send({ message: "2FA required" , twoFARequired: true});
        } 
      } catch (err) {

        return reply.code(401).send({ message: 'Invalid token' });
      }
    });
    // 2fa routes 

    // setup 2fa
    app.post (
      '/2fa-setup',
      {
        schema: {
          response: {
            200: $ref('TwoFASetupResponseSchema'),
          },
        },
      },
      async (req: FastifyRequest, reply: FastifyReply) => {
        const accessToken =  req.cookies.access_token;

        //check token
        if (!accessToken){
          return reply.code(401).send({ error: "unauthorized" });
        } 
        let userId: number;
        try {
          // Verify JWT token (from cookie)
          const payload = app.jwt.verify(accessToken) as { id: number; email: string };
          userId = payload.id;
      
        } catch (err) {
          return reply.code(401).send({ error: "Invalid or expired token" });
        }
    
        if (!userId) return reply.code(400).send({ error: "missing" });
        // check if 2fa already enabled
        const row = await fetch(API_ROUTES.FIND_USER_BY_ID, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: userId }),
        }).then(res => res.json());
        if (row.twofa_enabled) return reply.code(400).send({ error: "2FA already enabled" });
    if (row.twofa_enabled) return reply.code(400).send({ error: "2FA already enabled" });
        const secret = generateSecret();
        // Save secret temporarily (optionally store in a 'pending_twofa' column until user verifies)
        
        const rst  = await fetch(`${API_ROUTES.SAVE_INIT_OTP}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, twofa_secret: secret.base32 }),
        }
        );
        if (!rst.ok) {
          return reply.code(400).send({ error: "failed to save secret" });
        }
        const otpAuthUrl = secret.otpauth_url!;
        const qr = await generateQRCode(otpAuthUrl);
    
        // return qr and secret to frontend so user can scan right away (securely)
        reply.send({ qr});
      });
      // enable 2fa
    app.post (
      '/2fa-enable',
      {
        schema: {
          body: $ref('TwoFAEnableSchema'),
          response: {
            200: $ref('TwoFAEnableResponseSchema'),
          },
        },
      },
      async(req: FastifyRequest, reply: FastifyReply) =>
 {
    const {otp} = req.body as {otp: string };
    const accessToken =  req.cookies.access_token;
    let userId: number;
    //check token
    if (!accessToken) return reply.code(401).send({ error: "unauthorized" });
  try {
      // Verify JWT token (from cookie)
      const payload = app.jwt.verify(accessToken) as { id: number; email: string };
      userId = payload.id;
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
  });
    // disable 2fa
  app.post (
    "/2fa-disable",   
    {
      schema: {
        body: $ref("TwoFADisableSchema"),
        response: {
          200: $ref("TwoFADisableResponseSchema"),
        },
      },
    },
    async (req: FastifyRequest, reply: FastifyReply) => {
      const { otp } = req.body as { otp: string };
      const accessToken = req.cookies.access_token;
      let userId: number;
      // Check token
      if (!accessToken) return reply.code(401).send({ error: "unauthorized" });
      try {
        // Verify JWT token (from cookie)
        const payload = app.jwt.verify(accessToken) as { id: number; email: string };
  
        // Optional: check if payload.id matches userId in body
        userId = payload.id;
      } catch (err) {
        return reply.code(401).send({ error: "Invalid or expired token" });
      }
  
      // Retrieve user's 2FA secret
      const row = await fetch(API_ROUTES.FIND_USER_BY_ID, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userId }),
      }).then(res => res.json());
  
      if (!row || !row.twofa_enabled ) return reply.code(400).send({ error: "no 2fa set" });
  
      // Verify the one-time password (OTP)
      const isValid = verifyToken(row.twofa_secret, otp);
      if (!isValid) return reply.code(400).send({ error: "invalid token" });
  
      // Disable 2FA
      const res = await fetch(API_ROUTES.TWOFA_DISABLE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userId }),
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        return reply.code(400).send({ error: "failed to disable 2FA", details: errorData });
      }
  
      reply.send({ message: "2FA disabled" });
    }
  );
    // verify 2fa
    app.post(
      '/2fa-verify',
      {
        schema: {
          body: $ref('TwoFAVerifySchema'),
          response: {
            200: $ref('TwoFAVerifyResponseSchema'),
          },
        },
      },
      async (req: FastifyRequest, reply: FastifyReply) =>{
        const { otp } = req.body as { otp: string };
        const tmp_2fa = req.cookies.tmp_2fa;
      
        if (!tmp_2fa) {
          return reply.code(400).send({ error: "Missing temporary 2FA token" });
        }
      
        try {
          // Verify temporary 2FA token
          // const payload = await req.jwtVerify<{ id: number; need2fa: boolean }>(tmp_2fa);
          const payload = app.jwt.verify(tmp_2fa) as { id: number; need2fa: boolean };
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
          {
            id: row.id,
            email: row.email,
            tokenType: "access",
            jti: crypto.randomUUID(),   // unique ID for this token
          },
          {
            expiresIn: "2d",
          }
        );
        
        const refreshToken = await reply.jwtSign(
          {
            id: row.id,
            email: row.email,
            tokenType: "refresh",
            jti: crypto.randomUUID(),   // unique ID for refresh token
          },
          {
            expiresIn: "7d",
          }
        );
          
          setAccessTokenCookie(reply, accessToken);
          setRefreshTokenCookie(reply, refreshToken);
          clearTmp2FACookie(reply);

      
          return reply.send({ user: { id: row.id, email: row.email, userName: row.userName, twoFARequired: false}, success: true, message: "2FA verified successfully"});
        } catch (err) {
          console.error("2FA verification failed:", err);
          return reply.code(401).send({ error: "Invalid or expired temporary token" });
        }
      }
      )


    // Google OAuth routes
    app.get('/login/google', async (req, reply) => {
      // if already logged in, redirect to profile
      // const user = (req.session as any).user;
      // if (user) return reply.redirect('/profile'); // already logged in
    
      const fastifyAny = app as any;
    
      // manually generate Google OAuth URL
      fastifyAny.googleOAuth2.generateAuthorizationUri(req, reply, (err: any, uri: string) => {
        if (err) {
          fastifyAny.log.error('Error generating authorization URI:', err);
          return reply.status(400).send('Could not generate authorization URI');
        }
        return reply.redirect(uri);
      });
    });
    
    // callback route
    app.get('/login/google/callback', async (req, reply) => {
    
      try {
    
    
      const fastifyAny = app as any;
      const token = await fastifyAny.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(req);
      const googleAccessToken = token.token.access_token;
    
      console.log('Access Token =======>> ', googleAccessToken);
    
      // fetch user info
      const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${googleAccessToken}` }
      }).then(res => res.json());
    
      console.log('User info =======>> ', userInfo);
      // if gmail already in databae
      const fullName = userInfo.name;
      let imageUrl = userInfo.picture;
      const email = userInfo.email;
      const userName = email.split('@')[0];
    
      if (!imageUrl || imageUrl === "") {
        imageUrl = `https://api.dicebear.com/9.x/identicon/svg?seed=${userName}`;
      }
    
      const existingUser = await findUserIfExists(userName, email);
      let user;
    
      if (!existingUser) {
        // random password 
        const randomPassword = await bcrypt.hash(Math.random().toString(36).slice(-8), 10);
        // add user
        user = await createUser(fullName, userName, email, randomPassword, imageUrl);
        // update imageUrl
        // add data
        const radarDataId = await addNewRadarDataRow(user.id);
        const chartsDataId = await addNewChartsDataRows(user.id);
        const updateRes = await fetch(API_ROUTES.VERIFY_USER_EMAIL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id }),
        });
    
        if (!radarDataId || !chartsDataId || !updateRes.ok) {
          // should I delete the user if this fails?
          const res = await fetch(API_ROUTES.DELETE_USER_BY_ID, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: user.id })
          });
            if (!res.ok)
                console.error('Failed to delete user:', await res.text());
            return reply.code(400).send({ message: 'Could not initialize user data. Please try again.' });
        }
        
        
      } else {
        //before generating tokens, check if 2fa is enabledl);
        user = existingUser;
        if (user.twofa_enabled) {
          const tmp_2fa = await reply.jwtSign(
            {
              id: user.id,
              need2fa: true,
              jti: crypto.randomUUID(),
            },
            {
              expiresIn: "5m",
            }
          );
          setTmp2FACookie(reply, tmp_2fa);
          // await reply.send({ message: "2FA required" });
          return reply.redirect('http://localhost');
        }  
      }

        // Generate access + refresh tokens
        const accessToken = await reply.jwtSign(
          {
            id: user.id,
            email: user.email,
            tokenType: "access",
            jti: crypto.randomUUID(),   // unique ID for this token
          },
          {
            expiresIn: "2d",
          }
        );
        
        const refreshToken = await reply.jwtSign(
          {
            id: user.id,
            email: user.email,
            tokenType: "refresh",
            jti: crypto.randomUUID(),   // unique ID for refresh token
          },
          {
            expiresIn: "7d",
          }
        );
    // Set cookies
    setAccessTokenCookie(reply, accessToken);
    setRefreshTokenCookie(reply, refreshToken);
    console.log("✅ Google login successful. Tokens set.");
    // Redirect to frontend
    return reply.redirect('http://localhost');
  
} catch(error) {
        console.log(error);
        return reply.status(400).send({message: "something went wron!"})
      }
    });
    // display that user routes are registered
    app.log.info('user routes registered')
}