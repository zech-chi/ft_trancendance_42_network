
// GameRoom.ts
import { Namespace, Server, Socket } from "socket.io";

import { Player, PlayerColor, Piece, MoveDecision, BoardPosition } from "../types";
import { Board } from "./Board";
import { GameLogic } from "./gameLogic";
import chalk from "chalk";
import { describe } from "node:test";

const COLORS = [PlayerColor.RED, PlayerColor.YELLOW, PlayerColor.GREEN, PlayerColor.BLUE];

export class GameRoom {
  id: string;
  players: Player[] = [];
  sockets: Map<number, Socket> = new Map();
  board: Board;
  logic: GameLogic;
  currentPlayerIndex: number;
  readyPlayers: number = 0;

  currentDice: number[] = [];
  bonusDice: number = 0;
  gamestarted: boolean = false;
  gameOver: boolean = false;
  namespaceIO: Namespace;
  onGameOver?: (roomId: string) => void;


  constructor(roomId: string, namespace: Namespace) {
    this.id = roomId;
    this.board = new Board();
    this.logic = new GameLogic(this.board);
    this.currentPlayerIndex = 0;
    this.namespaceIO = namespace;

  }
    destroy() {
    // clear players
    this.players = [];

    // clear sockets and disconnect
    this.sockets.forEach((socket) => {
      socket.disconnect(true);
    });
    this.sockets.clear();

    // clear board and logic references
    this.board = null as any;
    this.logic = null as any;

    // clear dice and reset state
    this.currentDice = [];
    this.bonusDice = 0;
    this.gamestarted = false;
    this.gameOver = true;
  }

  newPlayer(username: string): Player {
    const color = COLORS[this.players.length];
    const newPlayerId = this.players.length + 1;
    const player: Player = {
      id: newPlayerId,
      userName: username ,
      color,
      pieces: [
        { id: 1, playerId: newPlayerId, position: "base" },
        { id: 2, playerId: newPlayerId, position: "base" },
        { id: 3, playerId: newPlayerId, position: "base" },
        { id: 4, playerId: newPlayerId, position: "base" }
      ],
      startIndex: this.board.setStartIndex(color),
      homeEntryIndex: this.board.setHomeEntryIndex(color),
      Remain_moves: [],
      bonus_moves: [],
      isReady: false,
    };
    this.board.setToWhom(player);
    return player;
  }

  addPlayer(player: Player, socket: Socket): boolean {
    if (this.players.length >= 4) return false;
    this.players.push(player);
    this.sockets.set(player.id, socket);
    return true;
  }

  broadcast(event: string, data: any) {
    this.namespaceIO.to(this.id).emit(event, data);
  }

  async startGame() {
    this.gamestarted = true;
  
    // send players info to clients after 1 second
    this.players.forEach(p => {
        this.broadcast("addPlayer", {
          id: p.id,
          userName: p.userName,
          color: p.color,
        });
      });

  
    console.log(chalk.red(
      `Game ${this.id} started with players: ${this.players.map(p => p.userName).join(", ")}`
    ));
  
    // set first player turn
    setTimeout(() => {
      this.broadcast("setPlayerTurn", { color: this.currentPlayer.color });
    }, 3000);
  }

  /**
   * Broadcast a single step move for animation (keeps your original event format).
   * `where` and `speed` preserved from your previous code.
   */
  private async emitMoveEvent(piece: Piece, color: PlayerColor, place: number | 'base' | 'home' | { homeIndex: number }, where: 'center'|'left'|'right' = 'center', speed = 2, delayMs = 400) {
    let se7en: boolean = false;
    let final: boolean = false;
    let placeofbr:number = 0;
    if (typeof place === 'number')
      {
        place += 1;
        placeofbr = place;
      }
    if (typeof place === 'object')
    {
      placeofbr = place.homeIndex + 1;
       se7en = true;
    }else if ( place === 'home')
    {
      final = true;
      this.bonusDice = 10;
      placeofbr = this.board.peekGoal(piece.playerId - 1).occupiedBy.length;
      where = 'center';
    }
    console.log("emitting move eventt to tile :", placeofbr);
    this.broadcast("move", {
      sphere_id: piece.id,
      sphere_type: color,
      place:placeofbr,
      where,
      speed,
      se7en,
      final,
    });
    await new Promise(resolve => setTimeout(resolve, delayMs));
  }
  // jump> {"sphere_id":1,"sphere_type":"RED","place":1,"where":"center","speed":1, "maxHeight": 5, "toStartPosition": false}

  
private async emitJumpEvent(piece: Piece, color: PlayerColor, place: number | 'base' | 'home' | { homeIndex: number }, where: 'center'|'left'|'right' = 'center', speed = 2, toStartPosition = false, delayMs = 500) {
    let se7en: boolean = false;
    let final: boolean = false;
    let placeofbr:number = 0;
    let maxHeight = 7;
    if (typeof place === 'number')
      {
        place += 1;
        placeofbr = place;
      }
    if (typeof place === 'object')
    {
      placeofbr = place.homeIndex + 1;
      se7en = true;
    }else if ( place === 'home')
    {
      final = true;
      this.bonusDice = 10;
      placeofbr = this.board.peekGoal(piece.playerId - 1).occupiedBy.length;
      where = 'center';
    }
    this.broadcast("jump", {
      sphere_id: piece.id,
      sphere_type: color,
      place:placeofbr,
      where,
      speed,
      se7en,
      final,
      maxHeight,
      toStartPosition
    });
    await new Promise(resolve => setTimeout(resolve, delayMs));
  }



  /**
   * Execute captures (do not call GameLogic to capture — GameLogic only detected them).
   * Returns list of captured piece refs (after being moved to base).
   */
  private executeCaptures(capture: { id: number; playerId: number; position: any }, actorColor: PlayerColor) {
  

      const target = this.board.findPiece(capture.playerId, capture.id);
      if (!target) return;
      // remove from its tile and place to its base
      this.board.removePieceAtomic(target);
      this.board.addPieceAtomic(target, 'base');
      // broadcast move of captured piece to base (animation)
      this.emitJumpEvent(target, actorColor, 'base', 'center', 2, true);
      this.bonusDice = 20;
    return target;
  }


  private async executeMoveDecision(decision: MoveDecision) {
    const playerColor = this.players.find(p => p.id === decision.piece.playerId)?.color ?? decision.piece.playerId;
    if (!decision.allowed) {
      console.log(chalk.yellow(`Move not allowed for piece ${decision.piece.id}: ${decision.reason}`));
      return false;
    }
    // 1) Execute captures (GameRoom is responsible for state mutation)
    if (decision.capture !== null) {
      const capturedcolor = this.players.find(p => p.id === decision.capture?.playerId)?.color ?? decision.capture?.playerId;
      console.log(chalk.red(`Piece ${decision.piece.id} with color ${playerColor} captures piece ${decision.capture?.id} piece color ${capturedcolor}`));
      this.executeCaptures(decision.capture, capturedcolor as PlayerColor);
    }
    
    // 2) Move the piece on the board (atomic)
    const moveResult = this.board.movePieceAtomic(decision.piece, decision.to);
    // if (!moveResult.removedFromPrevious)
    // {
    //   console.log(chalk.red(`Failed to move piece ${decision.piece.id} to ${decision.to}`));
    //   return false;
    // }
    const beforeOccupants = moveResult.addResult.targetOccupantsBefore; // occupants BEFORE insertion
    const prevPosition = moveResult.addResult.previousPosition as BoardPosition; // previous position of the moving piece
    const overflow = moveResult.addResult.overflowWarning; // true if occupancy > allowed after insertion
    // If a forbidden overflow happened (more than allowed occupants), roll back and reject
    if (overflow) {
      // remove the piece we just added
      this.board.removePieceAtomic(decision.piece);
      console.log(chalk.red(`Move aborted: tile would overflow (>2). Piece ${decision.piece.id} removed.`));
      return false;
    }
  
    // 3) Broadcast step-by-step path for the moving piece (animation)
    // Emit intermediate steps (if any). These are animation steps: center for path steps.
    if (decision.path && decision.path.length > 0) {
      let jumped = false;
      let isOnRight = false;
     if ((typeof decision.to === 'number' && beforeOccupants && beforeOccupants.length === 1) || (typeof decision.to === 'object' && beforeOccupants && beforeOccupants.length === 1))
      {
        isOnRight = true;
        // i have to find that piece that is not equal to the moving piece and put it on right
        const olderPiece = beforeOccupants.find(p => p.id !== decision.piece.id);
        await this.emitMoveEvent(olderPiece!, playerColor as PlayerColor, decision.to, 'left');
      }
  
      for (const step of decision.path) {
        if (jumped && decision.placeTojump && !decision.placeTojump.includes(step)) {
          await this.emitJumpEvent(decision.piece, playerColor as PlayerColor, step, 'center');
          jumped = false;
        }
        if (decision.placeTojump && decision.placeTojump.includes(step) && step !== decision.to) {
          jumped = true;
          continue;
        }
        else {
          // regular step check if the destination is the final one and is occupied by only 1 piece meaning this following piece is that one, this is the logic i set it in the board class before emitting the move event
          if (isOnRight && step === decision.to) {
            await this.emitMoveEvent(decision.piece, playerColor as PlayerColor, step, 'right');
          }else
          {
            await this.emitMoveEvent(decision.piece, playerColor as PlayerColor, step, 'center');
             // i have to get the older tile before moving and check if there was there 2 pieces if yes move the piece witch is not this to center
            console.log(`prev position : ${prevPosition}`);
            // get the previous tile occupants before moving
            const beforeOccupantsPrev = this.board.getTileoccupants(prevPosition);
            // check if the dice if containe 5 if yes return true other wise false
            const hasFive: boolean = this.currentDice.includes(5);
            if (((typeof prevPosition === 'number' && beforeOccupantsPrev && beforeOccupantsPrev.length === 1) || (typeof prevPosition === 'object' && beforeOccupantsPrev && beforeOccupantsPrev.length === 1)) && !hasFive)
              {
                const olderPiece = beforeOccupantsPrev.find(p => p.id !== decision.piece.id);
                await this.emitMoveEvent(olderPiece!, playerColor as PlayerColor, prevPosition, 'center');
              }
          }
        
        }
      }
    }
  
    // 4) Handle stacking / final positioning
    // beforeOccupants.length === number of pieces that were on the tile before we inserted the mover.
    if (!beforeOccupants || beforeOccupants.length === 0) {
      // Simple case: tile was empty — final place is center
      // this.emitMoveEvent(decision.piece, playerColor as PlayerColor, decision.to, 'center', 1);
      return true;
    }
  
    // if (beforeOccupants.length === 1 && decision.to !== 'home') {
    //   // Tile had one piece already -> after insertion we have two pieces.
    //   // Decide visual positions: existing (older) -> LEFT, new (recent) -> RIGHT
    //   const olderPiece = beforeOccupants[0];
    //   const newPiece = decision.piece;
  
    //   // Emit reposition for the older piece (shift it to left)
    //   await this.emitMoveEvent(olderPiece, playerColor as PlayerColor, decision.to, 'right');
  
    //   // Emit move for the newly placed piece to the right
    //   await this.emitMoveEvent(newPiece, playerColor as PlayerColor, decision.to, 'left');
  
    //   return true;
    // }
  
    // Safety: if beforeOccupants length > 1 (shouldn't happen due to checks), handle gracefully: // ballshit remove after
    if (beforeOccupants.length >= 2) {
      // This is an illegal state in your rules (only max 2 allowed).
      // Remove the moved piece to restore consistency and report error.
      this.board.removePieceAtomic(decision.piece);
      console.log(chalk.red(`Illegal state: target had ${beforeOccupants.length} occupants before move. Move rolled back.`));
      return false;
    }
  
    return true;
  }
  

  private removeOneDieValue(diceArr: number[], value: number) {
    const idx = diceArr.indexOf(value);
    if (idx !== -1) diceArr.splice(idx, 1);
  }

  /* ----------------------------
   * Game flow methods
   * ---------------------------- */
  async leaveBaseAuto():Promise<boolean>
  {
    const currentPlayer = this.currentPlayer;
    // 1) Check pieces that can leave base (this mutates dice inside GameLogic)
    const leaveMoves = this.logic.pieceCanLeaveBase(currentPlayer, this.currentDice);
    if (leaveMoves.length > 0) {
      // For each possible leave, build a decision and execute it
      for (const lm of leaveMoves) {
        // lm.moves typically [5]
        const decision = this.logic.movePieceDecision(currentPlayer, lm.piece, lm.moves[0]);
        if (decision !== undefined && decision.allowed) {
          console.log(chalk.blue(`leave-base decision for piece ${lm.piece.id} with color ${currentPlayer.color} with move ${lm.moves[0]}`));
          if (decision.capture !== null)
            console.log(chalk.blue(`this piece is cuptured : ${this.players[decision.capture?.playerId - 1]}`));
          console.log("move allowed and aproved to been excuted");
          await this.executeMoveDecision(decision);
        }
        else{console.log(chalk.red("leave-base decision not allowed")); return false;}
      }
      this.updateRemainMoves();
      return true;
    }
    this.updateRemainMoves();
    return false;
  }
 
async movePeiceAuto(available :{piece: Piece; moves: number[]})
{
  const movesLen = available.moves.length;
  for(let i = 0 ; i < movesLen; i++)// execute all available for that piec
  {
    const result = await this.cleanMoving(available.piece, available.moves[i], this.currentPlayer.Remain_moves);
    if (!result)
        return;
  }
}
updateRemainMoves()
{
  const currentPlayer = this.currentPlayer;

  currentPlayer.Remain_moves = this.logic.getAvailableMoves(currentPlayer, this.currentDice);
  if (this.bonusDice > 0)
    currentPlayer.bonus_moves = this.logic.getAvailableMoves(currentPlayer, [this.bonusDice]);
}

async autoMove() {

  const currentPlayer = this.currentPlayer;
  if ((currentPlayer.bonus_moves.length === 1 && currentPlayer.bonus_moves[0].moves.length === 1) || (currentPlayer.Remain_moves.length === 1 && currentPlayer.Remain_moves[0].moves.length === 1))
    {
      if (currentPlayer.bonus_moves.length === 1) await this.movePeiceAuto(currentPlayer.bonus_moves[0]);
      else await this.movePeiceAuto(currentPlayer.Remain_moves[0]);
      this.updateRemainMoves();
    }

}

async handleRollDice() {
    this.currentDice = this.logic.rollDice();
    const currentPlayer = this.currentPlayer;

    this.broadcast("rollDices", {
      color: currentPlayer.color,
      dice1: this.currentDice[0],
      dice2: this.currentDice[1]
    });
    await this.leaveBaseAuto();
    await this.autoMove();
      if ((!currentPlayer.Remain_moves || currentPlayer.Remain_moves.length === 0 ) && (!currentPlayer.bonus_moves || currentPlayer.bonus_moves.length === 0)) {
        // if no available moves left, go to next player
        console.log(`No available moves for player ${currentPlayer.userName}`);
        this.nextTurn();
        return;
      }
    else{
      if (currentPlayer.bonus_moves && currentPlayer.bonus_moves.length > 0)
        this.announceMoveablePieces(currentPlayer, currentPlayer.bonus_moves);
      else
        this.announceMoveablePieces(currentPlayer, currentPlayer.Remain_moves);
    }
  }



  announceMoveablePieces(player: Player, moves: { piece: Piece; moves: number[] }[]) {
    for (const move of moves) {
      this.broadcast("moveAble", {
        sphere_id: move.piece.id,
        sphere_type: player.color,
        choice1: move.moves[0] ?? 0,
        choice2: move.moves[1] ?? 0
      });
    }
  }

  async cleanMoving( piece: Piece, choice:number, remainmv:{ piece: Piece; moves: number[];}[]):Promise<boolean>
  {
        // Ask GameLogic for a decision (doesn't mutate the board)
        const choosen = choice; 
        const player = this.currentPlayer;
        if (this.bonusDice === choosen)
            this.bonusDice = 0;
        const decision = this.logic.movePieceDecision(player, piece, choosen);
        if (!decision.allowed) {
          console.log(`Move not allowed: ${decision.reason}`);
          return false;
        }
    
        // Execute the move (captures + move + broadcast)
        const ok = await this.executeMoveDecision(decision);
        if (!ok) {
          console.log("Failed to execute move");
          return false;
        }
    
        // Remove the used choosen from all remain_moves entries (same logic you had)
        for (let i = remainmv.length - 1; i >= 0; i--) {
          const idx = remainmv[i].moves.indexOf(choosen);
          if (idx !== -1) {
            remainmv[i].moves.splice(idx, 1);
            if (remainmv[i].moves.length === 0) {
              remainmv.splice(i, 1);
            }
          }
        }
        if (choosen < 7)
         this.removeOneDieValue(this.currentDice, choosen);
        return true;
  }

  /**
   * Called when a player chooses a move for a specific piece.
   * - Validates the move exists in Remain_moves,
   * - Builds a MoveDecision and executes it,
   * - Removes used choice from Remain_moves and advances turn if no moves left.
   */
  async handleMovePiece(pieceId: number, color: string, choice: number) {
    const player = this.currentPlayer;
    if (player.color !== color) {
      console.log("Color mismatch for move request");
      return;
    }

    const piece = this.players.find(p => p.color === color)?.pieces.find(pc => pc.id === pieceId);
    if (!piece) {
      console.log("Piece not found");
      return;
    }

    const moveEntry = player.Remain_moves.find(m => m.piece.id === pieceId);
    const movebonus =  player.bonus_moves.find(m => m.piece.id === pieceId); 
    if ((!moveEntry || !moveEntry.moves.includes(choice)) && player.Remain_moves.length === 0 && (!movebonus || !movebonus.moves.includes(choice))) {
      console.log(`Invalid move for piece ${pieceId} by player ${player.userName}`);
      return;
    }
    let remainmv = player.Remain_moves;
    if (choice > 6) {
      remainmv = player.bonus_moves;
      if (!movebonus || !movebonus.moves.includes(choice)) {
        console.log(`Invalid bonus move for piece ${pieceId} by player ${player.userName}`);
        return;
      }
    }
    const result = await this.cleanMoving( piece, choice, remainmv);
   if ( !result) return;

    // If the player has no remaining moves, go to next turn
    if ((!player.Remain_moves || player.Remain_moves.length === 0 || this.currentDice.length === 0) && (!player.bonus_moves || player.bonus_moves.length === 0)) {
      this.nextTurn();
    }
    else
    {
      // Announce remaining moveable pieces again (GameRoom also does this; redundant is fine)
      // this.
      const next = await this.leaveBaseAuto();
      await this.autoMove();
      if (player.bonus_moves && player.bonus_moves.length > 0)
        this.announceMoveablePieces(player, player.bonus_moves);
      else if (next || (!player.Remain_moves || player.Remain_moves.length === 0 || this.currentDice.length === 0) && (!player.bonus_moves || player.bonus_moves.length === 0))
        this.nextTurn();
      else
        this.announceMoveablePieces(player, player.Remain_moves);
    }
  }
  playerfinish():boolean
  {
    const currentPlayer = this.currentPlayer;
    if (this.board.peekGoal(currentPlayer.id - 1).occupiedBy.length === 4)
      return true;
    return false;
  }

  nextTurn() {
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    this.currentDice = [];
    this.bonusDice = 0;
    if (this.playerfinish()) {
      this.gameOver = true;
      this.broadcast("gameEnded", {
        winner: this.currentPlayer.userName,
        color: this.currentPlayer.color,
      });
      if (this.onGameOver) {
      this.onGameOver(this.id);
    }
      
      return;
    }
    this.broadcast("setPlayerTurn", { color: this.currentPlayer.color });
  }

  get currentPlayer(): Player {
    return this.players[this.currentPlayerIndex];
  }
  get playerCount(): number {
    return this.players.length;
  }
}
