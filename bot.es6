class Bot {
  constructor(){

  }
  determineMove(args){
    let board = args["board"],
        api = args["api"],
        availableMoves = api.availableMovesDefault(),
        homeTeam = board.allowedToMove,
        moveWeights = {};
        // move = availableMoves[Math.floor(Math.random()*availableMoves.length)];

    for(let i = 0; i < availableMoves.length; i++){
      let move = availableMoves[i],
          newBoard = api.resultOfHypotheticalMove({board: board, alphaNumericStartPosition: move[0], alphaNumericEndPosition: move[1]}),
          newlyAvailableMoves = api.availableMovesFor({movingTeam: homeTeam, board: newBoard}),
          potentialMoveNumber = newlyAvailableMoves.length;
      if( moveWeights[potentialMoveNumber] ){
      // if ( potentialMoveNumber === 21){
        // debugger
        moveWeights[potentialMoveNumber].push( availableMoves[i] )
      } else {
        moveWeights[potentialMoveNumber] = [availableMoves[i]]
      }

    }
    let weights = [];
    for (var property in moveWeights) {
      if (moveWeights.hasOwnProperty(property)) {
        weights.push(property)
      }
    }
    let weightsCopy = this.copyArray(weights),
      sortedWeights = this.sortArray(weightsCopy),
      moveIdeas = [];
      // debugger
    for(let i = 0; sortedWeights.length > i && moveIdeas.length < 5; i++){
      let weight = sortedWeights[i],
        moves = moveWeights[weight];
      for(let j = 0; moves.length > j; j++){
        moveIdeas.push( moves[j] )
      }
    }
    // debugger
    let move = moveIdeas[Math.floor(Math.random()*moveIdeas.length)];



    return move


  }

  sortArray(array){
    array.sort(function(a,b) {
        if (a < b) { return 1; }
        else if (a == b) { return 0; }
        else { return -1; }
    });
    return array
  }

  copyArray(array){
    let newArray = []
    for(let i = 0; i < array.length; i++){
      newArray.push( array[i] )
    };
    return newArray
  }
}



// bot should have a function called determineMove. it will take in a hash containing a board, and the api, and it
// will return an array, with the alphaNumeric startPosition and endPosition
