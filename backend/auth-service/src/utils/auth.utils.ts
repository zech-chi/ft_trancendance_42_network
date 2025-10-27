import { FastifyReply } from "fastify";

export function setAccessTokenCookie(reply: FastifyReply, token: string) {
  reply.setCookie("access_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/", // ✅ Must be root to be sent with all requests
    maxAge: 15 * 60, // 15 minutes
  });
}

export function setRefreshTokenCookie(reply: FastifyReply, token: string) {
  reply.setCookie("refresh_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/api/auth/refresh", // ✅ only sent when refreshing token
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

export function clearRefreshTokenCookie(reply: FastifyReply) {
  reply.clearCookie("refresh_token", { path: "/api/auth/refresh" });
}

export function setTmp2FACookie(reply: FastifyReply, token: string) {
  reply.setCookie("tmp_2fa", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/api/auth/2fa-verify",
    maxAge: 5 * 60, // 5 minutes
  });
}

export function clearTmp2FACookie(reply: FastifyReply) {
  reply.clearCookie("tmp_2fa", { path: "/auth/verify_2fa" });
}
