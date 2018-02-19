class Move {
  constructor( options = {
    boundaryCheck: undefined, endPosition: undefined,
    additionalActions: undefined, rangeLimit: undefined, pieceNotation: undefined,
    increment: undefined
  }){
    this.boundaryCheck = options["boundaryCheck"]
    this.increment = options["increment"]
    this.additionalActions = options["additionalActions"]
    this.rangeLimit = options["rangeLimit"]
    this.pieceNotation = options["pieceNotation"]
    this.endPosition = options["endPosition"]
  }

}
