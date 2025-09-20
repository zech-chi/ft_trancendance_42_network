import { FastifyRequest, FastifyReply } from "fastify";
import { db } from "../index";

export async function searchUsersController(
  req: FastifyRequest<{ Querystring: { prefix: string } }>,
  reply: FastifyReply
) {
  const { prefix } = req.query;

  // wrap callback-style sqlite3 in a Promise
  const rows: { id: number; userName: string; imageUrl?: string }[] =
    await new Promise((resolve, reject) => {
      db.all(
        `SELECT id, userName, imageUrl FROM Users WHERE userName LIKE ? COLLATE NOCASE`,
        [`${prefix}%`],
        (err, results) => {
          if (err) return reject(err);
          resolve(results as { id: number; userName: string; imageUrl?: string }[]);
        }
      );
    });

  const users = rows.map((row) => ({
    id: row.id,
    userName: row.userName,
    imageUrl: row.imageUrl ?? "",
  }));

  return reply.send({ users });
}
