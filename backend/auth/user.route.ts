import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { $ref, RegisterUserInput, LoginUserInput } from "./user.schema"
import { RegisterUser } from './user.controller';


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
        async (req: FastifyRequest<{ Body: RegisterUserInput }>, reply: FastifyReply) =>
        {
            return RegisterUser(req, reply);
        }
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
        async (req: FastifyRequest<{ Body: LoginUserInput }>, reply: FastifyReply) => 
        {

        }
    );
    
    // logout
    app.delete('/logout', (req: FastifyRequest, res: FastifyReply) => {
        
    });
    
    // display that user routes are registered
    app.log.info('user routes registered')
}