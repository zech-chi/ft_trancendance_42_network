// Game constants
export const BOARD_SIZE = 52; // Number of spaces on the board
export const PLAYER_COLORS = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B']; // Red, Blue, Green, Orange
export const START_POSITIONS = [0, 13, 26, 39]; // Starting positions for each player
export const HOME_ENTRANCE = [50, 11, 24, 37]; // Entrance to home stretch for each player
export const HOME_POSITIONS = [52, 53, 54, 55]; // Final home positions

// Socket events
export const SOCKET_EVENTS = {
  // Client to server
  CREATE_GAME: 'create_game',
  JOIN_GAME: 'join_game',
  LEAVE_GAME: 'leave_game',
  START_GAME: 'start_game',
  ROLL_DICE: 'roll_dice',
  MOVE_PIECE: 'move_piece',
  END_TURN: 'end_turn',
  
  // Server to client
  GAME_CREATED: 'game_created',
  PLAYER_JOINED: 'player_joined',
  PLAYER_LEFT: 'player_left',
  GAME_STARTED: 'game_started',
  DICE_ROLLED: 'dice_rolled',
  PIECE_MOVED: 'piece_moved',
  TURN_ENDED: 'turn_ended',
  GAME_STATE_UPDATED: 'game_state_updated',
  GAME_OVER: 'game_over',
  ERROR: 'error'
};

// Game modes
export const GAME_MODES = {
  LOCAL: 'local',
  AI: 'ai',
  ONLINE: 'online',
  TOURNAMENT: 'tournament'
};