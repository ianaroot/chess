// viable positions from errors when called on empty position
// even if move is illegal catches it, having viablePositions return illegal positions, such as checked castling, is gonna be problematic, like when i get to where i'm highlighting legal positions to move to
// throw error if args missing. make a reusable function, throw it in some stuff
// tells you it's the other team's turn if you try to move from an empty square
var Rules = function(){
  var pawnPromotionQuery = function(board){
    var layOut = board.layOut;
    for(var i = 0; i < 8; i++){
      if (layOut[i] === "blackPawn" ){
        board.promotePawn(i)
        return "=Q"
        //need to change this when i start allowing choice of promotion type
      }
    }
    for(var i = 56; i < 64; i++){
      if(layOut[i] === "whitePawn" ){
        board.promotePawn(i)
        return "=Q"
        //need to change this when i start allowing choice of promotion type
      }
    }
    return ""
  },
  checkmate = function(board){
    var otherTeam = board.teamNotMoving()
      kingPosition = board.kingPosition(otherTeam);
    var noLegalMoves = this.noLegalMoves(board)
    var kingInCheck = this.kingInCheck({board: board, startPosition: kingPosition, endPosition: kingPosition}) 
    return kingInCheck && noLegalMoves
  },
  noLegalMoves = function(board){
    var movingTeamString = board.allowedToMove,
      noLegalMoves = true;
    if(movingTeamString === "black"){
      var onDeckTeamString = "white"        
    } else {
      var onDeckTeamString = "black"
    }
    var occcupiedPositions = board.positionsOccupiedByTeam(onDeckTeamString);
    for(var i = 0; i < occcupiedPositions.length && noLegalMoves; i++){
      var startPosition = occcupiedPositions[i],
        viablePositions = viablePositionsFrom({startPosition: startPosition, board: board});
      for( var key in viablePositions ){ // checking only kingInCheck here because everything else is guaranteed by the fact that these positions came from viablePositions
        if( !kingInCheck( {startPosition: startPosition, endPosition: key, board: board}) ){
          noLegalMoves = false
        }
      };
    };
    return noLegalMoves
  },
  threeFoldRepetition = function(board){
    var  previousLayouts = board.previousLayouts,
      repetitions = 0,
      threeFoldRepetition = false,
      currentLayOut = board.layOut
      different;

    for( var i = 0; i < previousLayouts.length; i++ ){
      var comparisonLayout = previousLayouts[i],
        different = false;
      for( var j = 0; j < comparisonLayout.length; j++){
        if( comparisonLayout[j] !== currentLayOut[j] ){
          different = true
          break
        }
      };
      if( !different ){ repetitions ++ }
    };
    if(repetitions >= 2){
      threeFoldRepetition = true
    }
    return threeFoldRepetition
  },
  stalemate = function(board){
    return threeFoldRepetition(board) || noLegalMoves(board)
  },
  moveIsIllegal = function(startPosition, endPosition, board){
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
      viableMovement = positionViable( {startPosition: startPosition, endPosition: endPosition, board: board} );
      
    if ( !Board.classMethods.inBounds(endPosition) ){
      moveObject.alert = 'stay on the board, fool'
      moveObject.illegal = true
    } else if( board.occupiedByTeamMate({ position: endPosition, teamString: team }) ){
      moveObject.alert = "what, are you trying to capture your own piece?"
      moveObject.illegal = true
    } else if( !viableMovement ) {
      moveObject.alert = "that's not how that piece moves"
      moveObject.illegal = true
    } else if( kingInCheck( {startPosition: startPosition, endPosition: endPosition, board: board, additionalActions: viableMovement.additionalActions})){
      moveObject.alert = "check yo king fool"
      moveObject.illegal = true
    } // now we know the move is legal

    moveObject.additionalActions = viableMovement.additionalActions
    if( viableMovement.fullNotation ){
      moveObject.fullNotation = viableMovement.fullNotation
    } 
    
    moveObject.pieceNotation = viableMovement.pieceNotation
    return moveObject
  },
  kingInCheck = function(args){ // can just pass in same position as start and end if you want to know whether not moving anything creates check
    // this should be two functions, one that checks whether a king is in check from a given layout
    // and one that checks whether making a particular layout change would result in check
    if( 
      !Board.prototype.isPrototypeOf( args["board"] ) ||
      (typeof args["startPosition"] !== "number" ) ||
      !(typeof args["endPosition"] !== "number" || typeof args["endPosition"] !== "string") ||
      //not sure where this got turned into a string...
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
        newLayout          = Board.classMethods.deepCopyLayout(layOut),
        opposingTeamString = Board.classMethods.opposingTeam(teamString);
    var newBoard = new Board({layOut: newLayout});
    // global scope slip:
    // additional actions, blackMove, board, captureNotation, danger, enPassantLeft, enPassantRight, instance, kingPosition, layOut
    // newLayout, pieceMovements, pieceString, pieceType, position, positionString, prepareWhiteTurn, prepareBlackTurn,
    // rules, tests, turn, viablePositions, view, whiteMove, 
    // if( startPosition && endPosition ){
      newBoard.movePiece( startPosition, endPosition, additionalActions)
    // }
    var kingPosition = newBoard.kingPosition(teamString);
    var enemyPositions = newBoard.positionsOccupiedByTeam(opposingTeamString);
    for(var i = 0; i < enemyPositions.length; i++){
      var enemyPosition = enemyPositions[i],
        availableMovements = retrieveAvailableMovements( {position: enemyPosition, board: board} ),
        enemyPieceType = board.pieceTypeAt( enemyPosition );
        if( enemyPieceType !== "King" && positionViable({startPosition: enemyPosition, endPosition: kingPosition, board: newBoard} ) ){
        danger = true
        }
    };
    return danger
  },
  positionViable = function(args){
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
      viablePositions = viablePositionsFrom( {startPosition: startPosition, board: board} ),
      viable = false;
    for( var key in viablePositions ){
      if( key == endPosition ){
        viable = viablePositions[key]
      }
    };
    return viable
  },
  viablePositionsFrom = function(args){
    if( 
      !Board.prototype.isPrototypeOf( args["board"] ) ||
      typeof args["startPosition"] !== "number" 
    ){
      throw new Error("missing params in viablePositionsFrom")
    }
    var startPosition = args["startPosition"],
      board = args["board"]
      availableMovements = retrieveAvailableMovements( { position: startPosition, board: board} ),
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
  },
  retrieveAvailableMovements = function(args){
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
      pieceType = board.pieceTypeAt(position)
      pieceType = pieceType.charAt(0).toLowerCase() + pieceType.slice(1);
    if( pieceType === "pawn" ){ pieceType = positionString }
    availableMovements = movements.pieceSpecific[pieceType]
    return availableMovements
  },
  movements = {
    generic: {
      verticalUp: function(){
        return {
          increment: "+8",
          boundaryCheck: function(i, increment, startPosition) {
            var endPosition = i * increment + startPosition;
            return Board.classMethods.inBounds(endPosition)
          }
        }
      },
      verticalDown: function(){
        return {
          increment: "-8",
          boundaryCheck: function(i, increment, startPosition) {
            var endPosition = i * increment + startPosition;
            return Board.classMethods.inBounds(endPosition)
          }
        }
      },
      forwardSlashUp: function(){
        return {
          increment: "+9",
          boundaryCheck: function(i, increment, startPosition) {
            var endPosition = i * increment + startPosition;
            return (endPosition) % 8 > (startPosition % 8) && Board.classMethods.inBounds(endPosition)
          }
        }
      },
      forwardSlashDown: function(){
        return {
          increment: "-9",
          boundaryCheck: function(i, increment, startPosition) {
            var endPosition = i * increment + startPosition;
            return (endPosition) % 8 < (startPosition % 8) && Board.classMethods.inBounds(endPosition)
          }
        }
      },
      backSlashUp: function(){
        return {
          increment: "+7",
          boundaryCheck: function(i, increment, startPosition) {
            var endPosition = i * increment + startPosition;
            return (endPosition) % 8 < (startPosition % 8) && Board.classMethods.inBounds(endPosition)
          }
        }
      },
      backSlashDown: function(){
        return {
          increment: "-7",
          boundaryCheck: function(i, increment, startPosition) {
            var endPosition = i * increment + startPosition;
            return (endPosition) % 8 > (startPosition % 8) && Board.classMethods.inBounds(endPosition)
          }
        }
      },
      nightVerticalLeftUp: function(){
        return {
          increment: "+15",
          boundaryCheck: function(i, increment, startPosition) {
            var endPosition = i * increment + startPosition;
            return Math.abs( (endPosition) % 8 - startPosition % 8 ) === 1 && Board.classMethods.inBounds(endPosition)
          }
        }
      },
      nightVerticalRightUp: function(){
        return {
          increment: "+17",
          boundaryCheck: function(i, increment, startPosition) {
            var endPosition = i * increment + startPosition;
            return Math.abs( (endPosition) % 8 - startPosition % 8 ) === 1 && Board.classMethods.inBounds(endPosition)
          }
        }
      },
      nightHorizontalLeftUp: function(){
        return {
          increment: "+6",
          boundaryCheck: function(i, increment, startPosition) {
            var endPosition = i * increment + startPosition;
            return Math.abs( (endPosition) % 8 - startPosition % 8 ) === 2 && Board.classMethods.inBounds(endPosition)
          }
        }
      },
      nightHorizontalRightUp: function(){
        return {
          increment: "+10",
          boundaryCheck: function(i, increment, startPosition) {
            var endPosition = i * increment + startPosition;
            return Math.abs( (endPosition) % 8 - startPosition % 8 ) === 2 && Board.classMethods.inBounds(endPosition)
          }
        }
      },
      nightVerticalLeftDown: function(){
        return {
          increment: "-15",
          boundaryCheck: function(i, increment, startPosition) {
            var endPosition = i * increment + startPosition;
            return Math.abs( (endPosition) % 8 - startPosition % 8 ) === 1 && Board.classMethods.inBounds(endPosition)
          }
        }
      },
      nightVerticalRightDown: function(){
        return {
          increment: "-17",
          boundaryCheck: function(i, increment, startPosition) {
            var endPosition = i * increment + startPosition;
            return Math.abs( (endPosition) % 8 - startPosition % 8 ) === 1 && Board.classMethods.inBounds(endPosition)
          }
        }
      },
      nightHorizontalLeftDown: function(){
        return {
          increment: "-6",
          boundaryCheck: function(i, increment, startPosition) {
            var endPosition = i * increment + startPosition;
            return Math.abs( (endPosition) % 8 - startPosition % 8 ) === 2 && Board.classMethods.inBounds(endPosition)
          }
        }
      },
      nightHorizontalRightDown: function(){
        return {
          increment: "-10",
          boundaryCheck: function(i, increment, startPosition) {
            var endPosition = i * increment + startPosition;
            return Math.abs( (endPosition) % 8 - startPosition % 8 ) === 2 && Board.classMethods.inBounds(endPosition)
          }
        }
      },
      horizontalRight: function(){
        return {
          increment: "+1",
          boundaryCheck: function(i, increment, startPosition) {
            var endPosition = i * increment + startPosition;
            return Math.floor((endPosition) / 8) === Math.floor(startPosition / 8) && Board.classMethods.inBounds(endPosition)
          }
        }
      },
      horizontalLeft: function(){
        return {
          increment: "-1",
          boundaryCheck: function(i, increment, startPosition) {
            var endPosition = i * increment + startPosition;
            return Math.floor((endPosition) / 8) === Math.floor(startPosition / 8) && Board.classMethods.inBounds(endPosition)
          }
        }
      }
    },
    pieceSpecific: {
      night: function(args){
        // how the fuck is "this" the window right here?
        var board = args["board"],
          startPosition = args["startPosition"],
          moves = [movements.generic.nightHorizontalRightDown(), movements.generic.nightHorizontalLeftDown(), movements.generic.nightVerticalRightDown(),
                    movements.generic.nightVerticalLeftDown(), movements.generic.nightHorizontalRightUp(), movements.generic.nightHorizontalLeftUp(),
                    movements.generic.nightVerticalRightUp(), movements.generic.nightVerticalLeftUp()
                  ];
        for (var key in moves) {
          if (moves.hasOwnProperty(key)) {
            moves[key].rangeLimit = 1;
            moves[key].pieceNotation = "N"
          };
        };
        return  moves
      },
      rook: function(args){
        var board = args["board"],
          startPosition = args["startPosition"],
          moves = [movements.generic.horizontalRight(), movements.generic.horizontalLeft(), movements.generic.verticalUp(), movements.generic.verticalDown()]
        for (var key in moves) {
          if (moves.hasOwnProperty(key)) {
            moves[key].rangeLimit = 7;
            moves[key].pieceNotation = "R"
          };
        };
        return moves
      },
      bishop: function(args){
        var board = args["board"],
          startPosition = args["startPosition"],
          moves = [movements.generic.forwardSlashDown(), movements.generic.forwardSlashUp(), movements.generic.backSlashDown(), movements.generic.backSlashUp()]
        for (var key in moves) {
          if (moves.hasOwnProperty(key)) {
            moves[key].rangeLimit = 7;
            moves[key].pieceNotation = "B"
          };
        };
        return moves
      },
      queen: function(args){
        var board = args["board"],
          startPosition = args["startPosition"],
        moves =  movements.pieceSpecific.rook({startPosition: startPosition, board: board}).concat( movements.pieceSpecific.bishop({startPosition: startPosition, board: board}) )
        for (var key in moves) {
          if (moves.hasOwnProperty(key)) {
            moves[key].rangeLimit = 7;
            moves[key].pieceNotation = "Q"
          };
        };
        return moves
      },
      king: function(args){
        var board = args["board"],
          startPosition = args["startPosition"],
          moves = [movements.generic.horizontalRight(), movements.generic.horizontalLeft(), movements.generic.verticalUp(), movements.generic.verticalDown(),
                    movements.generic.forwardSlashDown(), movements.generic.forwardSlashUp(), movements.generic.backSlashDown(), movements.generic.backSlashUp()
                  ];
        for (var key in moves) {
          if (moves.hasOwnProperty(key)) {
            moves[key].rangeLimit = 1;
            moves[key].pieceNotation = "K"
          };
        };
        if ( board.pieceHasNotMovedFrom(startPosition) && board.kingSideCastleIsClear(startPosition) && board.kingSideRookHasNotMoved(startPosition) 
          && !kingInCheck({startPosition: startPosition, endPosition: startPosition, board: board })
          && !kingInCheck({startPosition: (startPosition), endPosition: (startPosition + 1), board: board })
          ){
          var castle = movements.generic.horizontalLeft()
          castle.increment = + 2
          castle.rangeLimit = 1
          castle.fullNotation = "O-O"
          castle.additionalActions = function(args){
          //planning to pass this to the game controller before invoking, so this should be the right object, but i wonder if i should be 
          // explicit here and use game controller instead of this
            var position = args["position"],
              pieceString = this.layOut[startPosition + 3];
            this.emptify( startPosition + 3)
            this.placePiece({ position: (startPosition + 1), pieceString: pieceString })
          }
          moves.push(castle)
        };
        if ( board.pieceHasNotMovedFrom(startPosition) && board.queenSideCastleIsClear(startPosition) && board.queenSideRookHasNotMoved(startPosition) 
          && !kingInCheck({startPosition: startPosition, endPosition: startPosition, board: board })
          && !kingInCheck({startPosition: (startPosition), endPosition: (startPosition - 1), board: board })
        ){
          var castle = movements.generic.horizontalRight()
          castle.increment = - 2
          castle.rangeLimit = 1
          castle.fullNotation = "O-O-O"
          castle.additionalActions = function(args){
            //planning to pass this to the game controller before invoking, so this should be the right object, but i wonder if i should be 
            // explicit here and use game controller instead of this
            var position = args["position"],
              pieceString = this.layOut[startPosition - 4];
            this.emptify( startPosition - 4)
            this.placePiece({ position: (startPosition - 1), pieceString: pieceString })
          }
          moves.push(castle)
        };
        return moves
      },
      whitePawn: function(args){
        var board = args["board"],
          startPosition = args["startPosition"],
          moves = [];
        enPassantLeft = function(args){
          var position = args["position"],
            board = args["board"]; 
          if( Board.classMethods.rank(position) === 5 && board.layOut[position - 1] === "blackPawn" && board.previousLayouts.length && board.positionEmpty(position + 15) && board.lastLayout()[position +  15] === "blackPawn" ){
            // not making use of this number as expected, may as well return true
            return position + 1
          } else {
            return false
          }
        };
        enPassantRight = function(args){
          var board = args["board"],
            position = args["position"];
          if( Board.classMethods.rank(position) === 5 && board.layOut[position + 1] === "blackPawn" && board.previousLayouts.length && board.positionEmpty(position + 17) && board.lastLayout()[position +  17] === "blackPawn" ){
            return position - 1
            // not making use of this number as expected, may as well return true
          } else {
            return false
          }
        };
        if( Board.classMethods.ranks.isSecond(startPosition) && board.twoSpacesUpIsEmpty( startPosition ) ){
          var newPossibility = movements.generic.verticalUp()
          newPossibility.rangeLimit = 2
          newPossibility.pieceNotation = ""
          moves = moves.concat(newPossibility)
        };
        if( board.oneSpaceUpIsEmpty(startPosition) ){
          var newPossibility = movements.generic.verticalUp()
          newPossibility.rangeLimit = 1
          newPossibility.pieceNotation = ""
          moves = moves.concat(newPossibility)
        };
        if( board.upAndLeftIsAttackable({position: startPosition, attackingTeamString: "white"}) ){
          var newPossibility = movements.generic.backSlashUp()
          newPossibility.rangeLimit = 1
          newPossibility.pieceNotation = Board.classMethods.file(startPosition)
          moves = moves.concat(newPossibility)
        };
        if( board.upAndRightIsAttackable({position: startPosition, attackingTeamString: "white"}) ){
          var newPossibility = movements.generic.forwardSlashUp()
          newPossibility.rangeLimit = 1
          newPossibility.pieceNotation = Board.classMethods.file(startPosition)
          moves = moves.concat(newPossibility)
        };
        if( this.enPassantLeft( {position: startPosition, board: board}) ){
          var newPossibility = movements.generic.backSlashUp()
          newPossibility.rangeLimit = 1
          newPossibility.pieceNotation = Board.classMethods.file(startPosition)
          newPossibility.additionalActions = function(args){
            var position = args["position"],
              captureNotation = this.capture(position - 1);
            return captureNotation
          }
          moves = moves.concat(newPossibility)
        };
        if( this.enPassantRight( {position: startPosition, board: board}) ){
          var newPossibility = movements.generic.forwardSlashUp()
          newPossibility.rangeLimit = 1
          newPossibility.pieceNotation = Board.classMethods.file(startPosition)
          newPossibility.additionalActions = function(args){
            var position = args["position"],
              captureNotation = this.capture(position + 1);
            return captureNotation
          }
          moves = moves.concat(newPossibility)
        };
        return moves
      },
      blackPawn: function(args){
        var board = args["board"],
          startPosition = args["startPosition"],
          enPassantTarget,
          moves = [];
        enPassantRight = function(args){
          var position = args["position"],
            board = args["board"]; 
          if( Board.classMethods.rank(position) === 4 && board.layOut[position + 1] === "whitePawn" && board.previousLayouts.length && board.positionEmpty(position - 15) && board.lastLayout()[position -  15] === "whitePawn" ){
            return true
          }
        };
        enPassantLeft= function(args){
          var board = args["board"],
            position = args["position"];
          if( Board.classMethods.rank(position) === 4 && board.layOut[position - 1] === "whitePawn" && board.previousLayouts.length && board.positionEmpty(position - 17) && board.lastLayout()[position -  17] === "whitePawn" ){
            return true
          }
        };
        if( Board.classMethods.ranks.isSeventh(startPosition) && board.twoSpacesDownIsEmpty(startPosition) ){
          var newPossibility = movements.generic.verticalDown()
          newPossibility.rangeLimit = 2
          newPossibility.pieceNotation = ""
          moves = moves.concat(newPossibility)
        };
        if( board.oneSpaceDownIsEmpty(startPosition) ){
          var newPossibility = movements.generic.verticalDown()
          newPossibility.rangeLimit = 1
          newPossibility.pieceNotation = ""
          moves = moves.concat(newPossibility)
        };
        if( board.downAndLeftIsAttackable({position: startPosition, attackingTeamString: "black"}) ){
          var newPossibility = movements.generic.forwardSlashDown()
          newPossibility.rangeLimit = 1
          newPossibility.pieceNotation = Board.classMethods.file(startPosition)
          moves = moves.concat(newPossibility)
        };
        if( board.downAndRightIsAttackable({position: startPosition, attackingTeamString: "black"}) ){
          var newPossibility = movements.generic.backSlashDown()
          newPossibility.rangeLimit = 1
          newPossibility.pieceNotation = Board.classMethods.file(startPosition)
          moves = moves.concat(newPossibility)
        };
        if( this.enPassantLeft( {position: startPosition, board: board}) ){
          var newPossibility = movements.generic.forwardSlashDown()
          newPossibility.rangeLimit = 1
          newPossibility.pieceNotation = Board.classMethods.file(startPosition)
          newPossibility.additionalActions = function(args){
            var position = args["position"],
              captureNotation = this.capture(position - 1);
            return captureNotation
          }
          moves = moves.concat(newPossibility)
        };
        if( this.enPassantRight( {position: startPosition, board: board}) ){
          var newPossibility = movements.generic.backSlashDown()
          newPossibility.rangeLimit = 1
          newPossibility.pieceNotation = Board.classMethods.file(startPosition)
          newPossibility.additionalActions = function(args){
            var position = args["position"],
              captureNotation = this.capture(position + 1);
            return captureNotation
          }
          moves = moves.concat(newPossibility)
        };
        return moves
      },
    }
  },
  instance = {
    moveIsIllegal: moveIsIllegal,
    pawnPromotionQuery: pawnPromotionQuery,
    checkmate: checkmate,
    kingInCheck: kingInCheck,
    stalemate: stalemate,
    noLegalMoves: noLegalMoves
  };
  // private
    //end private


  function createInstance() {
      var object = new Object("I am the instance");
      return object;
  }
  return {
    getInstance: function(controllerSet) {
      if (!instance) {
        instance = createInstance(controllerSet);
      }
      return instance;
    },
  };
}();



