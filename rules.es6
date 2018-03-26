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
        moveObject = new MoveObject({illegal: true}); //defaulting to illegal, will be overridden if it's not

    if( team === Board.EMPTY ){
      moveObject.alerts.push("that tile is empty")
      return moveObject
    }
    if( team !== board.allowedToMove ){
      moveObject.alerts.push( "other team's turn" )
      return moveObject
    }

    let viableMovement = {},
        movesCalculator = new MovesCalculator({board: board, startPosition: startPosition});
    for( let key in movesCalculator.viablePositions ){
      if( key == endPosition ){
        moveObject = movesCalculator.viablePositions[key]
        moveObject.endPosition = endPosition;
      }
    };

    if ( !Board._inBounds(endPosition) ){
      moveObject.alerts.push('stay on the board, fool')
      moveObject.illegal = true
    } else if( board.occupiedByTeamMate({position: endPosition, teamString: team}) ){
      moveObject.alerts.push("what, are you trying to capture your own piece?")
      moveObject.illegal = true
    } else if( moveObject.illegal ) {
      moveObject.alerts.push("that's not how that piece moves")
      moveObject.illegal = true
    } else if( Rules.checkQuery( {startPosition: startPosition, endPosition: endPosition, board: board, additionalActions: moveObject.additionalActions})){
      moveObject.alerts.push("check yo king fool")
      moveObject.illegal = true
    }

    return moveObject
  }

  static checkQuery({board: board, startPosition: startPosition, endPosition: endPosition, additionalActions: additionalActions, moveObject: moveObject}){
    if(
      !Board.prototype.isPrototypeOf( board ) ||
      typeof startPosition !== "number" ||
      !(typeof endPosition !== "number" || typeof endPosition !== "string") || //not sure where this got turned into a string...
      !(typeof additionalActions === "function" || typeof additionalActions === "undefined")
    ){
      throw new Error("missing params in checkQuery")
    }
    let layOut             = board.layOut,
        pieceObject        = layOut[startPosition],
        teamString         = board.teamAt(startPosition),
        danger             = false,
        newLayout          = Board._deepCopy(layOut),
        opposingTeamString = Board.opposingTeam(teamString),
        newBoard = new Board(newLayout),
        dummyMoveObject = {startPosition: startPosition, endPosition: endPosition, additionalActions: additionalActions};

    newBoard._hypotheticallyMovePiece( dummyMoveObject )
    let kingPosition = newBoard._kingPosition(teamString),
        enemyPositions = newBoard._positionsOccupiedByTeam(opposingTeamString);
    for(let i = 0; i < enemyPositions.length; i++){
      let enemyPosition = enemyPositions[i],
          enemyPieceType = newBoard.pieceTypeAt( enemyPosition );
      let movesCalculator = new MovesCalculator({board: newBoard, startPosition: enemyPosition, ignoreCastles: true}),
          responseMoveObject = new MoveObject({illegal: true}); //defaulting to illegal, will be overridden if it's not
      for( let key in movesCalculator.viablePositions ){
        if( parseInt(key) === kingPosition ){
          responseMoveObject = movesCalculator.viablePositions[key]
        }
      };
      if( !responseMoveObject.illegal ){
        if (moveObject){
          moveObject.alerts.push( "check" )
          moveObject.checkNotation = "+";
        }
        danger = true
      }
    };
    return danger
  }

  static viablePositionsFromKeysOnly({board: board, startPosition: startPosition}){
    if(
      !Board.prototype.isPrototypeOf( board ) ||
      typeof startPosition !== "number"
    ){
      throw new Error("missing params in viablePositionsFromKeysOnly")
    }

    let movesCalculator = new MovesCalculator({board: board, startPosition: startPosition}),
        keysOnly = [];
    for (let property in movesCalculator.viablePositions) {
      let newArgs = {board: board, startPosition: startPosition, endPosition: property };
      if (movesCalculator.viablePositions.hasOwnProperty(property) && !this.checkQuery( newArgs ) ){
        keysOnly.push(property)
      }
    }
    return keysOnly
  }

  static pawnPromotionQuery(args){
    let board = args["board"],
        moveObject = args["moveObject"],
        promotionNotation = "";
    for(let i = 0; i < 8; i++){
      if ( board._blackPawnAt(i) ){
        board._promotePawn(i)
        promotionNotation = "=Q"
      }
    }
    for(let i = 56; i < 64; i++){
      if( board._whitePawnAt(i) ){
        board._promotePawn(i)
        promotionNotation = "=Q"
      }
    }
    moveObject.promotionNotation = promotionNotation;
  }
  static checkmateQuery({board: board, moveObject: moveObject}){
    let checkNotation = "",
        otherTeam = board.teamNotMoving(),
        attackingTeam = Board.opposingTeam(otherTeam),
        kingPosition = board._kingPosition(otherTeam),
        inCheck = this.checkQuery({board: board, startPosition: kingPosition, endPosition: kingPosition}),
        noMoves = this.noLegalMoves(board);
    if (inCheck && noMoves){
      moveObject.checkNotation = "#"
			moveObject.alerts.push( "checkmate" )
			board._endGame(attackingTeam)
      return true
    } else {
      return false
    }
  }
  static noLegalMoves(board){
    let movingTeamString = board.allowedToMove,
      noLegalMoves = true;
    if(movingTeamString === Board.BLACK){
      var onDeckTeamString = Board.WHITE
    } else {
      var onDeckTeamString = Board.BLACK
    }
    let occcupiedPositions = board._positionsOccupiedByTeam(onDeckTeamString);
    for(let i = 0; i < occcupiedPositions.length && noLegalMoves; i++){
      let startPosition = occcupiedPositions[i],
        movesCalculator = new MovesCalculator({board: board, startPosition: startPosition})
      for( let key in movesCalculator.viablePositions ){
        if( !this.checkQuery( {startPosition: startPosition, endPosition: key, board: board}) ){
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
  static stalemateQuery({board: board, moveObject: moveObject}){
    if (this.threeFoldRepetition(board) || this.noLegalMoves(board)){
      moveObject.alerts.push( "stalemate" )
      board._endGame()
    }
  }
}
