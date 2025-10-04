// components/game/LobbyBrowser.tsx
'use client';

import React, { useEffect, useMemo, useState } from "react";
import { useGame } from "@/contexts/GameContext";
import { useSocket } from "@/contexts/SocketContext";
import Button from "@/components/ui/Button";

export default function LobbyBrowser() {
  const { state, joinLobby, toggleReady, leaveLobby, startGame } = useGame();
  const { connected } = useSocket();
  const [name, setName] = useState("");
  const [lobbyIdInput, setLobbyIdInput] = useState("");

  const myPlayer = useMemo(() => {
    if (!state.lobby || !name) return null;
    return state.lobby.players.find((p) => p.name === name) ?? null;
  }, [state.lobby, name]);

  useEffect(() => {
    // Optional: prefill a name from localStorage
    const saved = localStorage.getItem("parashichi:name");
    if (saved) setName(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("parashichi:name", name);
  }, [name]);

  const handleJoin = () => {
    if (!name || !lobbyIdInput) {
      alert("Enter a name and a lobby id");
      return;
    }
    joinLobby(lobbyIdInput, name);
  };

  const handleToggleReady = () => {
    if (!state.lobby || !myPlayer) return;
    toggleReady(state.lobby.id, !myPlayer.ready);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Lobby</h2>
        <div className="text-sm text-gray-600">{connected ? "Connected" : "Connecting..."}</div>
      </div>

      {/* Join form */}
      {!state.lobby && (
        <div className="bg-white p-4 rounded-md shadow-sm flex gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="flex-1 border rounded-md px-3 py-2"
          />
          <input
            value={lobbyIdInput}
            onChange={(e) => setLobbyIdInput(e.target.value)}
            placeholder="Lobby id (e.g., abc123)"
            className="w-40 border rounded-md px-3 py-2"
          />
          <Button onClick={handleJoin}>Join</Button>
        </div>
      )}

      {/* Lobby details */}
      {state.lobby && (
        <div className="bg-white p-4 rounded-md shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-lg font-medium">{state.lobby.name}</h3>
              <p className="text-sm text-gray-500">ID: {state.lobby.id} • {state.lobby.players.length}/{state.lobby.maxPlayers}</p>
            </div>

            <div className="flex items-center gap-2">
              {myPlayer && <Button variant="ghost" onClick={handleToggleReady}>{myPlayer.ready ? "Unready" : "Ready"}</Button>}
              <Button variant="ghost" onClick={() => leaveLobby(state.lobby!.id)}>Leave</Button>
              {/* Only host can start */}
              {state.lobby.hostId === (myPlayer?.id ?? "") && <Button onClick={() => startGame(state.lobby!.id)}>Start</Button>}
            </div>
          </div>

          <ul className="space-y-2">
            {state.lobby.players.map((p) => (
              <li key={p.id} className="flex items-center justify-between p-2 rounded-md border">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm">{p.name.charAt(0).toUpperCase()}</div>
                  <div>
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-gray-500">{p.ready ? "Ready" : "Not ready"}</div>
                  </div>
                </div>
                {/* show host badge */}
                <div className="text-xs text-gray-500">{state.lobby.hostId === p.id ? "Host" : ""}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
