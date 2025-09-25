import { FastifyReply, FastifyRequest } from "fastify";
import { dashboardSchemas, FetchUserParams, FetchUserResponse, RadarStatsParams } from "./dashboard.schema"
import bcrypt from "bcryptjs";
import { API_ROUTES } from "./utils/APIrouts";


// // function to find user by email
// export const fetchUser = async (userName: string) => {
//     const response = await fetch(`http://localhost:5000/users/${userName}`);
//     if (!response.ok) {
//       throw new Error(`Error: ${response.status}`);
//     }
//     const data = await response.json();
//     return data;
// };

export async function fetchUserHandler(
    request: FastifyRequest<{ Params: FetchUserParams }>,
    reply: FastifyReply
) {
    const { userName } = request.params;

    try {
        const user = await fetch("http://localhost:5000/api/dashboard/users/" + userName);

        if (!user.ok) {
            reply.status(404).send({ message: "User not found" });
            return;
        }

        const userData = await user.json();

        if (userData.success === "ko") {
            reply.status(404).send({ message: "User not found" });
            return;
        }

        return userData || null;

    } catch (error) {
        reply.status(400).send({ message: "something went wrong!" });
        return null;
    }
}

export async function fetchSearchUserHandler(
    request: FastifyRequest<{ Querystring: { prefix: string } }>,
    reply: FastifyReply
) {
    const { prefix } = request.query;

    try {
        const response = await fetch(`http://localhost:5000/api/dashboard/search?prefix=${encodeURIComponent(prefix)}`);;

        if (!response.ok) {
            reply.status(404).send({ message: "No users found" });
            return { users: [] };
        }

        const data = await response.json();

        if (data.status === "ko") {
            reply.status(404).send({ message: "No users found" });
            return { users: [] };
        }

        console.log("data from db service: ", data);

        return { users: data.users || [] };

    } catch (error) {
        reply.status(400).send({ message: "something went wrong!" });
        return { users: [] };
    }
}

// fetch radar data for a user 
export async function fetchRadarDataHandler(
    request: FastifyRequest<{ Params: RadarStatsParams }>,
    reply: FastifyReply
) {
    const { userName } = request.params;

    try {
        const response = await fetch(`http://localhost:5000/api/dashboard/radarData/${userName}`);

        if (!response.ok) {
            reply.status(404).send({ message: "Radar data not found" });
            return null;
        }

        const data = await response.json();
        console.log("data from db service: ", data);

        if (data.status === "ko") {
            reply.status(404).send({ message: "Radar data not found" });
            return null;
        }

        return data || null;

    } catch (error) {
        reply.status(400).send({ message: "something went wrong!" });
        return null;
    }
}