class Rules {

  static getMoveObject(startPosition, endPosition, board){
    // if(
    //   !Board.prototype.isPrototypeOf( board ) ||
    //   typeof startPosition !== "number" ||
    //   typeof endPosition !== "number"
    // ){
    //   throw new Error("missing params in getMoveObject")
    // }

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
        movesCalculator = new MovesCalculator({board: board, startPosition: startPosition})//, endPosition: endPosition});
    for(let i = 0; i < movesCalculator.moveObjects.length; i++){
      let currentMoveObject = movesCalculator.moveObjects[i],
        queryPosition = currentMoveObject.endPosition;
      if( endPosition === queryPosition ){
        moveObject = currentMoveObject
        break;
      }
    }

    if ( !Board._inBounds(endPosition) ){
      moveObject.alerts.push('stay on the board, fool')
      moveObject.illegal = true
    } else if( board.occupiedByTeamMate({position: endPosition, teamString: team}) ){
      moveObject.alerts.push("what, are you trying to capture your own piece?")
      moveObject.illegal = true
    } else if( moveObject.illegal ) {
      moveObject.alerts.push("that's not how that piece moves")
      moveObject.illegal = true
      // CHECKQUERY SELF
    } else if( Rules.checkQuery( {startPosition: startPosition, endPosition: endPosition, board: board, additionalActions: moveObject.additionalActions})){
      moveObject.alerts.push("check yo king fool")
      moveObject.illegal = true
    }
    return moveObject
  }

  static checkQuery({board: board, startPosition: startPosition, endPosition: endPosition, additionalActions: additionalActions, moveObject: moveObject}){
    // if(
    //   !Board.prototype.isPrototypeOf( board ) ||
    //   typeof startPosition !== "number" ||
    //   !(typeof endPosition !== "number" || typeof endPosition !== "string") || //not sure where this got turned into a string...
    //   !(typeof additionalActions === "function" || typeof additionalActions === "undefined")
    // ){
    //   throw new Error("missing params in checkQuery")
    // }
    let layOut             = board.layOut,
        pieceObject        = layOut[startPosition],
        teamString         = board.teamAt(startPosition),
        danger             = false,
        opposingTeamString = Board.opposingTeam(teamString),
        newBoard = board.deepCopy(),
        dummyMoveObject = {startPosition: startPosition, endPosition: endPosition, additionalActions: additionalActions};

    newBoard._hypotheticallyMovePiece( dummyMoveObject )
    let kingPosition = newBoard._kingPosition(teamString),
        enemyPositions = newBoard._positionsOccupiedByTeam(opposingTeamString);
        // console.log("kingPosition :" + kingPosition)
    for(let i = 0; i < enemyPositions.length; i++){
      let enemyPosition = enemyPositions[i],
          enemyPieceType = newBoard.pieceTypeAt( enemyPosition ),
          differential = kingPosition - enemyPosition;
          // console.log("enemyPosition :" + enemyPosition)
      if( !( differential % 10 === 0 || differential % 8 === 0 || differential % 6 === 0 || differential % 7 === 0 || differential % 9 === 0 || differential % 15 === 0 || differential % 17 === 0 || Math.abs(differential) < 8 ) ){ continue}
      let movesCalculator = new MovesCalculator({board: newBoard, startPosition: enemyPosition, ignoreCastles: true}),//, endPosition: kingPosition}),
          responseMoveObject = new MoveObject({illegal: true}); //defaulting to illegal, will be overridden if it's not
      for(let i = 0; i < movesCalculator.moveObjects.length; i++){
        let currentMoveObject = movesCalculator.moveObjects[i],
          endPosition = currentMoveObject.endPosition;
        if( endPosition === kingPosition ){
          responseMoveObject = currentMoveObject
          break;
        }
      }
      if( !responseMoveObject.illegal ){
        if (moveObject){
          moveObject.alerts.push( "check" )
          moveObject.checkNotation = "+";
        }
        return true
      }
    };
    return danger
  }

  static viablePositionsFromKeysOnly({board: board, startPosition: startPosition}){
    // if(
    //   !Board.prototype.isPrototypeOf( board ) ||
    //   typeof startPosition !== "number"
    // ){
    //   throw new Error("missing params in viablePositionsFromKeysOnly")
    // }
    let movesCalculator = new MovesCalculator({board: board, startPosition: startPosition}),
        keysOnly = [];
    for (let i = 0; i < movesCalculator.moveObjects.length; i++){
      let moveObject = movesCalculator.moveObjects[i],
        endPosition = moveObject.endPosition,
        newArgs = {board: board, startPosition: startPosition, endPosition: endPosition };
      if( !this.checkQuery( newArgs ) ){
        keysOnly.push(endPosition)
      }
    }
    return keysOnly
  }

  static pawnPromotionQuery({board: board, moveObject: moveObject}){
    for(let i = 0; i < 8; i++){
      if ( board._blackPawnAt(i) ){
        board._promotePawn(i)
        moveObject.promotionNotation = "=Q"
      }
    }
    for(let i = 56; i < 64; i++){
      if( board._whitePawnAt(i) ){
        board._promotePawn(i)
        moveObject.promotionNotation = "=Q"
      }
    }
  }

  static checkmateQuery({inCheck: inCheck, noMoves: noMoves, moveObject: moveObject,board:  board,attackingTeam: attackingTeam}){
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
        movesCalculator = new MovesCalculator({board: board, startPosition: startPosition});
      for (let i = 0; i < movesCalculator.moveObjects.length; i++){
        let moveObject = movesCalculator.moveObjects[i],
           endPosition = moveObject.endPosition;
         if( !this.checkQuery( {startPosition: startPosition, endPosition: endPosition, board: board}) ){
           noLegalMoves = false
           break
         }
      }
    };
    return noLegalMoves
  }

  static getDuplicatesForThreeFold( arr ) {
    var all = {};
    return arr.reduce(function( duplicates, value ) {// strip out clarifying rank or file letter
      //TODO record clarifying rank or file letter
      value = value.replace(/=[QRNB]/, "")
      value = value.replace(/\+/, "")
      if( /[RNBQ][a-h1-8][a-h]/.exec(value) ){
        value = value.replace(/[a-h1-8]/, "")
      }
      if( all[value] ) {
        duplicates.push(value);
        all[value] = false;
      } else if( typeof all[value] == "undefined" ) {
        all[value] = true;
      }
      return duplicates;
    }, []);
  }


  static threeFoldRepetition(board){
    let notations = board.movementNotation,
      notationsSinceCaptureOrPromotion = []
    for(let i = notations.length -1; i > 0; i --){
      let notation = notations[i];
      notationsSinceCaptureOrPromotion.push( notation )
      if( /x/.exec(notation) || /=/.exec(notation) ){
        break
      }


    }
    let duplicates = Rules.getDuplicatesForThreeFold(notationsSinceCaptureOrPromotion)
    if( duplicates.length < 2 ){
      return false
    } else {
      console.log("threeFold triggered")
    }
    // let previousLayouts = board.previousLayouts,
    //     repetitions = 0,
    //     threeFoldRepetition = false,
    //     currentLayOut = board.layOut;
    //
    // for( let i = 0; i < previousLayouts.length; i++ ){
    //   let comparisonLayout = previousLayouts[i],
    //     different = false;
    //   for( let j = 0; j < comparisonLayout.length; j++){
    //     if( comparisonLayout[j] !== currentLayOut[j] ){
    //       different = true
    //       break
    //     }
    //   };
    //   if( !different ){ repetitions ++ }
    // };
    // if(repetitions >= 2){
    //   threeFoldRepetition = true
    // }
    // return threeFoldRepetition
  }
  static stalemateQuery({board: board, moveObject: moveObject}){
    if (this.threeFoldRepetition(board) || this.noLegalMoves(board)){
    // if (this.noLegalMoves(board)){
      moveObject.alerts.push( "stalemate" )
      board._endGame()
    }
  }

  static postMoveQueries({board: board, moveObject: moveObject}){
    Rules.pawnPromotionQuery({board: board, moveObject: moveObject} );
    let checkNotation = "",
        otherTeam = board.teamNotMoving(),
        attackingTeam = Board.opposingTeam(otherTeam),
        kingPosition = board._kingPosition(otherTeam),
        inCheck = this.checkQuery({board: board, startPosition: kingPosition, endPosition: kingPosition, moveObject: moveObject}),
    // debugger
        noMoves = this.noLegalMoves(board),
        threeFold = this.threeFoldRepetition(board);
    this.checkmateQuery({inCheck: inCheck, noMoves: noMoves, moveObject: moveObject,board:  board,attackingTeam: attackingTeam})
  }
}
