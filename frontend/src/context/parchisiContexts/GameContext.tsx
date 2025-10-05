"use client"

import { createContext, useContext, useReducer, type ReactNode, useEffect } from "react"
import { useSocket } from "./SocketContext"
import { useLoggedUserName } from "@/context/LoggedUserNameContext";
// import { Route } from "lucide-react"
// import { describe } from "node:test"
import type { BoardTheme, DiceSkin, PieceSkin } from "@/types/game"

interface customzation
{
  pieceSkin: PieceSkin
    diceSkin: DiceSkin
  boardTheme: BoardTheme
}

interface Player {
  id: string
  userName: string
  isReady: boolean
  color: string
  avatar?: string
  customzation?: customzation
}

interface Lobby {
  gameId: string
  hostId: string
  players: Player[]
}

interface GameState {
  lobby: Lobby | null
  currentPlayer: Player | null
  gameStarted: boolean
  gameId: string | null
  board: object | undefined
}

type GameAction =
  | { type: "SET_LOBBY"; payload: Lobby }
  | { type: "CLEAR_LOBBY" }
  | { type: "UPDATE_PLAYER_READY"; payload: { playerId: string; isReady: boolean } }
  | { type: "ADD_PLAYER"; payload: Player }
  | { type: "REMOVE_PLAYER"; payload: string }
  | { type: "SET_CURRENT_PLAYER"; payload: Player }
  | { type: "GAME_STARTED"; payload: { gameId: string;players: Player[]; board: object; currentPlayer: Player } }
  | { type: "INIT_LOBBY"; payload: { gameId: string, hostId:string } }

const initialState: GameState = {
  lobby: null,
  currentPlayer: null,
  gameStarted: false,
  gameId: null,
  board: undefined,

}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
   case "INIT_LOBBY":
  return {
    ...state,
    lobby: state.lobby
      ? { ...state.lobby, gameId: action.payload.gameId, hostId: action.payload.hostId }
      : { gameId: action.payload.gameId, hostId: action.payload.hostId, players: [] },
    gameId: action.payload.gameId,
  };


    case "SET_LOBBY":
      return { ...state, 
    lobby: { 
      ...action.payload, 
      gameId: action.payload.gameId
    },
    gameId: action.payload.gameId
  }
    case "CLEAR_LOBBY":
      return { ...state, lobby: null }
    case "UPDATE_PLAYER_READY":
      if (!state.lobby) return state
      return {
        ...state,
        lobby: {
          ...state.lobby,
          players: state.lobby.players.map((player) =>
            player.id === action.payload.playerId ? { ...player, isReady: action.payload.isReady } : player,
          ),
        },
      }
    case "ADD_PLAYER":
      if (!state.lobby) return state
      return {
        ...state,
        lobby: {
          ...state.lobby,
          players: [...state.lobby.players, action.payload],
        },
      }
    case "REMOVE_PLAYER":
      if (!state.lobby) return state
      return {
        ...state,
        lobby: {
          ...state.lobby,
          players: state.lobby.players.filter((player) => player.id !== action.payload),
        },
      }
    case "SET_CURRENT_PLAYER":
      return { ...state, currentPlayer: action.payload }
    case "GAME_STARTED":
      if (!state.lobby || !action.payload) 
      {
        console.error("No lobby or payload in GAME_STARTED action")
        return state
      }
        
      if (state.lobby.gameId !== action.payload.gameId)
      {
        
        console.error("Mismatched room IDs in GAME_STARTED action")
        console.log("state.lobby.gameId:", state.lobby.gameId)
        console.log("action.payload.gameId:", action.payload.gameId)
        return state
      }
      return { 
            ...state, // copy old state
            gameStarted: true,
            gameId: action.payload.gameId,
            board: action.payload.board,
            lobby:{
              ...state.lobby,
              players: action.payload.players
            },
            currentPlayer: action.payload.currentPlayer || null
          }
    default:
      return state
  }
}

interface GameContextType {
  state: GameState
  joinLobby: (gameId: string) => Promise<void>
  leaveLobby: (lobbyId: string) => void
  toggleReady: (gameId: string, username: string) => void
  startGame: (gameId: string) => void
  createGame: () => Promise<string>
}

const GameContext = createContext<GameContextType | null>(null)



export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const {loggedUserName, setLoggedUserName} = useLoggedUserName();
  const { socket } = useSocket()

  // Socket event listeners
  useEffect(() => {
    if (!socket) return

    // Listen for lobby updates from backend
    socket.on("lobbyUpdate", (lobbyData: Lobby) => {
      dispatch({ type: "SET_LOBBY", payload: lobbyData })
    })

    socket.on("gameCreated", ({ gameId }: { gameId: string }) => {
      console.log("Game created with ID:", gameId)
    })

    socket.on("gameJoined", ({ success }: { success: boolean }) => {
      if (success) {
        console.log("Successfully joined game")
      }
    })
    socket.on("gameStarted", (data: { gameId: string, players: Player[], board: object, currentPlayer: Player }) => {
      dispatch({ type: "GAME_STARTED", payload: data })
    })

    socket.on("error", ({ message }: { message: string }) => {
      console.error("Socket error:", message)
      alert(message)
    })

    socket.on("roomFull", ({ message }: { message: string }) => {
      console.error("Room full:", message)
      alert(message)
    })

  socket.on("removePlayer", ({ id }: { id: string }) => {
    console.log("Player removed:", id);
    dispatch({ type: "REMOVE_PLAYER", payload: id });
  });

  socket.on("lobbyClosed", ({ message }: { message: string }) => {
    console.warn("Lobby closed:", message);
    dispatch({ type: "CLEAR_LOBBY" });

    // redirect back to /online
    window.location.href = "/protected/games/parchisi/online";
  });

    return () => {
      socket.off("removePlayer");
      socket.off("lobbyClosed");
      socket.off("lobbyUpdate")
      socket.off("gameCreated")
      socket.off("gameJoined")
      socket.off("playerReady")
      socket.off("gameStarted")
      socket.off("error")
      socket.off("roomFull")
    }
  }, [socket])

  const leaveLobby = (lobbyId: string) => {
    if (!socket) return
    socket.emit("leaveLobby", { lobbyId })
  }

  const toggleReady = (gameId: string, username: string) => {
    if (socket){
      socket.emit("readyToPlay", { gameId, username })
    }
  }

  const startGame = (gameId: string) => {
    if (!socket) return
    socket.emit("startGame", { gameId: gameId })
  }
  const createGame = async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!socket) return reject("No socket connected");

      const username = loggedUserName;
      socket.emit("createGame", { username });
      socket.once("gameCreated", (data: { gameId: string }) => {
        if (data?.gameId) {
          dispatch({ type: "INIT_LOBBY", payload: { gameId: data.gameId , hostId: socket.id || ""} });
          resolve(data.gameId);
        } else {
          reject("Failed to create game");
        }
      });
    });
  };

  const joinLobby = async (gameId: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!socket) return reject("No socket connected");

      const username = loggedUserName;
      socket.emit("joinGame", { gameId, username });

      socket.once("gameJoined", (data: { success: boolean; error?: string }) => {
        if (data.success) resolve();
        else reject(data.error || "Failed to join game");
      });
    });
  };

  return (
    <GameContext.Provider
    value={{
      state,
        joinLobby,
        leaveLobby,
        toggleReady,
        startGame,
        createGame,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error("useGame must be used within a GameProvider")
  }
  return context
}