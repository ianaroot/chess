class MovesCalculator {
  constructor(options = {  startPosition: undefined, board: undefined, moves: [],
  }){

    this.startPosition = options["startPosition"]
    this.board = options["board"]
    this.moves = []
    this.viablePositions = {}
  }
  addMoves(){
    if ( this.startPosition === undefined || !this.board){
      throw new Error("moveObject missing startPosition or board in addMovementTypesAndBoundaryChecks")
    } else {
      this. moves = MovesCalculator.pieceSpecificMovements()[this.board.pieceTypeAt(this.startPosition)]({startPosition: this.startPosition, board: this.board})
    }
  }

  calculateViablePositions(){
    var teamString = this.board.teamAt(this.startPosition);
    for(var i = 0; i < this.moves.length; i++){
      var move = this.moves[i],
        increment = move.increment,
        rangeLimit = move.rangeLimit,
        boundaryCheck = move.boundaryCheck;
      for(var j = 1; j <= rangeLimit; j++){
        // this calculation should be maybe happening on the moves calculator
        var currentPosition = increment * j + this.startPosition,
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
        let move = new Move({
          increment: "+8",
          boundaryCheck: function(i, increment, startPosition) {
            var endPosition = i * increment + startPosition;
            return Board.inBounds(endPosition)
          }
        })
        return move
      },
      verticalDown: function(){
        let move = new Move({
          increment: "-8",
          boundaryCheck: function(i, increment, startPosition) {
            var endPosition = i * increment + startPosition;
            return Board.inBounds(endPosition)
          }
        })
        return move
      },
      forwardSlashUp: function(){
        let move = new Move({
          increment: "+9",
          boundaryCheck: function(i, increment, startPosition) {
            var endPosition = i * increment + startPosition;
            // this is the wettest line of code i've ever seen
            return (endPosition) % 8 > (startPosition % 8) && Board.inBounds(endPosition)
            // can factor out these boundary calculations
          }
        })
        return move
      },
      forwardSlashDown: function(){
        let move = new Move({
          increment: "-9",
          boundaryCheck: function(i, increment, startPosition) {
            var endPosition = i * increment + startPosition;
            return (endPosition) % 8 < (startPosition % 8) && Board.inBounds(endPosition)
          }
        })
        return move
      },
      backSlashUp: function(){
        let move = new Move({
          increment: "+7",
          boundaryCheck: function(i, increment, startPosition) {
            var endPosition = i * increment + startPosition;
            return (endPosition) % 8 < (startPosition % 8) && Board.inBounds(endPosition)
          }
        })
        return move
      },
      backSlashDown: function(){
        let move = new Move({
          increment: "-7",
          boundaryCheck: function(i, increment, startPosition) {
            var endPosition = i * increment + startPosition;
            return (endPosition) % 8 > (startPosition % 8) && Board.inBounds(endPosition)
          }
        })
        return move
      },
      nightVerticalLeftUp: function(){
        let move = new Move({
          increment: "+15",
          boundaryCheck: function(i, increment, startPosition) {
            var endPosition = i * increment + startPosition;
            return Math.abs( (endPosition) % 8 - startPosition % 8 ) === 1 && Board.inBounds(endPosition)
          }
        })
        return move
      },
      nightVerticalRightUp: function(){
        let move = new Move({
          increment: "+17",
          boundaryCheck: function(i, increment, startPosition) {
            var endPosition = i * increment + startPosition;
            return Math.abs( (endPosition) % 8 - startPosition % 8 ) === 1 && Board.inBounds(endPosition)
          }
        })
        return move
      },
      nightHorizontalLeftUp: function(){
        let move = new Move({
          increment: "+6",
          boundaryCheck: function(i, increment, startPosition) {
            var endPosition = i * increment + startPosition;
            return Math.abs( (endPosition) % 8 - startPosition % 8 ) === 2 && Board.inBounds(endPosition)
          }
        })
        return move
      },
      nightHorizontalRightUp: function(){
        let move = new Move({
          increment: "+10",
          boundaryCheck: function(i, increment, startPosition) {
            var endPosition = i * increment + startPosition;
            return Math.abs( (endPosition) % 8 - startPosition % 8 ) === 2 && Board.inBounds(endPosition)
          }
        })
        return move
      },
      nightVerticalLeftDown: function(){
        let move = new Move({
          increment: "-15",
          boundaryCheck: function(i, increment, startPosition) {
            var endPosition = i * increment + startPosition;
            return Math.abs( (endPosition) % 8 - startPosition % 8 ) === 1 && Board.inBounds(endPosition)
          }
        })
        return move
      },
      nightVerticalRightDown: function(){
        let move = new Move({
          increment: "-17",
          boundaryCheck: function(i, increment, startPosition) {
            var endPosition = i * increment + startPosition;
            return Math.abs( (endPosition) % 8 - startPosition % 8 ) === 1 && Board.inBounds(endPosition)
          }
        })
        return move
      },
      nightHorizontalLeftDown: function(){
        let move = new Move({
          increment: "-6",
          boundaryCheck: function(i, increment, startPosition) {
            var endPosition = i * increment + startPosition;
            return Math.abs( (endPosition) % 8 - startPosition % 8 ) === 2 && Board.inBounds(endPosition)
          }
        })
        return move
      },
      nightHorizontalRightDown: function(){
        let move = new Move({
          increment: "-10",
          boundaryCheck: function(i, increment, startPosition) {
            var endPosition = i * increment + startPosition;
            return Math.abs( (endPosition) % 8 - startPosition % 8 ) === 2 && Board.inBounds(endPosition)
          }
        })
        return move
      },
      horizontalRight: function(){
        let move = new Move({
          increment: "+1",
          boundaryCheck: function(i, increment, startPosition) {
            var endPosition = i * increment + startPosition;
            return Math.floor((endPosition) / 8) === Math.floor(startPosition / 8) && Board.inBounds(endPosition)
          }
        })
        return move
      },
      horizontalLeft: function(){
        let move = new Move({
          increment: "-1",
          boundaryCheck: function(i, increment, startPosition) {
            var endPosition = i * increment + startPosition;
            return Math.floor((endPosition) / 8) === Math.floor(startPosition / 8) && Board.inBounds(endPosition)
          }
        })
        return move
      }
    }
  }



  static pieceSpecificMovements(){
    return {
      Night: function(args){
        var board = args["board"],
          startPosition = args["startPosition"],
          moves = [MovesCalculator.genericMovements().nightHorizontalRightDown(), MovesCalculator.genericMovements().nightHorizontalLeftDown(), MovesCalculator.genericMovements().nightVerticalRightDown(),
                    MovesCalculator.genericMovements().nightVerticalLeftDown(), MovesCalculator.genericMovements().nightHorizontalRightUp(), MovesCalculator.genericMovements().nightHorizontalLeftUp(),
                    MovesCalculator.genericMovements().nightVerticalRightUp(), MovesCalculator.genericMovements().nightVerticalLeftUp()
                  ];
        for (let i = 0; i < moves.length; i++ ) {
            moves[i].rangeLimit = 1;
            moves[i].pieceNotation = "N"
        };
        return  moves
      },
      Rook: function(args){
        var board = args["board"],
          startPosition = args["startPosition"],
          moves = [MovesCalculator.genericMovements().horizontalRight(), MovesCalculator.genericMovements().horizontalLeft(), MovesCalculator.genericMovements().verticalUp(), MovesCalculator.genericMovements().verticalDown()]
        for (let i = 0; i < moves.length; i++ ) {
          moves[i].rangeLimit = 7;
          moves[i].pieceNotation = "R"
        };
        return moves
      },
      Bishop: function(args){
        var board = args["board"],
          startPosition = args["startPosition"],
          moves = [MovesCalculator.genericMovements().forwardSlashDown(), MovesCalculator.genericMovements().forwardSlashUp(), MovesCalculator.genericMovements().backSlashDown(), MovesCalculator.genericMovements().backSlashUp()]
        for (let i = 0; i < moves.length; i++ ) {
          moves[i].rangeLimit = 7;
          moves[i].pieceNotation = "B"
        };
        return moves
      },
      Queen: function(args){
        var board = args["board"],
          startPosition = args["startPosition"],
          moves =  MovesCalculator.pieceSpecificMovements().Rook({startPosition: startPosition, board: board}).concat( MovesCalculator.pieceSpecificMovements().Bishop({startPosition: startPosition, board: board}) )
        for (let i = 0; i < moves.length; i++ ) {
          moves[i].rangeLimit = 7;
          moves[i].pieceNotation = "Q"
        };
        return moves
      },
      King: function(args){
        var board = args["board"],
          startPosition = args["startPosition"],
          moves = [MovesCalculator.genericMovements().horizontalRight(), MovesCalculator.genericMovements().horizontalLeft(), MovesCalculator.genericMovements().verticalUp(), MovesCalculator.genericMovements().verticalDown(),
                    MovesCalculator.genericMovements().forwardSlashDown(), MovesCalculator.genericMovements().forwardSlashUp(), MovesCalculator.genericMovements().backSlashDown(), MovesCalculator.genericMovements().backSlashUp()
                  ];
        for (let i = 0; i < moves.length; i++ ) {
          moves[i].rangeLimit = 1;
          moves[i].pieceNotation = "K"
        };
        if ( board.pieceHasNotMovedFrom(startPosition) && board.kingSideCastleIsClear(startPosition) && board.kingSideRookHasNotMoved(startPosition)
          && !PieceMovementRules.kingInCheck({startPosition: startPosition, endPosition: startPosition, board: board })
          && !PieceMovementRules.kingInCheck({startPosition: (startPosition), endPosition: (startPosition + 1), board: board })
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
            this.placePiece({ position: (startPosition + 1), pieceString: pieceObject })
          }
          moves.push(castle)
        };
        if ( board.pieceHasNotMovedFrom(startPosition) && board.queenSideCastleIsClear(startPosition) && board.queenSideRookHasNotMoved(startPosition)
          && !PieceMovementRules.kingInCheck({startPosition: startPosition, endPosition: startPosition, board: board })
          && !PieceMovementRules.kingInCheck({startPosition: (startPosition), endPosition: (startPosition - 1), board: board }) ){
          var castle = MovesCalculator.genericMovements().horizontalRight()
          castle.increment = - 2
          castle.rangeLimit = 1
          castle.fullNotation = "O-O-O"
          castle.additionalActions = function(args){
            //planning to pass this to the game controller before invoking, so this should be the right object, but i wonder if i should be
            // explicit here and use game controller instead of this
            var position = args["position"],
              pieceObject = JSON.parse(this.layOut[startPosition - 4]);
              // this should be telling the board to move the piece
            this.emptify( startPosition - 4)
            this.placePiece({ position: (startPosition - 1), pieceString: pieceObject })
          }
          moves.push(castle)
        };
        return moves
      },
      Pawn: function(args){
        var board = args["board"],
        startPosition = args["startPosition"],
        movements = [],
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
          movements = movements.concat(newPossibility)
        }
        // DOUBLESTEP
        if ( pawnVars.doubleStepCheck ){
          // will the twoSpaces Down check get covered later anyway?
            var newPossibility = pawnVars.nonAttackMove
          newPossibility.rangeLimit = 2
          newPossibility.pieceNotation = ""
          movements = movements.concat(newPossibility)
        }
        // STANDARD ATTACKS
        if ( pawnVars.leftAttackCheck ) {
          var newPossibility = pawnVars.leftAttackMove
          newPossibility.rangeLimit = 1
          newPossibility.pieceNotation = Board.file(startPosition)
          movements = movements.concat(newPossibility)
        }
        if( pawnVars.rightAttackCheck ) {
          var newPossibility = pawnVars.rightAttackMove
          newPossibility.rangeLimit = 1
          newPossibility.pieceNotation = Board.file(startPosition)
          movements = movements.concat(newPossibility)
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
          movements = movements.concat(newPossibility)
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
          movements = movements.concat(newPossibility)
        }
      return movements;
      }
    }
  }

}
