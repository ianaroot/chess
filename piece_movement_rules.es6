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
      Pawn: function(args){
        var board = args["board"],
        startPosition = args["startPosition"],
        movements = [],
        teamString = board.teamAt(startPosition),
          colorVars = {
            black: {
              startRank: 7,
              nonAttackMove: PieceMovementRules.genericMovements().verticalDown(),
              singleStepCheck: board.oneSpaceDownIsEmpty(startPosition),
              doubleStepCheck: Board.isSeventhRank(startPosition) && board.twoSpacesDownIsEmpty(startPosition),
              leftAttackCheck: board.downAndLeftIsAttackable(startPosition),
              leftAttackMove: PieceMovementRules.genericMovements().forwardSlashDown(),
              rightAttackCheck: board.downAndRightIsAttackable(startPosition),
              rightAttackMove: PieceMovementRules.genericMovements().backSlashDown(),
              rightEnPassantCheck: Board.rank(startPosition) === 4 && board.whitePawnAt(startPosition + 1) && board.whitePawnDoubleSteppedFrom(startPosition - 15),
              leftEnPassantCheck: Board.rank(startPosition) === 4 && board.whitePawnAt(startPosition - 1) && board.whitePawnDoubleSteppedFrom(startPosition - 17),
            },
            white: {
              startRank: 2,
              nonAttackMove: PieceMovementRules.genericMovements().verticalUp(),
              singleStepCheck: board.oneSpaceUpIsEmpty(startPosition),
              doubleStepCheck: Board.isSecondRank(startPosition) && board.twoSpacesUpIsEmpty( startPosition ),
              leftAttackCheck: board.upAndLeftIsAttackable(startPosition),
              // attackChecks don't need to intake obj anymore
              leftAttackMove: PieceMovementRules.genericMovements().backSlashUp(),
              rightAttackCheck: board.upAndRightIsAttackable(startPosition ),
              rightAttackMove: PieceMovementRules.genericMovements().forwardSlashUp(),
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
            // this is the wettest line of code i've ever seen
            return (endPosition) % 8 > (startPosition % 8) && Board.inBounds(endPosition)
            // can factor out these boundary calculations
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
      position = args["position"],
      pieceType = board.pieceTypeAt(position);
      // pieceType = pieceType.charAt(0) + pieceType.slice(1);
    // if( pieceType === Board.PAWN ){ pieceType = board.teamAt(position) + board.pieceTypeAt(position) }
    var availableMovements = PieceMovementRules.pieceSpecificMovements()[pieceType]
    // TODO move pieceSPecificMovementRules over to MOve object
    // back in move is illegal, make attachMoves function. move object already knows it's board and position and can
    // calculate all the shit on it's own
    // MOVE Object will store a dryer version of the boundary checks, the generic movements, all that cool shit
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
