// /protected/layout.tsx
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="h-screen flex items-center min-w-[200px] overflow-x-auto">
      <div className="flex flex-col w-full">
        {/* <p>welcome</p> */}
        <div className="flex flex-1">{children}</div>
      </div>
    </div>
  );
}