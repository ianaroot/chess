// viable positions from errors when called on empty position
// even if move is illegal catches it, having viablePositions return illegal positions, such as checked castling, is gonna be problematic, like when i get to where i'm highlighting legal positions to move to
// throw error if args missing. make a reusable function, throw it in some stuff
// tells you it's the other team's turn if you try to move from an empty square
class PieceMovementRules {

  static moveIsIllegal(startPosition, endPosition, board){
    if(
      !Board.prototype.isPrototypeOf( board ) ||
      typeof startPosition !== "number" ||
      typeof endPosition !== "number"
    ){
      throw new Error("missing params in moveIsIllegal")
    }
    var layOut = board.layOut,
      team = board.teamAt(startPosition),
      viableMovement = {},
      moveObject = {
        illegal: false,
        startPosition: startPosition,
        endPosition: endPosition
      },
      viableMovement = PieceMovementRules.positionViable( {startPosition: startPosition, endPosition: endPosition, board: board} );

    if ( !Board.inBounds(endPosition) ){
      moveObject.alert = 'stay on the board, fool'
      moveObject.illegal = true
    } else if( board.positionIsOccupiedByTeamMate(endPosition, team ) ){
      moveObject.alert = "what, are you trying to capture your own piece?"
      moveObject.illegal = true
    } else if( !viableMovement ) {
      moveObject.alert = "that's not how that piece moves"
      // should distinguish whether this is due to blockage or wrong form of movement
      moveObject.illegal = true
    } else if( PieceMovementRules.kingInCheck( {startPosition: startPosition, endPosition: endPosition, board: board, additionalActions: viableMovement.additionalActions})){
      moveObject.alert = "check yo king fool"
      moveObject.illegal = true
    } // now we know the move is legal
    moveObject.additionalActions = viableMovement.additionalActions
    if( viableMovement.fullNotation ){
      moveObject.fullNotation = viableMovement.fullNotation
    }

    moveObject.pieceNotation = viableMovement.pieceNotation
    return moveObject
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
      // pieceType = board.pieceTypeAt(position);
      // pieceType = pieceType.charAt(0) + pieceType.slice(1);
      // var availableMovements = PieceMovementRules.pieceSpecificMovements()[pieceType]

      movesCalculator = new MovesCalculator({board: board, startPosition: position})
      movesCalculator.addMoves()
    // TODO move pieceSPecificMovementRules over to MOve object
    // back in move is illegal, make attachMoves function. move object already knows it's board and position and can
    // calculate all the shit on it's own
    // MOVE Object will store a dryer version of the boundary checks, the generic movements, all that cool shit
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
        availableMovements = PieceMovementRules.retrieveAvailableMovements( {position: enemyPosition, board: board} ),
        enemyPieceType = board.pieceTypeAt( enemyPosition );
        if( enemyPieceType !== Board.KING && PieceMovementRules.positionViable({startPosition: enemyPosition, endPosition: kingPosition, board: newBoard} ) ){
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
      viable = false;
    for( var key in movesCalculator.viablePositions ){
      if( key == endPosition ){
        viable = movesCalculator.viablePositions[key]
      }
    };
    // debugger
    // TODO you could very reasonably expect this to just return false, but it's actually returning a move object
    return viable
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
        if (movesCalculator.viablePositions.hasOwnProperty(property)) {
          keysOnly.push(property)
      }
    }
    return keysOnly
  }
  static viablePositionsFrom(args){
    if(
      !Board.prototype.isPrototypeOf( args["board"] ) ||
      typeof args["startPosition"] !== "number"
    ){
      throw new Error("missing params in viablePositionsFrom")
    }
    var startPosition = args["startPosition"],
      board = args["board"],
      movesCalculator = PieceMovementRules.retrieveAvailableMovements( { position: startPosition, board: board} );
      // pieceMovements = availableMovements({board: board, startPosition: startPosition}),
      movesCalculator.calculateViablePositions()
    return movesCalculator
  }

}
