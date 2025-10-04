parcheesi-backend/
│
├── package.json
├── tsconfig.json
├── .env                 # Environment variables (ports, secrets)
├── src/
│   ├── server.ts        # Entry point - starts Fastify & Socket.IO
│   ├── plugins/
│   │   ├── socketManager.ts   # Manages socket connections/events
│   │   └── gamePlugin.ts      # Fastify plugin for REST/game setup // to do later on 
│   ├── game/
│   │   ├── GameState.ts       # Class to store one game's state
│   │   ├── GameManager.ts     # Class to manage multiple games
│   │   └── gameLogic.ts       # Core functions (roll dice, move pieces)
│   ├── types/
│   │   ├── index.ts           # Shared types/enums (PlayerColor, MoveRequestType...)
│   ├── utils/
│   │   ├── logger.ts          # Chalk-based colored logger
│   │   └── random.ts          # Random dice generator
│   └── config/
│       └── index.ts           # Load env vars, constants
│
└── tests/
    ├── gameLogic.test.ts
    ├── gameManager.test.ts




export enum PlayerColor {
    RED = "RED",
    GREEN = "GREEN",
    YELLOW = "YELLOW",
    BLUE = "BLUE"
}

// send this to each player at first time:
addPlayer> {"color":"RED", "userName": "hunterGon"}
addPlayer> {"color":"GREEN", "userName": "saw"}
addPlayer> {"color":"YELLOW", "userName": "zech-chi"}
addPlayer> {"color":"BLUE", "userName": "killzold"}

setPlayerTurn> {"color": "RED"}

rollDices> {"color":"RED", "dice1": 1, "dice2": 5}

jump> {"sphere_id":1,"sphere_type":"RED","place":1,"where":"center","speed":1, "maxHeight": 5, "toStartPosition": false}

moveAble> {"sphere_id":1, "sphere_type":"RED", "choice1": 1, "choice2": 5}
moveAble> {"sphere_id":2, "sphere_type":"RED", "choice1": 1, "choice2": 5}
moveAble> {"sphere_id":3, "sphere_type":"RED", "choice1": 1}
// moveAble> {"sphere_id":4, "sphere_type":"RED", "choice1": 0, "choice2": 0}


requestMove> {"sphere_id":3, "sphere_type":"RED", "choice": 1}

move> {"sphere_id":1,"sphere_type":"RED","place":1,"where":"center","speed":1}