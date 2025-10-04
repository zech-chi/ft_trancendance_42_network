"use client";
import React, { useEffect }  from "react";
import { useGame } from "@/contexts/GameContext";

type PlayerBaseProps = {
  player: number;
  color: string;
};

function PlayerBase ({ player, color }: PlayerBaseProps) {
  return (
      <div className="player-base" data-player-id={player.toString()} style={{ backgroundColor: color }}>
      {/* Optional content */}
      </div>
  );
}

function PlayerBases() {
  const colors = ["blue", "yellow", "red", "green"];
  const players = 4;

  return (
    <div className="player-bases">
      {[...Array(players)].map((_, i) => (
        <PlayerBase key={i} player={i} color={colors[i]} />
      ))}
    </div>
  );
}


const Board = () => {
  const refrence = React.useRef<HTMLDivElement | null>(null);

  const { state } = useGame();

  const board =
    state.lobby?.players[0]?.customzation?.boardTheme.image ||
    "/parshichi_src/board_skiin/classic.jpg";
  React.useEffect(() => {
    if (refrence.current === null) return;
    // Update header text
    else if (typeof refrence.current !== "string"){
      
const drawRows = () => {
    if (!refrence.current) return;

    const container = refrence.current as HTMLDivElement;
    container.innerHTML = ""; // clear old content
    container.style.display = "grid";
    container.style.gridTemplateRows = "repeat(25, 1fr)";
    container.style.gridTemplateColumns = "repeat(25, 1fr)";
    container.style.width = "100%";
    container.style.height = "100%";
; // stays on top of the image
    container.style.top = "0";
    container.style.left = "0";

    for (let rawIndex = 0; rawIndex < 25; rawIndex++) {
      for (let index = 0; index < 25; index++) {
        const putBox = document.createElement("div");
        const textInside = document.createElement("span");

        textInside.style.color = "white";
        textInside.innerText = `${String.fromCharCode(65 + rawIndex)},${index}`;
        textInside.style.fontSize = "0.6vmin"; // scales with screen
        textInside.style.fontWeight = "bold";

        putBox.appendChild(textInside);
        putBox.style.backgroundColor = "rgba(0,0,0,0.6)";
        putBox.style.display = "flex";
        putBox.style.justifyContent = "center";
        putBox.style.alignItems = "center";
        putBox.id = `${String.fromCharCode(65 + rawIndex)}.${index}`;

        container.appendChild(putBox);
      }
    }
  };

drawRows()
}
}, [])
  return (
    <div  className="flex justify-center items-center p-2 ">
       <div
    className="relative flex-1 border border-gray-800 rounded-4xl overflow-hidden shadow-lg"
    style={{
      width: "80vmin", // Use viewport-min so it scales equally with viewport
      height: "80vmin", // Keep square ratio
    }}
  >
    <img
      src={board}
      alt="Board Skin"
      className="absolute inset-0 w-full h-full object-contain"
    />
      <div ref={refrence} className="opacity-25"></div>
    </div>
     </div>
  );
};

export default Board;




// const tileMap: Record<number, string> = {
//   1: "O.5",
//   2: "O.6",
//   3: "O.7",
//   4: "O.8",
//   5: "O.9",
//   6: "O.10",
//   7: "O.11",
//   // ...
// };

// // Example usage:
// function getTileId(tileNumber: number): string {
//   return tileMap[tileNumber];
// }

// // Later, when backend sends you a tile:
// const backendTile = 1; 
// const frontTileId = getTileId(backendTile); // "E3"

// // Now you can use it to find the DOM element
// const tileDiv = document.getElementById(frontTileId);
// if (tileDiv) {
//   tileDiv.style.backgroundColor = "red"; // put a piece there
// }