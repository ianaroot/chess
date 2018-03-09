class Rules {

  static getMoveObject(startPosition, endPosition, board){
    if(
      !Board.prototype.isPrototypeOf( board ) ||
      typeof startPosition !== "number" ||
      typeof endPosition !== "number"
    ){
      throw new Error("missing params in getMoveObject")
    }
    let layOut = board.layOut,
        team = board.teamAt(startPosition),
        viableMovement = {},
        movesCalculator = new MovesCalculator({board: board, startPosition: startPosition}),
        moveObject = new MoveObject({illegal: true}); //defaulting to illegal, will be overridden if it's not
    for( let key in movesCalculator.viablePositions ){
      if( key == endPosition ){
        moveObject = movesCalculator.viablePositions[key]
      }
    };

    if ( !Board.inBounds(endPosition) ){
      moveObject.alert = 'stay on the board, fool'
      moveObject.illegal = true
    } else if( board.positionIsOccupiedByTeamMate(endPosition, team ) ){
      moveObject.alert = "what, are you trying to capture your own piece?"
      moveObject.illegal = true
    } else if( moveObject.illegal ) {
      moveObject.alert = "that's not how that piece moves"
      // should distinguish whether this is due to blockage or wrong form of movement
      moveObject.illegal = true
    } else if( Rules.kingInCheck( {startPosition: startPosition, endPosition: endPosition, board: board, additionalActions: moveObject.additionalActions})){
      moveObject.alert = "check yo king fool"
      moveObject.illegal = true
    } // now we know the move is legal

    return moveObject
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
    let startPosition      = args["startPosition"],
        endPosition        = args["endPosition"],
        board              = args["board"],
        additionalActions  = args["additionalActions"],
        layOut             = board.layOut,
        pieceString        = layOut[startPosition],
        teamString         = board.teamAt(startPosition),
        danger             = false,
        newLayout          = Board.deepCopyLayout(layOut),
        opposingTeamString = Board.opposingTeam(teamString),
        newBoard = new Board(newLayout);
    newBoard.movePiece( startPosition, endPosition, additionalActions)
    let kingPosition = newBoard.kingPosition(teamString),
        enemyPositions = newBoard.positionsOccupiedByTeam(opposingTeamString);
    for(let i = 0; i < enemyPositions.length; i++){
      let enemyPosition = enemyPositions[i],
          enemyPieceType = newBoard.pieceTypeAt( enemyPosition );
      if( enemyPieceType === Board.KING ){ continue }
      let movesCalculator = new MovesCalculator({board: newBoard, startPosition: enemyPosition}),
          moveObject = new MoveObject({illegal: true}); //defaulting to illegal, will be overridden if it's not
      for( let key in movesCalculator.viablePositions ){
        if( parseInt(key) === kingPosition ){
          moveObject = movesCalculator.viablePositions[key]
        }
      };
      if( enemyPieceType !== Board.KING &&  !moveObject.illegal ){ //!Rules.positionViable({startPosition: enemyPosition, endPosition: kingPosition, board: newBoard}).illegal ){
      danger = true
      }
    };
    return danger
  }

  static viablePositionsFromKeysOnly(args){
    if(
      !Board.prototype.isPrototypeOf( args["board"] ) ||
      typeof args["startPosition"] !== "number"
    ){
      throw new Error("missing params in viablePositionsFromKeysOnly")
    }
    let movesCalculator = new MovesCalculator(args),
        keysOnly = [];
    for (let property in movesCalculator.viablePositions) {
      let newArgs = Object.assign(args, { endPosition: property });
      if (movesCalculator.viablePositions.hasOwnProperty(property) && !this.kingInCheck( newArgs ) ){
        keysOnly.push(property)
      }
    }
    return keysOnly
  }

  static pawnPromotionQuery(board){
    for(let i = 0; i < 8; i++){
      if ( board.blackPawnAt(i) ){
        board.promotePawn(i)
        return "=Q"
        //need to change this when i start allowing choice of promotion type
      }
    }
    for(let i = 56; i < 64; i++){
      if( board.whitePawnAt(i) ){
        board.promotePawn(i)
        return "=Q"
        //need to change this when i start allowing choice of promotion type
      }
    }
    return ""
  }
  static checkmate(board){
    var otherTeam = board.teamNotMoving(),
        kingPosition = board.kingPosition(otherTeam),
        inCheck = this.kingInCheck({board: board, startPosition: kingPosition, endPosition: kingPosition}),
        noMoves = this.noLegalMoves(board);
    return inCheck && noMoves
  }
  static noLegalMoves(board){
    let movingTeamString = board.allowedToMove,
      noLegalMoves = true;
    if(movingTeamString === Board.BLACK){
      var onDeckTeamString = Board.WHITE
    } else {
      var onDeckTeamString = Board.BLACK
    }
    let occcupiedPositions = board.positionsOccupiedByTeam(onDeckTeamString);
    for(let i = 0; i < occcupiedPositions.length && noLegalMoves; i++){
      let startPosition = occcupiedPositions[i],
        movesCalculator = new MovesCalculator({board: board, startPosition: startPosition})
      for( let key in movesCalculator.viablePositions ){ // checking only kingInCheck here because everything else is guaranteed by the fact that these positions came from viablePositions
        if( !this.kingInCheck( {startPosition: startPosition, endPosition: key, board: board}) ){
          noLegalMoves = false
        }
      };
    };
    return noLegalMoves
  }
  static threeFoldRepetition(board){
    let previousLayouts = board.previousLayouts,
        repetitions = 0,
        threeFoldRepetition = false,
        currentLayOut = board.layOut;

    for( let i = 0; i < previousLayouts.length; i++ ){
      let comparisonLayout = previousLayouts[i],
        different = false;
      for( let j = 0; j < comparisonLayout.length; j++){
        if( comparisonLayout[j] !== currentLayOut[j] ){
          different = true
          break
        }
      };
      if( !different ){ repetitions ++ }
    };
    if(repetitions >= 2){
      threeFoldRepetition = true
    }
    return threeFoldRepetition
  }
  static stalemate(board){
    return this.threeFoldRepetition(board) || this.noLegalMoves(board)
  }
}
