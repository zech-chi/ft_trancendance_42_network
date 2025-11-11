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
        if (!request.body || !userId) {
            reply.code(400);
            return { success: false, error: "Invalid request body" };
        }

        // get the update and values arrays from the request body
        const { updates, values } = request.body;
        
        if (updates.length === 0 || values.length === 0 || updates.length !== values.length) { 
            reply.code(400);
            return { success: false, error: "Invalid updates or values" };
        }

        // Validate that we're not trying to update sensitive fields
        // const allowedFields = ['fullName', 'userName', 'bio', 'imageUrl', 'password'];
        // const invalidFields = updates.filter((field: string) => allowedFields.includes(field));
        
        // if (invalidFields.length > 0) {
        //     console.error("=========> Attempt to update invalid fields:", invalidFields);
        //     reply.code(400);
        //     return { success: false, error: `Invalid fields: ${invalidFields.join(', ')}. Cannot update other protected fields through this endpoint.` };
        // }

        console.log("Updates:", updates);
        console.log("Values:", values);
        console.log("==========> UserID:", userId); 
        
        try {
            // Check if user exists first
            const checkStmt = db.prepare("SELECT id FROM Users WHERE id = ?");
            const userExists = checkStmt.get(userId);
            
            if (!userExists) {
                reply.code(404);
                return { success: false, error: "User not found" };
            }

            // Build the SET clause for the UPDATE statement
            const setClause = updates.map((field: string) => `${field}`).join(", ");
            const stmt = db.prepare(`UPDATE Users SET ${setClause} WHERE id = ?`);
            stmt.run([...values, userId]);

            // Return the updated user without the password
            const getUserStmt = db.prepare(`
                SELECT 
                    fullName, userName, bio, imageUrl
                FROM Users 
                WHERE id = ?
            `);
            const updatedUser = getUserStmt.get(userId);

            return {
                success: true,
                user: updatedUser,
            };

        } catch (err) {
            console.error("Error updating user profile:", err);
            reply.code(400);
            return { success: false, error: "Something went wrong, please try again later!" };
        }
    });

}
