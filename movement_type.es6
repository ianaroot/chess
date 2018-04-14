class MovementType {
  constructor({
    boundaryCheck: boundaryCheck, rangeLimit: rangeLimit, increment: increment, additionalActions: additionalActions,
    pieceNotation: pieceNotation, captureNotation: captureNotation
  }){
    this.boundaryCheck = boundaryCheck
    this.increment = increment
    this.additionalActions = additionalActions
    this.rangeLimit = rangeLimit
    this.pieceNotation = pieceNotation || ""
    this.captureNotation = captureNotation
  }

    // let rangeLimit = args["rangeLimit"],
    //   pieceNotation = args["pieceNotation"],
    //   startPosition = args["startPosition"];
    // TODO could slide in a rangeLimit on creation to save later iterations
  static diagonalRightBoundaryCheck(i, increment, startPosition){
    let endPosition = i * increment + startPosition;
    return (endPosition) % 8 > (startPosition % 8) && Board._inBounds(endPosition)
  }
  static verticalBoundaryCheck(i, increment, startPosition){
    let endPosition = i * increment + startPosition;
    return Board._inBounds(endPosition)
  }
  static diagonalLeftBoundaryCheck(i, increment, startPosition){
    let endPosition = i * increment + startPosition;
    return (endPosition) % 8 < (startPosition % 8) && Board._inBounds(endPosition)
  }
  static nightVerticalBoundaryCheck(i, increment, startPosition){
    let endPosition = i * increment + startPosition;
    return Math.abs( (endPosition) % 8 - startPosition % 8 ) === 1 && Board._inBounds(endPosition)
  }
  static nightHorizontalBoundaryCheck(i, increment, startPosition){
    let endPosition = i * increment + startPosition;
    return Math.abs( (endPosition) % 8 - startPosition % 8 ) === 2 && Board._inBounds(endPosition)
  }
  static horizontalBoundaryCheck(i, increment, startPosition){
    let endPosition = i * increment + startPosition;
    return Math.floor((endPosition) / 8) === Math.floor(startPosition / 8) && Board._inBounds(endPosition)
  }

  static verticalUpIncrement({rangeLimit: rangeLimit, pieceNotation: pieceNotation}){
    var movementType = new MovementType({
      rangeLimit: rangeLimit,
      pieceNotation: pieceNotation,
      increment: "+8",
      boundaryCheck: MovementType.verticalBoundaryCheck
    })
    return movementType
  }

  static verticalDownIncrement({rangeLimit: rangeLimit, pieceNotation: pieceNotation}){
    var movementType = new MovementType({
      rangeLimit: rangeLimit,
      pieceNotation: pieceNotation,
      increment: "-8",
      boundaryCheck: MovementType.verticalBoundaryCheck
    })
    return movementType
  }

  static forwardSlashUpIncrement({rangeLimit: rangeLimit, pieceNotation: pieceNotation, captureNotation: captureNotation}){
    var movementType = new MovementType({
      rangeLimit: rangeLimit,
      pieceNotation: pieceNotation,
      captureNotation: captureNotation,
      increment: "+9",
      boundaryCheck: MovementType.diagonalRightBoundaryCheck
    })
    return movementType
  }

  static forwardSlashDownIncrement({rangeLimit: rangeLimit, pieceNotation: pieceNotation, captureNotation: captureNotation}){
    var movementType = new MovementType({
      rangeLimit: rangeLimit,
      pieceNotation: pieceNotation,
      captureNotation: captureNotation,
      increment: "-9",
      boundaryCheck: MovementType.diagonalLeftBoundaryCheck
    })
    return movementType
  }

  static backSlashUpIncrement({rangeLimit: rangeLimit, pieceNotation: pieceNotation, captureNotation: captureNotation}){
    var movementType = new MovementType({
      rangeLimit: rangeLimit,
      pieceNotation: pieceNotation,
      captureNotation: captureNotation,
      increment: "+7",
      boundaryCheck: MovementType.diagonalLeftBoundaryCheck
    })
    return movementType
  }

  static backSlashDownIncrement({rangeLimit: rangeLimit, pieceNotation: pieceNotation, captureNotation: captureNotation}){
    var movementType = new MovementType({
      rangeLimit: rangeLimit,
      pieceNotation: pieceNotation,
      captureNotation: captureNotation,
      increment: "-7",
      boundaryCheck: MovementType.diagonalRightBoundaryCheck
    })
    return movementType
  }

  static horizontalRightIncrement({increment: increment, rangeLimit: rangeLimit, pieceNotation: pieceNotation, additionalActions: additionalActions}){
    var movementType = new MovementType({
      additionalActions: additionalActions,
      rangeLimit: rangeLimit,
      pieceNotation: pieceNotation,
      increment: increment || "+1",
      boundaryCheck: MovementType.horizontalBoundaryCheck
    })
    return movementType
  }

  static horizontalLeftIncrement({increment: increment, rangeLimit: rangeLimit, pieceNotation: pieceNotation, additionalActions: additionalActions}){
    var movementType = new MovementType({
      additionalActions: additionalActions,
      rangeLimit: rangeLimit,
      pieceNotation: pieceNotation,
      increment: increment || "-1",
      boundaryCheck: MovementType.horizontalBoundaryCheck
    })
    return movementType
  }

  static nightVerticalLeftUpIncrement(){
    var movementType = new MovementType({
      rangeLimit: 1,
      pieceNotation: "N",
      increment: "+15",
      boundaryCheck: MovementType.nightVerticalBoundaryCheck
    })
    return movementType
  }

  static nightVerticalRightUpIncrement(){
    var movementType = new MovementType({
      rangeLimit: 1,
      pieceNotation: "N",
      increment: "+17",
      boundaryCheck: MovementType.nightVerticalBoundaryCheck
    })
    return movementType
  }

  static nightHorizontalLeftUpIncrement(){
    var movementType = new MovementType({
      rangeLimit: 1,
      pieceNotation: "N",
      increment: "+6",
      boundaryCheck: MovementType.nightHorizontalBoundaryCheck
    })
    return movementType
  }

  static nightHorizontalRightUpIncrement(){
    var movementType = new MovementType({
      rangeLimit: 1,
      pieceNotation: "N",
      increment: "+10",
      boundaryCheck: MovementType.nightHorizontalBoundaryCheck
    })
    return movementType
  }

  static nightVerticalLeftDownIncrement(){
    var movementType = new MovementType({
      rangeLimit: 1,
      pieceNotation: "N",
      increment: "-15",
      boundaryCheck: MovementType.nightVerticalBoundaryCheck
    })
    return movementType
  }

  static nightVerticalRightDownIncrement(){
    var movementType = new MovementType({
      rangeLimit: 1,
      pieceNotation: "N",
      increment: "-17",
      boundaryCheck: MovementType.nightVerticalBoundaryCheck
    })
    return movementType
  }

  static nightHorizontalLeftDownIncrement(){
    var movementType = new MovementType({
      rangeLimit: 1,
      pieceNotation: "N",
      increment: "-6",
      boundaryCheck: MovementType.nightHorizontalBoundaryCheck
    })
    return movementType
  }

  static nightHorizontalRightDownIncrement(){
    var movementType = new MovementType({
      rangeLimit: 1,
      pieceNotation: "N",
      increment: "-10",
      boundaryCheck: MovementType.nightHorizontalBoundaryCheck
    })
    return movementType
  }
}
