import { FastifyReply, FastifyRequest } from "fastify";
import { dashboardSchemas, FetchUserByIdParams, FetchUserParams, FetchUserResponse, FriendParams, RadarStatsParams } from "./dashboard.schema"
import bcrypt from "bcryptjs";
import { API_ROUTES } from "./utils/APIrouts";


// // function to find user by email
// export const fetchUser = async (userName: string) => {
//     const response = await fetch(`http://db-service:5000/users/${userName}`);
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
        const user = await fetch("http://db-service:5000/api/dashboard/users/" + userName);

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
        const user = await fetch("http://db-service:5000/api/dashboard/usersId/" + userId);

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
        const response = await fetch(`http://db-service:5000/api/dashboard/search?prefix=${encodeURIComponent(prefix)}`);;

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
        const response = await fetch(`http://db-service:5000/api/dashboard/radarData/${userName}`);

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
        const response = await fetch(`http://db-service:5000/api/dashboard/friends/${userId}?status=${encodeURIComponent(status)}`);

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

// fetchFriendsBySentHandler
export async function fetchFriendsBySentHandler(
    request: FastifyRequest<{ Params: { userId: string }; Querystring: { status: string } }>,
    reply: FastifyReply
) {
    const { userId } = request.params;
    const { status } = request.query;

    try {
        const response = await fetch(`http://db-service:5000/api/dashboard/friends/sentrequest/${userId}?status=${encodeURIComponent(status)}`);

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

// friend request handler
export async function friendRejectHandler(
    request: FastifyRequest<{ Body: FriendParams }>,
    reply: FastifyReply
) {
    const { sender_id, receiver_id } = request.body;

    try {
        const response = await fetch("http://db-service:5000/api/dashboard/friends/reject", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ sender_id, receiver_id }),
        });

        if (!response.ok) {
            reply.status(400).send({ message: "Failed to reject friend request" });
            return { success: "ko" };
        }

        const data = await response.json();
        return data || { success: "ok" };

    } catch (error) {
        reply.status(400).send({ message: "something went wrong!" });
        return { success: "ko" };
    }
}


// accept friend request handler
export async function friendAcceptHandler(
    request: FastifyRequest<{ Body: FriendParams }>,
    reply: FastifyReply
) {
    const { sender_id, receiver_id } = request.body;

    try {
        const response = await fetch("http://db-service:5000/api/dashboard/friends/accept", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ sender_id, receiver_id }),
        });

        if (!response.ok) {
            reply.status(400).send({ message: "Failed to accept friend request" });
            return { success: "ko" };
        }

        const data = await response.json();
        return data || { success: "ok" };

    } catch (error) {
        reply.status(400).send({ message: "something went wrong!" });
        return { success: "ko" };
    }
}


// unblock friend handler
export async function friendUnblockHandler(
    request: FastifyRequest<{ Body: FriendParams }>,
    reply: FastifyReply
) {
    const { sender_id, receiver_id } = request.body;

    try {
        const response = await fetch("http://db-service:5000/api/dashboard/friends/unblock", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ sender_id, receiver_id }),
        });

        if (!response.ok) {
            reply.status(400).send({ message: "Failed to unblock friend" });
            return { success: "ko" };
        }

        const data = await response.json();
        return data || { success: "ok" };

    } catch (error) {
        reply.status(400).send({ message: "something went wrong!" });
        return { success: "ko" };
    }
}


// friend request handler
export async function friendRequestHandler(
    request: FastifyRequest<{ Body: FriendParams }>,
    reply: FastifyReply
) {
    const { sender_id, receiver_id } = request.body;

    try {
        const response = await fetch("http://db-service:5000/api/dashboard/friends/requestfriend", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ sender_id, receiver_id }),
        });

        if (!response.ok) {
            reply.status(400).send({ message: "Failed to send friend request" });
            return { success: "ko" };
        }

        const data = await response.json();
        return data || { success: "ok" };

    } catch (error) {
        reply.status(400).send({ message: "something went wrong!" });
        return { success: "ko" };
    }
}


// fetch charts data handler
export async function fetchChartsDataHandler(
    request: FastifyRequest<{ Params: { userId: string }; Querystring: { game: string } }>,
    reply: FastifyReply
) {
    const { userId } = request.params;
    const { game } = request.query;

    try {
        const response = await fetch(`http://db-service:5000/api/dashboard/chartsdata/${userId}?game=${encodeURIComponent(game)}`);
        
        if (!response.ok) {
            reply.status(404).send({ message: "Charts data not found" });
            return null;
        }

        const data = await response.json();
        console.log("data from db service: ", data);

        if (data.status === "ko") {
            reply.status(404).send({ message: "Charts data not found" });
            return null;
        }

        return data || null;

    } catch (error) {
        reply.status(400).send({ message: "something went wrong!" });
        return null;
    }
}
