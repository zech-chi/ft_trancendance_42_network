// /protected/layout.tsx
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

async function getUserFromSession() {
  const cookieStore = await cookies(); // get cookies from the incoming request
  const cookieHeader = cookieStore.toString();

  const res = await fetch("http://localhost:5000/api/auth/session", {
    headers: {
      Cookie: cookieHeader, // forward cookies to backend
    },
    cache: "no-store",
  });

  if (!res.ok) {
    redirect("/login");
  }

  return res.json();
}

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
//   const user = await getUserFromSession();

  return (
    <div className="h-screen flex items-center min-w-[200px] overflow-x-auto">
      <div className="flex flex-col w-full">
        {/* <p>welcome</p> */}
        <div className="flex flex-1">{children}</div>
      </div>
    </div>
  );
}