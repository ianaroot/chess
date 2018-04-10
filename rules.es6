class Rules {

  static getMoveObject(startPosition, endPosition, board){
    // if(
    //   !Board.prototype.isPrototypeOf( board ) || typeof startPosition !== "number" ||  typeof endPosition !== "number"
    // ){
    //   throw new Error("missing params in getMoveObject")
    // }
    let layOut = board.layOut,
        team = board.teamAt(startPosition),
        moveObject = new MoveObject({illegal: true}); //defaulting to illegal, will be overridden if it's not
    if( team === Board.EMPTY ){
      moveObject.alert = "that tile is empty"
      return moveObject
    }
    if( team !== board.allowedToMove ){
      moveObject.alert =  "other team's turn"
      return moveObject
    }
    let moveObjects = new MovesCalculator({board: board, startPosition: startPosition}).moveObjects//, endPosition: endPosition});
    for(let i = 0; i < moveObjects.length; i++){
      let currentMoveObject = moveObjects[i],
        queryPosition = currentMoveObject.endPosition;
      if( endPosition === queryPosition ){
        moveObject = currentMoveObject
        if( this.checkQueryWithMove({board: board, moveObject: moveObject}) ){
          moveObject.illegal = true
        }
        break;
      }
    }
    return moveObject
  }

  static checkQueryWithMove({board: board, moveObject: moveObject}){
    // if(
    //   !Board.prototype.isPrototypeOf( board ) || typeof startPosition !== "number" || !(typeof additionalActions === "function" || typeof additionalActions === "undefined") || !(typeof endPosition !== "number" || typeof endPosition !== "string") //not sure where this got turned into a string...
    // ){
    //   throw new Error("missing params in checkQuery")
    // }
    let startPosition = moveObject.startPosition,
      teamString         = board.teamAt(startPosition),
      newBoard = board.deepCopy();
    newBoard._hypotheticallyMovePiece( moveObject )
    return this.checkQuery({board: newBoard, teamString: teamString})
  }

  static pieceWillBeAttackedAfterMove({board: board, moveObject: moveObject}){
    let startPosition = moveObject.startPosition,
      teamString         = board.teamAt(startPosition),
      newBoard = board.deepCopy();
    newBoard._hypotheticallyMovePiece( moveObject )
    return this.checkQuery({board: newBoard, teamString: teamString})
  }

  static checkQuery({board: board, teamString: teamString}){
    // let opposingTeamString = Board.opposingTeam(teamString),
      let kingPosition = board._kingPosition(teamString);
      return this.pieceIsAttacked({board: board, defensePosition: kingPosition})
  }

  static pieceIsAttacked({board: board, defensePosition: defensePosition}){ //doesn't care if the position is occupied
    let teamString = board.teamAt(defensePosition),
      opposingTeamString = Board.opposingTeam(teamString),
      enemyPositions = board._positionsOccupiedByTeam(opposingTeamString);
    for(let i = 0; i < enemyPositions.length; i++){
      let enemyPosition = enemyPositions[i],
      enemyPieceType = board.pieceTypeAt( enemyPosition ),
      differential = defensePosition - enemyPosition;
      if( !( differential % 10 === 0 || differential % 8 === 0 || differential % 6 === 0 || differential % 7 === 0 || differential % 9 === 0 || differential % 15 === 0 || differential % 17 === 0 || Math.abs(differential) < 8 ) ){ continue}
      let movesCalculator = new MovesCalculator({board: board, startPosition: enemyPosition, ignoreCastles: true}),//, endPosition: defensePosition}),
      responseMoveObject = new MoveObject({illegal: true}); //defaulting to illegal, will be overridden if it's not
      for(let i = 0; i < movesCalculator.moveObjects.length; i++){
        let currentMoveObject = movesCalculator.moveObjects[i],
        endPosition = currentMoveObject.endPosition;
        if( endPosition === defensePosition ){
          responseMoveObject = currentMoveObject
          // console.log(responseMoveObject)
          break;
        }
      }
      if( !responseMoveObject.illegal ){
        return true
      }
    };

  }

  static positionsControlledByTeam({board: board, team: team}){
    let occcupiedPositions = board.positionsOccupiedByTeam(team);
    for (let i = 0; i < occcupiedPositions.length; i++){

    }
  }

  static availableMovesFrom({board: board, startPosition: startPosition}){
    let moveObjects = new MovesCalculator({board: board, startPosition: startPosition}).moveObjects,
      safeMoves = [];
    for(let i = 0; i < moveObjects.length; i++){
      let moveObject = moveObjects[i]
      if( !this.checkQueryWithMove({board: board, moveObject: moveObject})){
        safeMoves.push(moveObject);
      }
    }
    return safeMoves
  }
  static viablePositionsFromKeysOnly({board: board, startPosition: startPosition}){
    // if(
    //   !Board.prototype.isPrototypeOf( board ) ||  typeof startPosition !== "number"
    // ){
    //   throw new Error("missing params in viablePositionsFromKeysOnly")
    // }
    let movesCalculator = new MovesCalculator({board: board, startPosition: startPosition}),
        keysOnly = [];
    for (let i = 0; i < movesCalculator.moveObjects.length; i++){
      let moveObject = movesCalculator.moveObjects[i],
        endPosition = moveObject.endPosition;
      if( !this.checkQueryWithMove({board: board, moveObject: moveObject}) ){
        keysOnly.push(endPosition)
      }
    }
    return keysOnly
  }

  static pawnPromotionQuery(board){
    for(let i = 0; i < 8; i++){
      if ( board._blackPawnAt(i) ){
        board._promotePawn(i)
        return "=Q"
      }
    }
    for(let i = 56; i < 64; i++){
      if( board._whitePawnAt(i) ){
        board._promotePawn(i)
        return "=Q"
      }
    }
    return ""
  }

  static noLegalMoves(board){
    // debugger
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
        let moveObject = movesCalculator.moveObjects[i];
           // endPosition = moveObject.endPosition;
         if( !this.checkQueryWithMove( {moveObject: moveObject, board: board}) ){
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


  static threeFoldRepetition(board, prefixNotation){
    let notations = Board._deepCopy(board.movementNotation),
      notationsSinceCaptureOrPromotion = [];
      notations.push(prefixNotation); //have to start with this one, don't want to skip the latest move
    for(let i = notations.length -1; i >= 0; i --){
      let notation = notations[i];
      notationsSinceCaptureOrPromotion.push( notation )
      if( /x/.exec(notation) || /^[a-h]/.exec(notation) ){
        break
      }
    }
    let teamOneNotation = [],
      teamTwoNotation = [];
    for(let i = 0; i < notationsSinceCaptureOrPromotion.length; i++){
      let notation = notationsSinceCaptureOrPromotion[i];
      if( i % 2 === 0 ){
        teamOneNotation.push(notation)
      } else {
        teamTwoNotation.push(notation)
      }
    }

    let teamOneDuplicates = this.getDuplicatesForThreeFold(teamOneNotation),
      teamTwoDuplicates = this.getDuplicatesForThreeFold(teamTwoNotation);
    if( teamOneDuplicates.length < 2 || teamTwoDuplicates.length < 2){//TODO setup more indicative three fold test to show why this is 2 not 3
      return false
    } else {
      // console.log("threeFold triggered")
      let previousLayouts = JSON.parse(board.previousLayouts),
          repetitions = 0,
          threeFoldRepetition = false,
          // currentLayOut = board.layOut;
          currentLayOut = JSON.stringify(board.layOut);

      for( let i = 0; i < previousLayouts.length; i++ ){

        let comparisonLayout = JSON.stringify(previousLayouts[i]);
        if(comparisonLayout === currentLayOut){ repetitions++ }

      //   let comparisonLayout = previousLayouts[i],
      //     different = false;
      //   for( let j = 0; j < comparisonLayout.length; j++){
      //     if( comparisonLayout[j] !== currentLayOut[j] ){
      //       different = true
      //       break
      //     }
      //   };
      // if( !different ){ repetitions ++ }
      };
      if(repetitions >= 2){
        threeFoldRepetition = true
      }
    return threeFoldRepetition
    }
  }


  static postMoveQueries(board, prefixNotation){
    let pawnPromotionNotation = Rules.pawnPromotionQuery(board),
        otherTeam = board.teamNotMoving(),
        attackingTeam = Board.opposingTeam(otherTeam),
        kingPosition = board._kingPosition(otherTeam),
        inCheck = this.checkQuery({board: board, teamString: otherTeam}),
        noMoves = this.noLegalMoves(board),
        threeFold = this.threeFoldRepetition(board, prefixNotation);
    if( inCheck && noMoves ){ board._endGame(attackingTeam); return pawnPromotionNotation + "#" }
    if( inCheck ){ return pawnPromotionNotation + "+" }
    if( noMoves || threeFold ){ board._endGame(); return pawnPromotionNotation }
    return pawnPromotionNotation
  }
}
