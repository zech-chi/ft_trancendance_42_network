import { JSX } from "react";
import TopDashboard from "@/components/TopDashboard";

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
          <TopDashboard />
        </div>
      </main>
  );
}