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
  }

  determineMove(board){
    this.setInstanceVars(board);
    let availableMoves = this.api.availableMovesDefault(),
        homeTeam = this.baseBoard.allowedToMove,
    // this.homeTeam = homeTeam;
    // let
        // gamePhase = this.calculateGamePhase({team: homeTeam, board: this.baseBoard}),
        // weightMoves = this.gamePhasePriorities[gamePhase],
        // weightedMoves = weightMoves({moves: availableMoves, board: this.baseBoard, team: homeTeam});

        weightedMoves = this.weightMovesRecursivelyForOpening(this.baseBoard, 3)

        console.log("weightedMoves")
        console.log(weightedMoves)

        // weightedMoves = this.weightMovesRecursively(board)

    let moveIdeas = this.pickNweightiestMovesFrom(weightedMoves, 5)
    let move = moveIdeas[Math.floor(Math.random()*moveIdeas.length)];
    console.log(homeTeam)
    console.log(move)
    return move

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

  weightMovesForMiddle({moves: moves, board: board, team: team}){
    let weightedMoves = {}
    for(let i = 0; i < moves.length; i++){
      let move = moves[i],
        weight = 0,
        stackDeckForCastle = this.stackDeckForCastle( board, move, 40 );
      weight = weight + stackDeckForCastle
      weight = Math.round( weight * 100 )/100

      if( weightedMoves[weight] ){
        weightedMoves[weight].push( moves[i] )
      } else {
        weightedMoves[weight] = [moves[i]]
      }
    }
   return weightedMoves
  }

  weightMovesForOpening({moves: moves, board: board, team: team}){
    let weightedMoves = {}
    for(let i = 0; i < moves.length; i++){
      let move = moves[i],
          weight = 0,
          newBoard = this.api.resultOfHypotheticalMove({board: board, moveObject: move}),
          newlyAvailableMoves = this.api.availableMovesFor({movingTeam: team, board: newBoard}),
          accessibleSquaresWeight = this.weightAccessibleSquares(newlyAvailableMoves) - this.weightAccessibleSquares(moves),
          seekCheckMate = this.seekCheckMate(board, move, team),
          avoidCheckMate = this.avoidCheckMate(board, move, team),// passing in newBoard seibnce we want to see the opponents possible responses
          stackDeckForCastle = this.stackDeckForCastle( board, move, 20 ),
          limitNonCastleKingMoves = this.limitNonCastleKingMoves( board, move ),
          discourageEarlyQueenMovement = this.discourageEarlyQueenMovement( board, move );
          // doubleMoveInOpeningPenalty = this. doubleMoveInOpeningPenalty( board, move );
      weight = weight + accessibleSquaresWeight + stackDeckForCastle + limitNonCastleKingMoves + discourageEarlyQueenMovement + seekCheckMate// + doubleMoveInOpeningPenalty
      weight = Math.round( weight * 100 )/100

      if( weightedMoves[weight] ){
        weightedMoves[weight].push( moves[i] )
      } else {
        weightedMoves[weight] = [moves[i]]
      }
    }
    return weightedMoves
  }

  logTime(){
    console.log(Math.floor(Date.now() / 1000))
  }

  benchMarkRecursivelyProjectMoves(N){
    this.logTime()
    let startTime = Math.floor(Date.now() / 1000),
      moves = this.api.availableMovesDefault(),
      weights = {}
    for(let  i = 0; i < moves.length; i++){
      let move = moves[i];
      if( [Board.KING, Board.QUEEN, Board.ROOK].includes(move.pieceNotation) && !Rules.pieceIsAttacked({board: this.baseBoard, }) ){ continue }
      // if( move.startPosition !== 26 || move.endPosition !== 35){ continue}
      this.baseNode = move
      let weight = (this.recursivelyProjectMoves({board: gameController.board, move: move, team: this.homeTeam, depth: N, iteration: 0}))
      if(weights[weight]){
        weights[weight].push(move)
      } else {
        weights[weight] = [move]
      }
    }
    let endTime = Math.floor(Date.now() / 1000)
    console.log(weights)
    console.log( endTime - startTime)
  }

  enemyLossesAreGreater(board, newBoard){
    return (board.pieceValue(this.homeTeam) - newBoard.pieceValue(this.homeTeam) ) < (board.pieceValue(this.opponent) - newBoard.pieceValue(this.opponent))
  }

  homeTeamLossesAreGreater(board, newBoard){
    return (board.pieceValue(this.homeTeam) - newBoard.pieceValue(this.homeTeam) ) > (board.pieceValue(this.opponent) - newBoard.pieceValue(this.opponent))
  }

  noNonPawnsUnderAttack({moves: moves, board: board}){
    for(let i = 0; i < moves.length; i++){
      let move = moves[i]
      if( move.captureNotation && !board.pieceTypeAt(move.endPosition) === Board.PAWN ){
        return true
      }
    }
  }

  pointLossExceeds({board: board, newBoard: newBoard, team: team, minVal: minVal}){
    // debugger
    (board.pieceValue(team) - newBoard.pieceValue(team) ) > minVal
  }


  recursivelyProjectMoves({board: board, move: move, depth: depth, iteration: iteration}){
    let pieceNotation = move.pieceNotation
    if( /O/.exec(pieceNotation) && board.allowedToMove === this.homeTeam ){ return 2 }
    var value;
    let newBoard = this.api.resultOfHypotheticalMove({board: board, moveObject: move});
    if( newBoard._winner === this.homeTeam){
      return 1000
    } else if ( newBoard._winner === this.opponent ){
      return -1000
    } else if (iteration === depth || newBoard.gameOver){
      let accessibleSquaresWeight = this.weightAccessibleSquares(newBoard),
        opponentPieceValueDifferential = this.opponentStartingPieceValue - newBoard.pieceValue(this.opponent),
        homeTeamPieceValueDifferential = this.hometeamStartingPieceValue - newBoard.pieceValue(this.homeTeam),
        total = accessibleSquaresWeight - homeTeamPieceValueDifferential + opponentPieceValueDifferential;
      if(total === undefined){debugger}
      return total
    } else {
      iteration++
      let newlyAvailableMoves = this.api.availableMovesFor({movingTeam: newBoard.allowedToMove, board: newBoard});
      for( let i = 0; i < newlyAvailableMoves.length; i++){
        let nextMove = newlyAvailableMoves[i]
        // var value = (value || 0) + this.recursivelyProjectMoves({board: newBoard, move: newlyAvailableMoves[i], depth: depth, iteration: iteration})
        if(!value ){
          value = this.recursivelyProjectMoves({board: newBoard, move: nextMove, depth: depth, iteration: iteration})
        } else {
          let latestValue = this.recursivelyProjectMoves({board: newBoard, move: nextMove, depth: depth, iteration: iteration})
          if ( value > latestValue ){ value = latestValue }
        }
        if( value + 2 < this.bestBranchValue ){ return value }
      }
    }
    // if( isNaN(value) ){debugger}
    // console.log("returning zero, yo shit is fucked up")
    // console.log(this.baseNode, value)
    return value || 0
  }

  weightMovesRecursivelyForOpening(board, N){
    let moves = this.api.availableMovesDefault(),
    weights = {}
    for(let  i = 0; i < moves.length; i++){
      let move = moves[i];
      this.baseNode = move
      if( [Board.KING, Board.QUEEN, Board.ROOK].includes(move.pieceNotation) && !move.captureNotation ){ continue };
      let weight = (this.recursivelyProjectMoves({board: board, move: move, team: Board.WHITE, value: 0, depth: N, iteration: 0}));
      if(weights[weight]){
        weights[weight].push(move)
      } else {
        weights[weight] = [move]
      }
    }
    return weights
  }

	seekCheckMate(board, move, team){
    let newBoard = this.api.resultOfHypotheticalMove({board: board, moveObject: move})
    if( board._winner === team){
      return 1000
    } else {
      return 0
    }
  }

  doubleMoveInOpeningPenalty(board, move){
    if( !board.pieceHasNotMovedFrom(move.startPosition)){
      return -5
    } else {
      return 0
    }
  }

  discourageEarlyQueenMovement(board, move){
    let pieceType = board.pieceTypeAt(move.startPosition);
    if( pieceType === Board.QUEEN ){
      return - 10
    } else {
      return 0
    }
  }

  limitNonCastleKingMoves(board, move){
    let pieceType = board.pieceTypeAt(move.startPosition);
    if( pieceType === Board.KING && !Bot.CASTLEENDPOSITIONS.includes(move.endPosition) ){
      return - 10
    } else {
      return 0
    }
  }

  static get CASTLEENDPOSITIONS() {
    return ['c1', 'g1', 'c8', 'g8']
  }

  static get KINGSTARTPOSITIONS(){
    return ['e1', 'e8']
  }

  stackDeckForCastle(board, move, weight){
    let pieceType = board.pieceTypeAt(move.startPosition);
    if( pieceType === Board.KING && Bot.KINGSTARTPOSITIONS.includes(move.startPosition) &&
    // (board.queenSideCastleViableFrom(move.startPosition) || board.kingSideCastleViableFrom(move.startPosition)) && Bot.CASTLEENDPOSITIONS.includes(move.endPosition)      ) {
    (board.queenSideCastleViableFor(board.allowedToMove) || board.kingSideCastleViableFor(board.allowedToMove)) && Bot.CASTLEENDPOSITIONS.includes(move.endPosition)      ) {
      return weight
    }
    else {
      return 0
    }
  }

  weightAccessibleSquares(board){
    let squareValues = 0,
      controlledPositions = Rules.positionsControlledByTeam({board: board, team: this.homeTeam}) ;//should be made accessible through the api
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
      // d5: 1.6,
      // d4: 1.6,
      // e5: 1.6,
      // e4: 1.6,

      35: .8,
      36: .8,
      27: .8,
      28: .8,

      // c3: .8,
      // c4: .8,
      // c5: .8,
      // c6: .8,
      // d3: .8,
      // d6: .8,
      // e3: .8,
      // e6: .8,
      // f3: .8,
      // f4: .8,
      // f5: .8,
      // f6: .8,

      18: .1,
      19: .1,
      20: .1,
      21: .1,
      26: .1,
      29: .1,
      34: .1,
      37: .1,
      42: .1,
      43: .1,
      44: .1,
      45: .1,

      // b2: .2,
      // b3: .2,
      // b4: .2,
      // b5: .2,
      // b6: .2,
      // b7: .2,
      // c2: .2,
      // c7: .2,
      // d2: .2,
      // d7: .2,
      // e2: .2,
      // e7: .2,
      // f2: .2,
      // f7: .2,
      // g2: .2,
      // g3: .2,
      // g4: .2,
      // g5: .2,
      // g6: .2,
      // g7: .2,

      9:  .02,
      10: .02,
      11: .02,
      12: .02,
      13: .02,
      14: .02,

      17: .02,
      22: .02,
      25: .02,
      30: .02,
      33: .02,
      38: .02,
      41: .02,
      46: .02,

      49: .02,
      50: .02,
      51: .02,
      52: .02,
      53: .02,
      54: .02,

      // a1: .1,
      // a2: .1,
      // a3: .1,
      // a4: .1,
      // a5: .1,
      // a6: .1,
      // a7: .1,
      // a8: .1,
      // b1: .1,
      // b8: .1,
      // c1: .1,
      // c8: .1,
      // d1: .1,
      // d8: .1,
      // e1: .1,
      // e8: .1,
      // f1: .1,
      // f8: .1,
      // g1: .1,
      // g8: .1,
      // h1: .1,
      // h2: .1,
      // h3: .1,
      // h4: .1,
      // h5: .1,
      // h6: .1,
      // h7: .1,
      // h8: .1

      0: .004,
      1: .004,
      2: .004,
      3: .004,
      4: .004,
      5: .004,
      6: .004,
      7: .004,

      8: .004,
      16: .004,
      24: .004,
      32: .004,
      40: .004,
      48: .004,

      56: .004,
      57: .004,
      58: .004,
      59: .004,
      60: .004,
      61: .004,
      62: .004,
      63: .004,

      15: .004,
      23: .004,
      31: .004,
      39: .004,
      47: .004,
      55: .004,
    }
  }


  sortArray(array){
    let sortNumber = function(a,b) {
        return a - b;
    }
    return array.sort(sortNumber);
  }

  // copyArray(array){
  //   let newArray = []
  //   for(let i = 0; i < array.length; i++){
  //     newArray.push( array[i] )
  //   };
  //   return newArray
  // }


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


// documentation
// bot should have a function called determineMove. it will take in a hash containing a board, and the this.api, and it
// will return an array, with the alphaNumeric startPosition and endPosition



// recursivelyProjectMoves({board: board, move: move, depth: depth, iteration: iteration}){
//   var value;
//   if( Board.pieceValues( board.pieceTypeAt(move.startPosition) ) < Board.pieceValues( board.pieceTypeAt(move.endPosition) ) ){
//     console.log("pieceValue");
//     return 20*this.teamModifier(board.allowedToMove)
//   }
//   let newBoard = this.api.resultOfHypotheticalMove({board: board, moveObject: move});
//   // set gamePhase priorities
//   let newlyAvailableMoves = this.api.availableMovesFor({movingTeam: newBoard.allowedToMove, board: newBoard});
//   if( newBoard._winner === this.homeTeam){
//     console.log("mate");
//     return 1000
//   } else if ( newBoard._winner === this.opponent ){
//     console.log("mate");
//     // return 1 //FOR CHECKING TOTAL END NODES
//     return -1000
//   //} else if (this.pointLossExceeds({board: this.baseBoard, newBoard:newBoard, minVal: 4, team: this.homeTeam}) ){
//   //   return -20
//   // }else if (this.pointLossExceeds({board: this.baseBoard, newBoard:newBoard, minVal: 4, team: this.opponent})){
//   //   return 20
//   } else if (iteration === depth || board.gameOver){//NOW WE GRADE THE END STATE OF THE BOARD
//
//     // THIS ONLY MAKES SENSE IF YOU START AND END WITH THE SAME TEAM ALLOWED TO MOVE
//     // ACTUALLY MAYBE NOT SINCE WE GET TO SPECIFY WHICH TEAM WE WANT THE MOVES FOR ON THE NEXT BOARD
//     let accessibleSquaresWeight = this.weightAccessibleSquares(this.api.availableMovesDefault()) - this.weightAccessibleSquares(this.api.availableMovesFor({board: newBoard, movingTeam: this.homeTeam}))
//     // debugger
//     // if( this.enemyLossesAreGreater(this.baseBoard, newBoard) && this.noNonPawnsUnderAttack({moves: newlyAvailableMoves, board: newBoard}) ){ //&& no moves are attacks
//     //   return 10
//     // } else if( this.homeTeamLossesAreGreater(this.baseBoard, newBoard) && this.noNonPawnsUnderAttack({moves: newlyAvailableMoves, board: newBoard}) ){
//     //   return -10
//     // }
//     // return 0
//     // return 1 //FOR CHECKING TOTAL END NODES
//     console.log(this.homeTeam);
//     console.log(newBoard.allowedToMove)
//     console.log(accessibleSquaresWeight);
//     return accessibleSquaresWeight
//   } else {
//     iteration++
//     for( let i = 0; i < newlyAvailableMoves.length; i++){
//       // var value = (value || 0) + this.recursivelyProjectMoves({board: newBoard, move: newlyAvailableMoves[i], depth: depth, iteration: iteration})
//       if(!value ){
//         value = this.recursivelyProjectMoves({board: newBoard, move: newlyAvailableMoves[i], depth: depth, iteration: iteration})
//       } else if ( value > this.recursivelyProjectMoves({board: newBoard, move: newlyAvailableMoves[i], depth: depth, iteration: iteration}) ){
//         value = this.recursivelyProjectMoves({board: newBoard, move: newlyAvailableMoves[i], depth: depth, iteration: iteration})
//       }
//     }
//   }
//   return value
// }
