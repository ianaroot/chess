class Rules {

  static getMoveObject(startPosition, endPosition, board){
    let layOut = board.layOut,
        team = board.teamAt(startPosition),
        moveObject = new MoveObject({illegal: true}); //defaulting to illegal, will be overridden if it's not
    if( team === Board.EMPTY ){
      moveObject.alert = "that tile is empty"
      return moveObject
    }else if( team !== board.allowedToMove ){
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
    let newBoard = board.deepCopy();
    newBoard._hypotheticallyMovePiece( moveObject )
    return this.checkQuery({board: newBoard, teamString: board.teamAt(moveObject.startPosition)})
  }

  static pieceWillBeAttackedAfterMove({board: board, moveObject: moveObject}){
    let newBoard = board.deepCopy();
    newBoard._hypotheticallyMovePiece( moveObject )
    return this.pieceIsAttacked({board: newBoard, defensePosition: newBoard._kingPosition(board.teamAt(moveObject.startPosition)) } )
  }

  static checkQuery({board: board, teamString: teamString}){
    return this.pieceIsAttacked({board: board, defensePosition: board._kingPosition(teamString)})
  }

  static pieceIsAttacked({board: board, defensePosition: defensePosition}){ //doesn't care if the position is occupied
    let teamString = board.teamAt(defensePosition),
      opposingTeamString = Board.opposingTeam(teamString),
      enemyPositions = board._positionsOccupiedByTeam(opposingTeamString);
    for(let i = 0; i < enemyPositions.length; i++){
      let enemyPosition = enemyPositions[i],
      enemyPieceType = board.pieceTypeAt( enemyPosition ),
      differential = defensePosition - enemyPosition;
      if( !( differential % 10 === 0 || differential % 8 === 0 || differential % 6 === 0 || differential % 7 === 0 || differential % 9 === 0 || differential % 15 === 0 || differential % 17 === 0 || Math.abs(differential) < 8 ) ){ continue }
      if( (enemyPieceType === Board.PAWN || enemyPieceType === Board.BISHOP) && !(differential % 9 === 0 || differential % 7 === 0) ){
        continue
      }else if( enemyPieceType === Board.ROOK && !(differential % 8 === 0 || Math.abs(differential) < 8) ){
        continue
      }else if( enemyPieceType === Board.NIGHT && ![10,-10,6,-6,15,-15,17,-17].includes(differential)){
        continue
      }else if( enemyPieceType === Board.QUEEN && !(differential % 9 === 0 || differential % 7 === 0 || differential % 8 === 0 || Math.abs(differential) < 8)){
        continue
      }
      let endPositions = new MovesCalculator({board: board, startPosition: enemyPosition, ignoreCastles: true}).endPositions,
        responseMove = new MoveObject({illegal: true}); //defaulting to illegal, will be overridden if it's not
      for(let i = 0; i < endPositions.length; i++){
        let endPosition = endPositions[i];
        if( endPosition === defensePosition ){
          return true;
        }
      }
    };
  }

  static positionsControlledByTeam({board: board, team: team, exemptions: exemptions}){
    let controlledPositions = [],
      occcupiedPositions = board._positionsOccupiedByTeam(team);
    exemptions = exemptions || [];
    for (let i = 0; i < occcupiedPositions.length; i++){
      if (exemptions.includes(board.pieceTypeAt(occcupiedPositions[i]) )){ continue }
      controlledPositions = controlledPositions.concat( new MovesCalculator({board: board, startPosition: occcupiedPositions[i], attacksOnly: true}).endPositions )
    }
    return controlledPositions
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

  static pawnPromotionQuery(board, notationPrefix){
    if( /[RNBQK]/.exec(notationPrefix) ){
      return ""
    }else if( /[81]/.exec(notationPrefix) ){
    let square = notationPrefix.substring(notationPrefix.length - 2, notationPrefix.length),
      position = Board.gridCalculatorReverse(square)
      board._promotePawn(position)
      return "=Q"
    } else {
      return ""
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
        moves = new MovesCalculator({board: board, startPosition: startPosition}).moveObjects;
      for (let i = 0; i < moves.length; i++){
        let moveObject = moves[i];
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


  static threeFoldRepetition(board, notationPrefix){
    let notations = Board._deepCopy(board.movementNotation),
      notationsSinceCaptureOrPromotion = [];
      notations.push(notationPrefix); //have to start with this one, don't want to skip the latest move
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
      let previousLayouts = JSON.parse(board.previousLayouts),
          repetitions = 0,
          threeFoldRepetition = false,
          currentLayOut = JSON.stringify(board.layOut);
      for( let i = 0; i < previousLayouts.length; i++ ){
        let comparisonLayout = JSON.stringify(previousLayouts[i]);
        if(comparisonLayout === currentLayOut){ repetitions++ }
      };
      if(repetitions >= 2){
        threeFoldRepetition = true
      }
    return threeFoldRepetition
    }
  }

  static postMoveQueries(board, notationPrefix){
    let pawnPromotionNotation = Rules.pawnPromotionQuery(board, notationPrefix),
        otherTeam = board.teamNotMoving(),
        inCheck = this.checkQuery({board: board, teamString: otherTeam}),
        noMoves = this.noLegalMoves(board);
    if( inCheck && noMoves ){
      let attackingTeam = board.allowedToMove;
      board._endGame(attackingTeam);
      return pawnPromotionNotation + "#"
    }
    if( inCheck ){ return pawnPromotionNotation + "+" }
    let threeFold = this.threeFoldRepetition(board, notationPrefix);
    if( noMoves || threeFold ){ board._endGame(); return pawnPromotionNotation }
    return pawnPromotionNotation
  }
}
