class MovesCalculator { //MOVES ARE NOT GUARANTEED TO BE LEGAL, MUST RUN CHECK QUERY
  constructor({  startPosition: startPosition, board: board, moveObjects: moveObjects,
    movementTypes: movementTypes, ignoreCastles: ignoreCastles, attacksOnly: attacksOnly//, countDefense: countDefense//, endPosition: endPosition
  }){
    this.startPosition = startPosition
    this.board = board
    this.movementTypes = movementTypes || []
    this.moveObjects = moveObjects || []
    this.pieceType = this.board.pieceTypeAt(this.startPosition)
    this.viablePositions = {}
    this.ignoreCastles = ignoreCastles || false
    this.attacksOnly = attacksOnly || false
    // this.countDefense = countDefense
    // this.endPosition = endPosition
    this.movementTypes = PieceMovementTypesFactory.factory({pieceType: this.pieceType, startPosition: this.startPosition, board: this.board, ignoreCastles: this.ignoreCastles, attacksOnly: this.attacksOnly})// , (this.endPosition - this.startPosition ) ); //TODO maybe shouldn't rely on Nan below when endPosition is undefined
    this.calculateViablePositions()
  }
// calculate form of motion by div modding start and end
// check whether the piece at the start is in the list of pieces allowed to make such a movement
// have some conditions under which pawns can move
// also conditions for castling

  endPositions(){
    let positions = []
    for(let i = 0; i < this.moveObjects.length; i++){
      positions.push(this.moveObjects[i].endPosition)
    }
    return positions
  }

  calculateViablePositions(){
    let teamString = this.board.teamAt(this.startPosition)
    for(let i = 0; i < this.movementTypes.length; i++){
      let movementType = this.movementTypes[i],
          increment = movementType.increment,
          rangeLimit = movementType.rangeLimit,
          boundaryCheck = movementType.boundaryCheck,
          additionalActions = movementType.additionalActions
      for(let j = 1; j <= rangeLimit; j++){
        let currentPosition = increment * j + this.startPosition
        if ( !boundaryCheck(j, increment, this.startPosition) ){
          break
        }
        if ( this.board.positionEmpty(currentPosition) ){
          this.moveObjects.push( new MoveObject({additionalActions: additionalActions, endPosition: currentPosition, startPosition: this.startPosition, pieceNotation: movementType.pieceNotation, captureNotation: movementType.captureNotation}) )// illegal may change later
          // if( this.endPosition === currentPosition){
          //   return
          // }
        } else if( this.board.occupiedByOpponent({position: currentPosition, teamString: teamString} ) ){
          this.moveObjects.push( new MoveObject({additionalActions: additionalActions, endPosition: currentPosition, startPosition: this.startPosition, pieceNotation: movementType.pieceNotation, captureNotation: "x"}) )// illegal may change later
          // if( this.endPosition === currentPosition){
          //   return
          // }
          break
        } else if( this.board.occupiedByTeamMate({position: currentPosition, teamString: teamString} ) ){
          if(this.attacksOnly){
            this.moveObjects.push( new MoveObject({additionalActions: additionalActions, endPosition: currentPosition, startPosition: this.startPosition, pieceNotation: movementType.pieceNotation, captureNotation: "x"}) )
          }
          break
        }
      }
    }
  }

  static get verticalUpIncrement(){ return 8 }
  static get verticalDownIncrement(){ return -8 }
  static get forwardSlashUpIncrement(){ return 9 }
  static get forwardSlashDownIncrement(){ return -9 }
  static get backSlashUpIncrement(){ return 7 }
  static get backSlashDownIncrement(){ return -7 }
  static get nightVerticalLeftUpIncrement(){ return 15 }
  static get nightVerticalRightUpIncrement(){ return 17 }
  static get nightHorizontalLeftUpIncrement(){ return 6 }
  static get nightHorizontalRightUpIncrement(){ return 10 }
  static get nightVerticalLeftDownIncrement(){ return -15 }
  static get nightVerticalRightDownIncrement(){ return -17 }
  static get nightHorizontalLeftDownIncrement(){ return -6 }
  static get nightHorizontalRightDownIncrement(){ return -10 }
  static get horizontalRightIncrement(){ return 1 }
  static get horizontalLeftIncrement(){ return -1 }


// TODO this is a movementType Factory

  static boundaryChecks(args){
    let startPosition = args["startPosition"],
        endPosition = args["endPosition"]
    return {

    }
  }

  // static get allIncrements(){
  //   return [MovesCalculator.verticalUpIncrement, MovesCalculator.verticalDownIncrement, MovesCalculator.forwardSlashUpIncrement, MovesCalculator.forwardSlashDownIncrement,
  //     MovesCalculator.backSlashUpIncrement, MovesCalculator.backSlashDownIncrement, MovesCalculator.nightVerticalLeftUpIncrement, MovesCalculator.nightVerticalRightUpIncrement,
  //     MovesCalculator.nightHorizontalLeftUpIncrement, MovesCalculator.nightHorizontalRightUpIncrement, MovesCalculator.nightVerticalLeftDownIncrement, MovesCalculator.nightVerticalRightDownIncrement,
  //     MovesCalculator.nightHorizontalLeftDownIncrement, MovesCalculator.nightHorizontalRightDownIncrement, MovesCalculator.horizontalRightIncrement, MovesCalculator.horizontalLeftIncrement
  //   ]
  // }

  static getCommonMoveObjects(arr1, arr2){
    let commons = []
    for(let i = 0; i < arr1.length; i++){
      for(let j = 0; j < arr2.length; j++){
        if( arr1[i].increment === arr2[j].increment && !(commons.includes(arr1[i]) ) ){
          commons.push(arr1[i])
        }
      }
    }
    return commons
  }

}
