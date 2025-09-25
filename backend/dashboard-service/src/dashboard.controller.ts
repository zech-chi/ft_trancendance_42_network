import { FastifyReply, FastifyRequest } from "fastify";
import { dashboardSchemas, FetchUserByIdParams, FetchUserParams, FetchUserResponse, RadarStatsParams } from "./dashboard.schema"
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



export async function fetchUserByIdHandler(
    request: FastifyRequest<{ Params: FetchUserByIdParams }>,
    reply: FastifyReply
) {
    const { userId } = request.params;

    try {
        const user = await fetch("http://localhost:5000/api/dashboard/usersId/" + userId);

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


// fetch friends by status for a user
export async function fetchFriendsByStatusHandler(
    request: FastifyRequest<{ Params: { userId: string }; Querystring: { status: string } }>,
    reply: FastifyReply
) {
    const { userId } = request.params;
    const { status } = request.query;

    try {
        const response = await fetch(`http://localhost:5000/api/dashboard/friends/${userId}?status=${encodeURIComponent(status)}`);

        console.log("response status from friends service: ", response.status, userId, status);
        if (!response.ok) {
            reply.status(404).send({ message: "No friends found" });
            return { friends: [] };
        }

        const data = await response.json();

        if (data.status === "ko") {
            reply.status(404).send({ message: "No friends found" });
            return { friends: [] };
        }

        console.log("data from friends service: ", data);

        return { friends: data.friends || [] };

    } catch (error) {
        reply.status(400).send({ message: "something went wrong!" });
        return { friends: [] };
    }
}