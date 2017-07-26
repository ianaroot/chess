// search for equals, deglobalize scope slippage
var PieceController = function(){
  // if (this.constructor === PieceController) {
  //   throw new Error("Can't instantiate abstract class!");
  // }
  // PieceController initialization...
  var instance = {
    addSpecialMoves: function(){
      // only some pieceController types use this method, but it should be able to be called by all without errors
    },
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
      this.addSpecialMoves({ startPosition: startPosition, board: board, viablePositions: viablePositions})
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
      // should this not just live on the movement Type object?
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
              // throw error if args missing. make a reusable function, throw it in some stuff
              var endPosition = i * increment + startPosition;
              return Board.classMethods.inBounds(endPosition)
            }
          }
        },
        verticalDown: function(){
          return {
            increment: "-8",
            boundaryCheck: function(i, increment, startPosition) {
              // throw error if args missing. make a reusable function, throw it in some stuff
              var endPosition = i * increment + startPosition;
              return Board.classMethods.inBounds(endPosition)
            }
          }
        },
        forwardSlashUp: function(){
          return {
            increment: "+9",
            boundaryCheck: function(i, increment, startPosition) {
              // throw error if args missing. make a reusable function, throw it in some stuff
              var endPosition = i * increment + startPosition;
              return (endPosition) % 8 > (startPosition % 8) && Board.classMethods.inBounds(endPosition)
            }
          }
        },
        forwardSlashDown: function(){
          return {
            increment: "-9",
            boundaryCheck: function(i, increment, startPosition) {
              // throw error if args missing. make a reusable function, throw it in some stuff
              var endPosition = i * increment + startPosition;
              return (endPosition) % 8 < (startPosition % 8) && Board.classMethods.inBounds(endPosition)
            }
          }
        },
        backSlashUp: function(){
          return {
            increment: "+7",
            boundaryCheck: function(i, increment, startPosition) {
              // throw error if args missing. make a reusable function, throw it in some stuff
              var endPosition = i * increment + startPosition;
              return (endPosition) % 8 < (startPosition % 8) && Board.classMethods.inBounds(endPosition)
            }
          }
        },
        backSlashDown: function(){
          return {
            increment: "-7",
            boundaryCheck: function(i, increment, startPosition) {
              // throw error if args missing. make a reusable function, throw it in some stuff
              var endPosition = i * increment + startPosition;
              return (endPosition) % 8 > (startPosition % 8) && Board.classMethods.inBounds(endPosition)
            }
          }
        },
        nightVerticalLeftUp: function(){
          return {
            increment: "+15",
            boundaryCheck: function(i, increment, startPosition) {
              // throw error if args missing. make a reusable function, throw it in some stuff
              var endPosition = i * increment + startPosition;
              return Math.abs( (endPosition) % 8 - startPosition % 8 ) === 1 && Board.classMethods.inBounds(endPosition)
            }
          }
        },
        nightVerticalRightUp: function(){
          return {
            increment: "+17",
            boundaryCheck: function(i, increment, startPosition) {
              // throw error if args missing. make a reusable function, throw it in some stuff
              var endPosition = i * increment + startPosition;
              return Math.abs( (endPosition) % 8 - startPosition % 8 ) === 1 && Board.classMethods.inBounds(endPosition)
            }
          }
        },
        nightHorizontalLeftUp: function(){
          return {
            increment: "+6",
            boundaryCheck: function(i, increment, startPosition) {
              // throw error if args missing. make a reusable function, throw it in some stuff
              var endPosition = i * increment + startPosition;
              return Math.abs( (endPosition) % 8 - startPosition % 8 ) === 2 && Board.classMethods.inBounds(endPosition)
            }
          }
        },
        nightHorizontalRightUp: function(){
          return {
            increment: "+10",
            boundaryCheck: function(i, increment, startPosition) {
              // throw error if args missing. make a reusable function, throw it in some stuff
              var endPosition = i * increment + startPosition;
              return Math.abs( (endPosition) % 8 - startPosition % 8 ) === 2 && Board.classMethods.inBounds(endPosition)
            }
          }
        },
        nightVerticalLeftDown: function(){
          return {
            increment: "-15",
            boundaryCheck: function(i, increment, startPosition) {
              // throw error if args missing. make a reusable function, throw it in some stuff
              var endPosition = i * increment + startPosition;
              return Math.abs( (endPosition) % 8 - startPosition % 8 ) === 1 && Board.classMethods.inBounds(endPosition)
            }
          }
        },
        nightVerticalRightDown: function(){
          return {
            increment: "-17",
            boundaryCheck: function(i, increment, startPosition) {
              // throw error if args missing. make a reusable function, throw it in some stuff
              var endPosition = i * increment + startPosition;
              return Math.abs( (endPosition) % 8 - startPosition % 8 ) === 1 && Board.classMethods.inBounds(endPosition)
            }
          }
        },
        nightHorizontalLeftDown: function(){
          return {
            increment: "-6",
            boundaryCheck: function(i, increment, startPosition) {
              // throw error if args missing. make a reusable function, throw it in some stuff
              var endPosition = i * increment + startPosition;
              return Math.abs( (endPosition) % 8 - startPosition % 8 ) === 2 && Board.classMethods.inBounds(endPosition)
            }
          }
        },
        nightHorizontalRightDown: function(){
          return {
            increment: "-10",
            boundaryCheck: function(i, increment, startPosition) {
              // throw error if args missing. make a reusable function, throw it in some stuff
              var endPosition = i * increment + startPosition;
              return Math.abs( (endPosition) % 8 - startPosition % 8 ) === 2 && Board.classMethods.inBounds(endPosition)
            }
          }
        },
        horizontalRight: function(){
          return {
            increment: "+1",
            boundaryCheck: function(i, increment, startPosition) {
              // throw error if args missing. make a reusable function, throw it in some stuff
              var endPosition = i * increment + startPosition;
              return Math.floor((endPosition) / 8) === Math.floor(startPosition / 8) && Board.classMethods.inBounds(endPosition)
            }
          }
        },
        horizontalLeft: function(){
          return {
            increment: "-1",
            boundaryCheck: function(i, increment, startPosition) {
              // throw error if args missing. make a reusable function, throw it in some stuff
              var endPosition = i * increment + startPosition;
              return Math.floor((endPosition) / 8) === Math.floor(startPosition / 8) && Board.classMethods.inBounds(endPosition)
            }
          }
        }
      },
      pieceSpecific: {
        night: function(){
          var moves = [PieceController.getInstance().movements.generic.nightHorizontalRightDown(), PieceController.getInstance().movements.generic.nightHorizontalLeftDown(), PieceController.getInstance().movements.generic.nightVerticalRightDown(),
                        PieceController.getInstance().movements.generic.nightVerticalLeftDown(), PieceController.getInstance().movements.generic.nightHorizontalRightUp(), PieceController.getInstance().movements.generic.nightHorizontalLeftUp(),
                        PieceController.getInstance().movements.generic.nightVerticalRightUp(), PieceController.getInstance().movements.generic.nightVerticalLeftUp()
                      ];
          for (var key in moves) {
            if (moves.hasOwnProperty(key)) {
              moves[key].rangeLimit = 1 ;
            };
          };
          return  moves
        },
        rook: function(){
          var moves = [PieceController.getInstance().movements.generic.horizontalRight(), PieceController.getInstance().movements.generic.horizontalLeft(), PieceController.getInstance().movements.generic.verticalUp(), PieceController.getInstance().movements.generic.verticalDown()]
          for (var key in moves) {
            if (moves.hasOwnProperty(key)) {
              moves[key].rangeLimit = 7 ;
            };
          };
          return moves
        },
        bishop: function(){
          var moves = [PieceController.getInstance().movements.generic.forwardSlashDown(), PieceController.getInstance().movements.generic.forwardSlashUp(), PieceController.getInstance().movements.generic.backSlashDown(), PieceController.getInstance().movements.generic.backSlashUp()]
          for (var key in moves) {
            if (moves.hasOwnProperty(key)) {
              moves[key].rangeLimit = 7 ;
            };
          };
          return moves
        },
        queen: function(){
          // scoping error is cause PieceController.getInstance() to be pieceSpecific, not the piececontroller when we get in the pieceSpecific.rook
          // return PieceController.getInstance().movements.pieceSpecific.rook().concat( PieceController.getInstance().movements.pieceSpecific.bishop() )
          var moves = [PieceController.getInstance().movements.generic.horizontalRight(), PieceController.getInstance().movements.generic.horizontalLeft(), PieceController.getInstance().movements.generic.verticalUp(), PieceController.getInstance().movements.generic.verticalDown(),
            PieceController.getInstance().movements.generic.forwardSlashDown(), PieceController.getInstance().movements.generic.forwardSlashUp(), PieceController.getInstance().movements.generic.backSlashDown(), PieceController.getInstance().movements.generic.backSlashUp()
          ]
          for (var key in moves) {
            if (moves.hasOwnProperty(key)) {
              moves[key].rangeLimit = 7 ;
            };
          };
          return moves
        },
        king: function(){
          var moves = [PieceController.getInstance().movements.generic.horizontalRight(), PieceController.getInstance().movements.generic.horizontalLeft(), PieceController.getInstance().movements.generic.verticalUp(), PieceController.getInstance().movements.generic.verticalDown(),
          PieceController.getInstance().movements.generic.forwardSlashDown(), PieceController.getInstance().movements.generic.forwardSlashUp(), PieceController.getInstance().movements.generic.backSlashDown(), PieceController.getInstance().movements.generic.backSlashUp()
          ]
          for (var key in moves) {
            if (moves.hasOwnProperty(key)) {
              moves[key].rangeLimit = 1 ;
            };
          };
          return moves
        },
        whitePawn: function(args){
          var board = args["board"],
            startPosition = args["startPosition"],
            movements = [];
          if( Board.classMethods.ranks.isSecond(startPosition) && board.twoSpacesUpIsEmpty( startPosition ) ){
            var newPossibility = PieceController.getInstance().movements.generic.verticalUp()
            newPossibility.rangeLimit = 2
            movements = movements.concat(newPossibility)
          };
          if( board.oneSpaceUpIsEmpty(startPosition) ){
            var newPossibility = PieceController.getInstance().movements.generic.verticalUp()
            newPossibility.rangeLimit = 1
            movements = movements.concat(newPossibility)
          };
          if( board.upAndLeftIsAttackable({position: startPosition, attackingTeamString: "white"}) ){
            var newPossibility = PieceController.getInstance().movements.generic.backSlashUp()
            newPossibility.rangeLimit = 1
            movements = movements.concat(newPossibility)
          };
          if( board.upAndRightIsAttackable({position: startPosition, attackingTeamString: "white"}) ){
            var newPossibility = PieceController.getInstance().movements.generic.forwardSlashUp()
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
            var newPossibility = PieceController.getInstance().movements.generic.verticalDown()
            newPossibility.rangeLimit = 2
            movements = movements.concat(newPossibility)
          };
          if( board.oneSpaceDownIsEmpty(startPosition) ){
            var newPossibility = PieceController.getInstance().movements.generic.verticalDown()
            newPossibility.rangeLimit = 1
            movements = movements.concat(newPossibility)
          };
          if( board.downAndLeftIsAttackable({position: startPosition, attackingTeamString: "black"}) ){
            var newPossibility = PieceController.getInstance().movements.generic.forwardSlashDown()
            newPossibility.rangeLimit = 1
            movements = movements.concat(newPossibility)
          };
          if( board.downAndRightIsAttackable({position: startPosition, attackingTeamString: "black"}) ){
            var newPossibility = PieceController.getInstance().movements.generic.backSlashDown()
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


// var NightController = function() {
//     var newMoves = PieceController.getInstance().movements.pieceSpecific.night
//     PieceController.apply(this, arguments);
//     this.directionalMovements = newMoves

// };
// NightController.prototype = Object.create(PieceController.prototype);
// NightController.prototype.constructor = NightController;

// var RookController = function() {
//     var newMoves = this.movements.pieceSpecific.rook
//     PieceController.apply(this, arguments);
//     this.directionalMovements = newMoves

// };
// RookController.prototype = Object.create(PieceController.prototype);
// RookController.prototype.constructor = RookController;

// var BishopController = function() {
//     var newMoves = this.movements.pieceSpecific.bishop
//     PieceController.apply(this, arguments);
//     this.directionalMovements = newMoves

// };
// BishopController.prototype = Object.create(PieceController.prototype);
// BishopController.prototype.constructor = BishopController;


// var KingController = function() {
//     var newMoves = this.movements.pieceSpecific.king
//     PieceController.apply(this, arguments);
//     this.directionalMovements = newMoves
//     this.kingSideCastleAllowed = function(args){
//       var board = args["board"],
//         startPosition = args["startPosition"];
//       return board.pieceHasNotMovedFrom( startPosition ) && board.kingSideRookHasNotMoved( startPosition ) && board.kingSideCastleIsClear( startPosition )
//     },
//     this.addSpecialMoves = function(args){
//       var startPosition = args["startPosition"],
//         board = args["board"],
//         viablePositions = args["viablePositions"];
//       // check for pieces blocking
//       // check for moving through out of or into check
//       // also needs to be verifying that the positions in between are empty and that the positions are not in check

//       // technically it should not be possible to end up checking a pieceController possiblemoves from a position it doesn't occupy, but it's worth making sure that can't happen
//       // if( board.pieceTypeAt(startPosition) === "King" && 
//       if( board.pieceHasNotMovedFrom(startPosition) ){
//         if( board.queenSideRookHasNotMoved(startPosition) ){
//           viablePositions.push( startPosition - 2 )
//         }
//         if( board.kingSideRookHasNotMoved(startPosition) ){
//           viablePositions.push( startPosition + 2 )
//         }
//       };
//     }
// };
// KingController.prototype = Object.create(PieceController.prototype);
// KingController.prototype.constructor = KingController;


// var QueenController = function() {
//     var newMoves = this.movements.pieceSpecific.queen
//     PieceController.apply(this, arguments);
//     this.directionalMovements = newMoves

// };
// QueenController.prototype = Object.create(PieceController.prototype);
// QueenController.prototype.constructor = QueenController;


// var WhitePawnController = function(){
//   PieceController.apply(this, arguments);
//   this.directionalMovements = function(layOut, position){
//     var movements = [];
//     if( Board.classMethods.ranks.isSecond(position) && this.twoSpacesUpIsEmpty( layOut, position ) ){
//       var newPossibility = this.movements.generic.verticalUp()
//       newPossibility.rangeLimit = 2
//       movements = movements.concat(newPossibility)
//     };
//     if( this.oneSpaceUpIsEmpty(layOut, position) ){
//       var newPossibility = this.movements.generic.verticalUp()
//       newPossibility.rangeLimit = 1
//       movements = movements.concat(newPossibility)
//     };
//     if( this.upAndLeftIsAttackable(layOut, position) ){
//       var newPossibility = this.movements.generic.backSlashUp()
//       newPossibility.rangeLimit = 1
//       movements = movements.concat(newPossibility)
//     };
//     if( this.upAndRightIsAttackable(layOut, position) ){
//       var newPossibility = this.movements.generic.forwardSlashUp()
//       newPossibility.rangeLimit = 1
//       movements = movements.concat(newPossibility)
//     };
//     return movements
//   }
//   this.twoSpacesUpIsEmpty = function(layOut, position){
//     if( Board.classMethods.inBounds( position + 16)){
//       return layOut[position + 16] === "empty"
//     } else {
//       return false
//     }
//   },
//   this.oneSpaceUpIsEmpty = function(layOut, position){
//     if( Board.classMethods.inBounds( position + 8)){
//       return layOut[position + 8] === "empty"
//     } else {
//       return false
//     }
//   },
//   this.upAndLeftIsAttackable = function(layOut, position){
//     if( Board.classMethods.inBounds( position + 7)){
//       var pieceString = layOut[position + 7],
//         pieceTeam = pieceString.substring(0,5);
//       return pieceTeam === "black" && Board.classMethods.squareColor(position) === Board.classMethods.squareColor(position + 7)
//     } else {
//       return false
//     }
//   },
//   this.upAndRightIsAttackable = function(layOut, position){
//     if( Board.classMethods.inBounds( position + 9)){
//       var pieceString = layOut[position + 9],
//         pieceTeam = pieceString.substring(0,5);
//       return pieceTeam === "black" && Board.classMethods.squareColor(position) === Board.classMethods.squareColor(position + 9)
//     } else {
//       return false
//     }
//   }
// };
// WhitePawnController.prototype = Object.create(PieceController.prototype);
// WhitePawnController.prototype.constructor = WhitePawnController;


// var BlackPawnController = function(){
//   PieceController.apply(this, arguments);
//   this.directionalMovements = function(layOut, position){
//     var movements = [];
//     if( Board.classMethods.ranks.isSeventh(position) && this.twoSpacesDownIsEmpty(layOut, position) ){
//       var newPossibility = this.movements.generic.verticalDown()
//       newPossibility.rangeLimit = 2
//       movements = movements.concat(newPossibility)
//     };
//     if( this.oneSpaceDownIsEmpty(layOut, position) ){
//       var newPossibility = this.movements.generic.verticalDown()
//       newPossibility.rangeLimit = 1
//       movements = movements.concat(newPossibility)
//     };
//     if( this.downAndLeftIsAttackable(layOut, position) ){
//       var newPossibility = this.movements.generic.forwardSlashDown()
//       newPossibility.rangeLimit = 1
//       movements = movements.concat(newPossibility)
//     };
//     if( this.downAndRightIsAttackable(layOut, position) ){
//       var newPossibility = this.movements.generic.backSlashDown()
//       newPossibility.rangeLimit = 1
//       movements = movements.concat(newPossibility)
//     };
//     return movements
//   },
//   this.twoSpacesDownIsEmpty = function(layOut, position){
//     if( Board.classMethods.inBounds( position - 16 )){ 
//       return layOut[position - 16] === "empty"
//     } else {
//       return false
//     }
//   },
//   this.oneSpaceDownIsEmpty = function(layOut, position){
//     if( Board.classMethods.inBounds( position - 8 ) ){
//       return layOut[position - 8] === "empty"
//     } else {
//       return false
//     }
//   },
//   this.downAndLeftIsAttackable = function(layOut, position){
//     if( Board.classMethods.inBounds( position - 9 )){ 
//       var pieceString = layOut[position - 9],
//         pieceTeam = pieceString.substring(0,5);
//       return pieceTeam === "white" && Board.classMethods.squareColor(position) === Board.classMethods.squareColor(position - 9)
//     } else {
//       return false
//     }
//   },
//   this.downAndRightIsAttackable = function(layOut, position){
//     if( Board.classMethods.inBounds( position - 7 ) ){
//       var pieceString = layOut[position - 7],
//         pieceTeam = pieceString.substring(0,5);
//       return pieceTeam === "white" && Board.classMethods.squareColor(position) === Board.classMethods.squareColor(position - 7)
//     } else {
//       return false
//     }
//   }
// };
// BlackPawnController.prototype = Object.create(PieceController.prototype);
// BlackPawnController.prototype.constructor = BlackPawnController;