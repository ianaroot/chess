// TOO newPossibility s are all really just moveObjects
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
      let pieceType = this.board.pieceTypeAt(this.startPosition),
          pieceSpecificMovements = MovesCalculator.pieceSpecificMovements()[ pieceType ];
      this.moveObjects = pieceSpecificMovements({startPosition: this.startPosition, board: this.board})
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
          // startPosition: startPosition,
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
          // startPosition: startPosition,
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
          // startPosition: startPosition,
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
          // startPosition: startPosition,
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
          // startPosition: startPosition,
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
          // startPosition: startPosition,
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
          // startPosition: startPosition,
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
          // startPosition: startPosition,
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
          // startPosition: startPosition,
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
          // startPosition: startPosition,
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
          // startPosition: startPosition,
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
          // startPosition: startPosition,
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
          // startPosition: startPosition,
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
          // startPosition: startPosition,
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
          // startPosition: startPosition,
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
          // startPosition: startPosition,
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
            moveObjects[i].pieceNotation = "N";;
            moveObjects[i].startPosition = startPosition
        };
        return  moveObjects
      },
      Rook: function(args){
        let board = args["board"],
          startPosition = args["startPosition"],
          moveObjects = [MovesCalculator.genericMovements().horizontalRight(), MovesCalculator.genericMovements().horizontalLeft(), MovesCalculator.genericMovements().verticalUp(), MovesCalculator.genericMovements().verticalDown()]
        for (let i = 0; i < moveObjects.length; i++ ) {
          moveObjects[i].rangeLimit = 7;
          moveObjects[i].pieceNotation = "R";
          moveObjects[i].startPosition = startPosition
        };
        return moveObjects
      },
      Bishop: function(args){
        let board = args["board"],
          startPosition = args["startPosition"],
          moveObjects = [MovesCalculator.genericMovements().forwardSlashDown(), MovesCalculator.genericMovements().forwardSlashUp(), MovesCalculator.genericMovements().backSlashDown(), MovesCalculator.genericMovements().backSlashUp()]
        for (let i = 0; i < moveObjects.length; i++ ) {
          moveObjects[i].rangeLimit = 7;
          moveObjects[i].pieceNotation = "B";
          moveObjects[i].startPosition = startPosition
        };
        return moveObjects
      },
      Queen: function(args){
        let board = args["board"],
          startPosition = args["startPosition"],
          moveObjects =  MovesCalculator.pieceSpecificMovements().Rook({startPosition: startPosition, board: board}).concat( MovesCalculator.pieceSpecificMovements().Bishop({startPosition: startPosition, board: board}) )
        for (let i = 0; i < moveObjects.length; i++ ) {
          moveObjects[i].rangeLimit = 7;
          moveObjects[i].pieceNotation = "Q";
          moveObjects[i].startPosition = startPosition
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
          moveObjects[i].pieceNotation = "K";
          moveObjects[i].startPosition = startPosition
        };
        if ( board.pieceHasNotMovedFrom(startPosition) && board.kingSideCastleIsClear(startPosition) && board.kingSideRookHasNotMoved(startPosition)
        // checkQueryNOMOVE
          && !Rules.checkQuery({startPosition: startPosition, endPosition: startPosition, board: board })
          && !Rules.checkQuery({startPosition: (startPosition), endPosition: (startPosition + 1), board: board })
          ){
          let moveObject = MovesCalculator.genericMovements().horizontalLeft()
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
        if ( board.pieceHasNotMovedFrom(startPosition) && board.queenSideCastleIsClear(startPosition) && board.queenSideRookHasNotMoved(startPosition)
        // ig moveObject had an additionalCheckQueries and stored these as them for later use, that might cut out the infinite loop shit?
        // also these castle viability functions should get bundled on the board
          && !Rules.checkQuery({startPosition: startPosition, endPosition: startPosition, board: board })
          && !Rules.checkQuery({startPosition: (startPosition), endPosition: (startPosition - 1), board: board }) ){
          let moveObject = MovesCalculator.genericMovements().horizontalRight()
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
              leftAttackMove: MovesCalculator.genericMovements().backSlashUp(),
              rightAttackCheck: board.upAndRightIsAttackable(startPosition ),
              rightAttackMove: MovesCalculator.genericMovements().forwardSlashUp(),
              leftEnPassantCheck: Board.rank(startPosition) === 5 && board._blackPawnAt(startPosition - 1) && board.blackPawnDoubleSteppedFrom(startPosition + 15),
              rightEnPassantCheck: Board.rank(startPosition) === 5 && board._blackPawnAt(startPosition + 1) && board.blackPawnDoubleSteppedFrom(startPosition + 17),
            }
          },
          pawnVars = colorVars[teamString];
        // SINGLE STEP
        if ( pawnVars.singleStepCheck ) {
          let moveObject = pawnVars.nonAttackMove
          moveObject.rangeLimit = 1
          moveObject.pieceNotation = ""
          moveObject.startPosition = startPosition
          moveObjects = moveObjects.concat(moveObject)
        }
        // DOUBLESTEP
        if ( pawnVars.doubleStepCheck ){
          // TODO will the twoSpaces Down check get covered later anyway?
            let moveObject = pawnVars.nonAttackMove
          moveObject.rangeLimit = 2
          moveObject.pieceNotation = ""
          moveObject.startPosition = startPosition
          moveObjects = moveObjects.concat(moveObject)
        }
        // STANDARD ATTACKS
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
        // EN PASSANT
          // RIGHT
        if( pawnVars.rightEnPassantCheck ){
          let moveObject = pawnVars.rightAttackMove
          moveObject.rangeLimit = 1
          moveObject.startPosition = startPosition
          moveObject.pieceNotation = Board.file(startPosition)
          moveObject.additionalActions = function(args){
            let position = args["position"],
              captureNotation = this._capture(startPosition + 1) + "e.p.";
            return captureNotation
            // TODO this is not really just a notation it's an action... or is it, i think the return is a notation, but the action is occurring right here.
          }
          moveObjects = moveObjects.concat(moveObject)
        }
          // LEFT
        if( pawnVars.leftEnPassantCheck ){
          let moveObject = pawnVars.leftAttackMove
          moveObject.rangeLimit = 1
          moveObject.startPosition = startPosition
          moveObject.pieceNotation = Board.file(startPosition)
          moveObject.additionalActions = function(args){
            let position = args["position"];
            let captureNotation = this._capture(startPosition - 1) + "e.p.";
            return captureNotation
            // TODO this is not really just a notation it's an action
          }
          moveObjects = moveObjects.concat(moveObject)
        }
      return moveObjects;
      }
    }
  }

}
