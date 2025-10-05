// import "@fastify/jwt";
interface JwtPayload {
  id: number;
  username: string;
  name: string;
}

export interface FastifyJWT {

  payload: {
    id: number;
    username: string;
    name: string;
  };

  
  user: {
    id: number;
    username: string;
    name: string;
  };
}


declare module "fastify" {
  interface FastifyRequest {
    // user: {
    //   id: number;
    //   username: string;
    //   name: string;
    // } | null;
    user : JwtPayload | null;
  }
  interface FastifyInstance {
    authDb: Database.Database;
    generateToken: (payload: any) => string;
    authenticate: (request: FastifyRequest) => Promise<void>;
    jwt: {
      sign: (payload: any, options?: any) => string;
      verify: (token: string, options?: any) => Promise<any>;
    };
  }
}
