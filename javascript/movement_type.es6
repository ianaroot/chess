class MovementType {
  constructor({
    boundaryCheck: boundaryCheck, rangeLimit: rangeLimit, increment: increment, additionalActions: additionalActions,
    pieceNotation: pieceNotation//, captureNotation: captureNotation
  }){
    this.boundaryCheck = boundaryCheck
    this.increment = increment
    this.additionalActions = additionalActions
    this.rangeLimit = rangeLimit
    this.pieceNotation = pieceNotation || ""
    // this.captureNotation = captureNotation
  }
}
