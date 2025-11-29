"use client";

import PingPongCanvas from "../../components/PongCanvas";
import { useSettings } from "../../context/settings/SettingsContext";

export default function Game() {
  const { settings } = useSettings();

  return (
      <div className="flex h-screen w-screen bg-cover bg-center overflow-auto justify-center">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
        </div>
        <div
          className="relative z-10 container mx-auto px-4 py-8 flex justify-center items-center
      w"
        >
          <div className="bg-black/30 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10">
            <div className="xl:col-span-1">
              <PingPongCanvas
                paddleColor={settings.paddle}
                tableUrl={settings.bgTable}
                ballUrl={settings.ball}
                maxScore="1"
              />
            </div>
          </div>
        </div>
      </div>
  );
}

