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

    // let rangeLimit = args["rangeLimit"],
    //   pieceNotation = args["pieceNotation"],
    //   startPosition = args["startPosition"];
    // TODO could slide in a rangeLimit on creation to save later iterations
  static diagonalRightBoundaryCheck({startPosition: startPosition, endPosition: endPosition}){
    return (endPosition) % 8 > (startPosition % 8) && Board._inBounds(endPosition)
  }
  static verticalBoundaryCheck({startPosition: startPosition, endPosition: endPosition}){
    return Board._inBounds(endPosition)
  }
  static diagonalLeftBoundaryCheck({startPosition: startPosition, endPosition: endPosition}){
    return (endPosition) % 8 < (startPosition % 8) && Board._inBounds(endPosition)
  }
  static nightVerticalBoundaryCheck({startPosition: startPosition, endPosition: endPosition}){
    return Math.abs( (endPosition) % 8 - startPosition % 8 ) === 1 && Board._inBounds(endPosition)
  }
  static nightHorizontalBoundaryCheck({startPosition: startPosition, endPosition: endPosition}){
    return Math.abs( (endPosition) % 8 - startPosition % 8 ) === 2 && Board._inBounds(endPosition)
  }
  static horizontalBoundaryCheck({startPosition: startPosition, endPosition: endPosition}){
    return Math.floor((endPosition) / 8) === Math.floor(startPosition / 8) && Board._inBounds(endPosition)
  }

  static verticalUpIncrement({increment: increment, rangeLimit: rangeLimit, pieceNotation: pieceNotation, startPosition: startPosition}){
    var movementType = new MovementType({
      rangeLimit: rangeLimit,
      pieceNotation: pieceNotation,
      startPosition: startPosition,
      increment: "+8",
      boundaryCheck: function(i, increment, startPosition) {
        let endPosition = i * increment + startPosition
        return MovementType.verticalBoundaryCheck({endPosition: endPosition})
      }
    })
    return movementType
  }

  static verticalDownIncrement({increment: increment, rangeLimit: rangeLimit, pieceNotation: pieceNotation, startPosition: startPosition}){
    var movementType = new MovementType({
      rangeLimit: rangeLimit,
      pieceNotation: pieceNotation,
      startPosition: startPosition,
      increment: "-8",
      boundaryCheck: function(i, increment, startPosition) {
        let endPosition = i * increment + startPosition
        return MovementType.verticalBoundaryCheck({endPosition: endPosition})
      }
    })
    return movementType
  }

  static forwardSlashUpIncrement({increment: increment, rangeLimit: rangeLimit, pieceNotation: pieceNotation, startPosition: startPosition}){
    var movementType = new MovementType({
      rangeLimit: rangeLimit,
      pieceNotation: pieceNotation,
      startPosition: startPosition,
      increment: "+9",
      boundaryCheck: function(i, increment, startPosition) {
        let endPosition = i * increment + startPosition
        return MovementType.diagonalRightBoundaryCheck({startPosition: startPosition, endPosition: endPosition})
      }
    })
    return movementType
  }

  static forwardSlashDownIncrement({increment: increment, rangeLimit: rangeLimit, pieceNotation: pieceNotation, startPosition: startPosition}){
    var movementType = new MovementType({
      rangeLimit: rangeLimit,
      pieceNotation: pieceNotation,
      startPosition: startPosition,
      increment: "-9",
      boundaryCheck: function(i, increment, startPosition) {
        let endPosition = i * increment + startPosition
        return MovementType.diagonalLeftBoundaryCheck({startPosition: startPosition, endPosition: endPosition})
      }
    })
    return movementType
  }

  static backSlashUpIncrement({increment: increment, rangeLimit: rangeLimit, pieceNotation: pieceNotation, startPosition: startPosition}){
    var movementType = new MovementType({
      rangeLimit: rangeLimit,
      pieceNotation: pieceNotation,
      startPosition: startPosition,
      increment: "+7",
      boundaryCheck: function(i, increment, startPosition) {
        let endPosition = i * increment + startPosition
        return MovementType.diagonalLeftBoundaryCheck({startPosition: startPosition, endPosition: endPosition})
      }
    })
    return movementType
  }

  static backSlashDownIncrement({increment: increment, rangeLimit: rangeLimit, pieceNotation: pieceNotation, startPosition: startPosition}){
    var movementType = new MovementType({
      rangeLimit: rangeLimit,
      pieceNotation: pieceNotation,
      startPosition: startPosition,
      increment: "-7",
      boundaryCheck: function(i, increment, startPosition) {
        let endPosition = i * increment + startPosition
        return MovementType.diagonalRightBoundaryCheck({startPosition: startPosition, endPosition: endPosition})
      }
    })
    return movementType
  }

  static horizontalRightIncrement({increment: increment, rangeLimit: rangeLimit, pieceNotation: pieceNotation, startPosition: startPosition}){
    var movementType = new MovementType({
      rangeLimit: rangeLimit,
      pieceNotation: pieceNotation,
      startPosition: startPosition,
      increment: "+1",
      boundaryCheck: function(i, increment, startPosition) {
        let endPosition = i * increment + startPosition
        return MovementType.horizontalBoundaryCheck({startPosition: startPosition, endPosition: endPosition})
      }
    })
    return movementType
  }

  static horizontalLeftIncrement({increment: increment, rangeLimit: rangeLimit, pieceNotation: pieceNotation, startPosition: startPosition}){
    var movementType = new MovementType({
      rangeLimit: rangeLimit,
      pieceNotation: pieceNotation,
      startPosition: startPosition,
      increment: "-1",
      boundaryCheck: function(i, increment, startPosition) {
        let endPosition = i * increment + startPosition
        return MovementType.horizontalBoundaryCheck({startPosition: startPosition, endPosition: endPosition})
      }
    })
    return movementType
  }

  static nightVerticalLeftUpIncrement({increment: increment, rangeLimit: rangeLimit, pieceNotation: pieceNotation, startPosition: startPosition}){
    var movementType = new MovementType({
      rangeLimit: rangeLimit,
      pieceNotation: pieceNotation,
      startPosition: startPosition,
      increment: "+15",
      boundaryCheck: function(i, increment, startPosition) {
        let endPosition = i * increment + startPosition
        return MovementType.nightVerticalBoundaryCheck({startPosition: startPosition, endPosition: endPosition})
      }
    })
    return movementType
  }

  static nightVerticalRightUpIncrement({increment: increment, rangeLimit: rangeLimit, pieceNotation: pieceNotation, startPosition: startPosition}){
    var movementType = new MovementType({
      rangeLimit: rangeLimit,
      pieceNotation: pieceNotation,
      startPosition: startPosition,
      increment: "+17",
      boundaryCheck: function(i, increment, startPosition) {
        let endPosition = i * increment + startPosition
        return MovementType.nightVerticalBoundaryCheck({startPosition: startPosition, endPosition: endPosition})
      }
    })
    return movementType
  }

  static nightHorizontalLeftUpIncrement({increment: increment, rangeLimit: rangeLimit, pieceNotation: pieceNotation, startPosition: startPosition}){
    var movementType = new MovementType({
      rangeLimit: rangeLimit,
      pieceNotation: pieceNotation,
      startPosition: startPosition,
      increment: "+6",
      boundaryCheck: function(i, increment, startPosition) {
        let endPosition = i * increment + startPosition
        return MovementType.nightHorizontalBoundaryCheck({startPosition: startPosition, endPosition: endPosition})
      }
    })
    return movementType
  }

  static nightHorizontalRightUpIncrement({increment: increment, rangeLimit: rangeLimit, pieceNotation: pieceNotation, startPosition: startPosition}){
    var movementType = new MovementType({
      rangeLimit: rangeLimit,
      pieceNotation: pieceNotation,
      startPosition: startPosition,
      increment: "+10",
      boundaryCheck: function(i, increment, startPosition) {
        let endPosition = i * increment + startPosition
        return MovementType.nightHorizontalBoundaryCheck({startPosition: startPosition, endPosition: endPosition})
      }
    })
    return movementType
  }

  static nightVerticalLeftDownIncrement({increment: increment, rangeLimit: rangeLimit, pieceNotation: pieceNotation, startPosition: startPosition}){
    var movementType = new MovementType({
      rangeLimit: rangeLimit,
      pieceNotation: pieceNotation,
      startPosition: startPosition,
      increment: "-15",
      boundaryCheck: function(i, increment, startPosition) {
        let endPosition = i * increment + startPosition
        return MovementType.nightVerticalBoundaryCheck({startPosition: startPosition, endPosition: endPosition})
      }
    })
    return movementType
  }

  static nightVerticalRightDownIncrement({increment: increment, rangeLimit: rangeLimit, pieceNotation: pieceNotation, startPosition: startPosition}){
    var movementType = new MovementType({
      rangeLimit: rangeLimit,
      pieceNotation: pieceNotation,
      startPosition: startPosition,
      increment: "-17",
      boundaryCheck: function(i, increment, startPosition) {
        let endPosition = i * increment + startPosition
        return MovementType.nightVerticalBoundaryCheck({startPosition: startPosition, endPosition: endPosition})
      }
    })
    return movementType
  }

  static nightHorizontalLeftDownIncrement({increment: increment, rangeLimit: rangeLimit, pieceNotation: pieceNotation, startPosition: startPosition}){
    var movementType = new MovementType({
      rangeLimit: rangeLimit,
      pieceNotation: pieceNotation,
      startPosition: startPosition,
      increment: "-6",
      boundaryCheck: function(i, increment, startPosition) {
        let endPosition = i * increment + startPosition
        return MovementType.nightHorizontalBoundaryCheck({startPosition: startPosition, endPosition: endPosition})
      }
    })
    return movementType
  }

  static nightHorizontalRightDownIncrement({increment: increment, rangeLimit: rangeLimit, pieceNotation: pieceNotation, startPosition: startPosition}){
    var movementType = new MovementType({
      rangeLimit: rangeLimit,
      pieceNotation: pieceNotation,
      startPosition: startPosition,
      increment: "-10",
      boundaryCheck: function(i, increment, startPosition) {
        let endPosition = i * increment + startPosition
        return MovementType.nightHorizontalBoundaryCheck({startPosition: startPosition, endPosition: endPosition})
      }
    })
    return movementType
  }
}
