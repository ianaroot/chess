class MovesCalculator {
  constructor({  startPosition: startPosition, board: board, moveObjects: moveObjects, movementTypes: movementTypes, ignoreCastles: ignoreCastles//, countDefense: countDefense//, endPosition: endPosition
  }){
    this.startPosition = startPosition
    this.board = board
    this.movementTypes = movementTypes || []
    this.moveObjects = moveObjects || []
    this.pieceType = this.board.pieceTypeAt(this.startPosition)
    this.viablePositions = {}
    this.ignoreCastles = ignoreCastles || false
    // this.countDefense = countDefense
    // this.endPosition = endPosition
    this.addMovementTypes()
    this.calculateViablePositions()
  }
// calculate form of motion by div modding start and end
// check whether the piece at the start is in the list of pieces allowed to make such a movement
// have some conditions under which pawns can move
// also conditions for castling
  addMovementTypes(){
    // if ( this.startPosition === undefined || !this.board){
    //   throw new Error("movementType missing startPosition or board in addMovementTypesAndBoundaryChecks")
    // } else {
      let pieceSpecificMovements = MovesCalculator.pieceSpecificMovements(this.pieceType)// , (this.endPosition - this.startPosition ) ); //TODO maybe shouldn't rely on Nan below when endPosition is undefined
          // the difference between the two refs to pieceSpecificMovements in these couple lines is very unclear
      this.movementTypes = pieceSpecificMovements({startPosition: this.startPosition, board: this.board, ignoreCastles: this.ignoreCastles})
    // }
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
          // if(this.countDefense){
          //   moveObjects.push( new MoveObject({additionalActions: additionalActions, endPosition: currentPosition, startPosition: this.startPosition, pieceNotation: movementType.pieceNotation, captureNotation: "x"}) )
          // }
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
  static genericMovements({increment: increment, rangeLimit: rangeLimit, pieceNotation: pieceNotation, startPosition: startPosition}){
    // let rangeLimit = args["rangeLimit"],
    //   pieceNotation = args["pieceNotation"],
    //   startPosition = args["startPosition"];
    // TODO could slide in a rangeLimit on creation to save later iterations
    switch(increment){
      case MovesCalculator.verticalUpIncrement:
        var movementType = new MovementType({
          rangeLimit: rangeLimit,
          pieceNotation: pieceNotation,
          startPosition: startPosition,
          increment: "+8",
          boundaryCheck: function(i, increment, startPosition) {
            let endPosition = i * increment + startPosition
            return MovesCalculator.boundaryChecks({endPosition: endPosition}).vertical()
          }
        })
        return movementType
        break
      case MovesCalculator.verticalDownIncrement:
        var movementType = new MovementType({
          rangeLimit: rangeLimit,
          pieceNotation: pieceNotation,
          startPosition: startPosition,
          increment: "-8",
          boundaryCheck: function(i, increment, startPosition) {
            let endPosition = i * increment + startPosition
            return MovesCalculator.boundaryChecks({endPosition: endPosition}).vertical()
          }
        })
        return movementType
        break
      case MovesCalculator.forwardSlashUpIncrement:
        var movementType = new MovementType({
          rangeLimit: rangeLimit,
          pieceNotation: pieceNotation,
          startPosition: startPosition,
          increment: "+9",
          boundaryCheck: function(i, increment, startPosition) {
            let endPosition = i * increment + startPosition
            return MovesCalculator.boundaryChecks({startPosition: startPosition, endPosition: endPosition}).diagonalRight()
          }
        })
        return movementType
        break
      case MovesCalculator.forwardSlashDownIncrement:
        var movementType = new MovementType({
          rangeLimit: rangeLimit,
          pieceNotation: pieceNotation,
          startPosition: startPosition,
          increment: "-9",
          boundaryCheck: function(i, increment, startPosition) {
            let endPosition = i * increment + startPosition
            return MovesCalculator.boundaryChecks({startPosition: startPosition, endPosition: endPosition}).diagonalLeft()
          }
        })
        return movementType
        break
      case MovesCalculator.backSlashUpIncrement:
        var movementType = new MovementType({
          rangeLimit: rangeLimit,
          pieceNotation: pieceNotation,
          startPosition: startPosition,
          increment: "+7",
          boundaryCheck: function(i, increment, startPosition) {
            let endPosition = i * increment + startPosition
            return MovesCalculator.boundaryChecks({startPosition: startPosition, endPosition: endPosition}).diagonalLeft()
          }
        })
        return movementType
        break
      case MovesCalculator.backSlashDownIncrement:
        var movementType = new MovementType({
          rangeLimit: rangeLimit,
          pieceNotation: pieceNotation,
          startPosition: startPosition,
          increment: "-7",
          boundaryCheck: function(i, increment, startPosition) {
            let endPosition = i * increment + startPosition
            return MovesCalculator.boundaryChecks({startPosition: startPosition, endPosition: endPosition}).diagonalRight()
          }
        })
        return movementType
        break
      case MovesCalculator.horizontalRightIncrement:
        var movementType = new MovementType({
          rangeLimit: rangeLimit,
          pieceNotation: pieceNotation,
          startPosition: startPosition,
          increment: "+1",
          boundaryCheck: function(i, increment, startPosition) {
            let endPosition = i * increment + startPosition
            return MovesCalculator.boundaryChecks({startPosition: startPosition, endPosition: endPosition}).horizontal()
          }
        })
        return movementType
        break
      case MovesCalculator.horizontalLeftIncrement:
        var movementType = new MovementType({
          rangeLimit: rangeLimit,
          pieceNotation: pieceNotation,
          startPosition: startPosition,
          increment: "-1",
          boundaryCheck: function(i, increment, startPosition) {
            let endPosition = i * increment + startPosition
            return MovesCalculator.boundaryChecks({startPosition: startPosition, endPosition: endPosition}).horizontal()
          }
        })
        return movementType
        break
      case MovesCalculator.nightVerticalLeftUpIncrement:
        var movementType = new MovementType({
          rangeLimit: rangeLimit,
          pieceNotation: pieceNotation,
          startPosition: startPosition,
          increment: "+15",
          boundaryCheck: function(i, increment, startPosition) {
            let endPosition = i * increment + startPosition
            return MovesCalculator.boundaryChecks({startPosition: startPosition, endPosition: endPosition}).nightVertical()
          }
        })
        return movementType
        break
      case MovesCalculator.nightVerticalRightUpIncrement:
        var movementType = new MovementType({
          rangeLimit: rangeLimit,
          pieceNotation: pieceNotation,
          startPosition: startPosition,
          increment: "+17",
          boundaryCheck: function(i, increment, startPosition) {
            let endPosition = i * increment + startPosition
            return MovesCalculator.boundaryChecks({startPosition: startPosition, endPosition: endPosition}).nightVertical()
          }
        })
        return movementType
        break
      case MovesCalculator.nightHorizontalLeftUpIncrement:
        var movementType = new MovementType({
          rangeLimit: rangeLimit,
          pieceNotation: pieceNotation,
          startPosition: startPosition,
          increment: "+6",
          boundaryCheck: function(i, increment, startPosition) {
            let endPosition = i * increment + startPosition
            return MovesCalculator.boundaryChecks({startPosition: startPosition, endPosition: endPosition}).nightHorizontal()
          }
        })
        return movementType
        break
      case MovesCalculator.nightHorizontalRightUpIncrement:
        var movementType = new MovementType({
          rangeLimit: rangeLimit,
          pieceNotation: pieceNotation,
          startPosition: startPosition,
          increment: "+10",
          boundaryCheck: function(i, increment, startPosition) {
            let endPosition = i * increment + startPosition
            return MovesCalculator.boundaryChecks({startPosition: startPosition, endPosition: endPosition}).nightHorizontal()
          }
        })
        return movementType
        break
      case MovesCalculator.nightVerticalLeftDownIncrement:
        var movementType = new MovementType({
          rangeLimit: rangeLimit,
          pieceNotation: pieceNotation,
          startPosition: startPosition,
          increment: "-15",
          boundaryCheck: function(i, increment, startPosition) {
            let endPosition = i * increment + startPosition
            return MovesCalculator.boundaryChecks({startPosition: startPosition, endPosition: endPosition}).nightVertical()
          }
        })
        return movementType
        break
      case MovesCalculator.nightVerticalRightDownIncrement:
        var movementType = new MovementType({
          rangeLimit: rangeLimit,
          pieceNotation: pieceNotation,
          startPosition: startPosition,
          increment: "-17",
          boundaryCheck: function(i, increment, startPosition) {
            let endPosition = i * increment + startPosition
            return MovesCalculator.boundaryChecks({startPosition: startPosition, endPosition: endPosition}).nightVertical()
          }
        })
        return movementType
        break
      case MovesCalculator.nightHorizontalLeftDownIncrement:
        var movementType = new MovementType({
          rangeLimit: rangeLimit,
          pieceNotation: pieceNotation,
          startPosition: startPosition,
          increment: "-6",
          boundaryCheck: function(i, increment, startPosition) {
            let endPosition = i * increment + startPosition
            return MovesCalculator.boundaryChecks({startPosition: startPosition, endPosition: endPosition}).nightHorizontal()
          }
        })
        return movementType
        break
      case MovesCalculator.nightHorizontalRightDownIncrement:
        var movementType = new MovementType({
          rangeLimit: rangeLimit,
          pieceNotation: pieceNotation,
          startPosition: startPosition,
          increment: "-10",
          boundaryCheck: function(i, increment, startPosition) {
            let endPosition = i * increment + startPosition
            return MovesCalculator.boundaryChecks({startPosition: startPosition, endPosition: endPosition}).nightHorizontal()
          }
        })
        return movementType
        break
    }
  }

  static boundaryChecks(args){
    let startPosition = args["startPosition"],
        endPosition = args["endPosition"]
    return {
      diagonalRight: function(){
        return (endPosition) % 8 > (startPosition % 8) && Board._inBounds(endPosition)
      },
      vertical: function(){
        return Board._inBounds(endPosition)
      },
      diagonalLeft: function(){
        return (endPosition) % 8 < (startPosition % 8) && Board._inBounds(endPosition)
      },
      nightVertical: function(){
        return Math.abs( (endPosition) % 8 - startPosition % 8 ) === 1 && Board._inBounds(endPosition)
      },
      nightHorizontal: function(){
        return Math.abs( (endPosition) % 8 - startPosition % 8 ) === 2 && Board._inBounds(endPosition)
      },
      horizontal: function(){
        return Math.floor((endPosition) / 8) === Math.floor(startPosition / 8) && Board._inBounds(endPosition)
      }
    }
  }

  static get allIncrements(){
    return [MovesCalculator.verticalUpIncrement, MovesCalculator.verticalDownIncrement, MovesCalculator.forwardSlashUpIncrement, MovesCalculator.forwardSlashDownIncrement,
      MovesCalculator.backSlashUpIncrement, MovesCalculator.backSlashDownIncrement, MovesCalculator.nightVerticalLeftUpIncrement, MovesCalculator.nightVerticalRightUpIncrement,
      MovesCalculator.nightHorizontalLeftUpIncrement, MovesCalculator.nightHorizontalRightUpIncrement, MovesCalculator.nightVerticalLeftDownIncrement, MovesCalculator.nightVerticalRightDownIncrement,
      MovesCalculator.nightHorizontalLeftDownIncrement, MovesCalculator.nightHorizontalRightDownIncrement, MovesCalculator.horizontalRightIncrement, MovesCalculator.horizontalLeftIncrement
    ]
  }

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

  static pieceSpecificMovements(species, differential){

    // if( differential ){
    //   var possibleMovesTowardsEndPosition = []
    //   for( let i = 0; i < MovesCalculator.allIncrements.length; i++){
    //     let increment = MovesCalculator.allIncrements[i]
    //     if( differential % increment === 0 ){
    //       possibleMovesTowardsEndPosition.push( MovesCalculator.genericMovements( increment ) )
    //     }
    //   }
    // }

    switch(species){
      case "P":
        return function({board: board, startPosition: startPosition}){
          var movementTypes = [],
            teamString = board.teamAt(startPosition),
            colorVars = {
              B: {
                startRank: 7,
                nonAttackMove: MovesCalculator.genericMovements({increment: MovesCalculator.verticalDownIncrement}),
                singleStepCheck: board._oneSpaceDownIsEmpty(startPosition),
                doubleStepCheck: Board.isSeventhRank(startPosition) && board._twoSpacesDownIsEmpty(startPosition) && board._oneSpaceDownIsEmpty(startPosition),
                leftAttackCheck: board._downAndLeftIsAttackable(startPosition),
                leftAttackMove: MovesCalculator.genericMovements({increment: MovesCalculator.forwardSlashDownIncrement}),
                rightAttackCheck: board._downAndRightIsAttackable(startPosition),
                rightAttackMove: MovesCalculator.genericMovements({increment: MovesCalculator.backSlashDownIncrement}),
                rightEnPassantCheck: Board.rank(startPosition) === 4 && board._whitePawnAt(startPosition + 1) && board.whitePawnDoubleSteppedTo(startPosition + 1),//board.whitePawnDoubleSteppedFrom(startPosition - 15),
                leftEnPassantCheck: Board.rank(startPosition) === 4 && board._whitePawnAt(startPosition - 1) && board.whitePawnDoubleSteppedTo(startPosition - 1)// board.whitePawnDoubleSteppedFrom(startPosition - 17),
              },
              W: {
                startRank: 2,
                nonAttackMove: MovesCalculator.genericMovements({increment: MovesCalculator.verticalUpIncrement}),
                singleStepCheck: board._oneSpaceUpIsEmpty(startPosition),
                doubleStepCheck: Board.isSecondRank(startPosition) && board._twoSpacesUpIsEmpty( startPosition ) && board._oneSpaceUpIsEmpty(startPosition),
                leftAttackCheck: board._upAndLeftIsAttackable(startPosition),
                leftAttackMove: MovesCalculator.genericMovements({increment: MovesCalculator.backSlashUpIncrement}),
                rightAttackCheck: board._upAndRightIsAttackable(startPosition ),
                rightAttackMove: MovesCalculator.genericMovements({increment: MovesCalculator.forwardSlashUpIncrement}),
                leftEnPassantCheck: Board.rank(startPosition) === 5 && board._blackPawnAt(startPosition - 1) && board.blackPawnDoubleSteppedTo(startPosition - 1),//board.blackPawnDoubleSteppedFrom(startPosition + 15),
                rightEnPassantCheck: Board.rank(startPosition) === 5 && board._blackPawnAt(startPosition + 1) && board.blackPawnDoubleSteppedTo(startPosition + 1)//board.blackPawnDoubleSteppedFrom(startPosition + 17),
              }
            },
            pawnVars = colorVars[teamString]
          if ( pawnVars.doubleStepCheck ){
            let movementType = pawnVars.nonAttackMove
            movementType.rangeLimit = 2
            movementType.pieceNotation = ""
            movementType.startPosition = startPosition
            movementTypes.push(movementType)
          } else if ( pawnVars.singleStepCheck ) {
            let movementType = pawnVars.nonAttackMove
            movementType.rangeLimit = 1
            movementType.pieceNotation = ""
            movementType.startPosition = startPosition
            movementTypes.push(movementType)
          }
          if ( pawnVars.leftAttackCheck ) {
            let movementType = pawnVars.leftAttackMove
            movementType.rangeLimit = 1
            movementType.startPosition = startPosition
            movementType.pieceNotation = Board.file(startPosition)
            movementTypes.push(movementType)
          }
          if( pawnVars.rightAttackCheck ) {
            let movementType = pawnVars.rightAttackMove
            movementType.rangeLimit = 1
            movementType.startPosition = startPosition
            movementType.pieceNotation = Board.file(startPosition)
            movementTypes.push(movementType)
          }
          if( pawnVars.rightEnPassantCheck ){
            let movementType = pawnVars.rightAttackMove
            movementType.rangeLimit = 1
            movementType.startPosition = startPosition
            movementType.pieceNotation = Board.file(startPosition)// + "x"
            movementType.captureNotation = "x" //might be quicker to assign a single hash at once
            // let capture = board._capture.bind(board)
            movementType.additionalActions = function(startPosition){
              this._capture(startPosition + 1)
              this._emptify(startPosition + 1)
              return "e.p."
            }
            movementTypes.push(movementType)
          }
          if( pawnVars.leftEnPassantCheck ){
            let movementType = pawnVars.leftAttackMove
            movementType.rangeLimit = 1
            movementType.startPosition = startPosition
            movementType.pieceNotation = Board.file(startPosition)// + "x"
            movementType.captureNotation = "x" //might be quicker to assign a single hash at once
            // let capture = board._capture.bind(board)
            movementType.additionalActions = function(startPosition){
              this._capture(startPosition - 1)
              this._emptify(startPosition - 1)
              return "e.p."
            }
            movementTypes.push(movementType)
          }
          // debugger
        return movementTypes
      }
      case "N":
        return function({board: board, startPosition: startPosition}){
          let pieceNotation = "N",
            rangeLimit = 1
          var movementTypes = [MovesCalculator.genericMovements({startPosition: startPosition, rangeLimit: rangeLimit, pieceNotation: pieceNotation, increment: MovesCalculator.nightHorizontalRightDownIncrement}), MovesCalculator.genericMovements({startPosition: startPosition, rangeLimit: rangeLimit, pieceNotation: pieceNotation, increment: MovesCalculator.nightHorizontalLeftDownIncrement}), MovesCalculator.genericMovements({startPosition: startPosition, rangeLimit: rangeLimit, pieceNotation: pieceNotation, increment: MovesCalculator.nightVerticalRightDownIncrement}),
              MovesCalculator.genericMovements({startPosition: startPosition, rangeLimit: rangeLimit, pieceNotation: pieceNotation, increment: MovesCalculator.nightVerticalLeftDownIncrement}), MovesCalculator.genericMovements({startPosition: startPosition, rangeLimit: rangeLimit, pieceNotation: pieceNotation, increment: MovesCalculator.nightHorizontalRightUpIncrement}), MovesCalculator.genericMovements({startPosition: startPosition, rangeLimit: rangeLimit, pieceNotation: pieceNotation, increment: MovesCalculator.nightHorizontalLeftUpIncrement}),
              MovesCalculator.genericMovements({startPosition: startPosition, rangeLimit: rangeLimit, pieceNotation: pieceNotation, increment: MovesCalculator.nightVerticalRightUpIncrement}), MovesCalculator.genericMovements({startPosition: startPosition, rangeLimit: rangeLimit, pieceNotation: pieceNotation, increment: MovesCalculator.nightVerticalLeftUpIncrement})
            ]
          // if( possibleMovesTowardsEndPosition ){
          //   movementTypes = MovesCalculator.getCommonMoveObjects(movementTypes, possibleMovesTowardsEndPosition)
          // }
          // for (let i = 0; i < movementTypes.length; i++ ) {
          //     movementTypes[i].rangeLimit = 1
          //     movementTypes[i].pieceNotation = "N";
          //     movementTypes[i].startPosition = startPosition
          // }
          return  movementTypes
        }
        break
      case "R":
        return function({board: board, startPosition: startPosition}){
          let pieceNotation = "R",
            rangeLimit = 7;
          var movementTypes = [MovesCalculator.genericMovements({startPosition: startPosition, rangeLimit: rangeLimit, pieceNotation: pieceNotation, increment: MovesCalculator.horizontalRightIncrement}), MovesCalculator.genericMovements({startPosition: startPosition, rangeLimit: rangeLimit, pieceNotation: pieceNotation, increment: MovesCalculator.horizontalLeftIncrement}), MovesCalculator.genericMovements({startPosition: startPosition, rangeLimit: rangeLimit, pieceNotation: pieceNotation, increment: MovesCalculator.verticalUpIncrement}), MovesCalculator.genericMovements({startPosition: startPosition, rangeLimit: rangeLimit, pieceNotation: pieceNotation, increment: MovesCalculator.verticalDownIncrement})]
          // if( possibleMovesTowardsEndPosition ){
          //   movementTypes = MovesCalculator.getCommonMoveObjects(movementTypes, possibleMovesTowardsEndPosition)
          // }
          // for (let i = 0; i < movementTypes.length; i++ ) {
          //   movementTypes[i].rangeLimit = 7
          //   movementTypes[i].pieceNotation = "R"
          //   movementTypes[i].startPosition = startPosition
          // }
          return movementTypes
        }
        break
      case "B":
        return function({board: board, startPosition: startPosition}){
          let pieceNotation = "B",
            rangeLimit = 7;
          var movementTypes = [MovesCalculator.genericMovements({startPosition: startPosition, rangeLimit: rangeLimit, pieceNotation: pieceNotation, increment: MovesCalculator.forwardSlashDownIncrement}), MovesCalculator.genericMovements({startPosition: startPosition, rangeLimit: rangeLimit, pieceNotation: pieceNotation, increment: MovesCalculator.forwardSlashUpIncrement}), MovesCalculator.genericMovements({startPosition: startPosition, rangeLimit: rangeLimit, pieceNotation: pieceNotation, increment: MovesCalculator.backSlashDownIncrement}), MovesCalculator.genericMovements({startPosition: startPosition, rangeLimit: rangeLimit, pieceNotation: pieceNotation, increment: MovesCalculator.backSlashUpIncrement})]
          // if( possibleMovesTowardsEndPosition ){
          //   movementTypes = MovesCalculator.getCommonMoveObjects(movementTypes, possibleMovesTowardsEndPosition)
          // }
          // for (let i = 0; i < movementTypes.length; i++ ) {
          //   movementTypes[i].rangeLimit = 7
          //   movementTypes[i].pieceNotation = "B"
          //   movementTypes[i].startPosition = startPosition
          // }
          return movementTypes
        }
        break
      case "Q":
        return function({board: board, startPosition: startPosition}){
          let pieceNotation = "Q",
            rangeLimit = 7;
          // var movementTypes =  MovesCalculator.pieceSpecificMovements("R", differential)({startPosition: startPosition, board: board}).concat( MovesCalculator.pieceSpecificMovements("B", differential)({startPosition: startPosition, board: board}) )
          //
          var movementTypes = [MovesCalculator.genericMovements({startPosition: startPosition, rangeLimit: rangeLimit, pieceNotation: pieceNotation, increment: MovesCalculator.forwardSlashDownIncrement}), MovesCalculator.genericMovements({startPosition: startPosition, rangeLimit: rangeLimit, pieceNotation: pieceNotation, increment: MovesCalculator.forwardSlashUpIncrement}),
            MovesCalculator.genericMovements({startPosition: startPosition, rangeLimit: rangeLimit, pieceNotation: pieceNotation, increment: MovesCalculator.backSlashDownIncrement}), MovesCalculator.genericMovements({startPosition: startPosition, rangeLimit: rangeLimit, pieceNotation: pieceNotation, increment: MovesCalculator.backSlashUpIncrement}),
            MovesCalculator.genericMovements({startPosition: startPosition, rangeLimit: rangeLimit, pieceNotation: pieceNotation, increment: MovesCalculator.horizontalRightIncrement}), MovesCalculator.genericMovements({startPosition: startPosition, rangeLimit: rangeLimit, pieceNotation: pieceNotation, increment: MovesCalculator.horizontalLeftIncrement}),
            MovesCalculator.genericMovements({startPosition: startPosition, rangeLimit: rangeLimit, pieceNotation: pieceNotation, increment: MovesCalculator.verticalUpIncrement}), MovesCalculator.genericMovements({startPosition: startPosition, rangeLimit: rangeLimit, pieceNotation: pieceNotation, increment: MovesCalculator.verticalDownIncrement})
          ]
          // if( possibleMovesTowardsEndPosition ){
          //   movementTypes = MovesCalculator.getCommonMoveObjects(movementTypes, possibleMovesTowardsEndPosition)
          // }
          // for (let i = 0; i < movementTypes.length; i++ ) {
          //   movementTypes[i].rangeLimit = 7
          //   movementTypes[i].pieceNotation = "Q"
          //   movementTypes[i].startPosition = startPosition
          // }
          return movementTypes
        }
        break
      case "K":
        return function({board: board, startPosition: startPosition, ignoreCastles: ignoreCastles}){
          let pieceNotation = "K",
            rangeLimit = 1;
          var movementTypes = [MovesCalculator.genericMovements({startPosition: startPosition, rangeLimit: rangeLimit, pieceNotation: pieceNotation, increment: MovesCalculator.horizontalRightIncrement}), MovesCalculator.genericMovements({startPosition: startPosition, rangeLimit: rangeLimit, pieceNotation: pieceNotation, increment: MovesCalculator.horizontalLeftIncrement}), MovesCalculator.genericMovements({startPosition: startPosition, rangeLimit: rangeLimit, pieceNotation: pieceNotation, increment: MovesCalculator.verticalUpIncrement}), MovesCalculator.genericMovements({startPosition: startPosition, rangeLimit: rangeLimit, pieceNotation: pieceNotation, increment: MovesCalculator.verticalDownIncrement}),
              MovesCalculator.genericMovements({startPosition: startPosition, rangeLimit: rangeLimit, pieceNotation: pieceNotation, increment: MovesCalculator.forwardSlashDownIncrement}), MovesCalculator.genericMovements({startPosition: startPosition, rangeLimit: rangeLimit, pieceNotation: pieceNotation, increment: MovesCalculator.forwardSlashUpIncrement}), MovesCalculator.genericMovements({startPosition: startPosition, rangeLimit: rangeLimit, pieceNotation: pieceNotation, increment: MovesCalculator.backSlashDownIncrement}), MovesCalculator.genericMovements({startPosition: startPosition, rangeLimit: rangeLimit, pieceNotation: pieceNotation, increment: MovesCalculator.backSlashUpIncrement})
            ],
            team = board.teamAt(startPosition)
            //
            // if( possibleMovesTowardsEndPosition ){
            //   movementTypes = MovesCalculator.getCommonMoveObjects(movementTypes, possibleMovesTowardsEndPosition)
            // }

          // for (let i = 0; i < movementTypes.length; i++ ) {
          //   movementTypes[i].rangeLimit = 1
          //   movementTypes[i].pieceNotation = "K"
          //   movementTypes[i].startPosition = startPosition
          // }
          if ( !ignoreCastles && board.kingSideCastleViableFor(team, startPosition) ){
            let movementType = MovesCalculator.genericMovements({startPosition: startPosition, rangeLimit: rangeLimit, pieceNotation: pieceNotation, increment: MovesCalculator.horizontalLeftIncrement})
            movementType.increment = + 2
            movementType.rangeLimit = 1
            movementType.pieceNotation = "O-O"
            movementType.startPosition = startPosition
            // let _emptify = board._emptify.bind(board),
            //   _placePiece = board._placePiece.bind(board),
            //   pieceObject = board.pieceObject.bind(board)
            movementType.additionalActions = function(startPosition){
              let rook = this.pieceObject( startPosition + 3 )
              this._placePiece({ position: (startPosition + 1), pieceObject: rook })
              this._emptify( startPosition + 3)
              return ""
            }
            movementTypes.push(movementType)
          }
          if ( !ignoreCastles && board.queenSideCastleViableFor(team, startPosition) ){
            let movementType = MovesCalculator.genericMovements({startPosition: startPosition, rangeLimit: rangeLimit, pieceNotation: pieceNotation, increment: MovesCalculator.horizontalRightIncrement})
            movementType.increment = - 2
            movementType.rangeLimit = 1
            movementType.pieceNotation = "O-O-O"
            movementType.startPosition = startPosition
            // let _emptify = board._emptify.bind(board),
            //   _placePiece = board._placePiece.bind(board),
            //   pieceObject = board.pieceObject.bind(board)
            movementType.additionalActions = function(startPosition){
              let rook = this.pieceObject( startPosition - 4 )
              this._placePiece({ position: (startPosition - 1), pieceObject: rook })
              this._emptify( startPosition - 4)
              return ""
            }
            movementTypes.push(movementType)
          }
          return movementTypes
        }
        break
      // }the case causes a weird switch in the indentation. jarring right?
    }
  }

}
