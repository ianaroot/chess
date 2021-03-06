class MoveObject {
  constructor( options = {
    boundaryCheck: undefined, endPosition: undefined,
    additionalActions: undefined, rangeLimit: undefined, pieceNotation: undefined,
    alerts: undefined, illegal: undefined, increment: undefined, fullNotation: undefined
  }){
    this.boundaryCheck = options["boundaryCheck"]
    this.increment = options["increment"]
    this.additionalActions = options["additionalActions"]
    this.rangeLimit = options["rangeLimit"]
    this.pieceNotation = options["pieceNotation"]
    this._endPosition = options["endPosition"]
    this.alerts = options["alerts"] || []
    this.illegal = options["illegal"]
    this.fullNotation = options["fullNotation"]
  }
  set endPosition(newEndPosition){
    this._endPosition = newEndPosition
  }
  get endPosition(){
    return this._endPosition
  }

}
