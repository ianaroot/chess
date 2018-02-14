// viable positions from errors when called on empty position
// even if move is illegal catches it, having viablePositions return illegal positions, such as checked castling, is gonna be problematic, like when i get to where i'm highlighting legal positions to move to
// throw error if args missing. make a reusable function, throw it in some stuff
// tells you it's the other team's turn if you try to move from an empty square
class PieceMovementRules {
  static pieceSpecificMovements(){
    return {
      Night: function(args){
        var board = args["board"],
          startPosition = args["startPosition"],
          moves = [PieceMovementRules.genericMovements().nightHorizontalRightDown(), PieceMovementRules.genericMovements().nightHorizontalLeftDown(), PieceMovementRules.genericMovements().nightVerticalRightDown(),
                    PieceMovementRules.genericMovements().nightVerticalLeftDown(), PieceMovementRules.genericMovements().nightHorizontalRightUp(), PieceMovementRules.genericMovements().nightHorizontalLeftUp(),
                    PieceMovementRules.genericMovements().nightVerticalRightUp(), PieceMovementRules.genericMovements().nightVerticalLeftUp()
                  ];
        for (var key in moves) {
          if (moves.hasOwnProperty(key)) {
            moves[key].rangeLimit = 1;
            moves[key].pieceNotation = "N"
          };
        };
        return  moves
      },
      Rook: function(args){
        var board = args["board"],
          startPosition = args["startPosition"],
          moves = [PieceMovementRules.genericMovements().horizontalRight(), PieceMovementRules.genericMovements().horizontalLeft(), PieceMovementRules.genericMovements().verticalUp(), PieceMovementRules.genericMovements().verticalDown()]
        for (var key in moves) {
          if (moves.hasOwnProperty(key)) {
            moves[key].rangeLimit = 7;
            moves[key].pieceNotation = "R"
          };
        };
        return moves
      },
      Bishop: function(args){
        var board = args["board"],
          startPosition = args["startPosition"],
          moves = [PieceMovementRules.genericMovements().forwardSlashDown(), PieceMovementRules.genericMovements().forwardSlashUp(), PieceMovementRules.genericMovements().backSlashDown(), PieceMovementRules.genericMovements().backSlashUp()]
        for (var key in moves) {
          if (moves.hasOwnProperty(key)) {
            moves[key].rangeLimit = 7;
            moves[key].pieceNotation = "B"
          };
        };
        return moves
      },
      Queen: function(args){
        var board = args["board"],
          startPosition = args["startPosition"],
          moves =  PieceMovementRules.pieceSpecificMovements().Rook({startPosition: startPosition, board: board}).concat( PieceMovementRules.pieceSpecificMovements().Bishop({startPosition: startPosition, board: board}) )
        for (var key in moves) {
          if (moves.hasOwnProperty(key)) {
            moves[key].rangeLimit = 7;
            moves[key].pieceNotation = "Q"
          };
        };
        return moves
      },
      King: function(args){
        var board = args["board"],
          startPosition = args["startPosition"],
          moves = [PieceMovementRules.genericMovements().horizontalRight(), PieceMovementRules.genericMovements().horizontalLeft(), PieceMovementRules.genericMovements().verticalUp(), PieceMovementRules.genericMovements().verticalDown(),
                    PieceMovementRules.genericMovements().forwardSlashDown(), PieceMovementRules.genericMovements().forwardSlashUp(), PieceMovementRules.genericMovements().backSlashDown(), PieceMovementRules.genericMovements().backSlashUp()
                  ];
        for (var key in moves) {
          if (moves.hasOwnProperty(key)) {
            moves[key].rangeLimit = 1;
            moves[key].pieceNotation = "K"
          };
        };
        if ( board.pieceHasNotMovedFrom(startPosition) && board.kingSideCastleIsClear(startPosition) && board.kingSideRookHasNotMoved(startPosition)
          && !PieceMovementRules.kingInCheck({startPosition: startPosition, endPosition: startPosition, board: board })
          && !PieceMovementRules.kingInCheck({startPosition: (startPosition), endPosition: (startPosition + 1), board: board })
          ){
          var castle = PieceMovementRules.genericMovements().horizontalLeft()
          castle.increment = + 2
          castle.rangeLimit = 1
          castle.fullNotation = "O-O"
          castle.additionalActions = function(args){
          //planning to pass this to the game controller before invoking, so this should be the right object, but i wonder if i should be
          // explicit here and use game controller instead of this
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
          var castle = PieceMovementRules.genericMovements().horizontalRight()
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
      // whitePawn: function(args){
      //   var board = args["board"],
      //     startPosition = args["startPosition"],
      //     movements = [],
      //     enPassantLeft = (args) => {
      //       var position = args["position"],
      //         board = args["board"];
      //       if( Board.rank(position) === 5 && board.blackPawnAt(position - 1) && board.blackPawnDoubleSteppedFrom(position + 15) ){
      //         // not making use of this number as expected, may as well return true
      //         return true
      //       }
      //     },
      //     enPassantRight = (args) => {
      //       var board = args["board"],
      //         position = args["position"];
      //       if( Board.rank(position) === 5 && board.blackPawnAt(position + 1) && board.blackPawnDoubleSteppedFrom(position + 17) ){
      //         return true
      //       }
      //     };
      //   if( Board.isSecondRank(startPosition) && board.twoSpacesUpIsEmpty( startPosition ) ){
      //     var newPossibility = PieceMovementRules.genericMovements().verticalUp()
      //     newPossibility.rangeLimit = 2
      //     newPossibility.pieceNotation = ""
      //     movements = movements.concat(newPossibility)
      //   };
      //   if( board.oneSpaceUpIsEmpty(startPosition) ){
      //     var newPossibility = PieceMovementRules.genericMovements().verticalUp()
      //     newPossibility.rangeLimit = 1
      //     newPossibility.pieceNotation = ""
      //     movements = movements.concat(newPossibility)
      //   };
      //   if( board.upAndLeftIsAttackable({position: startPosition, attackingTeamString: Board.WHITE}) ){
      //     var newPossibility = PieceMovementRules.genericMovements().backSlashUp()
      //     newPossibility.rangeLimit = 1
      //     newPossibility.pieceNotation = Board.file(startPosition)
      //     movements = movements.concat(newPossibility)
      //   };
      //   if( board.upAndRightIsAttackable({position: startPosition, attackingTeamString: Board.WHITE}) ){
      //     var newPossibility = PieceMovementRules.genericMovements().forwardSlashUp()
      //     newPossibility.rangeLimit = 1
      //     newPossibility.pieceNotation = Board.file(startPosition)
      //     movements = movements.concat(newPossibility)
      //   };
      //   if( enPassantLeft( {position: startPosition, board: board}) ){
      //     var newPossibility = PieceMovementRules.genericMovements().backSlashUp()
      //     newPossibility.rangeLimit = 1
      //     newPossibility.pieceNotation = Board.file(startPosition)
      //     newPossibility.additionalActions = function(args){
      //       var position = args["position"],
      //         captureNotation = this.capture(position - 1);
      //       return captureNotation
      //       // this is not really just a notation it's an action
      //     }
      //     movements = movements.concat(newPossibility)
      //   };
      //   if( enPassantRight( {position: startPosition, board: board}) ){
      //     var newPossibility = PieceMovementRules.genericMovements().forwardSlashUp()
      //     newPossibility.rangeLimit = 1
      //     newPossibility.pieceNotation = Board.file(startPosition)
      //     newPossibility.additionalActions = function(args){
      //       var position = args["position"],
      //         captureNotation = this.capture(position + 1);
      //       return captureNotation
      //       // this is not really just a notation it's an action
      //     }
      //     movements = movements.concat(newPossibility)
      //   };
      //   return movements
      // },
      // blackPawn: function(args){
      //   var board = args["board"],
      //     startPosition = args["startPosition"],
      //     enPassantTarget,
      //     movements = [],
      //     enPassantRight = (args) => {
      //       var position = args["position"],
      //         board = args["board"];
      //       if( Board.rank(position) === 4 && board.whitePawnAt(position + 1) && board.whitePawnDoubleSteppedFrom(position - 15) ){
      //         return true
      //       }
      //     },
      //     enPassantLeft= (args) => {
      //       var board = args["board"],
      //         position = args["position"];
      //       if( Board.rank(position) === 4 && board.whitePawnAt(position - 1) && board.whitePawnDoubleSteppedFrom(position - 17) ){
      //         return true
      //       }
      //     };
      //   if( Board.isSeventhRank(startPosition) && board.twoSpacesDownIsEmpty(startPosition) ){
      //     // will the twoSpaces Down check get covered later anyway?
      //     var newPossibility = PieceMovementRules.genericMovements().verticalDown()
      //     newPossibility.rangeLimit = 2
      //     newPossibility.pieceNotation = ""
      //     movements = movements.concat(newPossibility)
      //   };
      //   if( board.oneSpaceDownIsEmpty(startPosition) ){
      //     var newPossibility = PieceMovementRules.genericMovements().verticalDown()
      //     newPossibility.rangeLimit = 1
      //     newPossibility.pieceNotation = ""
      //     movements = movements.concat(newPossibility)
      //   };
      //   if( board.downAndLeftIsAttackable({position: startPosition, attackingTeamString: Board.BLACK}) ){
      //     var newPossibility = PieceMovementRules.genericMovements().forwardSlashDown()
      //     newPossibility.rangeLimit = 1
      //     newPossibility.pieceNotation = Board.file(startPosition)
      //     movements = movements.concat(newPossibility)
      //   };
      //   if( board.downAndRightIsAttackable({position: startPosition, attackingTeamString: Board.BLACK}) ){
      //     var newPossibility = PieceMovementRules.genericMovements().backSlashDown()
      //     newPossibility.rangeLimit = 1
      //     newPossibility.pieceNotation = Board.file(startPosition)
      //     movements = movements.concat(newPossibility)
      //   };
      //   if( enPassantLeft( {position: startPosition, board: board}) ){
      //     var newPossibility = PieceMovementRules.genericMovements().forwardSlashDown()
      //     newPossibility.rangeLimit = 1
      //     newPossibility.pieceNotation = Board.file(startPosition)
      //     newPossibility.additionalActions = function(args){
      //       var position = args["position"],
      //         captureNotation = this.capture(position - 1);
      //       return captureNotation
      //       // this is not really just a notation it's an action
      //     }
      //     movements = movements.concat(newPossibility)
      //   };
      //   if( enPassantRight( {position: startPosition, board: board}) ){
      //     var newPossibility = PieceMovementRules.genericMovements().backSlashDown()
      //     newPossibility.rangeLimit = 1
      //     newPossibility.pieceNotation = Board.file(startPosition)
      //     newPossibility.additionalActions = function(args){
      //       var position = args["position"],
      //         captureNotation = this.capture(position + 1);
      //       return captureNotation
      //       // this is not really just a notation it's an action
      //     }
      //     movements = movements.concat(newPossibility)
      //   };
      //   return movements
      // },
      Pawn: function(args){
        var board = args["board"],
          startPosition = args["startPosition"],
          movements = [],
          teamString = board.teamAt(startPosition);
        //BLACKSINGLESTEP
        if ( teamString === Board.BLACK && board.oneSpaceDownIsEmpty(startPosition) ){
          var newPossibility = PieceMovementRules.genericMovements().verticalDown()
          newPossibility.rangeLimit = 1
          newPossibility.pieceNotation = ""
          movements = movements.concat(newPossibility)
        }
        // WHITESINGLESTEP
        if ( teamString === Board.WHITE && board.oneSpaceUpIsEmpty(startPosition) ) {
          var newPossibility = PieceMovementRules.genericMovements().verticalUp()
          newPossibility.rangeLimit = 1
          newPossibility.pieceNotation = ""
          movements = movements.concat(newPossibility)
        }
        // DOUBLESTEPBLACK
        if (teamString === Board.BLACK && Board.isSeventhRank(startPosition) && board.twoSpacesDownIsEmpty(startPosition) ){
          // will the twoSpaces Down check get covered later anyway?
          var newPossibility = PieceMovementRules.genericMovements().verticalDown()
          newPossibility.rangeLimit = 2
          newPossibility.pieceNotation = ""
          movements = movements.concat(newPossibility)
        }
        // DOUBLESTEPWHITE
        if ( teamString === Board.WHITE && Board.isSecondRank(startPosition) && board.twoSpacesUpIsEmpty( startPosition ) ) {
          var newPossibility = PieceMovementRules.genericMovements().verticalUp()
          newPossibility.rangeLimit = 2
          newPossibility.pieceNotation = ""
          movements = movements.concat(newPossibility)
        }
        // BLACKATTACKS
        if ( teamString === Board.BLACK ) {
          if ( board.downAndLeftIsAttackable({position: startPosition, attackingTeamString: Board.BLACK}) ) {
            var newPossibility = PieceMovementRules.genericMovements().forwardSlashDown()
            newPossibility.rangeLimit = 1
            newPossibility.pieceNotation = Board.file(startPosition)
            movements = movements.concat(newPossibility)
          }
          if( board.downAndRightIsAttackable({position: startPosition, attackingTeamString: Board.BLACK}) ) {
            var newPossibility = PieceMovementRules.genericMovements().backSlashDown()
            newPossibility.rangeLimit = 1
            newPossibility.pieceNotation = Board.file(startPosition)
            movements = movements.concat(newPossibility)
          };
        }
        // WHITEATTACKS
        if ( teamString === Board.WHITE ) {
          if( board.upAndLeftIsAttackable({position: startPosition, attackingTeamString: Board.WHITE}) ){
            var newPossibility = PieceMovementRules.genericMovements().backSlashUp()
            newPossibility.rangeLimit = 1
            newPossibility.pieceNotation = Board.file(startPosition)
            movements = movements.concat(newPossibility)
          };
          if( board.upAndRightIsAttackable({position: startPosition, attackingTeamString: Board.WHITE}) ){
            var newPossibility = PieceMovementRules.genericMovements().forwardSlashUp()
            newPossibility.rangeLimit = 1
            newPossibility.pieceNotation = Board.file(startPosition)
            movements = movements.concat(newPossibility)
          };
        }
        // BLACKENPASSANT
        if ( teamString === Board.BLACK ) {
          // RIGHT
          if( Board.rank(startPosition) === 4 && board.whitePawnAt(startPosition + 1) && board.whitePawnDoubleSteppedFrom(startPosition - 15) ){
            var newPossibility = PieceMovementRules.genericMovements().backSlashDown()
            newPossibility.rangeLimit = 1
            newPossibility.pieceNotation = Board.file(startPosition)
            newPossibility.additionalActions = function(args){
              var position = args["position"],
                captureNotation = this.capture(startPosition + 1);
              return captureNotation
              // this is not really just a notation it's an action
            }
            movements = movements.concat(newPossibility)
          }
          // LEFT
          if( Board.rank(startPosition) === 4 && board.whitePawnAt(startPosition - 1) && board.whitePawnDoubleSteppedFrom(startPosition - 17) ){
            var newPossibility = PieceMovementRules.genericMovements().forwardSlashDown()
            newPossibility.rangeLimit = 1
            newPossibility.pieceNotation = Board.file(startPosition)
            newPossibility.additionalActions = function(args){
              var position = args["position"],
                captureNotation = this.capture(startPosition - 1);
              return captureNotation
              // this is not really just a notation it's an action
            }
            movements = movements.concat(newPossibility)
          }

        }
        // WHITEENPASSANT
        if ( teamString === Board.WHITE  ) {
          // LEFT
          if( Board.rank(startPosition) === 5 && board.blackPawnAt(startPosition - 1) && board.blackPawnDoubleSteppedFrom(startPosition + 15) ){
            var newPossibility = PieceMovementRules.genericMovements().backSlashUp()
            newPossibility.rangeLimit = 1
            newPossibility.pieceNotation = Board.file(startPosition)
            newPossibility.additionalActions = function(args){
              var position = args["position"],
                captureNotation = this.capture(startPosition - 1);
              return captureNotation
              // this is not really just a notation it's an action
            }
            movements = movements.concat(newPossibility)
          }
          // RIGHT
          if( Board.rank(startPosition) === 5 && board.blackPawnAt(startPosition + 1) && board.blackPawnDoubleSteppedFrom(startPosition + 17) ){
            var newPossibility = PieceMovementRules.genericMovements().forwardSlashUp()
            newPossibility.rangeLimit = 1
            newPossibility.pieceNotation = Board.file(startPosition)
            newPossibility.additionalActions = function(args){
              var position = args["position"],
                captureNotation = this.capture(startPosition + 1);
              return captureNotation
              // this is not really just a notation it's an action
            }
            movements = movements.concat(newPossibility)
          }
        }
      return movements;
      }
    }
  }

  static genericMovements(){
    return {
      verticalUp: function(){
        return {
          increment: "+8",
          boundaryCheck: function(i, increment, startPosition) {
            var endPosition = i * increment + startPosition;
            return Board.inBounds(endPosition)
          }
        }
      },
      verticalDown: function(){
        return {
          increment: "-8",
          boundaryCheck: function(i, increment, startPosition) {
            var endPosition = i * increment + startPosition;
            return Board.inBounds(endPosition)
          }
        }
      },
      forwardSlashUp: function(){
        return {
          increment: "+9",
          boundaryCheck: function(i, increment, startPosition) {
            var endPosition = i * increment + startPosition;
            return (endPosition) % 8 > (startPosition % 8) && Board.inBounds(endPosition)
          }
        }
      },
      forwardSlashDown: function(){
        return {
          increment: "-9",
          boundaryCheck: function(i, increment, startPosition) {
            var endPosition = i * increment + startPosition;
            return (endPosition) % 8 < (startPosition % 8) && Board.inBounds(endPosition)
          }
        }
      },
      backSlashUp: function(){
        return {
          increment: "+7",
          boundaryCheck: function(i, increment, startPosition) {
            var endPosition = i * increment + startPosition;
            return (endPosition) % 8 < (startPosition % 8) && Board.inBounds(endPosition)
          }
        }
      },
      backSlashDown: function(){
        return {
          increment: "-7",
          boundaryCheck: function(i, increment, startPosition) {
            var endPosition = i * increment + startPosition;
            return (endPosition) % 8 > (startPosition % 8) && Board.inBounds(endPosition)
          }
        }
      },
      nightVerticalLeftUp: function(){
        return {
          increment: "+15",
          boundaryCheck: function(i, increment, startPosition) {
            var endPosition = i * increment + startPosition;
            return Math.abs( (endPosition) % 8 - startPosition % 8 ) === 1 && Board.inBounds(endPosition)
          }
        }
      },
      nightVerticalRightUp: function(){
        return {
          increment: "+17",
          boundaryCheck: function(i, increment, startPosition) {
            var endPosition = i * increment + startPosition;
            return Math.abs( (endPosition) % 8 - startPosition % 8 ) === 1 && Board.inBounds(endPosition)
          }
        }
      },
      nightHorizontalLeftUp: function(){
        return {
          increment: "+6",
          boundaryCheck: function(i, increment, startPosition) {
            var endPosition = i * increment + startPosition;
            return Math.abs( (endPosition) % 8 - startPosition % 8 ) === 2 && Board.inBounds(endPosition)
          }
        }
      },
      nightHorizontalRightUp: function(){
        return {
          increment: "+10",
          boundaryCheck: function(i, increment, startPosition) {
            var endPosition = i * increment + startPosition;
            return Math.abs( (endPosition) % 8 - startPosition % 8 ) === 2 && Board.inBounds(endPosition)
          }
        }
      },
      nightVerticalLeftDown: function(){
        return {
          increment: "-15",
          boundaryCheck: function(i, increment, startPosition) {
            var endPosition = i * increment + startPosition;
            return Math.abs( (endPosition) % 8 - startPosition % 8 ) === 1 && Board.inBounds(endPosition)
          }
        }
      },
      nightVerticalRightDown: function(){
        return {
          increment: "-17",
          boundaryCheck: function(i, increment, startPosition) {
            var endPosition = i * increment + startPosition;
            return Math.abs( (endPosition) % 8 - startPosition % 8 ) === 1 && Board.inBounds(endPosition)
          }
        }
      },
      nightHorizontalLeftDown: function(){
        return {
          increment: "-6",
          boundaryCheck: function(i, increment, startPosition) {
            var endPosition = i * increment + startPosition;
            return Math.abs( (endPosition) % 8 - startPosition % 8 ) === 2 && Board.inBounds(endPosition)
          }
        }
      },
      nightHorizontalRightDown: function(){
        return {
          increment: "-10",
          boundaryCheck: function(i, increment, startPosition) {
            var endPosition = i * increment + startPosition;
            return Math.abs( (endPosition) % 8 - startPosition % 8 ) === 2 && Board.inBounds(endPosition)
          }
        }
      },
      horizontalRight: function(){
        return {
          increment: "+1",
          boundaryCheck: function(i, increment, startPosition) {
            var endPosition = i * increment + startPosition;
            return Math.floor((endPosition) / 8) === Math.floor(startPosition / 8) && Board.inBounds(endPosition)
          }
        }
      },
      horizontalLeft: function(){
        return {
          increment: "-1",
          boundaryCheck: function(i, increment, startPosition) {
            var endPosition = i * increment + startPosition;
            return Math.floor((endPosition) / 8) === Math.floor(startPosition / 8) && Board.inBounds(endPosition)
          }
        }
      }
    }
  }

  static moveIsIllegal(startPosition, endPosition, board){
    if(
      !Board.prototype.isPrototypeOf( board ) ||
      typeof startPosition !== "number" ||
      typeof endPosition !== "number"
    ){
      throw new Error("missing params in moveIsIllegal")
    }
    var layOut = board.layOut,
      team = board.teamAt(startPosition),
      viableMovement = {},
      moveObject = {
        illegal: false,
        startPosition: startPosition,
        endPosition: endPosition
      },
      viableMovement = PieceMovementRules.positionViable( {startPosition: startPosition, endPosition: endPosition, board: board} );

    if ( !Board.inBounds(endPosition) ){
      moveObject.alert = 'stay on the board, fool'
      moveObject.illegal = true
    } else if( board.positionIsOccupiedByTeamMate(endPosition, team ) ){
      moveObject.alert = "what, are you trying to capture your own piece?"
      moveObject.illegal = true
    } else if( !viableMovement ) {
      moveObject.alert = "that's not how that piece moves"
      moveObject.illegal = true
    } else if( PieceMovementRules.kingInCheck( {startPosition: startPosition, endPosition: endPosition, board: board, additionalActions: viableMovement.additionalActions})){
      moveObject.alert = "check yo king fool"
      moveObject.illegal = true
    } // now we know the move is legal
    moveObject.additionalActions = viableMovement.additionalActions
    if( viableMovement.fullNotation ){
      moveObject.fullNotation = viableMovement.fullNotation
    }

    moveObject.pieceNotation = viableMovement.pieceNotation
    return moveObject
  }
  static retrieveAvailableMovements(args){
    if(
      !Board.prototype.isPrototypeOf( args["board"] ) ||
      typeof args["position"] !== "number"
    ){
      throw new Error("missing params in retrieveAvailableMovements")
    }
    var  board = args["board"],
      layOut = board.layOut,
      position = args["position"],
      positionString = layOut[position],
      stringLength = positionString.length,
      pieceType = board.pieceTypeAt(position);
      // pieceType = pieceType.charAt(0) + pieceType.slice(1);
    // if( pieceType === Board.PAWN ){ pieceType = board.teamAt(position) + board.pieceTypeAt(position) }
    var availableMovements = PieceMovementRules.pieceSpecificMovements()[pieceType]
    return availableMovements
  }
  static kingInCheck(args){ // can just pass in same position as start and end if you want to know whether not moving anything creates check
    // this should be two functions, one that checks whether a king is in check from a given layout
    // and one that checks whether making a particular layout change would result in check
    if(
      !Board.prototype.isPrototypeOf( args["board"] ) ||
      typeof args["startPosition"] !== "number" ||
      !(typeof args["endPosition"] !== "number" || typeof args["endPosition"] !== "string") || //not sure where this got turned into a string...
      !(typeof args["additionalActions"] === "function" || typeof args["additionalActions"] === "undefined")
    ){
      throw new Error("missing params in kingInCheck")
    }
    var startPosition      = args["startPosition"],
        endPosition        = args["endPosition"],
        board              = args["board"],
        additionalActions  = args["additionalActions"],
        layOut             = board.layOut,
        pieceString        = layOut[startPosition],
        teamString         = board.teamAt(startPosition),
        danger             = false,
        newLayout          = Board.deepCopyLayout(layOut),
        opposingTeamString = Board.opposingTeam(teamString);
    var newBoard = new Board(newLayout);
    newBoard.movePiece( startPosition, endPosition, additionalActions)
    var kingPosition = newBoard.kingPosition(teamString);

    var enemyPositions = newBoard.positionsOccupiedByTeam(opposingTeamString);
    for(var i = 0; i < enemyPositions.length; i++){
      var enemyPosition = enemyPositions[i],
        availableMovements = PieceMovementRules.retrieveAvailableMovements( {position: enemyPosition, board: board} ),
        enemyPieceType = board.pieceTypeAt( enemyPosition );
        if( enemyPieceType !== Board.KING && PieceMovementRules.positionViable({startPosition: enemyPosition, endPosition: kingPosition, board: newBoard} ) ){
        danger = true
        }
    };
    return danger
  }
  static positionViable(args){
    if(
      !Board.prototype.isPrototypeOf( args["board"] ) ||
      typeof args["startPosition"] !== "number" ||
      !(typeof args["endPosition"] !== "number" || typeof args["endPosition"] !== "string") //not sure where this got turned into a string...
    ){
      throw new Error("missing params in positionViable")
    }
    var board = args["board"],
      startPosition = args["startPosition"],
      endPosition = args["endPosition"],
      viablePositions = PieceMovementRules.viablePositionsFrom( {startPosition: startPosition, board: board} ),
      viable = false;
    for( var key in viablePositions ){
      if( key == endPosition ){
        viable = viablePositions[key]
      }
    };
    return viable
  }
  static viablePositionsFromKeysOnly(args){
    if(
      !Board.prototype.isPrototypeOf( args["board"] ) ||
      typeof args["startPosition"] !== "number"
    ){
      throw new Error("missing params in viablePositionsFromKeysOnly")
    }
    var viablePositions = PieceMovementRules.viablePositionsFrom(args),
      keysOnly = [];
      for (var property in viablePositions) {
        if (viablePositions.hasOwnProperty(property)) {
          keysOnly.push(property)
      }
    }
    return keysOnly
  }
  static viablePositionsFrom(args){
    if(
      !Board.prototype.isPrototypeOf( args["board"] ) ||
      typeof args["startPosition"] !== "number"
    ){
      throw new Error("missing params in viablePositionsFrom")
    }
    var startPosition = args["startPosition"],
      board = args["board"],
      availableMovements = PieceMovementRules.retrieveAvailableMovements( { position: startPosition, board: board} ),
      pieceMovements = availableMovements({board: board, startPosition: startPosition}),
      teamString = board.teamAt(startPosition),
      viablePositions = {};
    for(var i = 0; i < pieceMovements.length; i++){
      var movement = pieceMovements[i],
        increment = movement.increment,
        rangeLimit = movement.rangeLimit,
        boundaryCheck = movement.boundaryCheck;
      for(var j = 1; j <= rangeLimit; j++){
        var currentPosition = increment * j + startPosition,
            occupyingTeam = board.teamAt(currentPosition);
        if ( !boundaryCheck(j, increment, startPosition) ){
          break
        }
        if ( board.positionEmpty(currentPosition) ){
          viablePositions[currentPosition] = movement
        } else if( board.occupiedByOpponent({position: currentPosition, teamString: teamString} ) ){
          viablePositions[currentPosition] = movement
          break
        } else if(board.occupiedByTeamMate({position: currentPosition, teamString: teamString} ) ){
          break
        };
      };
    };
    return viablePositions
  }

}
