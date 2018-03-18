class Bot {
  constructor(){

  }

  determineMove(args){
    this.api = args["api"];
    let board = args["board"],
        availableMoves = this.api.availableMovesDefault(),
        homeTeam = board.allowedToMove,
        // gamePhase = this.calculateGamePhase({team: homeTeam, board: board}),
        weightedMoves = this.weightMoves({moves: availableMoves, board: board, team: homeTeam});


    let moveIdeas = this.pickNweightiestMovesFrom(weightedMoves, 5)

    let move = moveIdeas[Math.floor(Math.random()*moveIdeas.length)];

    return move

  }

  calculateGamePhase({team: team, board: board}){
    let gamePhase = "opening";
    if ( this.backRankHasMinorPieces({team: team, board: board}) ){
      debugger
    }
  }

  backRankHasMinorPieces({team: team, board: board}){
    let backRank = this.backRank({team: team, board: board})
  }

  backRank({team: team, board: board}){
    // TODO should the this.api have it's own white etc...
    if( team === Board.WHITE){
      var rankTiles = ["a1", "b1", "c1", "d1", "e1", "f1", "g1", "h1"]
    } else {
      // do i want to reverse this mimic looking at the board from black's perspective?
      var rankTiles = ["a8", "b8", "c8", "d8", "e8", "f8", "g8", "h8"]
    }
    let backRankPieces =  []
    for(let i = 0; i < rankTiles.length; i ++){
      let tile = rankTiles[i];
      backRankPieces.push( board  )
    }
  }

  weightMoves({moves: moves, board: board, team: team}){
    let weightedMoves = {}
    for(let i = 0; i < moves.length; i++){
      let move = moves[i],
          newBoard = this.api.resultOfHypotheticalMove({board: board, alphaNumericStartPosition: move[0], alphaNumericEndPosition: move[1]}),
          newlyAvailableMoves = this.api.availableMovesFor({movingTeam: team, board: newBoard}),
          potentialMoveNumber = newlyAvailableMoves.length;
      if( weightedMoves[potentialMoveNumber] ){
        weightedMoves[potentialMoveNumber].push( moves[i] )
      } else {
        weightedMoves[potentialMoveNumber] = [moves[i]]
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
    return nWeights
  }
}



// bot should have a function called determineMove. it will take in a hash containing a board, and the this.api, and it
// will return an array, with the alphaNumeric startPosition and endPosition
