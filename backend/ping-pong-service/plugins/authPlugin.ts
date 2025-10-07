

// export default authPlugin;

import { FastifyPluginAsync, FastifyRequest, FastifyReply } from "fastify";
import Database from "better-sqlite3";
import bcrypt from "bcrypt";

import {
  UserRegistration,
  RegistrationResponse,
  LoginCredentials,
  LoginResponse,
  AuthPluginOptions,
} from "../types/auth";

import db from "../DataBase/db";
import { JwtPayload } from "../types/fastify-jwt";
import { request } from "http";
import { error } from "console";

const authPlugin: FastifyPluginAsync<AuthPluginOptions> = async (
  fastify,
  options
) => {
  const { secret, cookieName = "auth-token" } = options;

  // Décorateurs Fastify
  fastify.decorate("authDb", db);

  fastify.decorate("generateToken", (payload: any) => {
    return fastify.jwt.sign(payload);
  });

  fastify.decorate("authenticate", async (request: FastifyRequest) => {
    try {
      const token =
        request.cookies[cookieName] ||
        request.headers.authorization?.replace("Bearer ", "");

      if (!token) {
        throw new Error("No token provided");
      }

      const decoded = await fastify.jwt.verify(token);
      request.user = decoded as JwtPayload;
    } catch (error) {
      request.user = null;
      throw new Error("Invalid token");
    }
  });

  // Hook pour toutes les requêtes pour peupler request.user
  fastify.addHook("onRequest", async (request, reply) => {
    try {
      await fastify.authenticate(request);
    } catch {
      request.user = null;
    }
  });

  // Route Register
  fastify.post<{ Body: UserRegistration }>(
    "/register",
    async (request, reply): Promise<RegistrationResponse> => {
      const { name, username, password_hash } = request.body;
      const validationError = validateRegistrationInput(
        name,
        username,
        password_hash
      );

      if (validationError) {
        reply.code(400);
        return { success: false, error: validationError };
      }

      try {
        const hashedPassword = await bcrypt.hash(password_hash, 12);
        const stmt = db.prepare(
          "INSERT INTO users (name, username, password_hash) VALUES (?, ?, ?)"
        );
        const result = stmt.run(name, username, hashedPassword);

        if (result.changes === 0) {
          throw new Error("Failed to create user");
        }

        // Générer token JWT
        const token = fastify.generateToken({
          id: Number(result.lastInsertRowid),
          username,
          name,
        });

        // Cookie HTTP-only
        reply.setCookie(cookieName, token, {
          httpOnly: true,
          secure: false, // true en production
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60,
          path: "/",
        });

        reply.code(201);
        return {
          success: true,
          message: "User registered successfully",
          userId: Number(result.lastInsertRowid),
        };
      } catch (error: any) {
        return handleRegistrationError(error, reply);
      }
    }
  );

  // Route Login
  fastify.post<{ Body: LoginCredentials }>(
    "/login",
    async (request, reply): Promise<LoginResponse> => {
      const { username, password_hash } = request.body;

      if (!username || !password_hash) {
        reply.code(400);
        return { success: false, error: "Username and password required" };
      }

      try {
        const stmt = db.prepare("SELECT * FROM users WHERE username = ?");
        const user = stmt.get(username) as any;

        if (!user) {
          reply.code(401);
          return { success: false, error: "Invalid credentials" };
        }

        const isValidPassword = await bcrypt.compare(
          password_hash,
          user.password_hash
        );

        if (!isValidPassword) {
          reply.code(401);
          return { success: false, error: "Invalid credentials" };
        }

        const token = fastify.generateToken({
          id: user.id,
          username: user.username,
          name: user.name,
        });

        // Cookie HTTP-only
        reply.setCookie(cookieName, token, {
          httpOnly: true,
          secure: false, // true en production
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60,
          path: "/",
        });

        reply.code(200);
        return {
          success: true,
          message: "Login successful",
          user: {
            id: user.id,
            name: user.name,
            username: user.username,
          },
        };
      } catch (error: any) {
        reply.code(500);
        return { success: false, error: "Login failed" };
      }
    }
  );
  fastify.get("/test-user", { preHandler: [fastify.authenticate] }, async (request, reply) => {
    return {
      user: request.user,
      authenticated: true
    };
  });
  // Route Logout
  fastify.post("/logout", async (request, reply) => {
    reply.clearCookie(cookieName, { path: "/" });
    return { success: true, message: "Logout successful" };
  });

  // Route /me
  fastify.get("/me", async (request, reply) => {
    if (!request.user) {
      reply.code(401);
      return { success: false, error: "Not authenticated" };
    }

    try {
      const stmt = db.prepare(
        "SELECT id, name, username, created_at FROM users WHERE id = ?"
      );
      const user = stmt.get(request.user.id) as any;

      if (!user) {
        reply.code(404);
        return { success: false, error: "User not found" };
      }

      return {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          created_at: user.created_at,
        },
      };
    } catch {
      reply.code(500);
      return { success: false, error: "Internal server error" };
    }
  });

  fastify.get("/friends/:userId", async (request, reply) => {
    try {
    //   const stmt = db.prepare(`
    //   SELECT u.id, u.name, u.username, f.status
    //   FROM friends f
    //   JOIN users u
    //     ON (u.id = f.friend_id AND f.user_id = ?)
    //     OR (u.id = f.user_id AND f.friend_id = ?)
    //   WHERE f.status = 'accepted' AND u.state = 'online'
    // `);
    //   const friends = stmt.all(request.user?.id, request.user?.id);
    //   if (!friends) {
    //     reply.code(404);
    //     return { success: false, error: "The user has no friends" };
    //   }

    //   return {
    //     success: true,
    //     friends,
    //   };

    // fetch friends from the db in localhst:5000/api/pong/friends/:userId
    const { userId } = request.params as { userId: number };
    if (!userId) {
        reply.code(401);
        return { success: false, error: "Not authenticated" };
    }

    const response = await fetch(`http://db-service:5000/api/pong/friends/${userId}`);
    if (!response.ok) {
        reply.status(400).send({ success: false, error: "Failed to fetch friends" });
        return;
    }
    const data = await response.json();
    return data;

    } catch(err) {
      console.error(err);
      reply.code(400);
      return { success: false, error: "something went wrong try again later!" };
    }
  });


  // get user by id
  fastify.get("/get-user/:id", async (request, reply) => {
    const { id } = request.params as { id: number };
    if (!id) {
      reply.code(400);
      return { success: false, error: "User ID is required" };
    }

    try {
      // now fetch user from db localhost:5000/api/pong/user/:id
      const response = await fetch(`http://db-service:5000/api/pong/user/${id}`);
      if (!response.ok) {
        reply.status(400).send({ success: false, error: "Failed to fetch user" });
        return;
      }
      const data = await response.json();
      return data;
    } catch (error) {
      reply.code(400);
      return { success: false, error: "something went wrong try again later!" };
    }
  });

  fastify.addHook("onClose", (instance, done) => {
    db.close();
    done();
  });
};

// Helper functions
function validateRegistrationInput(
  name: string,
  username: string,
  password: string
): string | null {
  if (!name || !username || !password)
    return "Name, username, and password required";
  if (name.length < 2) return "Name must be at least 2 characters long";
  if (username.length < 3) return "Username must be at least 3 characters long";
  if (password.length < 6) return "Password must be at least 6 characters long";
  if (!/^[a-zA-Z0-9_]+$/.test(username))
    return "Username can only contain letters, numbers, and underscores";
  return null;
}

function handleRegistrationError(
  error: any,
  reply: FastifyReply
): RegistrationResponse {
  if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
    reply.code(409);
    return { success: false, error: "Username already exists" };
  }
  console.error("Registration error:", error);
  reply.code(500);
  return { success: false, error: "Internal server error" };
}

// Types Fastify
declare module "fastify" {
  interface FastifyInstance {
    authDb: Database.Database;
    generateToken: (payload: any) => string;
    authenticate: (request: FastifyRequest) => Promise<void>;
  }
}

export default authPlugin;
