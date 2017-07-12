// implements borrowed chess js board
var board1 = ChessBoard('board1');



// PAWNCONTROLLERPROTOTYPE CALLS TO board.isEmpty(position)
  // twoSpacesDownIsEmpty: function(position){
  //   return this.tiles[position - 16] === undefined
  // },
  // twoSpacesUpIsEmpty: function(position){
  //   return Math.floor(position / 8) === 1
  // },
  // oneSpaceDownIsEmpty: function(position){
  //   return this.tiles[position - 8] === undefined
  // },
  // oneSpaceUpIsEmpty: function(position){
  //   return this.tiles[position + 8] === undefined
  // },
  // stageRightBlackPawnAttackOccupied: function(position){
  //   return this.tiles[position - 7] !== undefined
  // },
  // stageLeftBlackAttackOccupied: function(position){
  //   return this.tiles[position - 9] !== undefined
  // },
  // stageLeftWhitePawnnAttackOccupied: function(position){
  //   return this.tiles[position + 7] !== undefined
  // },
  // stageRightWhitePawnAttackOccupied: function(position){
  //   return this.tiles[position + 9] !== undefined
  // },



queenController = {
  boo: "hiss"
}
// function setImgSrc (team, piece){
//   var pieceInitial = piece.name[0].toUpperCase()
//   if (piece.name === "whitePawn" || piece.name === "blackPawn"){ pieceInitial = "p" }
//   if( team == white ){
//     piece.imgSrc = "img/chesspieces/wikipedia/w" + pieceInitial + ".png"
//   } else {
//     piece.imgSrc = "img/chesspieces/wikipedia/b" + pieceInitial + ".png"
//   }
// };


  // deleteOldStuff: function(gridPosition, newGridPosition, piece){ 
  //     delete board.tiles[piece.position];
  //     this.undisplayPiece(gridPosition)
  //     this.undisplayPiece(gridPosition)
  //     this.undisplayPiece(newGridPosition);
  // },
  // placeNewStuff: function( piece, newPosition ){
  //   this.tiles[newPosition] = piece;
  //   piece.position = newPosition;
  //   this.displayPiece(piece);
  // }

var View = (function(){
  var instance = {
    displayPiece: function(piece){
      var elem = document.createElement("img"),
        gridPosition = this.gridCalculator(piece.position);
      elem.setAttribute("src", piece.imgSrc);
      elem.setAttribute("height", "49");
      elem.setAttribute("width", "49");
      document.getElementsByClassName( gridPosition )[0].appendChild(elem)
    },
    undisplayPiece: function(gridPosition){
      var element = document.getElementsByClassName( gridPosition )[0],
        children  = element.children;

      for( var i = 0; i < children.length; i ++){
        children[i].remove()
      }
    },
    displayBoard: function(layOut){
      for( var i = 0; i < layOut.length; i++){
        if( layOut[i] !== "empty" ){
          var elem = document.createElement("img"),
              gridPosition = Board.classMethods.gridCalculator(i),
              pieceInitials = this.pieceInitials(layOut[i]);
          elem.setAttribute("src", this.pieceImgSrc( pieceInitials ) );
          elem.setAttribute("height", "49");
          elem.setAttribute("width", "49");
          document.getElementsByClassName( gridPosition )[0].appendChild(elem)
        }
      }
    },
    pieceImgSrc: function(pieceInitials){
      return "img/chesspieces/wikipedia/" + pieceInitials + ".png"
    },
    pieceInitials: function(string){
      var firstInitial = string[0],
        secondInitial;
      for (i = 0; i < string.length; i++){
        if( string[i] === string[i].toUpperCase() ){ secondInitial = string[i] }
      };
      return firstInitial + secondInitial
    }
  };

  function createInstance() {
      var object = new Object("I am the instance");
      return object;
  }
  return {
      getInstance: function() {
          if (!instance) {
              instance = createInstance();
          }
          return instance;
      },
  };
})();


// pass objects instead of lists as args
// write function to display possible paths, is good way to display data for error checking



function Board(options){
  var layOut;
  if( options && options["layOut"]){ layOut = options["layOut"] }else{ layOut = [] };
  var capturedPieces;
  if( options && options["capturedPieces"]){ capturedPieces = options["capturedPieces"] }else{ capturedPieces = [] };
  this.layOut = layOut
  this.capturedPieces = capturedPieces;
  this.blackInCheck;
  this.whiteInCheck;
  // return classMethods
};
Board.classMethods = {
  ranks: {
    isSeventh: function(position){
      return Math.floor(position / 8) === 6
    },
    isSecond: function(position){
      return Math.floor(position / 8) === 1
    }
  },
  squareColor: function(position){
    var div = position / 8,
      mod   = position % 8,
      sum   = div + mod,
      squareColor;
    if (sum % 2 === 0){
      squareColor = "dark"
    } else {
      squareColor = "light"
    }
    return squareColor;
  },
  gridCalculator: function(tile){
    var x = Math.floor(tile % 8),
        y = Math.floor(tile / 8) + 1,
      alphaNum = {
        0: "a",
        1: "b",
        2: "c",
        3: "d",
        4: "e",
        5: "f",
        6: "g",
        7: "h"
      },
      x = alphaNum[x];
    return "square-" + x + y
  },
  boundaries: {
    upperLimit: 63,
    lowerLimit: 0
  },
    inBounds: function(position){
    return position < this.boundaries.upperLimit && position > this.boundaries.lowerLimit
  }
}
Board.prototype = {

  occupancy: {
    twoSpacesUp: function(position){
      return this.tileSet[position]  !== "empty"
    }
  },


// positionIsOccupied
// positionIsoccupiedByOpponent
// occupant
  positionIsOccupiedByTeamMate: function(position, team){
    return (this.tiles[position] !== undefined && this.tiles[position].team === team  )
  },

  // isAttacked: function( args ){
  //   var position      = args["position"],
  //       team          = args["team"],
  //       danger        = false,
  //       opposingTeam;
  //   if( team === white ){
  //     opposingTeam = black
  //   } else {
  //     opposingTeam = white
  //   };
  //   var activeOpposingTeamPieces = opposingTeam.activePieces;
  //   for (var i = 0; i < activeOpposingTeamPieces.length; i++){
  //     if( isAttackedBy({piece: activeOpposingTeamPieces[i], position: position}) ){ danger = true }
  //   }
  // },
  isAttackedByRnbq: function(args){
    // will give false positives on pawns attacking empty positions
    var piece     = args["piece"],
        position = args["position"];
    return rules.positionIsInPaths({position: position, piece: piece})
  },
  isAttackedByPawn: function(args){
    // will give fals positives on whether pawns can attack space if it's not yet occupied[]
    var pawn             = args["piece"],
        attackingPosition = pawn.position
        defendingPosition = args["position"],
        possibleMoves = pawn.possibleMoves(),
        attacked = false;
    for( var i = 0; i < possibleMoves.length; i++){
      var increment     = possibleMoves[i]["increment"],
        boundaryCheck = possibleMoves[i]["boundaryCheck"].replace(/\* i/g, "").replace(/position/, "attackingPosition");
      // could factor out the logic below and throw in a nifty object key or function name like "pawnAttacks" that's a horrible name, sit on it a while
      // debugger
      if( attackingPosition + increment === defendingPosition && boundaryCheck && (Math.abs(increment) === 7 || Math.abs(increment) === 9)){
        attacked = true;
      }
      return attacked
    }
  },
  isAttackedByKing: function(args){
    var piece     = args["piece"],
        position = args["position"];
  }
}

var Rules = (function () {
  var instance = {
    moveIsIllegal: function(position, newPosition, board){
      pieceString = board[position]
      stringLength = pieceString.length
      pieceType = pieceString.substring(5, stringLength)
      if( pieceType === "Pawn" ){ pieceType = pieceString.charAt(0).toUpperCase() + pieceString.slice(1) }
      pieceController = new window[ pieceType + "Controller"]()
    // debugger
      // PieceController = 
      // could take in a tileset and chess notation!??!  using a reverse gridCalculator
      illegal = false
      if ( !Board.classMethods.inBounds(newPosition) ){
        alert('stay on the board, fool')
        illegal = true
      } else if( !pieceController.positionIsInPaths({position: position, newPosition: newPosition, board: board}) ){
        alert("that's not how that piece moves")
        illegal = true
      } else if( board.positionIsOccupiedByTeamMate(newPosition, piece.team ) ){
        alert("what, are you trying to capture your own piece?")
        illegal = true
      } //else if( this.kingCheck( {piece: piece, position: newPosition})){
      //   alert("check yo")
      //   illegal = true
      // }
      return illegal
    },
    kingCheck: function(args){
      var position          = args["position"],
          piece             = args["piece"]
          pieceCopy         = args["piece"],
          team              = pieceCopy.team,
          activeTeamPieces  = team.activePieces,
          king              = activeTeamPieces.king,
          tilesCopy         = board.deepCopyTiles,
          danger            = false,
          opposingTeam;
      if( team === white ){
        opposingTeam = black
      } else {
        opposingTeam = white
      };
      var activeOpposingTeamPieces = opposingTeam.activePieces;
      for (var i = 0; i < activeOpposingTeamPieces.length; i++){
        if( isAttackedBy({piece: activeOpposingTeamPieces[i], position: kingPosition}) ){ danger = true }
      }
          // danger            = board.isAttacked({position: position, piece: pieceCopy, tiles: tilesCopy});
      return danger
  // pretend king has all movement abilities. stretch outward with them until hittting block, see if that block has the ability that was used to get to the king,
  // maybe iterate across movements testing each individualy
    },
    // castling  these can both refer to the previous board states to answer the question, so knowing about board states doesn't become a pieces job
    // en passant  these can both refer to the previous board states to answer the question, so knowing about board states doesn't become a pieces job 
    // stalemate
  }

  function createInstance() {
      var object = new Object("I am the instance");
      return object;
  }
  return {
      getInstance: function() {
          if (!instance) {
              instance = createInstance();
          }
          return instance;
      },
  };
})();



var GameController = (function(){
  var instance = {
    view: View.getInstance(),
    rules: Rules.getInstance(),
    currentBoard: new Board({layOut: ["whiteRook", "whiteNight", "whiteBishop", "whiteQueen", "whiteKing", "whiteBishop", "whiteNight", "whiteRook",
                             "whitePawn", "whitePawn", "whitePawn", "whitePawn", "whitePawn", "whitePawn", "whitePawn", "whitePawn", 
                             "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", 
                             "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", 
                             "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", 
                             "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty",
                             "blackPawn", "blackPawn", "blackPawn", "blackPawn", "blackPawn", "blackPawn", "blackPawn", "blackPawn",  
                             "blackRook", "blackNight", "blackBishop", "blackQueen", "blackKing", "blackBishop", "blackNight", "blackRook",
    ]}),
    move: function(position, newPosition){
      // debugger
      currentBoard = this.currentBoard
      layOut = currentBoard.layOut
      pieceString = layOut[position]
      var team = pieceString.substring(0,5)
      // debugger
      if( team !== this.allowedToMove ){
        alert("other team's turn")
        return
      }
      if( this.rules.moveIsIllegal(position, newPosition, this.currentBoard.layOut) ){
        return
      } else {

        // var gridPosition    = board.gridCalculator(piece.position),
        //     newGridPosition = board.gridCalculator(newPosition);


// REFACTOR MEEEEEEEEE
        var pieceString = this.currentBoard.layOut[position];
        this.currentBoard.layOut[position] = "empty"
        capturedPiece = this.currentBoard.layOut[newPosition]
        this.currentBoard.layOut[newPosition] = pieceString
        this.view.displayBoard(this.currentBoard.layOut)
        // this.view.deleteOldStuff(gridPosition, newGridPosition, piece)
        // board.placeNewStuff(piece, newPosition)

        if ( board.tiles[newPosition].team !== piece.team ){
          // capture(newPosition)
          // this is the only place that should be deleting the destination tile
          // it should also move the piece from active pieces into captured pieces
        }
        game.nextTurn()
      } 
    },
    simulate: function (){
      var gC = this

      gC.createTeams()
      gC.view.displayBoard(gC.currentBoard.layOut)
      gC.begin()
      setTimeout( function(){ gC.move(1,  18) }, 500)
      // setTimeout( function(){ gC.move(50, 42) }, 1000)
      // setTimeout( function(){ gC.move(11, 27) }, 1500)
      // setTimeout( function(){ gC.move(59, 32) }, 2000)
      // setTimeout( function(){ gC.move(3,  19) }, 2500)
      // setTimeout( function(){ gC.move(42, 34) }, 3000)
      // setTimeout( function(){ gC.move(12, 20) }, 3500)
      // setTimeout( function(){ gC.move(34, 27) }, 4000)
      // setTimeout( function(){ gC.move(0,  1) },  4500)
      // setTimeout( function(){ gC.move(27, 18) }, 5000)
      // setTimeout( function(){ gC.move(9,  18) }, 5500)
      // setTimeout( function(){ gC.move(51, 35)},  6000)
      // setTimeout( function(){ gC.move(15, 23)},  6500)
      // setTimeout( function(){ gC.move(58, 23)},  7000)
      // setTimeout( function(){ gC.move(19, 33)},  7500)
    },
    testing: function(){
      game.createTeams()
      game.addWhitePieces()
      game.addBlackPieces()
      game.begin()
      setTimeout( function(){ rules.move(1,  18) }, 500)
    },
    createTeams: function(){
      window.white = {
        name: "white"
      };
      window.black = {
        name: "black",
      };
      
    },
    begin: function(){
      this.allowedToMove = "white"
      this.view.displayBoard
    },
    turn: function(turnNum){
      var turnNum = turnNum || 1
      if( turnNum % 2 === 0  ){
        this.allowedToMove = black
      } else{
        this.allowedToMove = white
      }
    },
    nextTurn: function(){
      if( this.allowedToMove === "white" ){
        this.prepareBlackTurn()
      } else{
        this.prepareWhiteTurn()
      }
    },
    prepareBlackTurn: function(){
      this.allowedToMove = "black"
    },
    prepareWhiteTurn: function(){
      this.allowedToMove = "white"
    },
    whiteMove: function(position, newPosition){
      rules.move(position, newPosition)
    },
    blackMove: function(position, newPosition){
      rules.move(position, newPosition)
    },
    turn: function(turnNum){
      var turnNum = turnNum || 1
      if( turnNum % 2 === 0  ){
        this.allowedToMove = black
      } else{
        this.allowedToMove = white
      }
    },
    nextTurn: function(){
      if( this.allowedToMove === white ){
        this.prepareBlackTurn()
      } else{
        this.prepareWhiteTurn()
      }
    },
  }

  function createInstance() {
    var object  = new Object("yo soy el instancio")
    return object;
  };
  return{
    getInstance: function(){
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    }
  };
}());


//   prepareBlackTurn: function(){
//     this.allowedToMove = black
//   },
//   prepareWhiteTurn: function(){
//     this.allowedToMove = white
//   },
//   whiteMove: function(position, newPosition){
//     rules.move(position, newPosition)
//   },
//   blackMove: function(position, newPosition){
//     rules.move(position, newPosition)
//   }
// };

var PieceController = function(){
  if (this.constructor === PieceController) {
    throw new Error("Can't instantiate abstract class!");
  }
  // PieceController initialization...
};
PieceController.prototype = {
  positionIsViable: function(args){
    var layOut = args["layOut"],
        startPosition = args["startPosition"],
        endPosition = args["endPosition"],
        movementType = this.movementTypeFinder(startPosition, endPosition),
        ;
  },
  wrapAroundCheat: function(movementType, startSquareColor, range){
    switch(movementType){
      case this.backSlashDown
      case this.backSlashUp
      case this.forwardSlashUp
      case this.forwardSlashDown
      case this.nightVerticalLeftUp
      case 

      case this.verticalUp
      case this.verticalDown
      case this.horizontalLeft
      case this.horizontalRight
    }
  },
  movementDirectionFinder: function(startPosition, endPosition){
    var movementDirection,
        queries = this.movements.vagueQueries;
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
    }
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
      return Board.Ranks.isSecond(position)
    },
    isSeventh: function(position){
      return Board.Ranks.isSeventh(position)
    }
  },
  occupancy: {
    twoSpacesUp: function(options){
      var board = options["board"],
        position = options["position"];
      return board.occupancy.twoSpacesUp(position)
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
        var moves = [this.allMovements.nightHorizontalRightDown(), this.allMovements.nightHorizontalLeftDown(), this.allMovements.nightVerticalRightDown(),
                      this.allMovements.nightVerticalLeftDown(), this.allMovements.nightHorizontalRightUp(), this.allMovements.nightHorizontalLeftUp(),
                      this.allMovements.nightVerticalRightUp(), this.allMovements.nightVerticalLeftUp()
                    ];
        for (var key in moves) {
          if (moves.hasOwnProperty(key)) {
            moves[key].rangeLimit = 1 ;
          };
        };
        return  moves
      },
      rook: function(){
        var moves = [this.allMovements.horizontalRight(), this.allMovements.horizontalLeft(), this.allMovements.verticalUp(), this.allMovements.verticalDown()]
        for (var key in moves) {
          if (moves.hasOwnProperty(key)) {
            moves[key].rangeLimit = 7 ;
          };
        };
        return moves
      },
      bishop: function(){
        var moves = [this.allMovements.forwardSlashDown(), this.allMovements.forwardSlashUp(), this.allMovements.backSlashDown(), this.allMovements.backSlashUp()]
        for (var key in moves) {
          if (moves.hasOwnProperty(key)) {
            moves[key].rangeLimit = 7 ;
          };
        };
        return moves
      },
      queen: function(){
        return this.allMovements.sets.rook().concat( this.allMovements.sets.bishop() )
      },
      king: function(){
        var moves = [this.allMovements.horizontalRight(), this.allMovements.horizontalLeft(), this.allMovements.verticalUp(), this.allMovements.verticalDown(),
        this.allMovements.forwardSlashDown(), this.allMovements.forwardSlashUp(), this.allMovements.backSlashDown(), this.allMovements.backSlashUp()
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
          forwardSlashUp: this.allMovements.forwardSlashUp(), backSlashUp: this.allMovements.backSlashUp(), verticalUp: this.allMovements.verticalUp(), verticalUpTwoStep: this.allMovements.verticalUp()
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
        return startPosition / 8 === endPosition / 8
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
      // DANGER
      // team = piece.team;
    for(inc = 0; inc < this.viableMovements.length; inc++){
      paths.push(this.pathFinder(this.viableMovements[inc], position, team))
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
    var newMoves = this.allMovements.sets.night
    PieceController.apply(this, arguments);
    this.viableMovements = newMoves
    this.value = 3
    this.srcImgWhite = "img/chesspieces/wikipedia/wN.png"
    this.srcImgBlack = "img/chesspieces/wikipedia/bN.png"
    this.name = "night"

};
NightController.prototype = Object.create(PieceController.prototype);
NightController.prototype.constructor = NightController;

var RookController = function() {
    var newMoves = this.allMovements.sets.rook
    PieceController.apply(this, arguments);
    this.viableMovements = newMoves
    this.value = 3
    this.srcImgWhite = "img/chesspieces/wikipedia/wR.png"
    this.srcImgBlack = "img/chesspieces/wikipedia/bR.png"
    this.name = "rook"

};
RookController.prototype = Object.create(PieceController.prototype);
RookController.prototype.constructor = RookController;

var BishopController = function() {
    var newMoves = this.allMovements.sets.bishop
    PieceController.apply(this, arguments);
    this.viableMovements = newMoves
    this.value = 3
    this.srcImgWhite = "img/chesspieces/wikipedia/wB.png"
    this.srcImgBlack = "img/chesspieces/wikipedia/bB.png"
    this.name = "bishop"

};
BishopController.prototype = Object.create(PieceController.prototype);
BishopController.prototype.constructor = BishopController;


var KingController = function() {
    var newMoves = this.allMovements.sets.king
    PieceController.apply(this, arguments);
    this.viableMovements = newMoves
    this.value = 3
    this.srcImgWhite = "img/chesspieces/wikipedia/wK.png"
    this.srcImgBlack = "img/chesspieces/wikipedia/bK.png"
    this.name = "king"

};
KingController.prototype = Object.create(PieceController.prototype);
KingController.prototype.constructor = KingController;


var QueenController = function() {
    var newMoves = this.allMovements.sets.queen
    PieceController.apply(this, arguments);
    this.viableMovements = newMoves
    this.value = 3
    this.srcImgWhite = "img/chesspieces/wikipedia/wQ.png"
    this.srcImgBlack = "img/chesspieces/wikipedia/bQ.png"
    this.name = "queen"

};
QueenController.prototype = Object.create(PieceController.prototype);
QueenController.prototype.constructor = QueenController;


var whitePawncontroler = function(){
  PieceController.apply(this, arguments);
  this.name = "whitePawn";
  this.value = 1
  this.viableMovements = function(board, position){
    var movements = [];
    if( this.ranks.isSeventh(position) && this.occupancy.twoSpacesUp( {board: board, position: position} ) ){
      var newPossibility = this.possibleMoves.verticalUp()
      movements = movements.concat(newPossibility)
    };
    if( board.occupancy.oneSpaceUpIsEmpty({board: board, position: position}) ){
      var newPossibility = this.possibleMoves.verticalUp()
      movements = movements.concat(newPossibility)
    };
    if( board.occupancy.upAndLeft(this.position) ){
      var newPossibility = this.possibleMoves.backSlashUp()
      movements = movements.concat(newPossibility)
    };
    if( board.occupancy.upAndRigth(this.position) ){
      var newPossibility = this.possibleMoves.forwardSlashUp()
      movements = movements.concat(newPossibility)
    };
    return movements
  }
};


// var blackPawncontroler = (function (args){
//   var position = args["position"],
//       tiles = args["tiles"],
//       pawn = {
//     name: "blackPawn",
//     position: position,
//     value: 1,
//     team: black,
//     possibleMoves: function(){
//       var possibilities = [];
//       if( board.positions.isSeventhRank(this.position) && board.twoSpacesDownIsEmpty(this.position) ){
//         var newPossibility = rules.movementConstructors.verticalDown()
//         newPossibility.rangeLimit = 2
//         possibilities = possibilities.concat(newPossibility)
//       };

//       if( board.oneSpaceDownIsEmpty(this.position) ){
//         var newPossibility = rules.movementConstructors.verticalDown()
//         newPossibility.rangeLimit = 1
//         possibilities = possibilities.concat(newPossibility)
//       };

//       if( board.stageRightBlackPawnAttackOccupied(this.position) ){
//         var newPossibility = rules.movementConstructors.backSlashDown()
//         newPossibility.rangeLimit = 1
//         possibilities = possibilities.concat(newPossibility)
//       };

//       if( board.stageLeftBlackAttackOccupied(this.position) ){
//         var newPossibility = rules.movementConstructors.forwardSlashDown()
//         newPossibility.rangeLimit = 1
//         possibilities = possibilities.concat(newPossibility)
//       };
//       return possibilities
//     },
//     isTurn: false
//   };
//   setImgSrc(black, pawn)
//   setStartPosition({position: position,piece: pawn, tiles: tiles})
//   board.displayPiece(pawn)
//   return pawn
// });


//   // viableMovements: {
//   //   isVertical: function(position, newPosition){
//   //     return(position - newPosition) % 8 === 0
//   //   },
//   //   isDiagonalForwardSlash: function(position, newPosition){
//   //     return (position - newPosition) % 9 === 0
//   //   },
//   //   isDiagonalBackSlash: function(position, newPosition){
//   //     return (position - newPosition) % 7 === 0
//   //   },
//   //   isHorizontal: function(position, newPosition){
//   //     return (position - newPosition) % 1 === 0
//   //   }
//   // },
//   // movementIncrement: function(position, newPosition){
//   //   var increment;
//   //   if ( this.viableMovements.isVertical(position, newPosition) && position < newPosition ){
//   //     increment = 8
//   //   } else if ( this.viableMovements.isVertical(position, newPosition) && position > newPosition ){
//   //     increment = -8
//   //   }else if ( this.viableMovements.isDiagonalForwardSlash(position, newPosition) && position < newPosition ){
//   //     increment = 9
//   //   }else if ( this.viableMovements.isDiagonalForwardSlash(position, newPosition) && position > newPosition ){
//   //     increment = -9
//   //   }else if ( this.viableMovements.isDiagonalBackSlash(position, newPosition) && position < newPosition ){
//   //     increment = 7
//   //   }else if ( this.viableMovements.isDiagonalBackSlash(position, newPosition) && position > newPosition ){
//   //     increment = -7
//   //   }else if ( this.viableMovements.isHorizontal(position, newPosition) && position < newPosition){
//   //     increment = 1
//   //   }else if ( this.viableMovements.isHorizontal(position, newPosition) && position > newPosition){
//   //     increment = -1
//   //   }
//   //   return increment
//   // },


//   // movements: {
//   //   rangedDiagonalsForwardSlash:  "(((cP - nP) % 9 === 0) && " + board.boundaries.diagonalForwardSlashMovementBorderCheck + " )",
//   //   rangedDiagonalsBackSlash:     "(((cP - nP) % 7 === 0) && " + board.boundaries.diagonalBackSlashMovementBorderCheck + " )",
//   //   rangedVerticals:              "(cP - nP) % 8 === 0",
//   //   rangedHorizontals:            "((cP - nP) < 8 && " + board.boundaries.horizontalBorderCheck + " )",
//   //   nightMoves:                   "(Math.abs(cP - nP) === 15 && " + board.boundaries.verticalNightMovementBorderCheck + " ) || (Math.abs(cP - nP) === 17 && " + board.boundaries.verticalNightMovementBorderCheck + " ) || (Math.abs(cP - nP) === 10 && " + board.boundaries.horizontalNightMovementCheck + " ) || (Math.abs(cP - nP) === 6 && " + board.boundaries.horizontalNightMovementCheck + " )",
//   //   // #segerJokes
//   //   // THE DIAGONALS HERE ALL NEED BOUNDARY CHECKS!!
//   //   blackPawnTwoStep:             "nP - cP === -16",
//   //   blackPawnOneStep:             "nP - cP === -8",
//   //   blackPawnCaptureStageRight:   "nP - cP === -7",
//   //   blackPawnCaptureStageLeft:    "nP - cP === -9",
//   //   whitePawnTwoStep:             "nP - cP === 16",
//   //   whitePawnOneStep:             "nP - cP === 8",
//   //   whitePawnCaptureStageLeft:    "nP - cP === 7",
//   //   whitePawnCaptureStageRight:   "nP - cP === 9"
//   // },


//   // movementTypeVerifier: function(possibleMoves, currentPosition, newPosition){
//   //   var possibleMoves = possibleMoves.replace(/cP/g, currentPosition),
//   //     possibleMoves   = possibleMoves.replace(/nP/g, newPosition),
//   //     acceptability   = eval(possibleMoves);
//   //   return acceptability
//   // },


// // ▼ removed from board.boundaries
//   // diagonalForwardSlashMovementBorderCheck:  "(( ((cP % 8) > (nP % 8)) && (cP > nP) ) || ( ((cP % 8) < (nP % 8) ) && (cP < nP) ))",
//   // diagonalBackSlashMovementBorderCheck:     "( ((cP % 8) > (nP % 8)) && (cP < nP) ) || ( ((cP % 8) < (nP % 8) ) && (cP > nP) )",
//   // horizontalBorderCheck:                    "Math.floor(cP / 8) === Math.floor(nP / 8)",
//   // verticalNightMovementBorderCheck:         "(Math.abs(cP % 8 - nP % 8) === 1 )",
//   // horizontalNightMovementCheck:             "(Math.abs(cP % 8 - nP % 8) === 2 )"


//   // pathIsBlocked: function(position, newPosition){
//   //   var movementIncrement = this.movementIncrement(position, newPosition),
//   //       possibleBlocks    = [],
//   //       blocked           = false;
//   //   for( i = 1; ( i * movementIncrement + position) !== newPosition ; i++ ){
//   //     possibleBlocks.push( i * movementIncrement + position )
//   //   }
//   //   for( var i = 0; i < possibleBlocks.length; i++ ){
//   //     if ( board.tiles[possibleBlocks[i]] !== undefined ){
//   //       blocked = true
//   //     }
//   //   }
//   //   return blocked
//   // },
