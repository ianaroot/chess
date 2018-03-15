class Api {
  constructor (board){
    this.board = board
  }
  consoleLogBlackPov(){
    this.board.consoleLogBlackPov()
  }
  consoleLogWhitePov(){
    this.board.consoleLogWhitePov()
  }
  whoseTurn(){
    return this.board.allowedToMove
  }
  capturedPieces(){
    var captures = []
    for( let i = 0; i < this.board.capturedPieces.length; i++){
      captures.push( JSON.parse(this.board.capturedPieces[i]) )
    }
     return captures
  }
  movementNotation(){
    return this.board.movementNotation
  }
  availableMoves(){
    let movingTeam = this.board.allowedToMove,
        positions = this.board.positionsOccupiedByTeam(movingTeam),
        availableMoves = [];
    for(let i = 0; i < positions.length; i++){
      let availableMovesFromPosition = this.availableMovesFrom(positions[i])
      for(let j = 0; j < availableMovesFromPosition.length; j++){
        availableMoves.push([ Board.gridCalculator( positions[i] ), availableMovesFromPosition[j]])
      }
    }
    return availableMoves
  }

  availableMovesFrom(position){
    let alphaNumericAvailableMoves = [],
        availableMoves = Rules.viablePositionsFromKeysOnly({board: this.board, startPosition: position});
    for (let i = 0; i < availableMoves.length; i++){
      alphaNumericAvailableMoves.push( Board.gridCalculator(availableMoves[i]) )
    }
    return alphaNumericAvailableMoves
  }

  availableMovesIf(alphaNumericMove){
    let startPosition = Board.gridCalculatorReverse(alphaNumericMove[0]),
        endPosition = Board.gridCalculatorReverse(alphaNumericMove[1]);
    newBoard = this.board.deepCopy
  }

  attemptMove(startPosition, endPosition){

  }
}
