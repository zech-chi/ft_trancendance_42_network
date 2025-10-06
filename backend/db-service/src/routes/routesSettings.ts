// handle settings profile update


import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export default async function routesSettings(fastify: FastifyInstance) {
    // get the db instance
    const db = fastify.db;

    // define a hello route
    fastify.get('/settings', async (request: FastifyRequest, reply: FastifyReply) => {
        return { message: 'Hello from the Settings service!' };
    });

    // fetch user settings by user ID
    fastify.get('/users/:userId', async (request: FastifyRequest<{ Params: { userId: string } }>, reply: FastifyReply) => {
        const { userId } = request.params;
        try {
            const stmt = db.prepare("SELECT * FROM users WHERE id = ?");
            const user = stmt.get(userId);
            if (!user) {
                reply.code(404);
                return { success: false, error: "User not found" };
            }

            return {
                success: true,
                user: user,
            };
        } catch (err) {
            console.error(err);
            reply.code(400);
            return { success: false, error: "something went wrong try again later!" };
        }
    });


    // update user settings by user ID
    interface UpdateProfileBody {
        updates: string[];
        values: string[];
    }   

    fastify.patch('/users/updateprofile/:userId', async (request: FastifyRequest<{ Params: { userId: string }, Body: UpdateProfileBody }>, reply: FastifyReply) => {
        const { userId } = request.params;

        // check if the request body is valid
        if (!request.body) {
            reply.code(400);
            return { success: false, error: "Invalid request body" };
        }

        // get the update and values arrays from the request body
        const { updates, values } = request.body;
        
        if (updates.length === 0 || values.length === 0 || updates.length !== values.length) {
            reply.code(400);
            return { success: false, error: "Invalid updates or values" };
        }

        console.log("Updates:", updates);
        console.log("Values:", values);
        // try {
        //     const stmt = db.prepare(`UPDATE users SET ${updates.join(", ")} WHERE id = ?`);
        //     stmt.run([...values, userId]);

        //     // return the updated user
        //     const getUserStmt = db.prepare("SELECT * FROM users WHERE id = ?");
        //     const updatedUser = getUserStmt.get(userId);

        //     return {
        //         success: true,
        //         user: updatedUser,
        //     };

        // } catch (err) {
        //     console.error(err);
        //     reply.code(400);
        //     return { success: false, error: "something went wrong try again later!" };
        // }

        return { success: true, message: "Update route is working!", updates, values };
    });

}
