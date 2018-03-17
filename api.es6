// TODO more explicit error messaging for bot debugging
class Api {
  constructor (args){
    this._board = args["board"]
    this._gameController = args["gameController"];
  }
  consoleLogBlackPov(){
    this._board.consoleLogBlackPov()
  }
  consoleLogWhitePov(){
    this._board.consoleLogWhitePov()
  }
  whoseTurn(){
    return this._board.allowedToMove
  }
  capturedPieces(){
    var captures = []
    for( let i = 0; i < this._board.capturedPieces.length; i++){
      captures.push( JSON.parse(this._board.capturedPieces[i]) )
    }
     return captures
  }
  movementNotation(){
    return this._board.movementNotation
  }

  availableMovesDefault(){
    let movingTeam = this._board.allowedToMove;
    return this.availableMovesFor({movingTeam: movingTeam, board: this._board})
    //     positions = this._board.positionsOccupiedByTeam(movingTeam),
    //     availableMoves = [];
    // for(let i = 0; i < positions.length; i++){
    //   let availableMovesFromPosition = this.availableMovesFrom(positions[i])
    //   for(let j = 0; j < availableMovesFromPosition.length; j++){
    //     availableMoves.push([ Board.gridCalculator( positions[i] ), availableMovesFromPosition[j]])
    //   }
    // }
    // return availableMoves
  }

  availableMovesFor({movingTeam: movingTeam, board: board}){
    let positions = board.positionsOccupiedByTeam(movingTeam),
        availableMoves = [];
    for(let i = 0; i < positions.length; i++){
      let availableMovesFromPosition = this.availableMovesFrom({position: positions[i], board: board})
      for(let j = 0; j < availableMovesFromPosition.length; j++){
        availableMoves.push([ Board.gridCalculator( positions[i] ), availableMovesFromPosition[j]])
      }
    }
    return availableMoves
  }

  availableMovesFrom({position: position, board: board}){
    let alphaNumericAvailableMoves = [],
        availableMoves = Rules.viablePositionsFromKeysOnly({board: board, startPosition: position});
    for (let i = 0; i < availableMoves.length; i++){
      alphaNumericAvailableMoves.push( Board.gridCalculator(availableMoves[i]) )
    }
    return alphaNumericAvailableMoves
  }

  availableMovesIf(alphaNumericMove){
    let startPosition = Board.gridCalculatorReverse(alphaNumericMove[0]),
        endPosition = Board.gridCalculatorReverse(alphaNumericMove[1]);
    newBoard = this._board.deepCopy
  }

  attemptMove(alphaNumericStartPosition, alphaNumericEndPosition){
    let startPosition = Board.gridCalculatorReverse( alphaNumericStartPosition ),
        endPosition = Board.gridCalculatorReverse( alphaNumericEndPosition );
    this._gameController.attemptMove(startPosition, endPosition)
  }

  resultOfHypotheticalMove({board: board, alphaNumericStartPosition: alphaNumericStartPosition, alphaNumericEndPosition: alphaNumericEndPosition}){
// debugger

    //TODO this would be simpler and drier if attemptMove was a function on the board
    var startPosition  = Board.gridCalculatorReverse(alphaNumericStartPosition),
      endPosition  = Board.gridCalculatorReverse(alphaNumericEndPosition),
      newBoard = board.deepCopy(),
      moveObject = Rules.getMoveObject(startPosition, endPosition, newBoard);
      // debugger
    if( moveObject.illegal ){
      // this.view.displayAlerts(moveObject.alerts)
      return
    } else {
      newBoard.officiallyMovePiece( moveObject )
    }
    return newBoard
  }
}
