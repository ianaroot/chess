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
    this._endPosition = options["endPosition"]
    this.alerts = options["alerts"] || []
    this.illegal = options["illegal"]
    this.fullNotation = options["fullNotation"]
    this.pieceNotation = options["pieceNotation"]
    this.checkNotation = options["checkNotation"] || ""
    this.captureNotation = options["captureNotation"] || ""
    this.positionNotation = options["positionNotation"] || ""
    this.promotionNotation = options["promotionNotation"] || ""
  }
  set endPosition(newEndPosition){
    this._endPosition = newEndPosition
  }
  get endPosition(){
    return this._endPosition
  }
  set startPosition(newStartPosition){
    this._startPosition = newStartPosition
  }
  get startPosition(){
    return this._startPosition
  }

}
