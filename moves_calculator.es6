class MovesCalculator {
  constructor(options = {  startPosition: undefined, board: undefined, moveObjects: [],
  }){

    this.startPosition = options["startPosition"]
    this.board = options["board"]
    this.moveObjects = []
    this.viablePositions = {}
    this.addMoves(),
    this.calculateViablePositions();
  }
  addMoves(){
    if ( this.startPosition === undefined || !this.board){
      throw new Error("moveObject missing startPosition or board in addMovementTypesAndBoundaryChecks")
    } else {
      this.moveObjects = MovesCalculator.pieceSpecificMovements()[this.board.pieceTypeAt(this.startPosition)]({startPosition: this.startPosition, board: this.board})
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
        let currentPosition = increment * j + this.startPosition,
            occupyingTeam = this.board.teamAt(currentPosition);
        if ( !boundaryCheck(j, increment, this.startPosition) ){
          break
        }
        if ( this.board.positionEmpty(currentPosition) ){
          this.viablePositions[currentPosition] = move
        } else if( this.board.occupiedByOpponent({position: currentPosition, teamString: teamString} ) ){
          this.viablePositions[currentPosition] = move
          break
        } else if( this.board.occupiedByTeamMate({position: currentPosition, teamString: teamString} ) ){
          break
        };
      };
    };
  }



  static genericMovements(){
    return {
      verticalUp: function(){
        let moveObject = new MoveObject({
          increment: "+8",
          boundaryCheck: function(i, increment, startPosition) {
            let endPosition = i * increment + startPosition;
            return MovesCalculator.boundaryChecks({endPosition: endPosition}).vertical()
          }
        })
        return moveObject
      },
      verticalDown: function(){
        let moveObject = new MoveObject({
          increment: "-8",
          boundaryCheck: function(i, increment, startPosition) {
            let endPosition = i * increment + startPosition;
            return MovesCalculator.boundaryChecks({endPosition: endPosition}).vertical()
          }
        })
        return moveObject
      },
      forwardSlashUp: function(){
        let moveObject = new MoveObject({
          increment: "+9",
          boundaryCheck: function(i, increment, startPosition) {
            let endPosition = i * increment + startPosition;
            return MovesCalculator.boundaryChecks({startPosition: startPosition, endPosition: endPosition}).diagonalRight()
          }
        })
        return moveObject
      },
      forwardSlashDown: function(){
        let moveObject = new MoveObject({
          increment: "-9",
          boundaryCheck: function(i, increment, startPosition) {
            let endPosition = i * increment + startPosition;
            return MovesCalculator.boundaryChecks({startPosition: startPosition, endPosition: endPosition}).diagonalLeft()
          }
        })
        return moveObject
      },
      backSlashUp: function(){
        let moveObject = new MoveObject({
          increment: "+7",
          boundaryCheck: function(i, increment, startPosition) {
            let endPosition = i * increment + startPosition;
            return MovesCalculator.boundaryChecks({startPosition: startPosition, endPosition: endPosition}).diagonalLeft()
          }
        })
        return moveObject
      },
      backSlashDown: function(){
        let moveObject = new MoveObject({
          increment: "-7",
          boundaryCheck: function(i, increment, startPosition) {
            let endPosition = i * increment + startPosition;
            return MovesCalculator.boundaryChecks({startPosition: startPosition, endPosition: endPosition}).diagonalRight()
          }
        })
        return moveObject
      },
      nightVerticalLeftUp: function(){
        let moveObject = new MoveObject({
          increment: "+15",
          boundaryCheck: function(i, increment, startPosition) {
            let endPosition = i * increment + startPosition;
            return MovesCalculator.boundaryChecks({startPosition: startPosition, endPosition: endPosition}).nightVertical()
          }
        })
        return moveObject
      },
      nightVerticalRightUp: function(){
        let moveObject = new MoveObject({
          increment: "+17",
          boundaryCheck: function(i, increment, startPosition) {
            let endPosition = i * increment + startPosition;
            return MovesCalculator.boundaryChecks({startPosition: startPosition, endPosition: endPosition}).nightVertical()
          }
        })
        return moveObject
      },
      nightHorizontalLeftUp: function(){
        let moveObject = new MoveObject({
          increment: "+6",
          boundaryCheck: function(i, increment, startPosition) {
            let endPosition = i * increment + startPosition;
            return MovesCalculator.boundaryChecks({startPosition: startPosition, endPosition: endPosition}).nightHorizontal()
          }
        })
        return moveObject
      },
      nightHorizontalRightUp: function(){
        let moveObject = new MoveObject({
          increment: "+10",
          boundaryCheck: function(i, increment, startPosition) {
            let endPosition = i * increment + startPosition;
            return MovesCalculator.boundaryChecks({startPosition: startPosition, endPosition: endPosition}).nightHorizontal()
          }
        })
        return moveObject
      },
      nightVerticalLeftDown: function(){
        let moveObject = new MoveObject({
          increment: "-15",
          boundaryCheck: function(i, increment, startPosition) {
            let endPosition = i * increment + startPosition;
            return MovesCalculator.boundaryChecks({startPosition: startPosition, endPosition: endPosition}).nightVertical()
          }
        })
        return moveObject
      },
      nightVerticalRightDown: function(){
        let moveObject = new MoveObject({
          increment: "-17",
          boundaryCheck: function(i, increment, startPosition) {
            let endPosition = i * increment + startPosition;
            return MovesCalculator.boundaryChecks({startPosition: startPosition, endPosition: endPosition}).nightVertical()
          }
        })
        return moveObject
      },
      nightHorizontalLeftDown: function(){
        let moveObject = new MoveObject({
          increment: "-6",
          boundaryCheck: function(i, increment, startPosition) {
            let endPosition = i * increment + startPosition;
            return MovesCalculator.boundaryChecks({startPosition: startPosition, endPosition: endPosition}).nightHorizontal()
          }
        })
        return moveObject
      },
      nightHorizontalRightDown: function(){
        let moveObject = new MoveObject({
          increment: "-10",
          boundaryCheck: function(i, increment, startPosition) {
            let endPosition = i * increment + startPosition;
            return MovesCalculator.boundaryChecks({startPosition: startPosition, endPosition: endPosition}).nightHorizontal()
          }
        })
        return moveObject
      },
      horizontalRight: function(){
        let moveObject = new MoveObject({
          increment: "+1",
          boundaryCheck: function(i, increment, startPosition) {
            let endPosition = i * increment + startPosition;
            return MovesCalculator.boundaryChecks({startPosition: startPosition, endPosition: endPosition}).horizontal()
          }
        })
        return moveObject
      },
      horizontalLeft: function(){
        let moveObject = new MoveObject({
          increment: "-1",
          boundaryCheck: function(i, increment, startPosition) {
            let endPosition = i * increment + startPosition;
            return MovesCalculator.boundaryChecks({startPosition: startPosition, endPosition: endPosition}).horizontal()
          }
        })
        return moveObject
      }
    }
  }

  static boundaryChecks(args){
    let startPosition = args["startPosition"],
        endPosition = args["endPosition"]
    return {
      diagonalRight: function(){
        return (endPosition) % 8 > (startPosition % 8) && Board.inBounds(endPosition)
      },
      vertical: function(){
        return Board.inBounds(endPosition)
      },
      diagonalLeft: function(){
        return (endPosition) % 8 < (startPosition % 8) && Board.inBounds(endPosition)
      },
      nightVertical: function(){
        return Math.abs( (endPosition) % 8 - startPosition % 8 ) === 1 && Board.inBounds(endPosition)
      },
      nightHorizontal: function(){
        return Math.abs( (endPosition) % 8 - startPosition % 8 ) === 2 && Board.inBounds(endPosition)
      },
      horizontal: function(){
        return Math.floor((endPosition) / 8) === Math.floor(startPosition / 8) && Board.inBounds(endPosition)
      }
    }
  }

  static pieceSpecificMovements(){
    return {
      Night: function(args){
        let board = args["board"],
          startPosition = args["startPosition"],
          moveObjects = [MovesCalculator.genericMovements().nightHorizontalRightDown(), MovesCalculator.genericMovements().nightHorizontalLeftDown(), MovesCalculator.genericMovements().nightVerticalRightDown(),
                    MovesCalculator.genericMovements().nightVerticalLeftDown(), MovesCalculator.genericMovements().nightHorizontalRightUp(), MovesCalculator.genericMovements().nightHorizontalLeftUp(),
                    MovesCalculator.genericMovements().nightVerticalRightUp(), MovesCalculator.genericMovements().nightVerticalLeftUp()
                  ];
        for (let i = 0; i < moveObjects.length; i++ ) {
            moveObjects[i].rangeLimit = 1;
            moveObjects[i].pieceNotation = "N"
        };
        return  moveObjects
      },
      Rook: function(args){
        let board = args["board"],
          startPosition = args["startPosition"],
          moveObjects = [MovesCalculator.genericMovements().horizontalRight(), MovesCalculator.genericMovements().horizontalLeft(), MovesCalculator.genericMovements().verticalUp(), MovesCalculator.genericMovements().verticalDown()]
        for (let i = 0; i < moveObjects.length; i++ ) {
          moveObjects[i].rangeLimit = 7;
          moveObjects[i].pieceNotation = "R"
        };
        return moveObjects
      },
      Bishop: function(args){
        let board = args["board"],
          startPosition = args["startPosition"],
          moveObjects = [MovesCalculator.genericMovements().forwardSlashDown(), MovesCalculator.genericMovements().forwardSlashUp(), MovesCalculator.genericMovements().backSlashDown(), MovesCalculator.genericMovements().backSlashUp()]
        for (let i = 0; i < moveObjects.length; i++ ) {
          moveObjects[i].rangeLimit = 7;
          moveObjects[i].pieceNotation = "B"
        };
        return moveObjects
      },
      Queen: function(args){
        let board = args["board"],
          startPosition = args["startPosition"],
          moveObjects =  MovesCalculator.pieceSpecificMovements().Rook({startPosition: startPosition, board: board}).concat( MovesCalculator.pieceSpecificMovements().Bishop({startPosition: startPosition, board: board}) )
        for (let i = 0; i < moveObjects.length; i++ ) {
          moveObjects[i].rangeLimit = 7;
          moveObjects[i].pieceNotation = "Q"
        };
        return moveObjects
      },
      King: function(args){
        let board = args["board"],
          startPosition = args["startPosition"],
          moveObjects = [MovesCalculator.genericMovements().horizontalRight(), MovesCalculator.genericMovements().horizontalLeft(), MovesCalculator.genericMovements().verticalUp(), MovesCalculator.genericMovements().verticalDown(),
                    MovesCalculator.genericMovements().forwardSlashDown(), MovesCalculator.genericMovements().forwardSlashUp(), MovesCalculator.genericMovements().backSlashDown(), MovesCalculator.genericMovements().backSlashUp()
                  ];
        for (let i = 0; i < moveObjects.length; i++ ) {
          moveObjects[i].rangeLimit = 1;
          moveObjects[i].pieceNotation = "K"
        };
        if ( board.pieceHasNotMovedFrom(startPosition) && board.kingSideCastleIsClear(startPosition) && board.kingSideRookHasNotMoved(startPosition)
          && !Rules.kingInCheck({startPosition: startPosition, endPosition: startPosition, board: board })
          && !Rules.kingInCheck({startPosition: (startPosition), endPosition: (startPosition + 1), board: board })
          ){
          var castle = MovesCalculator.genericMovements().horizontalLeft()
          castle.increment = + 2
          castle.rangeLimit = 1
          castle.fullNotation = "O-O"
          castle.additionalActions = function(args){
          //TODO planning to pass this to the game controller before invoking, so this should be the right object, but i wonder if i should be
          // explicit here and use game controller instead of this?
            var position = args["position"],
              pieceObject = JSON.parse(this.layOut[startPosition + 3]);
            this.emptify( startPosition + 3)
            this.placePiece({ position: (startPosition + 1), pieceObject: pieceObject })
          }
          moveObjects.push(castle)
        };
        if ( board.pieceHasNotMovedFrom(startPosition) && board.queenSideCastleIsClear(startPosition) && board.queenSideRookHasNotMoved(startPosition)
          && !Rules.kingInCheck({startPosition: startPosition, endPosition: startPosition, board: board })
          && !Rules.kingInCheck({startPosition: (startPosition), endPosition: (startPosition - 1), board: board }) ){
          let castle = MovesCalculator.genericMovements().horizontalRight()
          castle.increment = - 2
          castle.rangeLimit = 1
          castle.fullNotation = "O-O-O"
          castle.additionalActions = function(args){
            var position = args["position"],
              pieceObject = JSON.parse(this.layOut[startPosition - 4]);
            this.emptify( startPosition - 4)
            this.placePiece({ position: (startPosition - 1), pieceObject: pieceObject })
          }
          moveObjects.push(castle)
        };
        return moveObjects
      },
      Pawn: function(args){
        let board = args["board"],
        startPosition = args["startPosition"],
        moveObjects = [],
        teamString = board.teamAt(startPosition),
          colorVars = {
            black: {
              startRank: 7,
              nonAttackMove: MovesCalculator.genericMovements().verticalDown(),
              singleStepCheck: board.oneSpaceDownIsEmpty(startPosition),
              doubleStepCheck: Board.isSeventhRank(startPosition) && board.twoSpacesDownIsEmpty(startPosition),
              leftAttackCheck: board.downAndLeftIsAttackable(startPosition),
              leftAttackMove: MovesCalculator.genericMovements().forwardSlashDown(),
              rightAttackCheck: board.downAndRightIsAttackable(startPosition),
              rightAttackMove: MovesCalculator.genericMovements().backSlashDown(),
              rightEnPassantCheck: Board.rank(startPosition) === 4 && board.whitePawnAt(startPosition + 1) && board.whitePawnDoubleSteppedFrom(startPosition - 15),
              leftEnPassantCheck: Board.rank(startPosition) === 4 && board.whitePawnAt(startPosition - 1) && board.whitePawnDoubleSteppedFrom(startPosition - 17),
            },
            white: {
              startRank: 2,
              nonAttackMove: MovesCalculator.genericMovements().verticalUp(),
              singleStepCheck: board.oneSpaceUpIsEmpty(startPosition),
              doubleStepCheck: Board.isSecondRank(startPosition) && board.twoSpacesUpIsEmpty( startPosition ),
              leftAttackCheck: board.upAndLeftIsAttackable(startPosition),
              // attackChecks don't need to intake obj anymore
              leftAttackMove: MovesCalculator.genericMovements().backSlashUp(),
              rightAttackCheck: board.upAndRightIsAttackable(startPosition ),
              rightAttackMove: MovesCalculator.genericMovements().forwardSlashUp(),
              leftEnPassantCheck: Board.rank(startPosition) === 5 && board.blackPawnAt(startPosition - 1) && board.blackPawnDoubleSteppedFrom(startPosition + 15),
              rightEnPassantCheck: Board.rank(startPosition) === 5 && board.blackPawnAt(startPosition + 1) && board.blackPawnDoubleSteppedFrom(startPosition + 17),
            }
          },
          pawnVars = colorVars[teamString];
        // SINGLE STEP
        if ( pawnVars.singleStepCheck ) {
          var newPossibility = pawnVars.nonAttackMove
          newPossibility.rangeLimit = 1
          newPossibility.pieceNotation = ""
          moveObjects = moveObjects.concat(newPossibility)
        }
        // DOUBLESTEP
        if ( pawnVars.doubleStepCheck ){
          // will the twoSpaces Down check get covered later anyway?
            var newPossibility = pawnVars.nonAttackMove
          newPossibility.rangeLimit = 2
          newPossibility.pieceNotation = ""
          moveObjects = moveObjects.concat(newPossibility)
        }
        // STANDARD ATTACKS
        if ( pawnVars.leftAttackCheck ) {
          var newPossibility = pawnVars.leftAttackMove
          newPossibility.rangeLimit = 1
          newPossibility.pieceNotation = Board.file(startPosition)
          moveObjects = moveObjects.concat(newPossibility)
        }
        if( pawnVars.rightAttackCheck ) {
          var newPossibility = pawnVars.rightAttackMove
          newPossibility.rangeLimit = 1
          newPossibility.pieceNotation = Board.file(startPosition)
          moveObjects = moveObjects.concat(newPossibility)
        };
        // EN PASSANT
          // RIGHT
        if( pawnVars.rightEnPassantCheck ){
          var newPossibility = pawnVars.rightAttackMove
          newPossibility.rangeLimit = 1
          newPossibility.pieceNotation = Board.file(startPosition)
          newPossibility.additionalActions = function(args){
            var position = args["position"],
              captureNotation = this.capture(startPosition + 1);
            return captureNotation
            // this is not really just a notation it's an action... or is it, i think the return is a notation, but the action is occurring right here.
          }
          moveObjects = moveObjects.concat(newPossibility)
        }
          // LEFT
        if( pawnVars.leftEnPassantCheck ){
          var newPossibility = pawnVars.leftAttackMove
          newPossibility.rangeLimit = 1
          newPossibility.pieceNotation = Board.file(startPosition)
          newPossibility.additionalActions = function(args){
            var position = args["position"];
            var captureNotation = this.capture(startPosition - 1);
            return captureNotation
            // this is not really just a notation it's an action
          }
          moveObjects = moveObjects.concat(newPossibility)
        }
      return moveObjects;
      }
    }
  }

}
