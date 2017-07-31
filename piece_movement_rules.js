// throw error if args missing. make a reusable function, throw it in some stuff
// tells you it's the other team's turn if you try to move from an empty square
// search for equals, deglobalize scope slippage
var PieceMovementRules = function(){
  var instance = {
    moveIsIllegal: function(startPosition, endPosition, board){
      var layOut = board.layOut,
        team = board.teamAt(startPosition),
        pieceController = this.retrieveControllerForPosition( startPosition ),
        illegal = false;
        
      if ( !Board.classMethods.inBounds(endPosition) ){
        alert('stay on the board, fool')
        illegal = true
      } else if( board.positionIsOccupiedByTeamMate(endPosition, team ) ){
        alert("what, are you trying to capture your own piece?")
        illegal = true
      } else if( !PieceMovementRules.getInstance().positionViable( {startPosition: startPosition, endPosition: endPosition, board: board, pieceMovements: pieceController} ) ) {
        alert("that's not how that piece moves")
        illegal = true
      } else if( this.kingCheck( {startPosition: startPosition, endPosition: endPosition, board: board})){
        alert("check yo king fool")
        illegal = true
      }
      return illegal
    },
    retrieveControllerForPosition: function(position){
      var  positionString = layOut[position],
        stringLength = positionString.length,
        pieceType = positionString.substring(5, stringLength)
        pieceType = pieceType.charAt(0).toLowerCase() + pieceType.slice(1);
      if( pieceType === "pawn" ){ pieceType = positionString }
        // needs a new name, not pieceController
      pieceController = PieceMovementRules.getInstance().movements.pieceSpecific[pieceType]
      return pieceController
    },
    kingCheck: function(args){
      var startPosition     = args["startPosition"],
          endPosition       = args["endPosition"]
          board             = args["board"],
          layOut            = board.layOut,
          pieceString       = layOut[startPosition],
          teamString        = board.teamAt(startPosition),
          danger            = false,
          newLayout         = Board.classMethods.deepCopyLayout(layOut),
          opposingTeamString = "";

      if( teamString === "white" ){
        opposingTeamString = "black"
      } else {
        opposingTeamString = "white"
      };
// do this in a function
// also probably gonna wanna copy all the board stuff, like previous states
      newLayout[startPosition] = "empty"
      newLayout[endPosition] = pieceString
      var newBoard = new Board({layOut: newLayout}),
      kingPosition = newBoard.kingPosition(teamString);
// seriously, factor it out

      var enemyPositions = newBoard.positionsOccupiedByTeam(opposingTeamString);
      for(var i = 0; i < enemyPositions.length; i++){
        var enemyPosition = enemyPositions[i],
          pieceController = this.retrieveControllerForPosition( enemyPosition );
          if( PieceMovementRules.getInstance().positionViable({startPosition: enemyPosition, endPosition: kingPosition, board: newBoard, pieceMovements: pieceController} ) ){
          danger = true
          }
      };
      return danger
    },
    // castling  these can both refer to the previous board states to answer the question, so knowing about board states doesn't become a pieces job
    // en passant  these can both refer to the previous board states to answer the question, so knowing about board states doesn't become a pieces job 
    // stalemate






    positionViable: function(args){
      var board = args["board"],
        startPosition = args["startPosition"],
        endPosition = args["endPosition"],
        pieceMovements = args["pieceMovements"],
        viablePositions = this.viablePositionsFrom( {startPosition: startPosition, board: board, pieceMovements: pieceMovements} ),
        viable = false;
      for(var i = 0; i < viablePositions.length; i++){
        if( viablePositions[i] === endPosition ){
          viable = true;
          break;
        }
      };
      return viable
    },
    viablePositionsFrom: function(args){
      var startPosition = args["startPosition"],
        board = args["board"],
        pieceMovements = args["pieceMovements"]({board: board, startPosition: startPosition}),
        teamString = board.teamAt(startPosition),
        // movements = this.directionalMovements(board.layOut, startPosition),
        viablePositions = [];
      for(var i = 0; i < pieceMovements.length; i++){
        var movement = pieceMovements[i],
          increment = movement.increment,
          rangeLimit = movement.rangeLimit,
          boundaryCheck = movement.boundaryCheck;
        for(var j = 1; j <= rangeLimit; j++){
          var currentPosition = increment * j + startPosition,
              occupyingTeam = board.teamAt(currentPosition);
          if(startPosition === 60  && increment === -2 && board.positionEmpty(57) ){ debugger }
          if ( !boundaryCheck(j, increment, startPosition) ){
            break
          }
          if ( board.positionEmpty(currentPosition) ){
            viablePositions.push(currentPosition)
          } else if( board.occupiedByOpponent({position: currentPosition, teamString: teamString} ) ){
            viablePositions.push(currentPosition)
            break 
          } else if(board.occupiedByTeamMate({position: currentPosition, teamString: teamString} ) ){
            break
          };
        };
      };
      return viablePositions
    },
    pathIsClear: function(startPosition, endPosition, movementType, layOut){
      var clear = true,
      rangeLimit = movementType.rangeLimit,
      increment = movementType.increment;
      for( var i = 1; i <= movementType.rangeLimit && (startPosition + i * increment) < endPosition; i++){
        var currentPosition = startPosition + i * increment;
        if( layOut[currentPosition] !== "empty"){
          clear = false;
        }
      }
      return clear
    },
    wrapAroundCheat: function(startPosition, endPosition, movementType){
      var startSquareColor = Board.classMethods.squareColor(startPosition),
        endSquareColor = Board.classMethods.squareColor(endPosition),
        rangeLimit = (startPosition - endPosition) / movementType.increment,
        cheat;
      switch(true){
        case (this.backSlashDown === movementType):
          if( startSquareColor === endSquareColor){ cheat = false } else { cheat = true}
          break;
        case (this.backSlashUp === movementType):
          if( startSquareColor === endSquareColor){ cheat = false } else { cheat = true}
          break;
        case (this.forwardSlashUp === movementType):
          if( startSquareColor === endSquareColor){ cheat = false } else { cheat = true}
          break;
        case (this.forwardSlashDown === movementType):
          if( startSquareColor === endSquareColor){ cheat = false } else { cheat = true}
          break;
        case (this.nightVerticalLeftUp === movementType):
          if( startSquareColor === endSquareColor){ cheat = false } else { cheat = true}
          break;

        case (this.verticalUp === movementType ):
          cheat = orthogonalMoveSquareColorCheat(startSquareColor, endSquareColor, range)
        case (this.verticalDown === movementType ):
          cheat = orthogonalMoveSquareColorCheat(startSquareColor, endSquareColor, range)
        case (this.horizontalLeft === movementType ):
          cheat = orthogonalMoveSquareColorCheat(startSquareColor, endSquareColor, range)
        case (this.horizontalRight === movementType ):
          cheat = orthogonalMoveSquareColorCheat(startSquareColor, endSquareColor, range)
      }
    },
    orthogonalMoveSquareColorCheat: function(startSquareColor, endSquareColor, range){
      var cheat = true;
      if (startSquareColor === endSquareColor && rangeLimit % 2 === 0){
        cheat = false;
      } else if(startSquareColor !== endSquareColor && rangeLimit % 2 === 1){
        cheat = false;
      }
      return cheat
    },
    movements: {
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
        night: function(){
          var moves = [PieceMovementRules.getInstance().movements.generic.nightHorizontalRightDown(), PieceMovementRules.getInstance().movements.generic.nightHorizontalLeftDown(), PieceMovementRules.getInstance().movements.generic.nightVerticalRightDown(),
                        PieceMovementRules.getInstance().movements.generic.nightVerticalLeftDown(), PieceMovementRules.getInstance().movements.generic.nightHorizontalRightUp(), PieceMovementRules.getInstance().movements.generic.nightHorizontalLeftUp(),
                        PieceMovementRules.getInstance().movements.generic.nightVerticalRightUp(), PieceMovementRules.getInstance().movements.generic.nightVerticalLeftUp()
                      ];
          for (var key in moves) {
            if (moves.hasOwnProperty(key)) {
              moves[key].rangeLimit = 1 ;
            };
          };
          return  moves
        },
        rook: function(){
          var moves = [PieceMovementRules.getInstance().movements.generic.horizontalRight(), PieceMovementRules.getInstance().movements.generic.horizontalLeft(), PieceMovementRules.getInstance().movements.generic.verticalUp(), PieceMovementRules.getInstance().movements.generic.verticalDown()]
          for (var key in moves) {
            if (moves.hasOwnProperty(key)) {
              moves[key].rangeLimit = 7 ;
            };
          };
          return moves
        },
        bishop: function(){
          var moves = [PieceMovementRules.getInstance().movements.generic.forwardSlashDown(), PieceMovementRules.getInstance().movements.generic.forwardSlashUp(), PieceMovementRules.getInstance().movements.generic.backSlashDown(), PieceMovementRules.getInstance().movements.generic.backSlashUp()]
          for (var key in moves) {
            if (moves.hasOwnProperty(key)) {
              moves[key].rangeLimit = 7 ;
            };
          };
          return moves
        },
        queen: function(){
          // scoping error is cause PieceMovementRules.getInstance() to be pieceSpecific, not the piececontroller when we get in the pieceSpecific.rook
          // return PieceMovementRules.getInstance().movements.pieceSpecific.rook().concat( PieceMovementRules.getInstance().movements.pieceSpecific.bishop() )
          var moves = [PieceMovementRules.getInstance().movements.generic.horizontalRight(), PieceMovementRules.getInstance().movements.generic.horizontalLeft(), PieceMovementRules.getInstance().movements.generic.verticalUp(), PieceMovementRules.getInstance().movements.generic.verticalDown(),
            PieceMovementRules.getInstance().movements.generic.forwardSlashDown(), PieceMovementRules.getInstance().movements.generic.forwardSlashUp(), PieceMovementRules.getInstance().movements.generic.backSlashDown(), PieceMovementRules.getInstance().movements.generic.backSlashUp()
          ]
          for (var key in moves) {
            if (moves.hasOwnProperty(key)) {
              moves[key].rangeLimit = 7 ;
            };
          };
          return moves
        },
        king: function(args){
          var board = args["board"],
            startPosition = args["startPosition"],
            moves = [PieceMovementRules.getInstance().movements.generic.horizontalRight(), PieceMovementRules.getInstance().movements.generic.horizontalLeft(), PieceMovementRules.getInstance().movements.generic.verticalUp(), PieceMovementRules.getInstance().movements.generic.verticalDown(),
          PieceMovementRules.getInstance().movements.generic.forwardSlashDown(), PieceMovementRules.getInstance().movements.generic.forwardSlashUp(), PieceMovementRules.getInstance().movements.generic.backSlashDown(), PieceMovementRules.getInstance().movements.generic.backSlashUp()
          ];
          for (var key in moves) {
            if (moves.hasOwnProperty(key)) {
              moves[key].rangeLimit = 1 ;
            };
          };
          if ( board.pieceHasNotMovedFrom(startPosition) && board.kingSideCastleIsClear(startPosition) && board.kingSideRookHasNotMoved(startPosition) ){
            var castle = PieceMovementRules.getInstance().movements.generic.horizontalLeft()
            castle.increment = + 2
            castle.rangeLimit = 1
            moves.push(castle)
          };
          if ( board.pieceHasNotMovedFrom(startPosition) && board.queenSideCastleIsClear && board.queenSideRookHasNotMoved(startPosition) ){
            var castle = PieceMovementRules.getInstance().movements.generic.horizontalRight()
            castle.increment = - 2
            castle.rangeLimit = 1
            moves.push(castle)
          };
          return moves
        },
        whitePawn: function(args){
          var board = args["board"],
            startPosition = args["startPosition"],
            movements = [];
          if( Board.classMethods.ranks.isSecond(startPosition) && board.twoSpacesUpIsEmpty( startPosition ) ){
            var newPossibility = PieceMovementRules.getInstance().movements.generic.verticalUp()
            newPossibility.rangeLimit = 2
            movements = movements.concat(newPossibility)
          };
          if( board.oneSpaceUpIsEmpty(startPosition) ){
            var newPossibility = PieceMovementRules.getInstance().movements.generic.verticalUp()
            newPossibility.rangeLimit = 1
            movements = movements.concat(newPossibility)
          };
          if( board.upAndLeftIsAttackable({position: startPosition, attackingTeamString: "white"}) ){
            var newPossibility = PieceMovementRules.getInstance().movements.generic.backSlashUp()
            newPossibility.rangeLimit = 1
            movements = movements.concat(newPossibility)
          };
          if( board.upAndRightIsAttackable({position: startPosition, attackingTeamString: "white"}) ){
            var newPossibility = PieceMovementRules.getInstance().movements.generic.forwardSlashUp()
            newPossibility.rangeLimit = 1
            movements = movements.concat(newPossibility)
          };
          return movements
        },
        blackPawn: function(args){
          var board = args["board"],
          startPosition = args["startPosition"],
          movements = []
          if( Board.classMethods.ranks.isSeventh(startPosition) && board.twoSpacesDownIsEmpty(startPosition) ){
            var newPossibility = PieceMovementRules.getInstance().movements.generic.verticalDown()
            newPossibility.rangeLimit = 2
            movements = movements.concat(newPossibility)
          };
          if( board.oneSpaceDownIsEmpty(startPosition) ){
            var newPossibility = PieceMovementRules.getInstance().movements.generic.verticalDown()
            newPossibility.rangeLimit = 1
            movements = movements.concat(newPossibility)
          };
          if( board.downAndLeftIsAttackable({position: startPosition, attackingTeamString: "black"}) ){
            var newPossibility = PieceMovementRules.getInstance().movements.generic.forwardSlashDown()
            newPossibility.rangeLimit = 1
            movements = movements.concat(newPossibility)
          };
          if( board.downAndRightIsAttackable({position: startPosition, attackingTeamString: "black"}) ){
            var newPossibility = PieceMovementRules.getInstance().movements.generic.backSlashDown()
            newPossibility.rangeLimit = 1
            movements = movements.concat(newPossibility)
          };
          // moves.verticalDownTwoStep.rangeLimit = 2;
          return movements
        },
      },
      vagueQueries: {
        up: function(startPosition, endPosition){
          return startPosition < endPosition
        },
        down: function(startPosition, endPosition){
          return startPosition > endPosition
        },
        vertical: function( startPosition, endPosition){
          return startPosition % 8 === endPosition % 8
        },
        horizontal: function( startPosition, endPosition){
          return Math.floor(startPosition / 8) === Math.floor(endPosition / 8)
        },
        left: function(startPosition, endPosition){
          return startPosition > endPosition
        },
        right: function(startPosition, endPosition){
          return startPosition < endPosition
        },
        backSlash: function(startPosition, endPosition){
          return Math.abs( startPosition - endPosition ) % 7 === 0
        },
        forwardSlash: function(startPosition, endPosition){
          return Math.abs( startPosition - endPosition ) % 9 === 0
        },
        nights: function(startPosition, endPosition){
          return Math.abs( startPosition - endPosition) === 6 || Math.abs( startPosition - endPosition) === 10 || Math.abs( startPosition - endPosition) === 15 || Math.abs( startPosition - endPosition) === 17
        },
      }
    },
    
  }

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