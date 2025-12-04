
//local game room management
import { Namespace, Server, Socket } from "socket.io";
import { Player, PlayerColor, Piece, MoveDecision, BoardPosition} from "../types";
import { Board } from "./Board";
import { GameLogic } from "./gameLogic";
import chalk from "chalk";

const COLORS_2P = [PlayerColor.RED, PlayerColor.YELLOW];
const COLORS_3P4P = [PlayerColor.RED, PlayerColor.GREEN,PlayerColor.YELLOW, PlayerColor.BLUE];

export default class localRoom {
  id: string;
  players: Player[] = [];
  socket: Socket | null = null;
  board: Board;
  logic: GameLogic;
  currentPlayerIndex: number;


  currentDice: number[] = [];
  bonusDice: number = 0;
  isDouble: number = 0;
  gamestarted: boolean = false;
  gameOver: boolean = false;
  private namespaceIO: Namespace;


     get currentPlayer(): Player {
     return this.players[this.currentPlayerIndex];
   }
   get playerCount(): number {
     return this.players.length;
   }

  constructor(roomId: string, namespace: Namespace, playersnum: number, ) {
    if (playersnum < 2 || playersnum > 4) {
        throw new Error("Invalid number of players. Must be between 2 and 4.");
    }
    this.id = roomId;
    this.board = new Board();
    this.logic = new GameLogic(this.board);
    this.currentPlayerIndex = 0;
    this.namespaceIO = namespace;
    for (let i = 0; i < playersnum; i++) {
      const player = this.newPlayer(`boot` , playersnum);
      this.addPlayer(player);
    }

  }
    destroy() {
    // clear players
    this.players = [];

    // clear sockets and disconnect
    this.socket = null;

    // clear board and logic references
    this.board = null as any;
    this.logic = null as any;

    // clear dice and reset state
    this.currentDice = [];
    this.bonusDice = 0;
    this.gamestarted = false;
    this.gameOver = true;
  }

  newPlayer(username: string, playersnum: number): Player {

    const colors = playersnum === 2 ? COLORS_2P : COLORS_3P4P;

    const color = colors[this.players.length];
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

  addPlayer(player: Player): boolean {
    if (this.players.length >= 4) return false;
    this.players.push(player);
    return true;
  }

  broadcast(event: string, data: any) {
    if (!this.socket) return;
    this.socket.emit(event, data);
  }

 async startGame() {
    this.gamestarted = true;
    // send players info to clients
    
    console.log(chalk.red(`Game ${this.id} started with players: ${this.players.map(p => p.color).join(", ")}`));
    this.players.forEach(p => {
  this.broadcast("addPlayer", {
    id: p.id,
    userName: p.userName,
    color: p.color
  })
});
  console.log(`current player index is : ${this.currentPlayerIndex}, and the player  is : ${this.currentPlayer.color}`);
    // set first player turn
    setTimeout(() => {
      if (!this || this.gameOver) return;
      this.broadcast("setPlayerTurn", { color: this.currentPlayer.color });
    }, 5000);
  }

  /**
   * Broadcast a single step move for animation (keeps your original event format).
   * `where` and `speed` preserved from your previous code.
   */
   private async emitMoveEvent(piece: Piece, color: PlayerColor, place: number | 'base' | 'home' | { homeIndex: number }, where: 'center'|'left'|'right' = 'center', speed = 6, delayMs = 250) {
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
      // console.log("emitting move eventt to tile :", placeofbr , "andi its where :", where, "and its  :", se7en? "se7en":"shared path", "and its final :", final? "yes":"no");
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
      console.log(chalk.green(`move : `) + (`Emitting move event for piece ${piece.id}, with color ${color} to place ${placeofbr} (se7en: ${se7en}, final: ${final}) and where: ${where}`));
  
    }
    // jump> {"sphere_id":1,"sphere_type":"RED","place":1,"where":"center","speed":1, "maxHeight": 5, "toStartPosition": false}
  
    
   async emitJumpEvent(piece: Piece, color: PlayerColor, place: number | 'base' | 'home' | { homeIndex: number }, where: 'center'|'left'|'right' = 'center', speed = 3, toStartPosition = false, delayMs = 350) {
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
      console.log(chalk.yellow(`Jump : `)+(`Emitting jump event for piece ${piece.id}, with color ${color} to place ${placeofbr} (se7en: ${se7en}, final: ${final}) and where: ${where}, toStartPosition: ${toStartPosition}`));
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  


  /**
   * Execute captures (do not call GameLogic to capture — GameLogic only detected them).
   * Returns list of captured piece refs (after being moved to base).
   */
  private async executeCaptures(capture: { id: number; playerId: number; position: any }, capturedcolor: PlayerColor) {
  

      const target = this.board.findPiece(capture.playerId, capture.id);
      if (!target) return;
      // remove from its tile and place to its base
      this.board.removePieceAtomic(target);
      this.board.addPieceAtomic(target, 'base');
      // broadcast move of captured piece to base (animation)
        await this.emitJumpEvent(target, capturedcolor, 'base', 'center', 3, true);
      this.bonusDice = 20;
    return target;
  }


  private async executeMoveDecision(decision: MoveDecision) {
    const player = this.players.find(p => p.id === decision.piece.playerId);
  const playerColor = player?.color ?? decision.piece.playerId;
    if (!decision.allowed) {
      console.log(chalk.red(`Move not allowed for piece ${decision.piece.id}: ${decision.reason}`));
      return false;
    }
    // 1) Execute captures (GameRoom is responsible for state mutation)
    if (decision.capture !== null) {
      const capturedcolor = this.players.find(p => p.id === decision.capture?.playerId)?.color ?? decision.capture?.playerId;
      await this.executeCaptures(decision.capture, capturedcolor as PlayerColor);
    }
    
    // 2) Move the piece on the board (atomic)
    const moveResult = this.board.movePieceAtomic(decision.piece, decision.to);
    // if (!moveResult.removedFromPrevious)
    // {
    //   console.log(chalk.red(`Failed to move piece ${decision.piece.id} to ${decision.to}`));
    //   return false;
    // }
    const beforeOccupants = moveResult.addResult.occupantsBeforeMove; // occupants BEFORE insertion
    const targetOccupantsBefore = moveResult.addResult.targetOccupantsBefore; // occupants BEFORE insertion
    const prevPosition = moveResult.addResult.previousPosition as BoardPosition; // previous position of the moving piece
    const currentOccupants = this.board.getTileoccupants(decision.to, decision.piece.playerId); // occupants AFTER insertion (including the mover)
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
      let done = false;
      console.log((chalk.cyan("DEBUG: ") + (`Moving piece ${decision.piece.id} of player ${playerColor} beforeOccupants: ${JSON.stringify(beforeOccupants)} prevPosition: ${JSON.stringify(prevPosition)} currentOccupants: ${JSON.stringify(currentOccupants)} `)) );
      if (((typeof decision.to === "object" && 'homeIndex' in decision.to) || typeof decision.to === 'number') && currentOccupants && currentOccupants.length === 2) {
        // i have to find that piece that is not equal to the moving piece and put it on right
        const olderPiece = currentOccupants.find(p => p.id !== decision.piece.id);
        if (olderPiece) {
          isOnRight = true;
          await this.emitMoveEvent(olderPiece!, playerColor as PlayerColor, decision.to, 'left');
        }
      }
      for (const step of decision.path) {
        //log the type of step and placeToJump if there is, and thier values
        // console.log(chalk.blue("tring step: ") + (`Step type: ${typeof step}, value: ${JSON.stringify(step)}   placeToJump type: ${typeof decision.placeTojump}, value: ${JSON.stringify(decision.placeTojump)}`));
        // console.log(chalk.green(`now im jumping over step: ${JSON.stringify(step)}`));
        if (jumped && decision.placeTojump && decision.placeTojump.length > 0 && (!decision.placeTojump.some(p => (typeof p === 'object' && typeof step === 'object') ? p.homeIndex === step.homeIndex : p === step) || step === decision.to)) {
          if (isOnRight && step === decision.to)
            await this.emitJumpEvent(decision.piece, playerColor as PlayerColor, step, 'right', 3, false);
          else
            await this.emitJumpEvent(decision.piece, playerColor as PlayerColor, step, 'center', 3, false);
          jumped = false;
        }
        else if (decision.placeTojump && decision.placeTojump.length > 0 && decision.placeTojump.some(p => (typeof p === 'object' && typeof step === 'object') ? p.homeIndex === step.homeIndex : p === step) && step !== decision.to) {
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
          }
          
        }
        // i have to get the older tile before moving and check if there was there 2 pieces mean now there is only one if yes move the piece witch is not this to center
       // get the previous tile occupants before moving
       // check if the dice if containe 5 if yes return true other wise false
       // check if there is a piece that still in the base if no move the older piece to center
       // console.log(`DEBG: prev position : ${prevPosition}, prevPos_occupantsNow length: ${beforeOccupantsPrev.length}`);
        const prevPos_occupantsNow = this.board.getTileoccupants(prevPosition, decision.piece.playerId);
        if (((typeof prevPosition === 'number' && prevPos_occupantsNow && prevPos_occupantsNow.length === 1) || ((typeof prevPosition === "object" && 'homeIndex' in prevPosition ) && prevPos_occupantsNow && prevPos_occupantsNow.length === 1)) && !done && beforeOccupants && beforeOccupants.length === 2)
          {
            
            console.log(chalk.magenta(" back center: ") + (`Moving older piece back to center from position: ${JSON.stringify(prevPosition)} with color: ${playerColor}`));
            const olderPiece = prevPos_occupantsNow.find(p => p.id !== decision.piece.id);
            const hasPieceInBase = this.players.find(p => p.color === playerColor)?.pieces.some(pc => pc.position === 'base');
            const backtoCenter = !(hasPieceInBase && this.currentDice.includes(5));
            console.log(chalk.bold.yellow("DEBG: ") + ` actually position: ${decision.piece.position}  and the piece id : ${decision.piece.id}  and the player color : ${playerColor} prev position : ${prevPosition}, prevPos_occupantsNow if that tile length: ${prevPos_occupantsNow.length}, older piece : ${olderPiece?.id}, backtoCenter : ${backtoCenter}`);
            if (olderPiece && olderPiece.position === this.players.find(p => p.id === decision.piece.playerId)?.startIndex && !backtoCenter)
              continue;
            if (olderPiece) {
              await this.emitMoveEvent(olderPiece!, playerColor as PlayerColor, prevPosition, 'center');
              done = true;
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

    if (targetOccupantsBefore.length >= 2 && decision.to !== 'home') {
      // This is an illegal state in your rules (only max 2 allowed).
      // Remove the moved piece to restore consistency and report error.
      this.board.removePieceAtomic(decision.piece);
      console.log(chalk.red(`Illegal state: target had ${targetOccupantsBefore.length} occupants before move. Move rolled back.`));
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
          if (decision.capture !== null)
            console.log(chalk.blue(`this piece is cuptured : ${this.players[decision.capture?.playerId - 1]}`));
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

async autoMove(): Promise<boolean> {
  const currentPlayer = this.currentPlayer;
  if ((currentPlayer.bonus_moves.length === 1 && currentPlayer.bonus_moves[0].moves.length === 1) || (currentPlayer.Remain_moves.length === 1 && currentPlayer.Remain_moves[0].moves.length === 1))
    {
      if (currentPlayer.bonus_moves.length === 1){
         await this.movePeiceAuto(currentPlayer.bonus_moves[0]);
      this.updateRemainMoves();
      }
      if (currentPlayer.Remain_moves.length === 1){
        await this.movePeiceAuto(currentPlayer.Remain_moves[0]);
        this.updateRemainMoves();
      }
      return true;
    }
  return false;
}

async doubleThreeTimes()
{
  if (this.currentDice[0] === this.currentDice[1]) {
    this.isDouble++;
    if (this.isDouble == 1)
      {
          // here going to be logic for hunldding if the player have a blocked piece , move on of them automaticly , without asking the player and consume the 2 dices one that piece
          const currentPlayer = this.currentPlayer;
          const blockedPieces = currentPlayer.pieces.filter(p => typeof p.position === 'number' && this.board.isTileBlocked(p.position, currentPlayer.id));
          if (blockedPieces.length > 0) {
            // Move the first blocked piece found
            console.log(chalk.yellow(`Player ${currentPlayer.userName} has blocked pieces. Auto-moving one due to double roll.`));
            
            
            for (const pieceToMove of blockedPieces) {
            // const pieceToMove = blockedPieces[0];
            const dieValue1 = this.currentDice[0];
            const dieValue2 = this.currentDice[1];
            const can1 = this.logic.checkIfPieceCanMove(currentPlayer, dieValue1, pieceToMove);
            const can2 = this.logic.checkIfPieceCanMove(currentPlayer, dieValue2 + dieValue1, pieceToMove);
            if (!can1 || !can2) {
              console.log(chalk.red(`Blocked piece ${pieceToMove.id} for player ${currentPlayer.userName} cannot move with double roll values.`));
              continue;
            }
            const decision1 = this.logic.movePieceDecision(currentPlayer, pieceToMove, dieValue1);
            const decision2check = this.logic.movePieceDecision(currentPlayer, pieceToMove, dieValue2 + dieValue1);
            //get the other piece that is on that tile 
            const otherPieces = this.board.getTileoccupants(pieceToMove.position as number, currentPlayer.id).filter(p => p.id !== pieceToMove.id);
            const oldpos = pieceToMove.position;
              if (decision1 && decision1.allowed && decision2check && decision2check.allowed) {
                const rs1 = await this.executeMoveDecision(decision1);
                if (!rs1) {
                  console.log(chalk.red(`Failed to auto-move blocked piece ${pieceToMove.id} for player ${currentPlayer.userName} on first die.`));
                  continue;
                }
                const decision2 = this.logic.movePieceDecision(currentPlayer, pieceToMove, dieValue2);
                console.log(chalk.blue(`Auto-move decision for piece ${pieceToMove.id} with die ${dieValue2}: ${decision2.allowed}`));
                const rt2 = await this.executeMoveDecision(decision2);
                if (!rt2) {
                  console.log(chalk.red(`Failed to auto-move blocked piece ${pieceToMove.id} for player ${currentPlayer.userName} on second die.`));
                  this.removeOneDieValue(this.currentDice, dieValue1); // rollback first move
                  return;
                }
                
                
                console.log(chalk.green(`Auto-moved blocked piece ${pieceToMove.id} for player ${currentPlayer.userName} due to double roll.`));
                // if both moves succeeded
                this.currentDice = [];
                //consume both dice and return the other opponent to center;
                if (otherPieces && otherPieces.length === 1)
                  await this.emitMoveEvent(otherPieces[0], currentPlayer.color, oldpos , 'center', 1);
                break;
              } else {
                console.log(chalk.red(`Failed to auto-move blocked piece ${pieceToMove.id} for player ${currentPlayer.userName}.`));
              }
          }
        }
        }

    else if (this.isDouble === 3)
      {
        // function to find the one piece that is not in the base and the with the highest position and send it to the base
        const currentPlayer = this.currentPlayer;
        this.isDouble = 0;
        this.currentDice = [];
        const piecesNotInBase = currentPlayer.pieces.filter(p => typeof p.position === 'number');
        if (piecesNotInBase.length === 0) {
          console.log(chalk.yellow(`All pieces of player ${currentPlayer.userName} are in base. No piece to send back.`));
          return;
        }
        // Find the piece with the highest position
        // home positions and home are not considered at all
        let pieceToSendBack: Piece | null = null;
        let maxDistance = -1;
        const startIndex = currentPlayer.startIndex;
        //just for now
        const safeIndices = [0, 7, 12, 17, 24, 29, 34, 41, 46, 51, 58, 63];
        for (const piece of piecesNotInBase) {
          if (typeof piece.position === 'number' &&  !safeIndices.includes(piece.position )) {
             // Calculate distance from startIndex, wrapping around if needed
        let distance = piece.position >= startIndex
          ? piece.position - startIndex
          : (this.board.sharedPathLength - startIndex) + piece.position;
        if (distance > maxDistance) {
          maxDistance = distance;
          pieceToSendBack = piece;
    }
          }
        }
        if (pieceToSendBack) {
          const piecepos = pieceToSendBack.position;
          // Move the piece back to base with movePieceAtomic
          this.board.movePieceAtomic(pieceToSendBack, 'base');
          // Broadcast the jump to base
          await this.emitJumpEvent(pieceToSendBack, currentPlayer.color, 'base', 'center', 3, true);
          console.log(chalk.red(`Player ${currentPlayer.userName} rolled doubles three times! Piece ${pieceToSendBack.id} sent back to base.`));
          // check if there is another piece on that tile and move it to center
          const tileOccupants = this.board.getTileoccupants(piecepos, currentPlayer.id);
          if (tileOccupants && tileOccupants.length === 1) {
            await this.emitMoveEvent(tileOccupants[0], currentPlayer.color, piecepos, 'center', 1);
            console.log(chalk.magenta(`Moving remaining piece ${tileOccupants[0].id} to center after sending piece ${pieceToSendBack.id} back to base.`));
          }
        
        } else {
          console.log(chalk.yellow(`No valid piece found to send back for player ${currentPlayer.userName}.`));
        }
        
      }
  } else {
    this.isDouble = 0;
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
    await this.doubleThreeTimes();
    await this.leaveBaseAuto();
    let auto = true;
    while (auto) {
      auto = await this.autoMove();
    }
    if (this.bonusDice > 0 && (!currentPlayer.bonus_moves || currentPlayer.bonus_moves.length === 0)) {
      this.bonusDice = 0;
    }
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
        {
          this.bonusDice = 0;
          player.bonus_moves = [];
        }
        const decision = this.logic.movePieceDecision(player, piece, choosen);
        if (!decision.allowed) {
          console.log(`Move not allowed: ${decision.reason}`);
          return false;
        }
        
        if (choosen < 7)
        {
          console.log(chalk.green(`removing die value ${choosen} from currentDice ${this.currentDice}`));
          this.removeOneDieValue(this.currentDice, choosen);
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
    if (((!player.Remain_moves || player.Remain_moves.length === 0) && this.currentDice.length === 0) && ((!player.bonus_moves || player.bonus_moves.length === 0) && this.bonusDice === 0)) {
      this.nextTurn();
    }
    else
    {
      // Announce remaining moveable pieces again (GameRoom also does this; redundant is fine)
      // this.
      const next = await this.leaveBaseAuto();
      let auto = true;

      while (auto) {
        auto = await this.autoMove();
      }
      if (this.bonusDice > 0 && (!player.bonus_moves || player.bonus_moves.length === 0)) {
        this.bonusDice = 0;
      }
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
     if (this.playerfinish()) {
       this.gameOver = true;
       console.log(chalk.red(`Player ${this.currentPlayer.userName} has won the game!`));    
       return;
     }
     if (this.isDouble == 0)
     {
         this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
     }
     this.currentDice = [];
     this.bonusDice = 0;
     this.broadcast("setPlayerTurn", { color: this.currentPlayer.color });
   }
 

 }