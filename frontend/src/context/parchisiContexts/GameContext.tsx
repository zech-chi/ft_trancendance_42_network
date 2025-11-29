"use client"

import { createContext, useContext, useReducer, type ReactNode, useEffect, use } from "react"
import { useSocket } from "./SocketContext"
import { useLoggedUserName } from "@/context/LoggedUserNameContext";
import { data } from "framer-motion/client";
import { CustomizationType } from "@/types/game";



interface Player {
  id: string
  userName: string
  isReady: boolean
  color: string
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
  gameId: string | null;
  gametype?: string | null;
  winner?: string | null;
  winnerColor?: string | null;
  theme: CustomizationType;
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
  | { type: "SET_WINNER"; payload: {winner: string, winnerColor: string} }
  | { type: "SET_THEME"; payload: CustomizationType }

const initialState: GameState = {
  lobby: null,
  currentPlayer: null,
  gameStarted: false,
  gameId: null,
  winner: null,
  winnerColor: null,
  theme: {
    theme_ds: 'sky',
    textureimage: "https://playground.babylonjs.com/"+"textures/skybox",
    istextureonline: true,
    showpic: '/parchisi_src/1337.jpg'
  }
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
      return { ...state, lobby: null, currentPlayer: null, gameStarted: false, gameId: null, winner: null, winnerColor: null }
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
            lobby:{
              ...state.lobby,
              players: action.payload.players
            },
            currentPlayer: action.payload.currentPlayer || null
          }
    case "SET_WINNER":
      return {
        ...state,
        winner: action.payload.winner,
        winnerColor: action.payload.winnerColor
      }
    case "SET_THEME":
        return {
          ...state,
          theme: action.payload
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
  createGame: (playernumber?: number) => Promise<string>
  setTheme: (theme: CustomizationType) => void;
  dispatch: React.Dispatch<GameAction>
}

const GameContext = createContext<GameContextType | null>(null)



export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const {loggedUserName, setLoggedUserName} = useLoggedUserName();
  const { socket, namespace } = useSocket()

  // Socket event listeners
  useEffect(() => {
    if (!socket || namespace != 'online') return

      state.gametype = 'online';
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
    window.location.href = "/gzone/games/parchisi";
  });
  socket.on("gameOver", (data: {winner: string, color: string}) => {
    dispatch({type:"SET_WINNER", payload: {winner: data.winner, winnerColor: data.color}});
  })

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
  }, [socket, namespace])

  useEffect(() => {
    if (!socket || namespace != 'local') return

    state.gametype = 'local';

    // Clear lobby when switching to local
    dispatch({ type: "CLEAR_LOBBY" });
    socket.on ("gameStarted", (data: { gameId: string }) => {
      dispatch({ type: "INIT_LOBBY", payload: { gameId: data.gameId, hostId: socket.id || "" } });

    })
    socket.on("error", ({ message }: { message: string }) => {
      console.error("Socket error:", message)
      alert(message)
    })
    socket.on("gameOver", (data: {winner: string, color: string}) => {
      console.log("Game over! Winner:", data.winner);
      dispatch({type:"SET_WINNER", payload: {winner: data.winner, winnerColor: data.color}});
    })
    
    return () => {
      
      dispatch({ type: "CLEAR_LOBBY" })
      socket.off("gameStarted")
      socket.off("gameOver")
      socket.off("error")
    }
  }, [socket, namespace])

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
  const createGame = async (playernumber?: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      
      if (!socket) return reject("No socket connected");
      
      state.gametype = namespace;
      console.log (`createGame with user : ${loggedUserName} in namespace ${namespace}`);
      const username = loggedUserName;
      const isLocal = namespace === "local";
      if (playernumber && (playernumber < 2 || playernumber > 4))
      {
        return reject("Invalid number of players");
      }
      else if (playernumber && (playernumber >= 2 && playernumber <= 4))
      {
        socket.emit("createGame", { username, playersnumber: playernumber });
      }
      else
      {
        socket.emit("createGame", { username });
      }
      const successEvent = isLocal ? "gameStarted" : "gameCreated";
      socket.once(successEvent, (data: { gameId: string }) => {
        if (data?.gameId) {
          dispatch({ type: "INIT_LOBBY", payload: { gameId: data.gameId , hostId: socket.id || ""} });
          resolve(data.gameId);
        } else {
          reject("Failed to create game");
        }
      });
      socket.once("error", (data: { message: string }) => {
        reject(data.message || "Failed to create game");
      }
      );
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
  
  const setTheme = (theme: CustomizationType) => {
    dispatch({ type: "SET_THEME", payload: theme });
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
        setTheme,
        dispatch,
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