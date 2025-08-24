import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'



export async function authRoutes(app: FastifyInstance) {
    // for testing
    app.get('/', (req: FastifyRequest, res: FastifyReply) => {
        res.code(200).send("auth work");
    });

    // register
    app.post('/register', (req: FastifyRequest, res: FastifyReply) => {
        
    });

    // login
    app.post('/login', (req: FastifyRequest, res: FastifyReply) => {
        
    });
    
    // logout
    app.delete('/logout', (req: FastifyRequest, res: FastifyReply) => {
        
    });
    
    // display that user routes are registered
    app.log.info('user routes registered')
}