import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";


export async function apiFetch(url: string, options: RequestInit = {}) {
  const { accessToken, setAccessToken, clearAccessToken } = useAuth();
  const router = useRouter();

  let res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
    },
    credentials: "include", // include HttpOnly refresh token
  });

  if (res.status === 401) {
    // try refresh token endpoint
    const refreshRes = await fetch("http://localhost:5001/api/auth/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (refreshRes.ok) {
      const data = await refreshRes.json();
      setAccessToken(data.accessToken);

      // retry original request
      res = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${data.accessToken}`,
        },
        credentials: "include",
      });
    } else {
      // refresh failed, logout
      clearAccessToken();
      router.push("/login");
      throw new Error("Session expired");
    }
  }

  return res;
}
