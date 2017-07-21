// search for equals deglobalize scope slippage
var PieceController = function(){
  if (this.constructor === PieceController) {
    throw new Error("Can't instantiate abstract class!");
  }
  // PieceController initialization...
};
PieceController.prototype = {
  positionViable: function(args){
    var board = args["board"],
      startPosition = args["startPosition"],
      endPosition = args["endPosition"],
      movementType = this.movementDirectionFinder(startPosition, endPosition),
      viablePositions = this.viablePositionsFrom( {startPosition: startPosition, board: board} ),
      viable = false
    ;
    for( i = 0; i < viablePositions.length; i++){
      if( viablePositions[i] === endPosition ){
        viable = true;
        break;
      }
    };
    return viable
    //   // maybe pass empty set something instead of relying on undefined
    // if ( movementType === undefined ){ //no valid movement type was found that leads to this position
    //   return false
    // } 
    // var movementType = movementType(),
    //   viable = false,
    //   directionalMovements = this.directionalMovements(layOut, startPosition);
    // for(var i = 0; i < directionalMovements.length; i++){
    //   if( directionalMovements[i].increment === movementType.increment && !this.wrapAroundCheat(startPosition, endPosition, movementType) && this.pathIsClear(startPosition, endPosition, movementType, layOut) ){

    //       // look for bad check?
    //     // look for capture
    //     viable = true
    //   }
    // }
    // return viable
  },
  viablePositionsFrom: function(args){
    var startPosition = args["startPosition"],
        board = args["board"],
        teamString = board.teamAt(startPosition),
        movements = this.directionalMovements(board.layOut, startPosition),
        viablePositions = []
    ;
    for(i = 0; i < movements.length; i++){
      var movement = movements[i],
        increment = movement.increment,
        rangeLimit = movement.rangeLimit,
        boundaryCheck = movement.boundaryCheck;
        console.log("team is: " + teamString)
        for( j = 1; j <= rangeLimit; j++){
          var currentPosition = increment * j + startPosition,
              occupyingTeam = board.teamAt(currentPosition);
              // debugger
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
    // debugger
    for( var i = 1; i <= movementType.rangeLimit && (startPosition + i * increment) < endPosition; i++){
      var currentPosition = startPosition + i * increment;
      // debugger
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
  movementDirectionFinder: function(startPosition, endPosition){
    var queries = this.movements.vagueQueries,
        movementDirection;
    if ( queries.up(startPosition, endPosition) && queries.vertical(startPosition, endPosition) ){
      movementDirection = this.movements.directional.verticalUp
    } else if ( queries.down(startPosition, endPosition) && queries.vertical(startPosition, endPosition) ){
      movementDirection = this.movements.directional.verticalDown
    } else if ( queries.horizontal(startPosition, endPosition) && queries.left(startPosition, endPosition) ){
      movementDirection = this.movements.directional.horizontalLeft
    } else if ( queries.horizontal(startPosition, endPosition) && queries.right(startPosition, endPosition) ){
      movementDirection = this.movements.directional.horizontalRight
    } else if ( queries.down(startPosition, endPosition) && queries.vertical(startPosition, endPosition) ){
      movementDirection = this.movements.directional.verticalDown
    } else if ( queries.down(startPosition, endPosition) && queries.backSlash(startPosition, endPosition) ){
      movementDirection = this.movements.directional.backSlashDown
    } else if ( queries.up(startPosition, endPosition) && queries.backSlash(startPosition, endPosition) ){
      movementDirection = this.movements.directional.backSlashUp
    } else if ( queries.down(startPosition, endPosition) && queries.forwardSlash(startPosition, endPosition) ){
      movementDirection = this.movements.directional.forwardSlashDown
    } else if ( queries.up(startPosition, endPosition) && queries.forwardSlash(startPosition, endPosition) ){
      movementDirection = this.movements.directional.forwardSlashUp
    } else if ( queries.nights(startPosition, endPosition) ){
        if ( startPosition + 17 === endPosition ){
          movementDirection = this.movements.directional.nightVerticalRightUp
          movementDirection.rangeLimit = 1
        }
        if ( startPosition + 15 === endPosition ){
          movementDirection = this.movements.directional.nightVerticalLeftUp
          movementDirection.rangeLimit = 1
        };
        if ( startPosition - 17 === endPosition ){
          movementDirection = this.movements.directional.nightVerticalLeftDown
          movementDirection.rangeLimit = 1
        }
        if ( startPosition - 15 === endPosition ){
          movementDirection = this.movements.directional.nightVerticalRightDown
          movementDirection.rangeLimit = 1
        };

        if ( startPosition + 10 === endPosition ){
          movementDirection = this.movements.directional.nightHorizontalRightUp
          movementDirection.rangeLimit = 1
        }
        if ( startPosition + 6 === endPosition ){
          movementDirection = this.movements.directional.nightVerticalLeftUp
          movementDirection.rangeLimit = 1
        };
        if ( startPosition - 10 === endPosition ){
          movementDirection = this.movements.directional.nightHorizontalLeftDown
          movementDirection.rangeLimit = 1
        }
        if ( startPosition - 6 === endPosition ){
          movementDirection = this.movements.directional.nightHorizontalRightDown
          movementDirection.rangeLimit = 1
        };
    }
    return movementDirection
  },
  positionIsInPaths: function(args){
    // there are faster ways to calculate what i'm using this for
    var position = args["position"],
        newPosition = args["newPosition"],
        layOut = args["layOut"],
        paths = this.allPathsFinder(layOut, position);
        // paths will be part of the input coming from the piece
        // paths = rules.allPathsFinder(piece),
        positionViable = false;
    for( var i = 0; i < paths.length; i ++){
      var path = paths[i]
      for( var j = 0; j < path.length; j++){
        if( path[j] === newPosition ){ positionViable = true }
      };
    };
    return positionViable
  },
  ranks: {
    isSecond: function(position){
      return Board.classMethods.ranks.isSecond(position)
    },
    isSeventh: function(position){
      return Board.classMethods.ranks.isSeventh(position)
    }
  },
  movements: {
    directional: {
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
    sets: {
      night: function(){
        var moves = [this.movements.directional.nightHorizontalRightDown(), this.movements.directional.nightHorizontalLeftDown(), this.movements.directional.nightVerticalRightDown(),
                      this.movements.directional.nightVerticalLeftDown(), this.movements.directional.nightHorizontalRightUp(), this.movements.directional.nightHorizontalLeftUp(),
                      this.movements.directional.nightVerticalRightUp(), this.movements.directional.nightVerticalLeftUp()
                    ];
        for (var key in moves) {
          if (moves.hasOwnProperty(key)) {
            moves[key].rangeLimit = 1 ;
          };
        };
        return  moves
      },
      rook: function(){
        var moves = [this.movements.directional.horizontalRight(), this.movements.directional.horizontalLeft(), this.movements.directional.verticalUp(), this.movements.directional.verticalDown()]
        for (var key in moves) {
          if (moves.hasOwnProperty(key)) {
            moves[key].rangeLimit = 7 ;
          };
        };
        return moves
      },
      bishop: function(){
        var moves = [this.movements.directional.forwardSlashDown(), this.movements.directional.forwardSlashUp(), this.movements.directional.backSlashDown(), this.movements.directional.backSlashUp()]
        for (var key in moves) {
          if (moves.hasOwnProperty(key)) {
            moves[key].rangeLimit = 7 ;
          };
        };
        return moves
      },
      queen: function(){
        // scoping error is cause this to be sets, not the piececontroller when we get in the sets.rook
        // return this.movements.sets.rook().concat( this.movements.sets.bishop() )

        var moves = [this.movements.directional.horizontalRight(), this.movements.directional.horizontalLeft(), this.movements.directional.verticalUp(), this.movements.directional.verticalDown(),
          this.movements.directional.forwardSlashDown(), this.movements.directional.forwardSlashUp(), this.movements.directional.backSlashDown(), this.movements.directional.backSlashUp()
        ]
        for (var key in moves) {
          if (moves.hasOwnProperty(key)) {
            moves[key].rangeLimit = 7 ;
          };
        };
        return moves
      },
      king: function(){
        var moves = [this.movements.directional.horizontalRight(), this.movements.directional.horizontalLeft(), this.movements.directional.verticalUp(), this.movements.directional.verticalDown(),
        this.movements.directional.forwardSlashDown(), this.movements.directional.forwardSlashUp(), this.movements.directional.backSlashDown(), this.movements.directional.backSlashUp()
        ]
        for (var key in moves) {
          if (moves.hasOwnProperty(key)) {
            moves[key].rangeLimit = 1 ;
          };
        };
        return moves
      },
      whitePawn: function(){
        var moves = {
          forwardSlashUp: this.movements.directional.forwardSlashUp(), backSlashUp: this.movements.directional.backSlashUp(), verticalUp: this.movements.directional.verticalUp(), verticalUpTwoStep: this.movements.directional.verticalUp()
        }
        for (var key in moves) {
          if (moves.hasOwnProperty(key)) {
            moves[key].rangeLimit = 1 ;
          };
        };
        moves.verticalUpTwoStep.rangeLimit = 2;
        return moves
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
  allPathsFinder: function(layOut, position, team){
    var paths = [];
    for(inc = 0; inc < this.directionalMovements.length; inc++){
      paths.push(this.pathFinder(this.directionalMovements[inc], position, team))
      }
    return paths
  },
  pathFinder: function(move, position, team){
    var increment = move["increment"],
        boundaryCheck = move["boundaryCheck"],
        rangeLimit = move["rangeLimit"],
        path = [];
    for (i = 1; boundaryCheck(i, increment, position) && i <= rangeLimit; i++){
      pathPosition = position + i * increment
      if( board.tiles[pathPosition] !== undefined && board.tiles[pathPosition].team === team ){ break; }
      path.push(pathPosition)
    }
    return path
  }

}
var NightController = function() {
    var newMoves = this.movements.sets.night
    PieceController.apply(this, arguments);
    this.directionalMovements = newMoves
    this.value = 3
    this.srcImgWhite = "img/chesspieces/wikipedia/wN.png"
    this.srcImgBlack = "img/chesspieces/wikipedia/bN.png"
    this.name = "night"

};
NightController.prototype = Object.create(PieceController.prototype);
NightController.prototype.constructor = NightController;

var RookController = function() {
    var newMoves = this.movements.sets.rook
    PieceController.apply(this, arguments);
    this.directionalMovements = newMoves
    this.value = 3
    this.srcImgWhite = "img/chesspieces/wikipedia/wR.png"
    this.srcImgBlack = "img/chesspieces/wikipedia/bR.png"
    this.name = "rook"

};
RookController.prototype = Object.create(PieceController.prototype);
RookController.prototype.constructor = RookController;

var BishopController = function() {
    var newMoves = this.movements.sets.bishop
    PieceController.apply(this, arguments);
    this.directionalMovements = newMoves
    this.value = 3
    this.srcImgWhite = "img/chesspieces/wikipedia/wB.png"
    this.srcImgBlack = "img/chesspieces/wikipedia/bB.png"
    this.name = "bishop"

};
BishopController.prototype = Object.create(PieceController.prototype);
BishopController.prototype.constructor = BishopController;


var KingController = function() {
    var newMoves = this.movements.sets.king
    PieceController.apply(this, arguments);
    this.directionalMovements = newMoves
    this.value = 3
    this.srcImgWhite = "img/chesspieces/wikipedia/wK.png"
    this.srcImgBlack = "img/chesspieces/wikipedia/bK.png"
    this.name = "king"

};
KingController.prototype = Object.create(PieceController.prototype);
KingController.prototype.constructor = KingController;


var QueenController = function() {
    var newMoves = this.movements.sets.queen
    PieceController.apply(this, arguments);
    this.directionalMovements = newMoves
    this.value = 3
    this.srcImgWhite = "img/chesspieces/wikipedia/wQ.png"
    this.srcImgBlack = "img/chesspieces/wikipedia/bQ.png"
    this.name = "queen"

};
QueenController.prototype = Object.create(PieceController.prototype);
QueenController.prototype.constructor = QueenController;


var WhitePawnController = function(){
  PieceController.apply(this, arguments);
  this.name = "whitePawn";
  this.value = 1
  this.directionalMovements = function(layOut, position){
    var movements = [];
    if( Board.classMethods.ranks.isSecond(position) && this.twoSpacesUpIsEmpty( layOut, position ) ){
      var newPossibility = this.movements.directional.verticalUp()
      newPossibility.rangeLimit = 2
      movements = movements.concat(newPossibility)
    };
    if( this.oneSpaceUpIsEmpty(layOut, position) ){
      var newPossibility = this.movements.directional.verticalUp()
      newPossibility.rangeLimit = 1
      movements = movements.concat(newPossibility)
    };
    if( this.upAndLeftIsAttackable(layOut, position) ){
      var newPossibility = this.movements.directional.backSlashUp()
      newPossibility.rangeLimit = 1
      movements = movements.concat(newPossibility)
    };
    if( this.upAndRightIsAttackable(layOut, position) ){
      var newPossibility = this.movements.directional.forwardSlashUp()
      newPossibility.rangeLimit = 1
      movements = movements.concat(newPossibility)
    };
    return movements
  }
  this.twoSpacesUpIsEmpty = function(layOut, position){
    return layOut[position + 16] === "empty"
  },
  this.oneSpaceUpIsEmpty = function(layOut, position){
    return layOut[position + 8] === "empty"
  },
  this.upAndLeftIsAttackable = function(layOut, position){
    pieceString = layOut[position + 7]
    pieceTeam = pieceString.substring(0,5)
    return pieceTeam === "black" && Board.classMethods.squareColor(position) === Board.classMethods.squareColor(position + 7)
  },
  this.upAndRightIsAttackable = function(layOut, position){
    pieceString = layOut[position + 9]
    pieceTeam = pieceString.substring(0,5)
    return pieceTeam === "black" && Board.classMethods.squareColor(position) === Board.classMethods.squareColor(position + 9)
  }
};
WhitePawnController.prototype = Object.create(PieceController.prototype);
WhitePawnController.prototype.constructor = WhitePawnController;


var BlackPawnController = function(){
  PieceController.apply(this, arguments);
  this.name = "whitePawn";
  this.value = 1
  this.directionalMovements = function(layOut, position){
    var movements = [];
    if( Board.classMethods.ranks.isSeventh(position) && this.twoSpacesDownIsEmpty(layOut, position) ){
      var newPossibility = this.movements.directional.verticalDown()
      newPossibility.rangeLimit = 2
      movements = movements.concat(newPossibility)
    };
    if( this.oneSpaceDownIsEmpty(layOut, position) ){
      var newPossibility = this.movements.directional.verticalDown()
      newPossibility.rangeLimit = 1
      movements = movements.concat(newPossibility)
    };
    if( this.downAndLeftIsAttackable(layOut, position) ){
      var newPossibility = this.movements.directional.forwardSlashDown()
      newPossibility.rangeLimit = 1
      movements = movements.concat(newPossibility)
    };
    if( this.downAndRightIsAttackable(layOut, position) ){
      var newPossibility = this.movements.directional.backSlashDown()
      newPossibility.rangeLimit = 1
      movements = movements.concat(newPossibility)
    };
    return movements
  },
  this.twoSpacesDownIsEmpty = function(layOut, position){
    return layOut[position - 16] === "empty"
  },
  this.oneSpaceDownIsEmpty = function(layOut, position){
    return layOut[position - 8] === "empty"
  },
  this.downAndLeftIsAttackable = function(layOut, position){
    pieceString = layOut[position - 9]
    pieceTeam = pieceString.substring(0,5)
    return pieceTeam === "white" && Board.classMethods.squareColor(position) === Board.classMethods.squareColor(position - 9)
  },
  this.downAndRightIsAttackable = function(layOut, position){
    pieceString = layOut[position - 7]
    pieceTeam = pieceString.substring(0,5)
    return pieceTeam === "white" && Board.classMethods.squareColor(position) === Board.classMethods.squareColor(position - 7)
  }
};
BlackPawnController.prototype = Object.create(PieceController.prototype);
BlackPawnController.prototype.constructor = BlackPawnController;