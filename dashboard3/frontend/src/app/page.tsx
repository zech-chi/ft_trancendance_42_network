import { JSX } from "react";
import TopDashboard from "@/components/TopDashboard";
import CalendarDashboard from "@/components/CalendarDashboard";

const TOTAL_USERS = 133742;

const user = {
  fullName: "Gon Freecss",
  userName: "hunterGon",
  bio: "One heartbeat matters, the next one!",
  imageUrl: "/gon.jpg",
  rank: 1337,
  level: 9,
  progress: .3, // 75% progress
  online: false,
}

export default function Home() : JSX.Element {
  return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24 relative">
        <div className="absolute top-20 bottom-0 left-25 w-3/4 w-[calc(65%-1rem)] m-4 rounded-[50px]"
          style={{
            background:
              'linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.1)), linear-gradient(to top, rgba(42, 21, 34, .8), rgba(96, 31, 48, .8) 100%)',
            backgroundBlendMode: 'overlay',
          }}
        >
          <TopDashboard user={user} totalUsers={TOTAL_USERS} />
        </div>

        <div className="absolute top-72 h-70 left-34 w-3/4 w-[calc(63.5%-1rem)] rounded-4xl justify-center items-center flex"
          style={{
            background:
              'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.1)), linear-gradient(to top, rgba(42, 21, 34, .8), rgba(96, 31, 48, .8) 100%)',
            backgroundBlendMode: 'overlay',
          }}
        >
          <CalendarDashboard />
        </div>

      </main>
  );
}
