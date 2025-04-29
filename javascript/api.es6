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
  }

  availableMovesFor({movingTeam: movingTeam, board: board}){
    let positions = board._positionsOccupiedByTeam(movingTeam),
        availableMoves = [];
    for(let i = 0; i < positions.length; i++){
      availableMoves = availableMoves.concat( this.availableMovesFrom({board: board, position: positions[i]}) )
    }
    return availableMoves
  }

  availableMovesFrom({position: position, board: board}){
    return Rules.availableMovesFrom({board: board, startPosition: position})
  }

  attemptMove(moveObject){
    this._gameController.attemptMove(moveObject.startPosition, moveObject.endPosition)
  }

  resultOfHypotheticalMove({board: board, moveObject:moveObject}){
      let newBoard = board.deepCopy();
      newBoard._officiallyMovePiece( moveObject )
    return newBoard
  }







  piecesAttackableByPieceAt(board, square){
    let startPosition = Board.convertPositionFromAlphaNumeric(square);
    let  viablePositions = Rules.viablePositionsFromKeysOnly({board: board, startPosition: startPosition}),
      attackedPositions = {}
    for(let i = 0; i < viablePositions.length; i++){
      let position = viablePositions[i];
      if( !board.positionEmpty( position ) ){
        attackedPositions[Board.gridCalculator(position)] = board.pieceTypeAt(position)
      }
    }
    return attackedPositions
  }

  piecesDefendedByPieceAt(square){
    // are these just returning the square or also the piece object at the square?
  }

  piecesDefending(square){

  }

  piecesAttacking(board, square){
    let queryPositionString = String( Board.gridCalculatorReverse(square) ),
      team = board.teamAt(square),
      enemyPositions = board._positionsOccupiedByOpponentOf(team),
      attackers = {};
    for(let i = 0; i < enemyPositions.length; i++){
      let position = enemyPositions[i],
        attackedPositions = Rules.viablePositionsFromKeysOnly({board: board, startPosition: position});
      if( attackedPositions.includes( queryPositionString )){
        attackers[Board.gridCalculator(position)] = board.pieceTypeAt(position)
      }
    }
    return attackers
  }

  piecesHypotheticallyAttackableFromBy(square, pieceObject){

  }

  piecesHypotheticallyDefendableFromBy(square, pieceObject){

  }

  piecesAttackableByTeam(board, teamString){
  let positions = board._positionsOccupiedByTeam(teamString),
    attackedPositions = {};
    for(let i = 0; i < positions.length; i++){
      let position = positions[i],
        subsetOfAttackedPositions = this.piecesAttackableByPieceAt(board, position);
      Object.assign(attackedPositions, subsetOfAttackedPositions)
    }
    return attackedPositions;
  }
  undefendedPiecesAttackableByTeam(teamString){

  }


  positionsHypotheticallyAttackablBy(){
    // like squares a pawn could attack if occupied
  }

  // value of pieces for team on board

  // move is castle

  // move is en passant

  // move abandons defended position

  // move abandons attacking position (verify that it's not doing to for capture of said attack)

  // something to compare values of

  // move captures

  // move is defended

  // move is attacked

  // move creates new attacks

  // move creates new threats

  // positionsCurrentlyAttackedBy(team) doesn't care whether pawn attack position is occupied
}
