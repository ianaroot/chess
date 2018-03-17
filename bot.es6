class Bot {
  constructor(){

  }
  determineMove(args){
    let board = args["board"],
        api = args["api"],
        availableMoves = api.availableMovesDefault(),
        move = availableMoves[Math.floor(Math.random()*availableMoves.length)];

    // for(let i = 0; i < availableMoves.length; i++){
    //   var move = availableMoves[i]
    //   newBoard = api.resultOfHypotheticalMove({board: board, startPosition: startPosition, endPosition: });
    //
    // }
    return move


  }
}


// bot should have a function called determineMove. it will take in a hash containing a board, and the api, and it
// will return an array, with the alphaNumeric startPosition and endPosition
