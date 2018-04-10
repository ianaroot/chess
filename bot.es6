class Bot {
  constructor(api, team){
    this.api = api;
    this.homeTeam = team;
    this.opponent = Board.opposingTeam(team)
  }

  teamModifier(team){
    if( team === this.homeTeam ){
      return 1
    } else if ( team === this.opponent ){
      return -1
    } else {
      alert("bad input at bot.teamModifier :" + team)
    }
  }

  setInstanceVars(board){
    this.baseBoard = board;
    this.bestBranchValue = null;
    this.hometeamStartingPieceValue = this.baseBoard.pieceValue(this.homeTeam);
    this.opponentStartingPieceValue = this.baseBoard.pieceValue(this.opponent);
    this.startingNotationLength = this.baseBoard.movementNotation.length
    this.homeTeamStartingControlValue = this.weightAccessibleSquares({board: this.baseBoard, team: this.homeTeam})
    this.opponentStartingControlValue = this.weightAccessibleSquares({board: this.baseBoard, team: this.opponent})
    this.baseCaseBranchDepth = 4
  }

  determineMove(board){
    this.setInstanceVars(board);
    let availableMoves = this.api.availableMovesDefault();
        // gamePhase = this.calculateGamePhase({team: homeTeam, board: this.baseBoard}),
        // weightMoves = this.gamePhasePriorities[gamePhase],
    console.log(this.homeTeam)
    let  weightedMoves = this.pingPongMovesStart()

        console.log(weightedMoves)

    let moveIdeas = this.pickNweightiestMovesFrom(weightedMoves, 5)
    let move = moveIdeas[Math.floor(Math.random()*moveIdeas.length)];
    console.log(Board.gridCalculator(move.startPosition), Board.gridCalculator(move.endPosition), move.pieceNotation || 'p', move.captureNotation)
    return move

  }

  pingPongMovesStart(){
    let startTime = Math.floor(Date.now() / 1000),
      moves = this.api.availableMovesDefault();
      // weights = {};
    for(let  i = 0; i < moves.length; i++){
      let move = moves[i];
      this.baseNode = move
      // if( [Board.KING, Board.QUEEN, Board.ROOK].includes(move.pieceNotation) && !move.captureNotation ){ continue };
      let weightsHash = this.pingHomeTeam({board: this.baseBoard, move: move}),
        weight = weightsHash.us - weightsHash.them
        weight = Math.round( weight * 100 )/100
      if(!weights){
        var weights = {};
        weights[weight] = [move]
        this.bestBranchValue = weight
      } else if(weights[weight]){
        weights[weight].push(move)
      } else {
        weights[weight] = [move]
      }
      if( weight > this.bestBranchValue ){ this.bestBranchValue = weight}
    }
    let endTime = Math.floor(Date.now() / 1000)
    console.log( endTime - startTime)
    return weights
  }

  pingHomeTeam({board: board, move: move}){
    let newBoard = this.api.resultOfHypotheticalMove({board: board, moveObject: move}),
      currentNotationLength = newBoard.movementNotation.length
    if( newBoard.gameOver){
      if(newBoard._winner === this.homeTeam){
        return {them: undefined, us: 1000}
      } else if (newBoard._winner === 0){
        return {them: undefined, us: 0}
        // gotta determine whether we wanted to play for stale, maybe just return zero, and if the other options are all negative, that ain't so bad?
      }
    }
    var value = 0
    if( move.captureNotation ){
      value =  value + (Board.pieceValues()[board.pieceTypeAt(move.endPosition)] || 1) //if there's a capture, but the endPosition value is undefined, it must've been en passant.. that or a bug ¯\_(ツ)_/¯
    }
    if( /O/.exec(move.pieceNotation) ){
      value = value + 2
    }
    var newMoves = this.api.availableMovesFor({board: newBoard, movingTeam: this.opponent})
    let currentBranchDepth = currentNotationLength - this.startingNotationLength
    if( currentBranchDepth >= this.baseCaseBranchDepth ){
      // for( let i = 0; i < newMoves.length; i++){
      //   let newMove = newMoves[i];
      //   if( !move.captureNotation || newBoard.pieceTypeAt(newMove.endPosition) === Board.PAWN || currentBranchDepth === 7 ){
          value = value + this.weightAccessibleSquares({board: newBoard, team: this.homeTeam}) - this.homeTeamStartingControlValue
          // console.log(value, newBoard.movementNotation);
          return {them: undefined, us: value}
      //   }
      // }
    }
    for( let i = 0; i < newMoves.length; i++){
      let newMove = newMoves[i];
      var responseValueHash = this.pongOpponent({board: newBoard, move: newMove});
      if ( !usThem ){
        var usThem = responseValueHash
      } else if( responseValueHash.them > usThem.them ){
        var usThem = responseValueHash
      }

      if( move === this.baseNode ){
        let weight = usThem.us - usThem.them + value
        weight = Math.round( weight * 100 )/100
        if( weight + 2.5 < this.bestBranchValue ){ return {us: (usThem.us + value), them: usThem.them} }
      }
    }
    if( !usThem.us ){ usThem.us =  this.weightAccessibleSquares({board: newBoard, team: this.homeTeam}) - this.homeTeamStartingControlValue }
    usThem.us = usThem.us + value
    return usThem
  }

  pongOpponent({board: board, move: move}){
    let newBoard = this.api.resultOfHypotheticalMove({board: board, moveObject: move}),
      currentNotationLength = newBoard.movementNotation.length
    if( newBoard.gameOver){
      if(newBoard._winner === this.opponent){
        return {them: 1000, us: undefined}
      } else if (newBoard._winner === undefined){
        return {them: 0, us: undefined}
        // gotta determine whether we wanted to allow opponent to get stale, but probably again, if we return zero, and other branches are higher, then cool.
      }
    }
    var value = 0
    if( move.captureNotation ){
      value =  value + (Board.pieceValues()[board.pieceTypeAt(move.endPosition)] || 1) //if there's a capture, but the endPosition value is undefined, it must've been en passant.. that or a bug ¯\_(ツ)_/¯
    }
    if( /O/.exec(move.pieceNotation) ){
      value = value + 2
    }
    var newMoves = this.api.availableMovesFor({board: newBoard, movingTeam: this.homeTeam});
    let currentBranchDepth = currentNotationLength - this.startingNotationLength
    if( currentBranchDepth >= this.baseCaseBranchDepth ){
      // for( let i = 0; i < newMoves.length; i++){
      //   let newMove = newMoves[i];
      //   if( !move.captureNotation || newBoard.pieceTypeAt(newMove.endPosition) === Board.PAWN || currentBranchDepth === 7 ){
          value = value + this.weightAccessibleSquares({board: newBoard, team: this.opponent}) - this.opponentStartingControlValue
          // console.log(value, newBoard.movementNotation);
          return {them: value, us: undefined}
      //   }
      // }
    }

    for( let i = 0; i < newMoves.length; i++){
      let newMove = newMoves[i];
      var responseValueHash = this.pingHomeTeam({board: newBoard, move: newMove});
      if ( !usThem ){
        var usThem = responseValueHash
      } else if( responseValueHash.us > usThem.us ){
        var usThem = responseValueHash
      }
    }
    if( !usThem.them ){ usThem.them =  this.weightAccessibleSquares({board: newBoard, team: this.opponent}) - this.opponentStartingControlValue }
    usThem.them = usThem.them + value
    return usThem
  }

  selectRandomMove(){
    let availableMoves = this.api.availableMovesDefault(),
      move = availableMoves[Math.floor(Math.random()*availableMoves.length)];
    return move
  }

  pretendRandomMoveIsWeighted(){
    let move = this.selectRandomMove()
    return {1: [move]} //this is the data structure necesary to mimic the return of weightedMoves
  }

  get gamePhasePriorities(){
    return {
      opening: this.weightMovesForOpening.bind(this),
      middle: this.weightMovesForMiddle.bind(this),
      end: this.pretendRandomMoveIsWeighted.bind(this),
    }
  }

  calculateGamePhase({team: team, board: board}){
    let kingPosition = board.kingPosition(team);
    if ( board.pieceValue( Board.opposingTeam(team) ) <= 13 ) {
      return "end";
    } else if ( !this.backRankHasMinorPieces({team: team, board: board})) {
      return "middle";
    } else {
      return "opening";
    }
    // } else if ( this.backRankHasMinorPieces({team: team, board: board}) && board.pieceHasNotMovedFrom(kingPosition) ){
    //   return "opening";
  }

  backRankHasMinorPieces({team: team, board: board}){
    let backRank = this.backRank({team: team, board: board})
    for( let i = 0; i < backRank.length; i++){
      let pieceObject = backRank[i],
          pieceSpecies = Board.parseSpecies( pieceObject ),
          pieceTeam = Board.parseTeam( pieceObject );
      if( pieceTeam === team && Board.MINOR_PIECES.includes(pieceSpecies) ){ return true}
    }
  }

  backRank({team: team, board: board}){
    if( team === Board.WHITE){
      var squares = ["a1", "b1", "c1", "d1", "e1", "f1", "g1", "h1"]
    } else {
      // do i want to reverse this to mimic looking at the board from black's perspective? computer doesn't care, but human user might appreciate? that's me.. this is my bot not the api
      var squares = ["a8", "b8", "c8", "d8", "e8", "f8", "g8", "h8"]
    }
    let backRankPieces =  []
    for(let i = 0; i < squares.length; i ++){
      let square = squares[i];
      backRankPieces.push( board.pieceObject(square)  )
    }
    return backRankPieces
  }

  // weightMovesForOpening({moves: moves, board: board, team: team}){
  //   let weightedMoves = {}
  //   for(let i = 0; i < moves.length; i++){
  //     let move = moves[i],
  //         weight = 0,
  //         newBoard = this.api.resultOfHypotheticalMove({board: board, moveObject: move}),
  //         newlyAvailableMoves = this.api.availableMovesFor({movingTeam: team, board: newBoard}),
  //         accessibleSquaresWeight = this.weightAccessibleSquares(newlyAvailableMoves) - this.weightAccessibleSquares(moves),
  //         seekCheckMate = this.seekCheckMate(board, move, team),
  //         avoidCheckMate = this.avoidCheckMate(board, move, team),// passing in newBoard seibnce we want to see the opponents possible responses
  //         stackDeckForCastle = this.stackDeckForCastle( board, move, 20 ),
  //         limitNonCastleKingMoves = this.limitNonCastleKingMoves( board, move ),
  //         discourageEarlyQueenMovement = this.discourageEarlyQueenMovement( board, move );
  //         // doubleMoveInOpeningPenalty = this. doubleMoveInOpeningPenalty( board, move );
  //     weight = weight + accessibleSquaresWeight + stackDeckForCastle + limitNonCastleKingMoves + discourageEarlyQueenMovement + seekCheckMate// + doubleMoveInOpeningPenalty
  //     weight = Math.round( weight * 100 )/100
  //
  //     if( weightedMoves[weight] ){
  //       weightedMoves[weight].push( moves[i] )
  //     } else {
  //       weightedMoves[weight] = [moves[i]]
  //     }
  //   }
  //   return weightedMoves
  // }


  noNonPawnsUnderAttack({moves: moves, board: board}){
    for(let i = 0; i < moves.length; i++){
      let move = moves[i]
      if( move.captureNotation && !board.pieceTypeAt(move.endPosition) === Board.PAWN ){
        return true
      }
    }
  }



  // weightMovesRecursivelyForOpening(board, N){
  //   let moves = this.api.availableMovesDefault(),
  //   weights = {}
  //   for(let  i = 0; i < moves.length; i++){
  //     let move = moves[i];
  //     this.baseNode = move
  //     if( [Board.KING, Board.QUEEN, Board.ROOK].includes(move.pieceNotation) && !move.captureNotation ){ continue };
  //     let weight = (this.recursivelyProjectMoves({board: board, move: move, team: Board.WHITE, value: 0, depth: N, iteration: 0}));
  //     if(weights[weight]){
  //       weights[weight].push(move)
  //     } else {
  //       weights[weight] = [move]
  //     }
  //   }
  //   return weights
  // }
  //
	// seekCheckMate(board, move, team){
  //   let newBoard = this.api.resultOfHypotheticalMove({board: board, moveObject: move})
  //   if( board._winner === team){
  //     return 1000
  //   } else {
  //     return 0
  //   }
  // }
  //
  // doubleMoveInOpeningPenalty(board, move){
  //   if( !board.pieceHasNotMovedFrom(move.startPosition)){
  //     return -5
  //   } else {
  //     return 0
  //   }
  // }
  //
  // discourageEarlyQueenMovement(board, move){
  //   let pieceType = board.pieceTypeAt(move.startPosition);
  //   if( pieceType === Board.QUEEN ){
  //     return - 10
  //   } else {
  //     return 0
  //   }
  // }
  //
  // limitNonCastleKingMoves(board, move){
  //   let pieceType = board.pieceTypeAt(move.startPosition);
  //   if( pieceType === Board.KING && !Bot.CASTLEENDPOSITIONS.includes(move.endPosition) ){
  //     return - 10
  //   } else {
  //     return 0
  //   }
  // }

  weightAccessibleSquares({board: board, team: team}){
    let squareValues = 0,
      controlledPositions = Rules.positionsControlledByTeam({board: board, team: team, exemptions: [Board.KING, Board.ROOK, Board.QUEEN]}) ;//should be made accessible through the api
    for( let i = 0; i < controlledPositions.length; i++){
      let square = controlledPositions[i],
        squareValue = Bot.SQUAREWEIGHTS[square];
      squareValues = squareValues + squareValue
    }
    squareValues = Math.round( squareValues * 100 )/100
    return squareValues
  }

  static get SQUAREWEIGHTS() {
    return {

      35: .2,
      36: .2,
      27: .2,
      28: .2,

      18: .09,
      19: .09,
      20: .09,
      21: .09,
      26: .09,
      29: .09,
      34: .09,
      37: .09,
      42: .09,
      43: .09,
      44: .09,
      45: .09,


      9:  .04,
      10: .04,
      11: .04,
      12: .04,
      13: .04,
      14: .04,

      17: .04,
      22: .04,
      25: .04,
      30: .04,
      33: .04,
      38: .04,
      41: .04,
      46: .04,

      49: .04,
      50: .04,
      51: .04,
      52: .04,
      53: .04,
      54: .04,

      0: .01,
      1: .01,
      2: .01,
      3: .01,
      4: .01,
      5: .01,
      6: .01,
      7: .01,

      8:  .01,
      16: .01,
      24: .01,
      32: .01,
      40: .01,
      48: .01,

      56: .01,
      57: .01,
      58: .01,
      59: .01,
      60: .01,
      61: .01,
      62: .01,
      63: .01,

      15: .01,
      23: .01,
      31: .01,
      39: .01,
      47: .01,
      55: .01,
    }
  }


  sortArray(array){
    let sortNumber = function(a,b) {
        return a - b;
    }
    return array.sort(sortNumber);
  }


  pickNweightiestMovesFrom(weightedMoves, n){
    let nWeights = [],
      weights = Object.keys(weightedMoves),
      sortedWeights = this.sortArray(weights),
      highestWeight = sortedWeights[sortedWeights.length -1];
    for(let i = sortedWeights.length -1 ; i > -1 && nWeights.length < n; i--){
      let weight = sortedWeights[i],
        moves = weightedMoves[weight];
      if((highestWeight - 2) < weight){
        for( let j = 0; j < moves.length; j++){
          nWeights.push(moves[j])
        }
      }
    }
    return nWeights
  }




}
