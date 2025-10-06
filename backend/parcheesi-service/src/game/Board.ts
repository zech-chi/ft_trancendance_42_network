// Board.ts
import chalk from "chalk";
import { colors } from "../config";
import {
  SharedTile, Piece, Player, PlayerColor,
  HomeTile, HomePath, GoalTile, BaseArea, BoardPosition
} from "../types";

/**
 * A minimal board that only stores state and exposes simple, deterministic
 * atomic operations. Game rules and side-effects belong to GameLogic/GameRoom.
 */
export class Board {
  sharedPath: SharedTile[];    // 68 shared tiles (0..67)
  homePaths: HomePath[];       // 4 players, each has 7 home tiles (keeps Hometile field for compatibility)
  bases: BaseArea[];           // 4 bases (one per player)
  goals: GoalTile[];           // 4 final goals (one per player)

  constructor() {
    this.sharedPath = this.initializeSharedPath();
    this.homePaths = this.initializeHomePaths();
    this.bases = this.initializeBases();
    this.goals = this.initializeGoals();
  }

  /* ----------------------------
   * Initialization helpers
   * ---------------------------- */

  private initializeSharedPath(): SharedTile[] {
    const safeIndices = [0, 7, 12, 17, 24, 29, 34, 41, 46, 51, 58, 63];
    return Array.from({ length: 68 }, (_, index) => ({
      index,
      isSafe: safeIndices.includes(index),
      toWhom: 'all',
      occupiedBy: [],
    }));
  }

  private initializeHomePaths(): HomePath[] {
    return Array.from({ length: 4 }, (_, playerIndex) => ({
      Hometile: Array.from({ length: 7 }, (_, step) => ({
        index: step,
        playerId: playerIndex,
        color: colors[playerIndex],
        occupiedBy: [],
      })),
    }));
  }

  private initializeBases(): BaseArea[] {
    return Array.from({ length: 4 }, (_, playerId) => ({
      type: 'base' as const,
      playerId,
      color: colors[playerId],
      pieces: [],
    }));
  }

  private initializeGoals(): GoalTile[] {
    return Array.from({ length: 4 }, (_, playerId) => ({
      type: 'goal' as const,
      playerId,
      color: colors[playerId],
      occupiedBy: [],
    }));
  }

  /* ----------------------------
   * Low-level getters
   * ---------------------------- */

  private getShared(idx: number) { return this.sharedPath[idx]; }
  private getHome(playerIdx: number) { return this.homePaths[playerIdx]; }
  private getBase(playerIdx: number) { return this.bases[playerIdx]; }
  private getGoal(playerIdx: number) { return this.goals[playerIdx]; }

  isValidSharedIndex(idx: number) {
    return Number.isInteger(idx) && idx >= 0 && idx < this.sharedPath.length;
  }
  isValidHomeIndex(homeIndex: number) {
    return Number.isInteger(homeIndex) && homeIndex >= 0 && homeIndex < 7;
  }

  /* ----------------------------
   * Peek helpers (read-only queries)
   * ---------------------------- */

  /**
   * Return a shallow copy of occupants and metadata for a shared tile.
   * Does not mutate state.
   */
  peekShared(index: number) {
    if (!this.isValidSharedIndex(index)) throw new Error(`Shared index ${index} out of bounds`);
    const tile = this.getShared(index);
    return {
      index: tile.index,
      isSafe: tile.isSafe,
      toWhom: tile.toWhom,
      occupants: [...tile.occupiedBy], // shallow copy
    };
  }

  /**
   * Return a shallow copy of the given player's home tile.
   * playerId is required.
   */
  peekHome(playerIdx: number, homeIndex: number) {
    if (playerIdx < 0 || playerIdx >= 4) throw new Error(`Invalid playerIdx ${playerIdx}`);
    if (!this.isValidHomeIndex(homeIndex)) throw new Error(`Home index ${homeIndex} out of bounds`);
    const tile = this.getHome(playerIdx).Hometile[homeIndex];
    return { ...tile, occupants: [...tile.occupiedBy] };
  }

  peekBase(playerIdx: number) {
    if (playerIdx < 0 || playerIdx >= this.bases.length) throw new Error(`Invalid playerIdx ${playerIdx}`);
    return { ...this.getBase(playerIdx), pieces: [...this.getBase(playerIdx).pieces] };
  }

  peekGoal(playerIdx: number) {
    if (playerIdx < 0 || playerIdx >= this.goals.length) throw new Error(`Invalid playerIdx ${playerIdx}`);
    return { ...this.getGoal(playerIdx), occupants: [...this.getGoal(playerIdx).occupiedBy] };
  }


  /**
   * this function to get a tile by position
   * returns the tile and its type (shared, home, base, goal)
   * or undefined if not found
   * it shoud use the low-level getters and peek helpers
   */
  getTileByPosition(position: BoardPosition, playerid:number = 0): {postions: SharedTile | GoalTile| HomePath | BaseArea |undefined} {
    if (typeof position === 'number') {
      if (!this.isValidSharedIndex(position)) return {postions: undefined};
      return {postions: this.getShared(position)}; 
    }
    if (position === 'base' ) {
      return {postions: this.getBase(0)}; // playerId is not used here
    }
    if (position === 'home') {
      return {postions: this.getGoal(0)}; // playerId is not used here
    }
    if (typeof position === 'object' && 'homeIndex' in position) {
      const hi = position.homeIndex;
      if (!this.isValidHomeIndex(hi)) return {postions: undefined};
      return {postions: this.getHome(playerid)}; // playerId is required here
    }
    return {postions: undefined};
  }


  /* ----------------------------
   * Atomic mutation operations (no game rules)
   * ---------------------------- */

  /**
   * Remove piece from its current position if present.
   * Returns true if piece was removed, false otherwise.
   */
  removePieceAtomic(piece: Piece): boolean {
    const pos = piece.position;
    if (pos === undefined || pos === null) return false;

    if (typeof pos === 'number') {
      if (!this.isValidSharedIndex(pos)) return false;
      const tile = this.getShared(pos);
      const before = tile.occupiedBy.length;
      tile.occupiedBy = tile.occupiedBy.filter(p => !(p.id === piece.id && p.playerId === piece.playerId));
      piece.position = undefined as any; // caller will set new position explicitly
      return tile.occupiedBy.length !== before;
    }

    if (pos === 'base') {
      const base = this.getBase(piece.playerId - 1);
      const before = base.pieces.length;
      base.pieces = base.pieces.filter(p => !(p.id === piece.id && p.playerId === piece.playerId));
      piece.position = undefined as any;
      return base.pieces.length !== before;
    }

    if (pos === 'home') {
      const goal = this.getGoal(piece.playerId - 1);
      const before = goal.occupiedBy.length;
      goal.occupiedBy = goal.occupiedBy.filter(p => !(p.id === piece.id && p.playerId === piece.playerId));
      piece.position = undefined as any;
      return goal.occupiedBy.length !== before;
    }

    if (typeof pos === 'object' && 'homeIndex' in pos) {
      const hi = pos.homeIndex;
      if (!this.isValidHomeIndex(hi)) return false;
      const tile = this.getHome(piece.playerId - 1).Hometile[hi];
      const before = tile.occupiedBy.length;
      tile.occupiedBy = tile.occupiedBy.filter(p => !(p.id === piece.id && p.playerId === piece.playerId));
      piece.position = undefined as any;
      return tile.occupiedBy.length !== before;
    }

    return false;
  }

  /**
   * Add piece to a target position *without* removing other occupants.
   * Returns info about the target tile before insertion so caller can decide what to do.
   *
   * Note: piece.position is updated to the new position by this method.
   */
  addPieceAtomic(piece: Piece, position: BoardPosition): {
    previousPosition: BoardPosition | undefined;
    targetOccupantsBefore: Piece[];
    overflowWarning: boolean; // true if occupancy exceeds typical limit (eg. >2) after insertion
  } {
    const prevPos = piece.position;
    // For safety, we do NOT automatically remove piece from previous position.
    // Caller should call removePieceAtomic(prev) before addPieceAtomic if needed.
    // But to keep pieces consistent, we still clear the previous reference if it exists:
    // (Optionally you can remove this automatic clear and force caller to call remove).
    // Here we choose to clear the previous position field only (not remove from arrays).
    piece.position = undefined as any;

    // SHARED
    if (typeof position === 'number') {
      if (!this.isValidSharedIndex(position)) throw new Error(`Shared index ${position} out of bounds`);
      const tile = this.getShared(position);
      const before = [...tile.occupiedBy];
      tile.occupiedBy.push(piece);
      piece.position = position;
      return {
        previousPosition: prevPos,
        targetOccupantsBefore: before,
        overflowWarning: tile.occupiedBy.length > 2
      };
    }

    // BASE
    if (position === 'base') {
      const base = this.getBase(piece.playerId - 1);
      const before = [...base.pieces];
      base.pieces.push(piece);
      piece.position = 'base';
      return { previousPosition: prevPos, targetOccupantsBefore: before, overflowWarning: base.pieces.length > 4 };
    }

    // GOAL
    if (position === 'home') {
      const goal = this.getGoal(piece.playerId - 1);
      const before = [...goal.occupiedBy];
      goal.occupiedBy.push(piece);
      piece.position = 'home';
      return { previousPosition: prevPos, targetOccupantsBefore: before, overflowWarning: false };
    }

    // HOME PATH
    if (typeof position === 'object' && 'homeIndex' in position) {
      const hi = position.homeIndex;
      if (!this.isValidHomeIndex(hi)) throw new Error(`Home index ${hi} out of bounds`);
      const tile = this.getHome(piece.playerId -1).Hometile[hi];
      const before = [...tile.occupiedBy];
      tile.occupiedBy.push(piece);
      piece.position = position;
      return { previousPosition: prevPos, targetOccupantsBefore: before, overflowWarning: tile.occupiedBy.length > 2 };
    }

    throw new Error('Unsupported position variant');
  }

  /**
   * Move a piece atomically: remove from previous position and add to target.
   * Returns the same object as addPieceAtomic, plus a list of removedPieces (from the previous tile)
   * This still does NOT perform captures — it only moves the piece.
   */
  movePieceAtomic(piece: Piece, target: BoardPosition): {
    removedFromPrevious: boolean;
    addResult: ReturnType<Board['addPieceAtomic']>;
  } {
    const prevPos = piece.position;
    const removed = this.removePieceAtomic(piece);
    const addResult = this.addPieceAtomic(piece, target);
    addResult.previousPosition = prevPos; // preserve original previous position from before removal cause the one camming from add is now undefined
    return { removedFromPrevious: removed, addResult };
  }

  /* ----------------------------
   * Helpers for convenience or integration
   * (these are thin wrappers you can call from GameLogic)
   * ---------------------------- */

  /**
   * Find a piece anywhere on the board (returns reference).
   * Useful for GameLogic to locate a piece.
   */
  findPiece(playerId: number, pieceId: number): Piece | undefined {
    // base
    const base = this.getBase(playerId - 1);
    const p = base.pieces.find(x => x.id === pieceId && x.playerId === playerId);
    if (p) return p;

    // home/goal
    const goal = this.getGoal(playerId - 1).occupiedBy.find(x => x.id === pieceId && x.playerId === playerId);
    if (goal) return goal;

    // home path
    for (const ht of this.getHome(playerId - 1).Hometile) {
      const h = ht.occupiedBy.find(x => x.id === pieceId && x.playerId === playerId);
      if (h) return h;
    }

    // shared
    for (const s of this.sharedPath) {
      const sP = s.occupiedBy.find(x => x.id === pieceId && x.playerId === playerId);
      if (sP) return sP;
    }

    return undefined;
  }

  /**
   * Set the 'toWhom' for the starting shared tile of the player.
   */
  setToWhom(player: Player) {
    const idx = player.startIndex;
    this.getShared(idx).toWhom = player.color;
  }

  setStartIndex(color: PlayerColor): number {
    const index = { RED: 0, GREEN: 17, YELLOW: 34, BLUE: 51 } as const;
    return index[color];
  }

  setHomeEntryIndex(color: PlayerColor): number {
    const index = { RED: 63, GREEN: 12, YELLOW: 29, BLUE: 46 } as const;
    return index[color];
  }

  toJSON() {
    return {
      sharedPath: this.sharedPath.map(tile => ({
        index: tile.index,
        isSafe: tile.isSafe,
        toWhom: tile.toWhom,
        occupiedBy: tile.occupiedBy.map(p => ({ id: p.id, playerId: p.playerId })),
      })),
      homePaths: this.homePaths.map(hp => ({
        Hometile: hp.Hometile.map(tile => ({
          index: tile.index,
          playerId: tile.playerId,
          color: tile.color,
          occupiedBy: tile.occupiedBy.map(p => ({ id: p.id, playerId: p.playerId })),
        })),
      })),
      bases: this.bases.map(base => ({
        type: base.type,
        playerId: base.playerId,
        color: base.color,
        pieces: base.pieces.map(p => ({ id: p.id, playerId: p.playerId })),
      })),
      goals: this.goals.map(goal => ({
        type: goal.type,
        playerId: goal.playerId,
        color: goal.color,
        occupiedBy: goal.occupiedBy.map(p => ({ id: p.id, playerId: p.playerId })),
      })),
    };
  }

  getTileoccupants(position: BoardPosition, playerId: number = 1): Piece[] {
    if (typeof position === 'number') {
      if (!this.isValidSharedIndex(position)) return [];
      return [...this.getShared(position).occupiedBy]; // shallow copy
    }
    if (position === 'base') {
      return [...this.getBase(playerId - 1).pieces]; // playerId is required here
    }
    if (position === 'home') {
      return [...this.getGoal(playerId - 1).occupiedBy]; // playerId is required here
    }
    if (typeof position === 'object' && 'homeIndex' in position) {
      const hi = position.homeIndex;
      if (!this.isValidHomeIndex(hi)) return [];
      return [...this.getHome(playerId - 1).Hometile[hi].occupiedBy]; // playerId is required here
    }
    return [];
  }

}


