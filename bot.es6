class Bot {
  // undo doesn't query bot move
  // TODO urgent, just got killed by a pawn stepping forward.
  // it was from start, killing a queen.
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
    // console.log(move)
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
          potentialMoveNumber = newlyAvailableMoves.length;
          weight = weight + potentialMoveNumber

      if( weightedMoves[weight] ){
        weightedMoves[weight].push( moves[i] )
      } else {
        weightedMoves[weight] = [moves[i]]
      }
    }
    return weightedMoves
  }

  // sortArray(array){
  //   array.sort(function(a,b) {
  //       if (a < b) { return 1; }
  //       else if (a == b) { return 0; }
  //       else { return -1; }
  //   });
  //   return array
  // }

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
      values = Object.values(weightedMoves);
    for( let i = values.length - 1; i > -1 && nWeights.length < n; i--){
      if(Array.isArray(values[i]) ){
        for( let j = 0; j < values[i].length; j++){
          nWeights.push(values[i][j])
        }
      } else {
        nWeights.push(values[i])
      }
    }
    // console.log("nWeights")
    // console.log(nWeights)
    return nWeights
  }
}



// bot should have a function called determineMove. it will take in a hash containing a board, and the this.api, and it
// will return an array, with the alphaNumeric startPosition and endPosition
