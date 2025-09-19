import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { $ref, RegisterUserInput, LoginUserInput } from "./user.schema"
import { RegisterUser } from './user.controller.register';
import { LoginUser } from './user.controller.signin';
import { findUserByEmail } from './user.controller.signin';

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
    
    // display that user routes are registered
    app.log.info('user routes registered')
}