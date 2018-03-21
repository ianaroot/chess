class Bot {
  // undo doesn't query bot move
  // TODO urgent, just got killed by a pawn stepping forward.
  // it was from start, killing a queen.
  // TODO add castle check to calculateGamePhase
  // TODO occasional parse error in stackDeckForCastle
  constructor(){

  }

  determineMove(args){
    this.api = args["api"];
    let board = args["board"],
        availableMoves = this.api.availableMovesDefault(),
        homeTeam = board.allowedToMove,
        gamePhase = this.calculateGamePhase({team: homeTeam, board: board}),
        weightMoves = this.gamePhasePriorities[gamePhase],
        weightedMoves = weightMoves({moves: availableMoves, board: board, team: homeTeam});

        console.log("weightedMoves")
        console.log(weightedMoves)


        // console.log(move)
    let moveIdeas = this.pickNweightiestMovesFrom(weightedMoves, 5)
    // console.log("moveIdeas below")
    // console.log(moveIdeas)
    let move = moveIdeas[Math.floor(Math.random()*moveIdeas.length)];
    console.log(homeTeam)
    console.log(move)
    return move

  }

  selectRandomMove(){
    let availableMoves = this.api.availableMovesDefault(),
      move = availableMoves[Math.floor(Math.random()*availableMoves.length)];
      // console.log("inside random " + move)
    return move
  }

  pretendRandomMoveIsWeighted(){
    let move = this.selectRandomMove()
    return {1: [move]} //this is the data structure necesary to mimic the return of weightedMoves
  }

  get gamePhasePriorities(){
    return {
      opening: this.weightMovesForOpening.bind(this),
      middle: this.pretendRandomMoveIsWeighted.bind(this),
      end: this.pretendRandomMoveIsWeighted.bind(this),
    }
  }

  calculateGamePhase({team: team, board: board}){
    let gamePhase = "opening";
    if ( board.remainingPieceValueFor( Board.opposingTeam(team) ) <= 13 ) {
      return "end";
    } else if ( this.backRankHasMinorPieces({team: team, board: board}) ){
      return gamePhase;
    } else {
      gamePhase = "middle";
      return gamePhase;
    }
  }

  backRankHasMinorPieces({team: team, board: board}){
    let backRank = this.backRank({team: team, board: board})
    // response = false //going to otherwise use implicit return of undefined
    for( let i = 0; i < backRank.length; i++){
      let pieceObject = backRank[i],
          pieceSpecies = Board.parseSpecies( pieceObject ),
          pieceTeam = Board.parseTeam( pieceObject );
      if( pieceTeam === team && Board.MINOR_PIECES.includes(pieceSpecies) ){ return true}
    }
  }

  backRank({team: team, board: board}){
    // TODO should the this.api have it's own white etc...
    if( team === Board.WHITE){
      var squares = ["a1", "b1", "c1", "d1", "e1", "f1", "g1", "h1"]
    } else {
      // do i want to reverse this mimic looking at the board from black's perspective?
      var squares = ["a8", "b8", "c8", "d8", "e8", "f8", "g8", "h8"]
    }
    let backRankPieces =  []
    for(let i = 0; i < squares.length; i ++){
      let square = squares[i];
      backRankPieces.push( board.pieceObject(square)  )
    }
    return backRankPieces
  }

  weightMovesForOpening({moves: moves, board: board, team: team}){
    let weightedMoves = {}
    for(let i = 0; i < moves.length; i++){
      let move = moves[i],
          weight = 0,
          newBoard = this.api.resultOfHypotheticalMove({board: board, alphaNumericStartPosition: move.startPosition, alphaNumericEndPosition: move.endPosition}),
          newlyAvailableMoves = this.api.availableMovesFor({movingTeam: team, board: newBoard}),
          accessibleSquaresWeight = this.weightAccessibleSquares(newlyAvailableMoves),
          potentialMoveNumber = newlyAvailableMoves.length,
          stackDeckForCastle = this.stackDeckForCastle( board, move ),
          limitNonCastleMoves = this.limitNonCastleMoves( board, move ),
          discourageEarlyQueenMovement = this.discourageEarlyQueenMovement( board, move );
      weight = weight + accessibleSquaresWeight + stackDeckForCastle + limitNonCastleMoves + discourageEarlyQueenMovement
      weight = Math.round( weight * 100 )/100

      if( weightedMoves[weight] ){
        weightedMoves[weight].push( moves[i] )
      } else {
        weightedMoves[weight] = [moves[i]]
      }
    }
    return weightedMoves
  }

  discourageEarlyQueenMovement(board, move){
    let pieceType = board.pieceTypeAt(move.startPosition);
    if( pieceType === Board.QUEEN ){
      return - 10
    } else {
      return 0
    }

  }

  limitNonCastleMoves(board, move){
    let pieceType = board.pieceTypeAt(move.startPosition);
    if( pieceType === Board.KING && !Bot.CASTLEENDPOSITIONS.includes(move.endPosition) ){
      return - 10
    } else {
      return 0
    }
  }

  static get CASTLEENDPOSITIONS() {
    // TODO organize this shit by team
    return ['c1', 'g1', 'c8', 'g8']
  }

  static get KINGSTARTPOSITIONS(){
    return ['e1', 'e8']
  }

  stackDeckForCastle(board, move){
    let pieceType = board.pieceTypeAt(move.startPosition);
    console.log("stackDeckForCastle " + move)
    if( pieceType === Board.KING && Bot.KINGSTARTPOSITIONS.includes(move.startPosition) &&
    (board.queenSideCastleViableFrom(move.startPosition) || board.kingSideCastleViableFrom(move.startPosition)) && Bot.CASTLEENDPOSITIONS.includes(move.endPosition)      ) {
      return 20
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
    // console.log(squareValues)
    squareValues = Math.round( squareValues * 100 )/100
    return squareValues
  }

  static get SQUAREWEIGHTS() {
    return {
      d5: 1,
      d4: 1,
      e5: 1,
      e4: 1,

      c3: .8,
      c4: .8,
      c5: .8,
      c6: .8,
      d3: .8,
      d6: .8,
      e3: .8,
      e6: .8,
      f3: .8,
      f4: .8,
      f5: .8,
      f6: .8,

      b2: .6,
      b3: .6,
      b4: .6,
      b5: .6,
      b6: .6,
      b7: .6,
      c2: .6,
      c7: .6,
      d2: .6,
      d7: .6,
      e2: .6,
      e7: .6,
      f2: .6,
      f7: .6,
      g2: .6,
      g3: .6,
      g4: .6,
      g5: .6,
      g6: .6,
      g7: .6,

      a1: .4,
      a2: .4,
      a3: .4,
      a4: .4,
      a5: .4,
      a6: .4,
      a7: .4,
      a8: .4,
      b1: .4,
      b8: .4,
      c1: .4,
      c8: .4,
      d1: .4,
      d8: .4,
      e1: .4,
      e8: .4,
      f1: .4,
      f8: .4,
      g1: .4,
      g8: .4,
      h1: .4,
      h2: .4,
      h3: .4,
      h4: .4,
      h5: .4,
      h6: .4,
      h7: .4,
      h8: .4
    }
  }
  sortArray(array){
    // array.sort(function(a,b) {
    //     if (a < b) { return 1; }
    //     else if (a == b) { return 0; }
    //     else { return -1; }
    // });
    // return array
    let sortNumber = function(a,b) {
        return a - b;
    }

    return array.sort(sortNumber);

    // return (array.join(","));
  }

  // copyArray(array){
  //   let newArray = []
  //   for(let i = 0; i < array.length; i++){
  //     newArray.push( array[i] )
  //   };
  //   return newArray
  // }


  pickNweightiestMovesFrom(weightedMoves, n){
    // if (weightedMoves[1]){debugger}
    let nWeights = [],
      weights = Object.keys(weightedMoves),
      sortedWeights = this.sortArray(weights);
      console.log("sortedWeights");
      console.log(sortedWeights);
      // values = Object.values(weightedMoves);
      // debugger
    // for(let i = 0; i < sortedWeights.length && nWeights.length < n; i++){
    for(let i = sortedWeights.length -1 ; i > -1 && nWeights.length < n; i--){
      let weight = sortedWeights[i],
        moves = weightedMoves[weight];
      for( let j = 0; j < moves.length; j++){
        nWeights.push(moves[j])
      }
    }



    // for( let i = values.length - 1; i > -1 && nWeights.length < n; i--){
    //   if(Array.isArray(values[i]) ){
    //     for( let j = 0; j < values[i].length; j++){
    //       nWeights.push(values[i][j])
    //     }
    //   } else {
    //     nWeights.push(values[i])
    //   }
    // }
    console.log("nWeights")
    console.log(nWeights)
    return nWeights
  }
}



// bot should have a function called determineMove. it will take in a hash containing a board, and the this.api, and it
// will return an array, with the alphaNumeric startPosition and endPosition
