class MoveObject {
  constructor({endPosition: endPosition,
    additionalActions: additionalActions, pieceNotation: pieceNotation,
    illegal: illegal,// alert: alert, 
    startPosition: startPosition, captureNotation: captureNotation
  }){
    this.additionalActions = additionalActions
    this.endPosition = endPosition
    this.startPosition = startPosition
    this.alert = alert
    this.illegal = illegal
    this.pieceNotation = pieceNotation
    this.captureNotation = captureNotation
    // this.alert = ""
    // this.promotionNotation = ""
    // this.checkNotation = ""
    // this.enPassantNotation = enPassantNotation
  }


  notation(){
    if( !/O-O/.exec(this.pieceNotation) ){
      var positionNotation = Board.gridCalculator(this.endPosition);
    }
    return this.pieceNotation + (this.captureNotation || "") + (positionNotation || "")// + this.promotionNotation + this.checkNotation;
  }

}
