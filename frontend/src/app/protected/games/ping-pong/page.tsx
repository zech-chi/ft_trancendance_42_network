"use client";

import { useRouter } from "next/navigation";
import { Router } from "next/router";
import React, { useState } from "react";
// import controlImg from "@/public/images/controle.png";
// import controlImg from "../../../../../public/images/";

// import controlFixImg from "../../../public/images/controle_fix.png";
import Image from "next/image";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

type BoxProps = {
  label: string;
  className: string;
  isHovered: boolean;
  isOtherHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
};

function Box({
  label,
  className,
  isHovered,
  isOtherHovered,
  onHover,
  onLeave,
  onClick,
}: BoxProps) {
  return (
    <div
      onClick={onClick}
      className={`
        w-[80%] h-[80%] flex items-center justify-center rounded-2xl sm:w-[90%] sm:h-[90%] ${className}
        transition duration-300 cursor-pointer fixed
        ${isOtherHovered ? "brightness-50" : "brightness-100"}
        ${isHovered ? "scale-105" : "scale-100"}
      `}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <h1 className="truncate text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400 font-bold text-2xl sm:text-2xl md:text-4xl ">
        {label}
      </h1>
    </div>
  );
}

export default function Test() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const router = useRouter();
  const boxes = [
    {
      id: 0,
      label: "LOCAL",
      className: "costum-path",
      pageLink: "../games/ping-pong/modes/gameSettings2D",
    },
    {
      id: 1,
      label: "AI",
      className: "costum-path-3",
      pageLink: "../games/ping-pong/modes/gameSettings2D",
    },
    {
      id: 2,
      label: "FRIEND",
      className: "costum-path-2",
      pageLink: "../games/ping-pong/modes/invitefriend",
    },
    {
      id: 3,
      label: "TOURNEMENT",
      className: "costum-path-4",
      pageLink: "../games/ping-pong/modes/tournament",
    },
  ];

  return (
      // <div className="relative flex h-screen w-screen settings-bg bg-cover bg-center overflow-hidden items-center justify-center">
      //   <div className="bg-[rgba(0,0,0,0.5)] p-6  w-[70%] h-[80%] flex flex-col items-center gap-2 justify-center sm:grid sm:grid-cols-2 sm:grid-rows-2 sm:place-items-center rounded-2xl">
      //     {boxes.map(({ id, label, className, pageLink }) => (
      //       <Box
      //         key={id}
      //         label={label}
      //         className={className}
      //         isHovered={hoveredIndex === id}
      //         isOtherHovered={hoveredIndex !== null && hoveredIndex !== id}
      //         onHover={() => setHoveredIndex(id)}
      //         onLeave={() => setHoveredIndex(null)}
      //         onClick={() => router.push(pageLink)}
      //       />
      //     ))}
      //   </div>
      // </div>

       <div className="h-screen flex items-center min-w-[200px] w-full overflow-x-auto">
        <Sidebar />
        <Navbar />
        <main
          className="flex flex-row items-center justify-center relative overflow-x-hidden
                            xl:pl-20 2xl:pl-24 w-full
                            h-[calc(100%-130px)]
                            xl:h-[calc(100%-75px)]
                            2xl:h-[calc(100%-85px)]
                            2xl:mt-[67px] xl:mt-[60px] overflow-y-hidden
                        "
        >
          <div className="relative flex h-screen w-screen  bg-cover bg-center overflow-hidden items-center justify-center">
        <div className="bg-[rgba(0,0,0,0.5)] p-6  w-[70%] h-[80%] flex flex-col items-center gap-2 justify-center sm:grid sm:grid-cols-2 sm:grid-rows-2 sm:place-items-center rounded-2xl">
          {boxes.map(({ id, label, className, pageLink }) => (
            <Box
              key={id}
              label={label}
              className={className}
              isHovered={hoveredIndex === id}
              isOtherHovered={hoveredIndex !== null && hoveredIndex !== id}
              onHover={() => setHoveredIndex(id)}
              onLeave={() => setHoveredIndex(null)}
              onClick={() => router.push(pageLink)}
            />
          ))}
        </div>
      </div>
        </main>
 </div>
  );
}





