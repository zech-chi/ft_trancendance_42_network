// GameLogic.ts
import { start } from "repl";
import { Player, Piece, PlayerColor, BoardPosition, MoveDecision } from "../types";
import { Board } from "./Board";
import chalk from "chalk";



export class GameLogic {
  board: Board;

  constructor(board: Board) {
    this.board = board;
  }

  rollDice(): number[] {
    return [this.randomDice(), this.randomDice()];
  }

  private randomDice(): number {
    return Math.floor(Math.random() * 6) + 1;
  }

  /**
   * Decide which base pieces can leave given `dice`.
   * IMPORTANT: This mutates the `dice` array to remove used dice (so the GameRoom keeps correct remaining dice).
   *
   * Returns an array of { piece, moves } where moves is an array of dice values consumed for that piece (typically [5]).
   */
  pieceCanLeaveBase(player: Player, dice: number[]): { piece: Piece; moves: number[] }[] {
    const results: { piece: Piece; moves: number[] }[] = [];
    if (!dice || dice.length === 0) return results;

    // Use peekShared to inspect the start tile without mutating the board
    const startTile = this.board.peekShared(player.startIndex);
    const basePieces = player.pieces.filter(p => p.position === "base");
    if (basePieces.length === 0) return results;

    // Helper: remove first occurrence(s) of a value from dice array
    const removeDiceValue = (val: number, count = 1) => {
      for (let i = 0; i < count; i++) {
        const idx = dice.indexOf(val);
        if (idx !== -1) dice.splice(idx, 1);
      }
    };

    // Case: both dice are present and both are 5 (we require dice[0] & dice[1] to be 5 in original ordering)
    if (dice.length >= 2 && dice[0] === 5 && dice[1] === 5) {
      // if start tile is fully occupied (2 pieces), no one can leave
      if (startTile.occupants.length === 2) {
        // do NOT consume dice
        console.log(chalk.red(`Cannot leave base: start tile (${player.startIndex}) is full`));
        return results;
      }

      // If tile empty or occupied by enemies only (we will let leaving be possible; GameRoom will decide captures)
      if (startTile.occupants.length === 0 || startTile.occupants.every(o => o.playerId !== player.id)) {
        const allowedCount = Math.min(basePieces.length, 2);
      const allowedPieces = basePieces.slice(0, allowedCount);
      for (const p of allowedPieces) results.push({ piece: p, moves: [5] });
      // consume the correct number of dice , at most 2
      removeDiceValue(5, allowedCount);
      return results;
}
      // If there is exactly one friendly piece on start tile, allow only one piece to leave and consume one die
      if (startTile.occupants.length === 1 && startTile.occupants[0].playerId === player.id) {
        const p = basePieces[0];
        results.push({ piece: p, moves: [5] });
        removeDiceValue(5, 1);
        return results;
      }

      return results;
    }

    // Case: any single die equals 5
    const idx5 = dice.indexOf(5);
    if (idx5 !== -1) {
      const p = basePieces[0];
      if (!p) return results;
      if (startTile.occupants.length < 2) {
        results.push({ piece: p, moves: [5] });
        // remove the used die (first found 5)
        dice.splice(idx5, 1);
      }
      return results;
    }

    // Case: sum of dice equals 5 (e.g., 2 + 3 = 5)
    if (dice.length >= 2 && (dice[0] + dice[1] === 5)) {
      const p = basePieces[0];
      if (!p) return results;
      if (startTile.occupants.length < 2) {
        results.push({ piece: p, moves: [dice[0] + dice[1]] }); // still report moves = [5]
        // consume the two dice used
        dice.splice(0, 2);
      }
      return results;
    }

    // nothing
    return results;
  }

  /**
   * Return all available moves for pieces already on the board (not in base).
   * Does not mutate anything.
   */
  getAvailableMoves(player: Player, dice: number[]): { piece: Piece; moves: number[] }[] {
    const result: { piece: Piece; moves: number[] }[] = [];
    if (!dice || dice.length === 0) return result;

    for (const piece of player.pieces) {
      if (piece.position === "base" || piece.position === 'home') continue;

      const moves: number[] = [];
      for (const die of dice) {
        if (this.checkIfPieceCanMove(player, die, piece)) moves.push(die);

      }

      if (moves.length > 0) result.push({ piece, moves });
    }

    return result;
  }

  /**
   * Check if a piece can move `dice` steps.
   * - For shared path pieces: true if the target shared tile has fewer than 2 occupants.
   *  also check if there is blocked way to the dis
   * - NOTE: This function is intentionally conservative — it doesn't compute captures or home-path transitions.
   */
 checkIfPieceCanMove(player: Player, dice: number, piece?: Piece): boolean {
  const targetPiece = piece ?? player.pieces.find(p => p.position === "base" && dice === 5);
  if (!targetPiece) return false;

  const playerIndex = (player.id >= 1) ? player.id - 1 : player.id;
  const canTraverseHome = (remainingSteps: number): boolean => {
    if (remainingSteps <= 0) return false;
    if (remainingSteps > 7) return false; // home size is 8 insluding home (indices 0..7)
    const destHomeIdx = remainingSteps - 1; // 1 step -> homeIndex 0
    for (let h = 0; h <= destHomeIdx; h++) {
      const ht = this.board.peekHome(playerIndex, h);
      if (ht.occupants.length > 1) return false; // any occupant blocks
    }
    return true;
  };

  // If piece is on shared path -> check each intermediate tile + destination
  // then possibly transition into home path if the move reaches homeEntryIndex.

  if (typeof targetPiece.position === "number") {
    const start = targetPiece.position;
    const boardLen = this.board.sharedPath.length;
    // Special case: piece is already on the homeEntryIndex -> first step goes into home
    if (start === player.homeEntryIndex) {
      // all dice steps are used for home movement
      const remainingSteps = dice;
      return canTraverseHome(remainingSteps);
    }

    // Walk step-by-step to detect blockers and possible entering home
    for (let s = 1; s <= dice; s++) {
      const idx = (start + s) % boardLen;
      const sharedTile = this.board.peekShared(idx);

      // Case: we step ONTO the entry tile BEFORE finishing all steps -> next steps go into home
      if (idx === player.homeEntryIndex && s < dice) {
        // entry shared tile must not be a blocking stack
        if (sharedTile.occupants.length >= 2) return false;
        const remaining = dice - s; // steps that go into home
        return canTraverseHome(remaining);
      }

      // If this is an intermediate shared tile (not final), block if >= 2 occupants
      if (s < dice) {
        if (sharedTile.occupants.length >= 2) return false;
        continue; // go to next step
      }

      // s === dice -> destination is this shared tile (we did not enter home)
      // Destination rules:
      if (sharedTile.occupants.length >= 2) {
        return false; // cannot land on a tile with 2 pieces
      }
      if (sharedTile.occupants.length === 0) {
        return true; // empty -> OK
      }
      // occupants.length === 1
      const occupant = sharedTile.occupants[0];
      if (sharedTile.isSafe) {
        // on safe tile: allow if same-player sharing, otherwise cannot capture
        return occupant.playerId === player.id;
      } else {
        // not safe: capture opponent allowed; stacking your own piece is allowed
        return true;
      }
    } // end for

    // fallback (shouldn't reach)
    return false;
  }

  else if (typeof targetPiece.position === 'object')
    {
          const homeIdx = dice + targetPiece.position.homeIndex;
          if (homeIdx <= 0 || homeIdx > 7) return false;
          //read those after 
          // 1) Check all shared tiles we've traversed BEFORE entering home (they were checked while looping)
          //    (we already checked each step up to this idx below, so no extra check needed here)
          
          // 2) Check each home tile along the path up to the destination (0..homeIndex-1)
          //    If any of those home tiles is occupied by more thhan 2 -> blocked (can't skip or pass)
          for(let i = targetPiece.position.homeIndex + 1 ; i < homeIdx; i++){
            const homeTile = this.board.peekHome(player.id - 1 , i);
            if (homeTile.occupants.length > 1) return false;
          }

          if (homeIdx === 7)
              return true;
          const  homedest = this.board.peekHome(player.id -1 , homeIdx);
          if (homedest.occupants.length > 1) return false;
          return true;
    }

  // If piece is in base and dice === 5 -> check start tile only
  if (targetPiece.position === "base" && dice === 5) {
    const startTile = this.board.peekShared(player.startIndex);
    // blocked if start tile has 2 or more pieces
    if (startTile.occupants.length >= 2) return false;
    // if start has 1 occupant and it's same player and stacking is forbidden -> blocked
    if (startTile.occupants.length === 1 && startTile.occupants[0].playerId === player.id) {
      // adapt if you allow stacking your own pieces on start
      return false;
    }
    return true;
  }

  // Home-path / goal logic not handled here (return false). Extend when needed.
  return false;
}


  movePieceDecision(player: Player, piece: Piece, steps: number): MoveDecision {
    const from = piece.position as BoardPosition | undefined;
    const playerIndex = (player.id >= 1) ? player.id - 1 : player.id; // convert 1..4 -> 0..3
    const placeTojump:BoardPosition[] = [];
    // Helper to return a disallowed decision
    const disallowed = (reason: string) => ({
      piece,
      from,
      to: piece.position as BoardPosition,
      path: [] as BoardPosition[],
      capture:{} as { id: number; playerId: number; position: BoardPosition } | null,
      allowed: false,
      reason
    });
  
    // Leaving base -> go to startIndex (only when steps===5 handled here)
    if (piece.position === "base" && steps === 5) {
      const targetIndex = player.startIndex;
      const targetTile = this.board.peekShared(targetIndex);
      const capture = this._detectCapturesOnTile(player, targetTile, targetIndex);
      return {
        piece,
        from,
        to: targetIndex,
        path: [targetIndex],
        capture,
        allowed: targetTile.occupants.length < 2 || capture !== null,
        reason: capture !== null ? "capture" : undefined
      };
    }
  
    const path: BoardPosition[] = [];
    let destPosition: BoardPosition | undefined = undefined;
  
    // Moving along shared path (may enter home)
    if (typeof piece.position === "number") {
      const start = piece.position;
      const boardLen = this.board.sharedPath.length;
  
      // Special case: piece currently standing on the entry tile -> first step goes into home
      if (start === player.homeEntryIndex) {
        // all steps are used inside home
        const remaining = steps;
        if (remaining > 8) return disallowed("overshoot-home");
        // check home tiles 0..remaining-1 (remaining may be 8 -> final goal)
        for (let h = 0; h < remaining; h++) {
          if (h <= 6) {
            const ht = this.board.peekHome(playerIndex, h);
            if (ht.occupants.length > 1) return disallowed(`blocked-in-home-at-${h}`);
            else if (ht.occupants.length === 1)
            {
              placeTojump.push({homeIndex : h});
            }
            path.push({ homeIndex: h });
          } else {
            // h === 7 means final goal

            path.push("home");
            
          }
        }
        destPosition = path[path.length - 1];
        return { piece, from, to: destPosition!, path, capture: null, allowed: true, placeTojump };
      }
  
      // Walk the shared steps one-by-one
      for (let s = 1; s <= steps; s++) {
        const idx = (start + s) % boardLen;
        const sharedTile = this.board.peekShared(idx);
  
        // If we land on the entry tile BEFORE finishing steps -> we will enter home
        if (idx === player.homeEntryIndex && s < steps) {
          // entry tile may not be a blocking stack
          if (sharedTile.occupants.length >= 2) return disallowed(`blocked-on-shared-entry-${idx}`);
          if (sharedTile.occupants.length === 1)
          {
            placeTojump.push(idx);
          }
          path.push(idx); // include the entry shared tile in the path
      
          const remaining = steps - s; // steps that will be applied inside home
          if (remaining > 7) return disallowed("overshoot-home");
  
          // Check all home tiles we must pass/land on: homeIndex 0 .. remaining-1 (remaining may be 8 => final goal)
          for (let h = 0; h < remaining; h++) {
            if (h <= 6) {
              const ht = this.board.peekHome(playerIndex, h);
              if (ht.occupants.length > 1) return disallowed(`blocked-in-home-at-${h}`);
              path.push({ homeIndex: h });
              if (ht.occupants.length === 1)
              {
                placeTojump.push({homeIndex : h});
              }
            } else {
              // final goal
              path.push("home");
            }
          }
          destPosition = path[path.length - 1];
          return { piece, from, to: destPosition!, path, capture: null, allowed: true, placeTojump };
        }
  
        // Not entering home at this step -> check blocking for intermediate tiles
        if (s < steps) {
          if (sharedTile.occupants.length >= 2) return disallowed(`blocked-on-shared-at-${idx}`);
          if (sharedTile.occupants.length === 1)
          {
            placeTojump.push(idx);
          }
          path.push(idx);
          continue;
        }
  
        // s === steps -> destination is this shared tile (we did NOT enter home)
        if (sharedTile.occupants.length >= 2) return disallowed(`destination-blocked-shared-${idx}`);
  
        const capture = this._detectCapturesOnTile(player, sharedTile, idx);
        destPosition = idx;
        path.push(idx);
        return {
          piece,
          from,
          to: destPosition,
          path,
          capture,
          allowed: sharedTile.occupants.length < 2 || capture !== null,
          reason: capture !== null ? "capture" : undefined,
          placeTojump
        };
      }
  
      // fallback (shouldn't reach)
      return disallowed("unhandled-shared-path");
    }
  
    // Moving inside home path (piece.position is { homeIndex })
    if (typeof piece.position === "object" && 'homeIndex' in piece.position) {
      const currentHomeIndex = piece.position.homeIndex; // 0..6
      // steps allowed: landing at final goal when currentHomeIndex + steps === 7
      if (currentHomeIndex + steps > 7) return disallowed("overshoot-home");
      // build path: for i = 1..steps -> targetHome = currentHomeIndex + i
      for (let i = 1; i <= steps; i++) {
        const target = currentHomeIndex + i;
        if (target <= 6) {
          const ht = this.board.peekHome(playerIndex, target);
          if (ht.occupants.length > 1) return disallowed(`blocked-in-home-at-${target}`);
          path.push({ homeIndex: target });
          if (ht.occupants.length === 1)
          {
            placeTojump.push({homeIndex:target});
          }
        } else {
          // target === 7 -> final goal
          path.push("home");
        }
      }
      destPosition = path[path.length - 1];
      return {
        piece,
        from,
        to: destPosition!,
        path,
        capture: null,
        allowed: true,
        placeTojump
      };
    }
  
    // Other positions unsupported
    return {
      piece,
      from,
      to: piece.position as BoardPosition,
      path: [],
      capture: null,
      allowed: false,
      reason: "unsupported-position"
    };
  }
  
  /**
   * Helper to detect opponent pieces on a target shared tile that should be captured.
   * Returns list of opponent references (id, playerId, position).
   *
   * NOTE: We do NOT remove them here. We only return the list so GameRoom can act.
   */
  //logic for capturing multiple pieces on safe tiles more understanding
  
  private _detectCapturesOnTile(
    player: Player,
    tileInfo: ReturnType<Board["peekShared"]>,
    tileIndex: number
  ): { id: number; playerId: number; position: BoardPosition } | null {
    if (tileInfo.occupants.length === 0) return null;
    if (tileInfo.occupants.length === 1) {
      const occupant = tileInfo.occupants[0];
      if (
        (tileInfo.isSafe && tileInfo.toWhom === player.color && occupant.playerId !== player.id) ||
        (!tileInfo.isSafe && occupant.playerId !== player.id)
      ) {
        return { id: occupant.id, playerId: occupant.playerId, position: tileIndex };
      }
      return null;
    }
    return null;
  }
}







