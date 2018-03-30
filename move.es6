class MoveObject {
  constructor( options = {endPosition: undefined,
    additionalActions: undefined, pieceNotation: undefined,
    alerts: undefined, illegal: undefined, fullNotation: undefined,
    startPosition: startPosition
  }){
    this.additionalActions = options["additionalActions"]
    this._endPosition = options["endPosition"]
    this.startPosition = options["startPosition"]
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
