class MovesCalculator {
  constructor({  startPosition: startPosition, board: board, moveObjects: moveObjects, ignoreCastles: ignoreCastles, endPosition: endPosition
  }){
    this.startPosition = startPosition;
    this.board = board;
    this.moveObjects = moveObjects || [];
    this.viablePositions = {};
    this.ignoreCastles = ignoreCastles || false;
    this.endPosition = endPosition;
    this.addMoves();
    this.calculateViablePositions();
  }
// calculate form of motion by div modding start and end
// check whether the piece at the start is in the list of pieces allowed to make such a movement
// have some conditions under which pawns can move
// also conditions for castling
  addMoves(){
    if ( this.startPosition === undefined || !this.board){
      throw new Error("moveObject missing startPosition or board in addMovementTypesAndBoundaryChecks")
    } else {
      let pieceType = this.board.pieceTypeAt(this.startPosition),
          pieceSpecificMovements = MovesCalculator.pieceSpecificMovements()[ pieceType ];
      this.moveObjects = pieceSpecificMovements({startPosition: this.startPosition, board: this.board, ignoreCastles: this.ignoreCastles})
    }
  }

  calculateViablePositions(){
    let teamString = this.board.teamAt(this.startPosition);
    for(let i = 0; i < this.moveObjects.length; i++){
      let move = this.moveObjects[i],
          increment = move.increment,
          rangeLimit = move.rangeLimit,
          boundaryCheck = move.boundaryCheck;
      for(let j = 1; j <= rangeLimit; j++){
        let currentPosition = increment * j + this.startPosition;
        if ( !boundaryCheck(j, increment, this.startPosition) ){
          break
        }
        if ( this.board.positionEmpty(currentPosition) ){
          this.viablePositions[currentPosition] = move
          if( this.endPosition === currentPosition){ return }
        } else if( this.board.occupiedByOpponent({position: currentPosition, teamString: teamString} ) ){
          this.viablePositions[currentPosition] = move
          if( this.endPosition === currentPosition){ return }
          break
        } else if( this.board.occupiedByTeamMate({position: currentPosition, teamString: teamString} ) ){
          break
        };
      };
    };
  }

  static get verticalUp(){ return 8 }
  static get verticalDown(){ return -8 }
  static get forwardSlashUp(){ return 9 }
  static get forwardSlashDown(){ return -9 }
  static get backSlashUp(){ return 7 }
  static get backSlashDown(){ return -7 }
  static get nightVerticalLeftUp(){ return 15 }
  static get nightVerticalRightUp(){ return 17 }
  static get nightHorizontalLeftUp(){ return 6 }
  static get nightHorizontalRightUp(){ return 10 }
  static get nightVerticalLeftDown(){ return -15 }
  static get nightVerticalRightDown(){ return -17 }
  static get nightHorizontalLeftDown(){ return -6 }
  static get nightHorizontalRightDown(){ return -10 }
  static get horizontalRight(){ return 1 }
  static get horizontalLeft(){ return -1 }


  static genericMovements(increment){
    switch(increment){
      case MovesCalculator.verticalUp:
        var moveObject = new MoveObject({
          increment: "+8",
          boundaryCheck: function(i, increment, startPosition) {
            let endPosition = i * increment + startPosition;
            return MovesCalculator.boundaryChecks({endPosition: endPosition}).vertical()
          }
        })
        return moveObject
        break;
      case MovesCalculator.verticalDown:
        var moveObject = new MoveObject({
          increment: "-8",
          boundaryCheck: function(i, increment, startPosition) {
            let endPosition = i * increment + startPosition;
            return MovesCalculator.boundaryChecks({endPosition: endPosition}).vertical()
          }
        })
        return moveObject
        break;
      case MovesCalculator.forwardSlashUp:
        var moveObject = new MoveObject({
          increment: "+9",
          boundaryCheck: function(i, increment, startPosition) {
            let endPosition = i * increment + startPosition;
            return MovesCalculator.boundaryChecks({startPosition: startPosition, endPosition: endPosition}).diagonalRight()
          }
        })
        return moveObject
        break;
      case MovesCalculator.forwardSlashDown:
        var moveObject = new MoveObject({
          increment: "-9",
          boundaryCheck: function(i, increment, startPosition) {
            let endPosition = i * increment + startPosition;
            return MovesCalculator.boundaryChecks({startPosition: startPosition, endPosition: endPosition}).diagonalLeft()
          }
        })
        return moveObject
        break;
      case MovesCalculator.backSlashUp:
        var moveObject = new MoveObject({
          increment: "+7",
          boundaryCheck: function(i, increment, startPosition) {
            let endPosition = i * increment + startPosition;
            return MovesCalculator.boundaryChecks({startPosition: startPosition, endPosition: endPosition}).diagonalLeft()
          }
        })
        return moveObject
        break;
      case MovesCalculator.backSlashDown:
        var moveObject = new MoveObject({
          increment: "-7",
          boundaryCheck: function(i, increment, startPosition) {
            let endPosition = i * increment + startPosition;
            return MovesCalculator.boundaryChecks({startPosition: startPosition, endPosition: endPosition}).diagonalRight()
          }
        })
        return moveObject
        break;
      case MovesCalculator.nightVerticalLeftUp:
        var moveObject = new MoveObject({
          increment: "+15",
          boundaryCheck: function(i, increment, startPosition) {
            let endPosition = i * increment + startPosition;
            return MovesCalculator.boundaryChecks({startPosition: startPosition, endPosition: endPosition}).nightVertical()
          }
        })
        return moveObject
        break;
      case MovesCalculator.nightVerticalRightUp:
        var moveObject = new MoveObject({
          increment: "+17",
          boundaryCheck: function(i, increment, startPosition) {
            let endPosition = i * increment + startPosition;
            return MovesCalculator.boundaryChecks({startPosition: startPosition, endPosition: endPosition}).nightVertical()
          }
        })
        return moveObject
        break;
      case MovesCalculator.nightHorizontalLeftUp:
        var moveObject = new MoveObject({
          increment: "+6",
          boundaryCheck: function(i, increment, startPosition) {
            let endPosition = i * increment + startPosition;
            return MovesCalculator.boundaryChecks({startPosition: startPosition, endPosition: endPosition}).nightHorizontal()
          }
        })
        return moveObject
        break;
      case MovesCalculator.nightHorizontalRightUp:
        var moveObject = new MoveObject({
          increment: "+10",
          boundaryCheck: function(i, increment, startPosition) {
            let endPosition = i * increment + startPosition;
            return MovesCalculator.boundaryChecks({startPosition: startPosition, endPosition: endPosition}).nightHorizontal()
          }
        })
        return moveObject
        break;
      case MovesCalculator.nightVerticalLeftDown:
        var moveObject = new MoveObject({
          increment: "-15",
          boundaryCheck: function(i, increment, startPosition) {
            let endPosition = i * increment + startPosition;
            return MovesCalculator.boundaryChecks({startPosition: startPosition, endPosition: endPosition}).nightVertical()
          }
        })
        return moveObject
        break;
      case MovesCalculator.nightVerticalRightDown:
        var moveObject = new MoveObject({
          increment: "-17",
          boundaryCheck: function(i, increment, startPosition) {
            let endPosition = i * increment + startPosition;
            return MovesCalculator.boundaryChecks({startPosition: startPosition, endPosition: endPosition}).nightVertical()
          }
        })
        return moveObject
        break;
      case MovesCalculator.nightHorizontalLeftDown:
        var moveObject = new MoveObject({
          increment: "-6",
          boundaryCheck: function(i, increment, startPosition) {
            let endPosition = i * increment + startPosition;
            return MovesCalculator.boundaryChecks({startPosition: startPosition, endPosition: endPosition}).nightHorizontal()
          }
        })
        return moveObject
        break;
      case MovesCalculator.nightHorizontalRightDown:
        var moveObject = new MoveObject({
          increment: "-10",
          boundaryCheck: function(i, increment, startPosition) {
            let endPosition = i * increment + startPosition;
            return MovesCalculator.boundaryChecks({startPosition: startPosition, endPosition: endPosition}).nightHorizontal()
          }
        })
        return moveObject
        break;
      case MovesCalculator.horizontalRight:
        var moveObject = new MoveObject({
          increment: "+1",
          boundaryCheck: function(i, increment, startPosition) {
            let endPosition = i * increment + startPosition;
            return MovesCalculator.boundaryChecks({startPosition: startPosition, endPosition: endPosition}).horizontal()
          }
        })
        return moveObject
        break;
      case MovesCalculator.horizontalLeft:
        var moveObject = new MoveObject({
          increment: "-1",
          boundaryCheck: function(i, increment, startPosition) {
            let endPosition = i * increment + startPosition;
            return MovesCalculator.boundaryChecks({startPosition: startPosition, endPosition: endPosition}).horizontal()
          }
        })
        return moveObject
        break;
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
    return [-1, 1, -7, 7, -9, 9, 8, -8, -15, 15, -17, 17, 6, -6, 10, -10]
  }

  static pieceSpecificMovements(species, differential){
    if( differential ){
      var possibleIncrements = []

    };
    switch(species){
      case "N":
        return function({board: board, startPosition: startPosition}){
          let moveObjects = [MovesCalculator.genericMovements( MovesCalculator.nightHorizontalRightDown), MovesCalculator.genericMovements( MovesCalculator.nightHorizontalLeftDown), MovesCalculator.genericMovements( MovesCalculator.nightVerticalRightDown),
                      MovesCalculator.genericMovements( MovesCalculator.nightVerticalLeftDown), MovesCalculator.genericMovements( MovesCalculator.nightHorizontalRightUp), MovesCalculator.genericMovements( MovesCalculator.nightHorizontalLeftUp),
                      MovesCalculator.genericMovements( MovesCalculator.nightVerticalRightUp), MovesCalculator.genericMovements( MovesCalculator.nightVerticalLeftUp)
                    ];
          for (let i = 0; i < moveObjects.length; i++ ) {
              moveObjects[i].rangeLimit = 1;
              moveObjects[i].pieceNotation = "N";;
              moveObjects[i].startPosition = startPosition
          };
          return  moveObjects
        };
      case "R":
        return function({board: board, startPosition: startPosition}){
          let moveObjects = [MovesCalculator.genericMovements( MovesCalculator.horizontalRight), MovesCalculator.genericMovements( MovesCalculator.horizontalLeft), MovesCalculator.genericMovements( MovesCalculator.verticalUp), MovesCalculator.genericMovements( MovesCalculator.verticalDown)]
          for (let i = 0; i < moveObjects.length; i++ ) {
            moveObjects[i].rangeLimit = 7;
            moveObjects[i].pieceNotation = "R";
            moveObjects[i].startPosition = startPosition
          };
          return moveObjects
        };
      case "B":
        return function({board: board, startPosition: startPosition}){
          let moveObjects = [MovesCalculator.genericMovements( MovesCalculator.forwardSlashDown), MovesCalculator.genericMovements( MovesCalculator.forwardSlashUp), MovesCalculator.genericMovements( MovesCalculator.backSlashDown), MovesCalculator.genericMovements( MovesCalculator.backSlashUp)]
          for (let i = 0; i < moveObjects.length; i++ ) {
            moveObjects[i].rangeLimit = 7;
            moveObjects[i].pieceNotation = "B";
            moveObjects[i].startPosition = startPosition
          };
          return moveObjects
        };
      case "Q":
        return function({board: board, startPosition: startPosition}){
          let moveObjects =  MovesCalculator.pieceSpecificMovements("R")({startPosition: startPosition, board: board}).concat( MovesCalculator.pieceSpecificMovements("B")({startPosition: startPosition, board: board}) )
          for (let i = 0; i < moveObjects.length; i++ ) {
            moveObjects[i].rangeLimit = 7;
            moveObjects[i].pieceNotation = "Q";
            moveObjects[i].startPosition = startPosition
          };
          return moveObjects
        };
      case "K":
        return function({board: board, startPosition: startPosition, ignoreCastles: ignoreCastles}){
          let moveObjects = [MovesCalculator.genericMovements( MovesCalculator.horizontalRight), MovesCalculator.genericMovements( MovesCalculator.horizontalLeft), MovesCalculator.genericMovements( MovesCalculator.verticalUp), MovesCalculator.genericMovements( MovesCalculator.verticalDown),
                      MovesCalculator.genericMovements( MovesCalculator.forwardSlashDown), MovesCalculator.genericMovements( MovesCalculator.forwardSlashUp), MovesCalculator.genericMovements( MovesCalculator.backSlashDown), MovesCalculator.genericMovements( MovesCalculator.backSlashUp)
                    ],
            team = board.teamAt(startPosition)
          for (let i = 0; i < moveObjects.length; i++ ) {
            moveObjects[i].rangeLimit = 1;
            moveObjects[i].pieceNotation = "K";
            moveObjects[i].startPosition = startPosition
          };
          // if ( !ignoreCastles && board.kingSideCastleViableFrom(startPosition) ){
          if ( !ignoreCastles && board.kingSideCastleViableFor(team) ){
            let moveObject = MovesCalculator.genericMovements( MovesCalculator.horizontalLeft)
            moveObject.increment = + 2
            moveObject.rangeLimit = 1
            moveObject.fullNotation = "O-O";
            moveObject.startPosition = startPosition;
            moveObject.additionalActions = function(args){
              let position = args["position"],
                  pieceObject = this.pieceObject( startPosition + 3 );
              this._emptify( startPosition + 3)
              this._placePiece({ position: (startPosition + 1), pieceObject: pieceObject })
            }
            moveObjects.push(moveObject)
          };
          // if ( !ignoreCastles && board.queenSideCastleViableFrom(startPosition) ){
          if ( !ignoreCastles && board.queenSideCastleViableFor(team) ){
            let moveObject = MovesCalculator.genericMovements( MovesCalculator.horizontalRight)
            moveObject.increment = - 2
            moveObject.rangeLimit = 1
            moveObject.fullNotation = "O-O-O";
            moveObject.startPosition = startPosition;
            moveObject.additionalActions = function(args){
              let position = args["position"],
                  pieceObject = this.pieceObject( startPosition - 4 );
              this._emptify( startPosition - 4)
              this._placePiece({ position: (startPosition - 1), pieceObject: pieceObject })
            }
            moveObjects.push(moveObject)
          };
          return moveObjects
        };
      case "P":
        return function({board: board, startPosition: startPosition}){
          let moveObjects = [],
            teamString = board.teamAt(startPosition),
            colorVars = {
              B: {
                startRank: 7,
                nonAttackMove: MovesCalculator.genericMovements( MovesCalculator.verticalDown),
                singleStepCheck: board._oneSpaceDownIsEmpty(startPosition),
                doubleStepCheck: Board.isSeventhRank(startPosition) && board._twoSpacesDownIsEmpty(startPosition),
                leftAttackCheck: board._downAndLeftIsAttackable(startPosition),
                leftAttackMove: MovesCalculator.genericMovements( MovesCalculator.forwardSlashDown),
                rightAttackCheck: board._downAndRightIsAttackable(startPosition),
                rightAttackMove: MovesCalculator.genericMovements( MovesCalculator.backSlashDown),
                rightEnPassantCheck: Board.rank(startPosition) === 4 && board._whitePawnAt(startPosition + 1) && board.whitePawnDoubleSteppedTo(startPosition + 1),//board.whitePawnDoubleSteppedFrom(startPosition - 15),
                leftEnPassantCheck: Board.rank(startPosition) === 4 && board._whitePawnAt(startPosition - 1) && board.whitePawnDoubleSteppedTo(startPosition - 1)// board.whitePawnDoubleSteppedFrom(startPosition - 17),
              },
              W: {
                startRank: 2,
                nonAttackMove: MovesCalculator.genericMovements( MovesCalculator.verticalUp),
                singleStepCheck: board._oneSpaceUpIsEmpty(startPosition),
                doubleStepCheck: Board.isSecondRank(startPosition) && board._twoSpacesUpIsEmpty( startPosition ),
                leftAttackCheck: board._upAndLeftIsAttackable(startPosition),
                leftAttackMove: MovesCalculator.genericMovements( MovesCalculator.backSlashUp),
                rightAttackCheck: board._upAndRightIsAttackable(startPosition ),
                rightAttackMove: MovesCalculator.genericMovements( MovesCalculator.forwardSlashUp),
                leftEnPassantCheck: Board.rank(startPosition) === 5 && board._blackPawnAt(startPosition - 1) && board.blackPawnDoubleSteppedTo(startPosition - 1),//board.blackPawnDoubleSteppedFrom(startPosition + 15),
                rightEnPassantCheck: Board.rank(startPosition) === 5 && board._blackPawnAt(startPosition + 1) && board.blackPawnDoubleSteppedTo(startPosition + 1)//board.blackPawnDoubleSteppedFrom(startPosition + 17),
              }
            },
            pawnVars = colorVars[teamString];
          if ( pawnVars.singleStepCheck ) {
            let moveObject = pawnVars.nonAttackMove
            moveObject.rangeLimit = 1
            moveObject.pieceNotation = ""
            moveObject.startPosition = startPosition
            moveObjects = moveObjects.concat(moveObject)
          }
          if ( pawnVars.doubleStepCheck ){
              let moveObject = pawnVars.nonAttackMove
            moveObject.rangeLimit = 2
            moveObject.pieceNotation = ""
            moveObject.startPosition = startPosition
            moveObjects = moveObjects.concat(moveObject)
          }
          if ( pawnVars.leftAttackCheck ) {
            let moveObject = pawnVars.leftAttackMove
            moveObject.rangeLimit = 1
            moveObject.startPosition = startPosition
            moveObject.pieceNotation = Board.file(startPosition)
            moveObjects = moveObjects.concat(moveObject)
          }
          if( pawnVars.rightAttackCheck ) {
            let moveObject = pawnVars.rightAttackMove
            moveObject.rangeLimit = 1
            moveObject.startPosition = startPosition
            moveObject.pieceNotation = Board.file(startPosition)
            moveObjects = moveObjects.concat(moveObject)
          };
          if( pawnVars.rightEnPassantCheck ){
            let moveObject = pawnVars.rightAttackMove
            moveObject.rangeLimit = 1
            moveObject.startPosition = startPosition
            moveObject.pieceNotation = Board.file(startPosition)
            moveObject.additionalActions = function(args){
              let position = args["position"],
                captureNotation = this._capture(startPosition + 1) + "e.p.";
              return captureNotation
            }
            moveObjects = moveObjects.concat(moveObject)
          }
          if( pawnVars.leftEnPassantCheck ){
            let moveObject = pawnVars.leftAttackMove
            moveObject.rangeLimit = 1
            moveObject.startPosition = startPosition
            moveObject.pieceNotation = Board.file(startPosition)
            moveObject.additionalActions = function(args){
              let position = args["position"];
              let captureNotation = this._capture(startPosition - 1) + "e.p.";
              return captureNotation
            }
            moveObjects = moveObjects.concat(moveObject)
          }
        return moveObjects;
      };
    }
  }

}
