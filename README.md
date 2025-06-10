## Project Structure
├── api-gateway/
│ ├── Dockerfile
│ ├── package.json
│ └── src/
│ └── index.js
├── user-service/
│ ├── Dockerfile
│ ├── package.json
│ └── src/
│ └── index.js
├── game-service/
│ ├── Dockerfile
│ ├── package.json
│ └── src/
│ └── index.js
├── ai-service/ (if chosen)
├── chat-service/ (if chosen)
├── frontend/
│ ├── package.json
│ └── src/ (TypeScript, HTML, CSS)
└── docker-compose.yml

## Front-end
frontend-app/
├── app/                      # App Router directory
│   ├── (auth)/               # Route group for authentication pages (unprotected)
│   │   ├── layout.tsx        # Optional layout specific to auth pages
│   │   ├── login/
│   │   │   └── page.tsx      # Login page component
│   │   ├── register/
│   │   │   └── page.tsx      # Registration page component
│   │   ├── google/
│   │   │   └── callback/     # Handles Google OAuth callback
│   │   │       └── page.tsx  # Page to process callback (might redirect)
│   │   ├── 2fa/
│   │   │   ├── setup/
│   │   │   │   └── page.tsx  # 2FA setup page
│   │   │   └── verify/
│   │   │       └── page.tsx  # 2FA verification page
│   ├── (main)/               # Route group for main application (protected)
│   │   ├── layout.tsx        # Main app layout (e.g., with Navbar, Sidebar)
│   │   ├── dashboard/
│   │   │   └── page.tsx      # Main dashboard after login
│   │   ├── game/
│   │   │   ├── pong/
│   │   │   │   └── page.tsx  # Pong game page
│   │   │   ├── [other-game]/ # If you add another game
│   │   │   │   └── page.tsx
│   │   │   ├── tournaments/
│   │   │   │   ├── page.tsx          # List of tournaments
│   │   │   │   └── [id]/page.tsx     # Specific tournament view
│   │   ├── profile/
│   │   │   ├── me/page.tsx   # Current user's profile
│   │   │   └── [userId]/     # Viewing another user's profile
│   │   │       └── page.tsx
│   │   ├── chat/
│   │   │   └── page.tsx      # Chat interface page
│   │   ├── settings/
│   │   │   └── page.tsx      # User settings page
│   ├── api/                    # Next.js API Routes (Backend for Frontend, or proxy)
│   │   ├── auth/
│   │   │   └── [...nextauth].ts # If using NextAuth.js (recommended for OAuth)
│   │   └── proxy/              # Optional: Proxy to your microservice API Gateway
│   │       └── [...path].ts
│   ├── layout.tsx            # Root layout for the entire application
│   ├── page.tsx              # Homepage (e.g., landing page before login)
│   ├── globals.css           # Global styles
│   └── loading.tsx           # Optional: Global loading UI
│   └── error.tsx             # Optional: Global error UI
├── components/
│   ├── ui/                   # Generic, reusable UI components (Button, Input, Modal, Card)
│   │   ├── Button.tsx
│   │   └── ...
│   ├── auth/                 # Authentication-specific components
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── GoogleSignInButton.tsx
│   ├── game/                 # Game-related components
│   │   ├── PongCanvas.tsx    # "use client"; Babylon.js integration here
│   │   ├── Scoreboard.tsx
│   │   └── TournamentBracket.tsx
│   ├── layout/               # Layout components (Navbar, Sidebar, Footer)
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── chat/                 # Chat components
│   │   ├── ChatWindow.tsx    # "use client"; WebSocket logic here
│   │   ├── MessageList.tsx
│   │   └── MessageInput.tsx
│   ├── profile/              # User profile components
│   │   ├── UserProfileCard.tsx
│   │   └── FriendList.tsx
│   └── common/               # Other shared components
├── lib/ or services/         # Utility functions, API service calls, constants
│   ├── apiClient.ts          # Configured Axios/fetch instance for backend calls
│   ├── auth.ts               # Authentication related functions/hooks (or use NextAuth.js)
│   ├── gameService.ts        # Functions to interact with the game microservice
│   ├── userService.ts        # Functions for user profile, friends, etc.
│   ├── chatService.ts        # WebSocket connection management
│   ├── babylon/              # Babylon.js specific setup, helpers, scene logic
│   │   ├── sceneManager.ts
│   │   └── ...
│   └── constants.ts          # App-wide constants
├── hooks/                    # Custom React Hooks
│   ├── useAuth.ts            # Hook to access auth state and actions
│   ├── useSocket.ts          # Hook for managing WebSocket connections
│   └── ...
├── contexts/ or store/       # Global state management (React Context, Zustand, Redux, etc.)
│   ├── AuthContext.tsx       # Example if using React Context for authentication state
│   └── ThemeContext.tsx      # Example for theme
├── public/                   # Static assets (images, fonts, favicon.ico)
│   ├── images/
│   └── fonts/
├── types/ or interfaces/     # TypeScript type definitions
│   ├── user.ts
│   ├── game.ts
│   ├── api.ts                # Types for API request/response payloads
│   └── index.ts
├── middleware.ts             # Next.js Middleware (for route protection)
├── next.config.js            # Next.js configuration file
├── tailwind.config.js        # If using Tailwind CSS
├── tsconfig.json             # TypeScript configuration
└── package.json
