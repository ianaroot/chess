class MoveObject {
  constructor({endPosition: endPosition,
    additionalActions: additionalActions, pieceNotation: pieceNotation,
    illegal: illegal,
    startPosition: startPosition, captureNotation: captureNotation
  }){
    this.additionalActions = additionalActions
    this.endPosition = endPosition
    this.startPosition = startPosition
    this.illegal = illegal
    this.pieceNotation = pieceNotation
    this.captureNotation = captureNotation
  }


  notation(){
    if( !/O-O/.exec(this.pieceNotation) ){
      var positionNotation = Board.gridCalculator(this.endPosition);
    }
    return this.pieceNotation + (this.captureNotation || "") + (positionNotation || "")
  }

}
