class Bot {
  constructor(api, team){
    this.api = api;
    this.team = team
  }

  determineMove(args){
    // this.api = args["api"];
    let board = args["board"],
        availableMoves = this.api.availableMovesDefault(),
        homeTeam = board.allowedToMove,
    // this.team = homeTeam;
    // let
        gamePhase = this.calculateGamePhase({team: homeTeam, board: board}),
        weightMoves = this.gamePhasePriorities[gamePhase],
        weightedMoves = weightMoves({moves: availableMoves, board: board, team: homeTeam});

        console.log("weightedMoves")
        console.log(weightedMoves)

    let moveIdeas = this.pickNweightiestMovesFrom(weightedMoves, 3)
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
    if ( board.remainingPieceValueFor( Board.opposingTeam(team) ) <= 13 ) {
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

  avoidCheckMate(board, move, team){

  }

  logTime(){
    console.log(Math.floor(Date.now() / 1000))
  }

  benchMarkRecursivelyProjectMoves(){
    this.logTime()
    let startTime = Math.floor(Date.now() / 1000),
      moves = gameController.api.availableMovesDefault(),
      v = 0
    for(let  i = 0; i < moves.length; i++){
      v = v + (gameController._whiteBot.recursivelyProjectMoves({board: gameController.board, move: moves[i], team: Board.WHITE, value: 0, depth: 2, iteration: 0}))
    }
    let endTime = Math.floor(Date.now() / 1000)
    console.log(v)
    console.log( endTime - startTime)
  }

  recursivelyProjectMoves({board: board, move: move, depth: depth, iteration: iteration}){
    // console.log(move.captureNotation)
    let newBoard = this.api.resultOfHypotheticalMove({board: board, moveObject: move});
    if( newBoard._winner === this.team){
      // console.log(newBoard.movementNotation)
      // console.log('good checkmate')
      // return 1
      return 1
    } else if ( newBoard._winner === Board.opposingTeam(this.team) ){
      // console.log('bad checkmate')
      // console.log(newBoard.movementNotation)
      return -1
      // return 1 //FOR CHECKING TOTAL END NODES
    } else if (iteration === depth || board.gameOver){
      return 0
      // return 1 //FOR CHECKING TOTAL END NODES
    } else {
      let newlyAvailableMoves = this.api.availableMovesFor({movingTeam: newBoard.allowedToMove, board: newBoard});
      iteration++
      for( let i = 0; i < newlyAvailableMoves.length; i++){
        var value = (value || 0) + this.recursivelyProjectMoves({board: newBoard, move: newlyAvailableMoves[i], depth: depth, iteration: iteration})
        // return 1
      }
    }
    return value
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

  weightAccessibleSquares(moves){
    let squareValues = 0;
    for( let i = 0; i < moves.length; i++){
      let square = moves[i].endPosition,
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

      35: 1.6,
      36: 1.6,
      27: 1.6,
      28: 1.6,

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

      18: .8,
      19: .8,
      20: .8,
      21: .8,
      26: .8,
      29: .8,
      34: .8,
      37: .8,
      42: .8,
      43: .8,
      44: .8,
      45: .8,

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

      9: .2,
      10: .2,
      11: .2,
      12: .2,
      13: .2,
      14: .2,

      17: .2,
      22: .2,
      25: .2,
      30: .2,
      33: .2,
      38: .2,
      41: .2,
      46: .2,

      49: .2,
      50: .2,
      51: .2,
      52: .2,
      53: .2,
      54: .2,

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

      1: .1,
      2: .1,
      3: .1,
      4: .1,
      5: .1,
      6: .1,
      7: .1,
      8: .1,
      16: .1,
      24: .1,
      32: .1,
      40: .1,
      48: .1,
      56: .1,
      57: .1,
      58: .1,
      59: .1,
      60: .1,
      61: .1,
      62: .1,
      63: .1,
      15: .1,
      23: .1,
      31: .1,
      39: .1,
      47: .1,
      55: .1,
      63: .1
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
      sortedWeights = this.sortArray(weights);
    for(let i = sortedWeights.length -1 ; i > -1 && nWeights.length < n; i--){
      let weight = sortedWeights[i],
        moves = weightedMoves[weight];
      for( let j = 0; j < moves.length; j++){
        nWeights.push(moves[j])
      }
    }
    return nWeights
  }




}


// documentation
// bot should have a function called determineMove. it will take in a hash containing a board, and the this.api, and it
// will return an array, with the alphaNumeric startPosition and endPosition
