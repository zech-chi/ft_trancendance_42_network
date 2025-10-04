#!/bin/bash
# setup.sh - Create initial project file and directory structure

echo "🚀 Setting up project structure..."

# Create directories
mkdir -p src/{app/{local,ai,online/lobby,tournament,game/[id]},components/{game,ui},hooks,contexts,utils,types}

# Create files in app
touch src/app/layout.tsx \
      src/app/page.tsx \
      src/app/local/page.tsx \
      src/app/ai/page.tsx \
      src/app/online/page.tsx \
      src/app/online/lobby/page.tsx \
      src/app/tournament/page.tsx \
      src/app/game/[id]/page.tsx

# Create component files
touch src/components/game/{Board.tsx,Dice.tsx,Piece.tsx,Controls.tsx,StatusPanel.tsx,LobbyBrowser.tsx,TournamentBracket.tsx}
touch src/components/ui/{Modal.tsx,Button.tsx,Loader.tsx,Card.tsx}

# Create hooks
touch src/hooks/{useGameSocket.ts,useGameState.ts,useDiceRoll.ts,useMultiplayer.ts,useAIGame.ts}

# Create contexts
touch src/contexts/{GameContext.tsx,SocketContext.tsx}

# Create utils
touch src/utils/{api.ts,socket.ts,gameHelpers.ts,constants.ts}

# Create types
touch src/types/{game.ts,api.ts,socket.ts}

echo "✅ Project structure created successfully!"
