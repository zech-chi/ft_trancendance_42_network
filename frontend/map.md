my-parshichi-frontend/
├─ app/
│  ├─ layout.tsx           # Shared layout (header, footer, common styles)
│  ├─ page.tsx             # Homepage: choose mode (Local, AI, Online, Tournament)
│  ├─ local/
│  │  └─ page.tsx          # Local mode page: display board, controls
│  ├─ ai/
│  │  └─ page.tsx          # AI mode page
│  ├─ online/
│  │  └─ page.tsx          # Online multiplayer page
│  ├─ tournament/
│  │  └─ page.tsx          # Tournament mode page
│  └─ tutorial/
│     └─ page.tsx          # Tutorial page (optional)
│
├─ components/
│  ├─ Header.tsx           # Header with navigation buttons
│  ├─ Footer.tsx           # Footer
│  ├─ GameBoard.tsx        # Board visual component
│  ├─ PlayerPiece.tsx      # Each player's piece
│  ├─ Dice.tsx             # Dice visual and animation
│  ├─ GameControls.tsx     # Roll dice, move buttons, end turn, etc.
│  ├─ ModeCard.tsx         # Card on homepage for each mode
│  └─ Loader.tsx           # Loading spinner / visual feedback
│
├─ hooks/
│  ├─ useGameState.ts      # Custom hook: fetch game state, refresh, errors
│  └─ useDice.ts           # Dice animation / frontend dice UX (purely visual)
│
├─ utils/
│  ├─ api.ts               # Functions to call backend (fetch / WebSocket)
│  ├─ constants.ts         # Constants like board size, player colors
│  └─ helpers.ts           # Helper functions for frontend checks, formatting
│
├─ styles/
│  └─ globals.css          # Tailwind imports + global styles
│
├─ types/
│  ├─ game.ts              # Types for Game, Player, Piece, Move
│  └─ api.ts               # Types for API responses
│
├─ public/
│  └─ images/              # Dice images, piece images, background images
│
├─ next.config.js
├─ tsconfig.json
└─ package.json



src/
  app/
    layout.tsx              # Root layout with providers
    page.tsx                # Homepage with mode selection
    local/
      page.tsx              # Local multiplayer game
    ai/
      page.tsx              # Play against AI
    online/
      page.tsx              # Online multiplayer
      lobby/ 
      /[id]               # Online lobby components
        page.tsx
    tournament/
      page.tsx              # Tournament mode
    game/
      [id]/                 # Dynamic route for specific games
        page.tsx
  components/
    game/
      Board.tsx             # Main game board
      Dice.tsx              # Dice component with animations
      Piece.tsx             # Player piece with movement
      Controls.tsx           # Game action controls
      StatusPanel.tsx        # Game state and player info
      LobbyBrowser.tsx       # Online lobby list
      TournamentBracket.tsx  # Tournament visualization
    ui/
      Modal.tsx             # Reusable modal
      Button.tsx            # Styled button component
      Loader.tsx            # Loading animation
      Card.tsx              # Card component
  hooks/
    useGameSocket.ts        # Socket.IO connection management
    useGameState.ts         # Game state management
    useDiceRoll.ts          # Dice roll animations
    useMultiplayer.ts       # Online game logic
    useAIGame.ts            # AI game logic
  contexts/
    GameContext.tsx         # Game state context
    SocketContext.tsx       # Socket connection context
  utils/
    api.ts                  # API client functions
    socket.ts               # Socket event handlers
    gameHelpers.ts          # Game-specific helpers
    constants.ts            # Game constants
  types/
    game.ts                 # TypeScript interfaces
    api.ts                  # API response types
    socket.ts               # Socket event types

