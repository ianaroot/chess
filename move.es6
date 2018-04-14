class MoveObject {
  constructor({endPosition: endPosition,
    additionalActions: additionalActions, pieceNotation: pieceNotation,
    illegal: illegal,
    startPosition: startPosition, captureNotation: captureNotation
  }){
    this.startPosition = startPosition
    this.endPosition = endPosition
    this.pieceNotation = pieceNotation
    this.captureNotation = captureNotation
    this.additionalActions = additionalActions
    this.illegal = illegal
  }

  notation(){
    if( !/O-O/.exec(this.pieceNotation) ){
      var positionNotation = Board.gridCalculator(this.endPosition);
    }
    return this.pieceNotation + (this.captureNotation || "") + (positionNotation || "")
  }

}
