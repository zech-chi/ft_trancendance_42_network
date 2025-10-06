import { FastifyInstance } from "fastify";
import { getProfileImage, UpdateProfile } from "../controllers/ProfileController";


export async function ProfileRoutes(fastify: FastifyInstance) {
  // Define a route for getting user settings
  fastify.patch('/update/:id', UpdateProfile);

  // get user profile image
  fastify.get('/profileImage/*', getProfileImage);
}


// curl -X PATCH http://localhost:5003/api/settings/update/6 \
//   -F "firstName=John" \
//   -F "lastName=Doe" \
//   -F "language=en" \
//   -F "bio=Updated bio description" \
//   -F "oldPassword=oldpass123" \
//   -F "newPassword=newpass123" \
//   -F "confirmPassowrd=newpass123"