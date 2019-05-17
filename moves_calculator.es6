class MovesCalculator { //MOVES ARE NOT GUARANTEED TO BE LEGAL, MUST RUN CHECK QUERY
  constructor({  startPosition: startPosition, board: board, ignoreCastles: ignoreCastles, attacksOnly: attacksOnly//, countDefense: countDefense//, endPosition: endPosition
  }){//TODO ALLOWS CASTLYING THROUGH CHECK!!!
    this.moveObjects = []
    this.viablePositions = {}
    this.ignoreCastles = ignoreCastles
    this.attacksOnly = attacksOnly
    this.endPositions = []
    // this.countDefense = countDefense
    // this.endPosition = endPosition
    let pieceType = board.pieceTypeAt(startPosition)
    console.log("piecetype: " + pieceType)
    if( [Board.PAWN,Board.KING].includes(pieceType) ){
      this.movementTypes = PieceMovementTypesFactory.complexFactory({pieceType: pieceType, startPosition: startPosition, board: board, ignoreCastles: this.ignoreCastles, attacksOnly: this.attacksOnly})// , (this.endPosition - startPosition ) ); //TODO maybe shouldn't rely on Nan below when endPosition is undefined
    } else {
      this.movementTypes = PieceMovementTypesFactory.simpleFactory(pieceType)// , (this.endPosition - startPosition ) ); //TODO maybe shouldn't rely on Nan below when endPosition is undefined
    }
    // debugger
    this.calculateViablePositions(board, startPosition)
  }
// calculate form of motion by div modding start and end
// check whether the piece at the start is in the list of pieces allowed to make such a movement
// have some conditions under which pawns can move
// also conditions for castling

  calculateViablePositions(board, startPosition){
    let teamString = board.teamAt(startPosition)
    for(let i = 0; i < this.movementTypes.length; i++){
      let movementType = this.movementTypes[i],
          increment = movementType.increment,
          rangeLimit = movementType.rangeLimit,
          boundaryCheck = movementType.boundaryCheck,
          additionalActions = movementType.additionalActions
      for(let j = 1; j <= rangeLimit; j++){
        let currentPosition = increment * j + startPosition
        if ( !boundaryCheck(j, increment, startPosition) ){
          break
        }
        if ( board.positionEmpty(currentPosition) ){
          this.moveObjects.push( new MoveObject({additionalActions: additionalActions, endPosition: currentPosition, startPosition: startPosition, pieceNotation: movementType.pieceNotation, captureNotation: movementType.captureNotation}) )// illegal may change later
          this.endPositions.push(currentPosition)
          // if( this.endPosition === currentPosition){
          //   return
          // }
        } else if( board.occupiedByOpponent({position: currentPosition, teamString: teamString} ) ){
          this.moveObjects.push( new MoveObject({additionalActions: additionalActions, endPosition: currentPosition, startPosition: startPosition, pieceNotation: movementType.pieceNotation, captureNotation: "x"}) )// illegal may change later
          this.endPositions.push(currentPosition)
          // if( this.endPosition === currentPosition){
          //   return
          // }
          break
        } else if( board.occupiedByTeamMate({position: currentPosition, teamString: teamString} ) ){
          if(this.attacksOnly){
            this.moveObjects.push( new MoveObject({additionalActions: additionalActions, endPosition: currentPosition, startPosition: startPosition, pieceNotation: movementType.pieceNotation, captureNotation: "x"}) )
            this.endPositions.push(currentPosition)
          }
          break
        }
      }
    }
  }

  static getCommonMoveObjects(arr1, arr2){
    let commons = []
    for(let i = 0; i < arr1.length; i++){
      for(let j = 0; j < arr2.length; j++){
        if( arr1[i].increment === arr2[j].increment && !(commons.includes(arr1[i]) ) ){
          commons.push(arr1[i])
        }
      }
    }
    return commons
  }

}
