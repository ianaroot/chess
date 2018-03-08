// TODO positionViable is actually returning a moveObject, and illegal is set to true if it's not a viable move
// retrieveAvailableMovements actually returns a movesCalculator with the moves having been calculated (in a green field sort of we didn't check if positions are blocked or cause check kind of way)
// viablePositionsFrom calculates the viable positions in a slightly less green fieldy sort of, we still didnt' bother to look at check, kind of way
// viable positions from errors when called on empty position
class PieceMovementRules {

  static getMoveObject(startPosition, endPosition, board){
    if(
      !Board.prototype.isPrototypeOf( board ) ||
      typeof startPosition !== "number" ||
      typeof endPosition !== "number"
    ){
      throw new Error("missing params in getMoveObject")
    }
    var layOut = board.layOut,
      team = board.teamAt(startPosition),
      viableMovement = {},
      move = PieceMovementRules.positionViable( {startPosition: startPosition, endPosition: endPosition, board: board} );

    if ( !Board.inBounds(endPosition) ){
      move.alert = 'stay on the board, fool'
      move.illegal = true
    } else if( board.positionIsOccupiedByTeamMate(endPosition, team ) ){
      move.alert = "what, are you trying to capture your own piece?"
      move.illegal = true
    } else if( move.illegal ) {
      move.alert = "that's not how that piece moves"
      // should distinguish whether this is due to blockage or wrong form of movement
      move.illegal = true
    } else if( PieceMovementRules.kingInCheck( {startPosition: startPosition, endPosition: endPosition, board: board, additionalActions: move.additionalActions})){
      move.alert = "check yo king fool"
      move.illegal = true
    } // now we know the move is legal

    return move
  }
  static retrieveAvailableMovements(args){
    if(
      !Board.prototype.isPrototypeOf( args["board"] ) ||
      typeof args["position"] !== "number"
    ){
      throw new Error("missing params in retrieveAvailableMovements")
    }
    var  board = args["board"],
      position = args["position"],
      movesCalculator = new MovesCalculator({board: board, startPosition: position})
      movesCalculator.addMoves()
    return movesCalculator
  }

  static kingInCheck(args){ // can just pass in same position as start and end if you want to know whether not moving anything creates check
    // this should be two functions, one that checks whether a king is in check from a given layout
    // and one that checks whether making a particular layout change would result in check
    if(
      !Board.prototype.isPrototypeOf( args["board"] ) ||
      typeof args["startPosition"] !== "number" ||
      !(typeof args["endPosition"] !== "number" || typeof args["endPosition"] !== "string") || //not sure where this got turned into a string...
      !(typeof args["additionalActions"] === "function" || typeof args["additionalActions"] === "undefined")
    ){
      throw new Error("missing params in kingInCheck")
    }
    var startPosition      = args["startPosition"],
        endPosition        = args["endPosition"],
        board              = args["board"],
        additionalActions  = args["additionalActions"],
        layOut             = board.layOut,
        pieceString        = layOut[startPosition],
        teamString         = board.teamAt(startPosition),
        danger             = false,
        newLayout          = Board.deepCopyLayout(layOut),
        opposingTeamString = Board.opposingTeam(teamString);
    var newBoard = new Board(newLayout);
    newBoard.movePiece( startPosition, endPosition, additionalActions)
    var kingPosition = newBoard.kingPosition(teamString);

    var enemyPositions = newBoard.positionsOccupiedByTeam(opposingTeamString);
    for(var i = 0; i < enemyPositions.length; i++){
      var enemyPosition = enemyPositions[i],
        enemyPieceType = newBoard.pieceTypeAt( enemyPosition );
        if( enemyPieceType !== Board.KING && !PieceMovementRules.positionViable({startPosition: enemyPosition, endPosition: kingPosition, board: newBoard}).illegal ){
        danger = true
        }
    };
    return danger
  }
  static positionViable(args){
    if(
      !Board.prototype.isPrototypeOf( args["board"] ) ||
      typeof args["startPosition"] !== "number" ||
      !(typeof args["endPosition"] !== "number" || typeof args["endPosition"] !== "string") //not sure where this got turned into a string...
    ){
      throw new Error("missing params in positionViable")
    }
    var board = args["board"],
      startPosition = args["startPosition"],
      endPosition = args["endPosition"],
      movesCalculator = PieceMovementRules.viablePositionsFrom( {startPosition: startPosition, board: board} ),
      moveObject = new MoveObject({illegal: true}); //defaulting to illegal, will be overridden if it's not
    for( var key in movesCalculator.viablePositions ){
      if( key == endPosition ){
        moveObject = movesCalculator.viablePositions[key]
      }
    };
    return moveObject
  }
  static viablePositionsFromKeysOnly(args){
    if(
      !Board.prototype.isPrototypeOf( args["board"] ) ||
      typeof args["startPosition"] !== "number"
    ){
      throw new Error("missing params in viablePositionsFromKeysOnly")
    }
    var movesCalculator = PieceMovementRules.viablePositionsFrom(args),
      keysOnly = [];
      for (var property in movesCalculator.viablePositions) {
        if (movesCalculator.viablePositions.hasOwnProperty(property) && !this.kingInCheck(Object.assign(args, { endPosition: property })) ){

          keysOnly.push(property)
      }
    }
    return keysOnly
  }
  static viablePositionsFrom(args){
    //KEYSONLY is the one the api will want. this function ignores the fact that a move is not legal if it places oneself in check
    if(
      !Board.prototype.isPrototypeOf( args["board"] ) ||
      typeof args["startPosition"] !== "number"
    ){
      throw new Error("missing params in viablePositionsFrom")
    }
    var startPosition = args["startPosition"],
      board = args["board"],
      movesCalculator = PieceMovementRules.retrieveAvailableMovements( { position: startPosition, board: board} );
      movesCalculator.calculateViablePositions()
    return movesCalculator
  }

}
