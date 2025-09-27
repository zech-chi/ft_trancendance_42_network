import { FastifyInstance } from "fastify";
import { getProfileImage, UpdateProfile } from "../controllers/ProfileController";


export async function ProfileRoutes(fastify: FastifyInstance) {
  // Define a route for getting user settings
  fastify.patch('/update/:id', UpdateProfile);

  // get user profile image
  fastify.get('/profileImage/:filename', getProfileImage);
}