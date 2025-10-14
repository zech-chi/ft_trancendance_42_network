import fastify, { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { $ref, RegisterUserInput, LoginUserInput } from "./user.schema"
import { RegisterUser, addNewChartsDataRows, addNewRadarDataRow, createUser, findUserIfExists } from './user.controller.register';
import { LoginUser } from './user.controller.signin';
import { findUserByEmail } from './user.controller.signin';
import bcrypt from "bcryptjs";
import { API_ROUTES } from "./utils/APIrouts";

interface JwtPayload {
  email: string;
  id: number;
}


export async function authRoutes(app: FastifyInstance) {
    // for testing
    app.get('/', (req: FastifyRequest, res: FastifyReply) => {
        res.code(200).send("auth work");
    });

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
    app.delete('/logout', (req: FastifyRequest, res: FastifyReply) => {
        
    });


    // add get user from session route
    app.get('/session', async (request: FastifyRequest, reply: FastifyReply) => {
      if (!request.cookies.token) {
        return reply.code(401).send({ message: 'No token' });
      }

      try {
        const decoded = await request.jwtVerify<JwtPayload>(); // 👈 typed
        const user = await findUserByEmail(decoded.email);
        if (!user) {
          return reply.code(401).send({ message: 'Invalid token' });
        }
        return reply.send(user);
      } catch (err) {
        return reply.code(401).send({ message: 'Invalid token' });
      }
    });
    
  //   // Google OAuth login - will redirect to Google
  //     app.get('/login/google', async (req, reply) => {
  //   // if already logged in, redirect to profile
  //   // const user = (req.session as any).user;
  //   // if (user) return reply.redirect('/profile'); // already logged in
  //   const fastifyAny = app as any;

  //   // manually generate Google OAuth URL
  //   fastifyAny.googleOAuth2.generateAuthorizationUri(req, reply, (err: any, uri: string) => {
      
  //     if (err) {
  //       fastifyAny.log.error('Error generating authorization URI:', err);
  //         return reply.status(400).send('Could not generate authorization URI');
  //       }
  //       return reply.redirect(uri);
  //     });
  // });


    // Google OAuth callback
//    app.get('/login/google/callback', async (req, reply) => {

//     try {
//     const fastifyAny = app as any;
//     console.log("request session at callback =======>> ", req.session);

//   const token = await fastifyAny.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(req);
//   const accessToken = token.token.access_token;

//   console.log('Access Token =======>> ', accessToken);

//   // fetch user info
//   const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
//     headers: { Authorization: `Bearer ${accessToken}` }
//   }).then(res => res.json());

//   console.log('User info =======>> ', userInfo);
//   console.log("request session =======>> ", req.session);

//   // to remove that shite later
//   (req.session as any).user = {
//     id: userInfo.sub,
//     email: userInfo.email,
//     name: userInfo.name,
//     picture: userInfo.picture
//   };



//   // store user info in the db later !
//   // send the data to the db 
//   reply.send(userInfo);
//   } catch (err) {
//     console.error('Error in Google OAuth callback:', err);
//     reply.status(400).send('Authentication failed something went wrong!');
//   }
// });

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
  const accessToken = token.token.access_token;

  console.log('Access Token =======>> ', accessToken);

  // fetch user info
  const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` }
  }).then(res => res.json());

  console.log('User info =======>> ', userInfo);
  // if gmail already in databae
  const fullName = userInfo.name;
  const imageUrl = userInfo.picture;
  const userName = userInfo.given_name;
  const email = userInfo.email;


  const existingUser = await findUserIfExists(userName, email);
  let user;

  if (!existingUser) {
    // random password 
    const randomPassword = await bcrypt.hash(Math.random().toString(36).slice(-8), 10);
    // add user
    user = await createUser(fullName, userName, email, randomPassword);
    // update imageUrl
    // add data
    const radarDataId = await addNewRadarDataRow(user.id);
    const chartsDataId = await addNewChartsDataRows(user.id);

    if (!radarDataId || !chartsDataId) {
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
    console.log("user already exists with this gmail : ", email);
    user = existingUser;
  }
  
  // JWT and cookie:
  const JWTtoken = await reply.jwtSign({ id: user.id, email: user.email });
  // set token in cookie
  reply.setCookie('token', JWTtoken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // for development, use 'strict' in production
      path: '/',
      maxAge: 54 * 60 * 60 // 1 day
  });

  return reply.redirect('http://localhost:3000/');
  } catch(error) {
    console.log(error);
    return reply.status(400).send({message: "something went wron!"})
  }
});
    
    // display that user routes are registered
    app.log.info('user routes registered')
}