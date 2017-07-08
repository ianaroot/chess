copyPiece = function(piece, tiles){
  //THIS FUNCTION IS INSANELY DANGEROUS
  // AS IS REALLY ANYTHING USING EVAL. THOSE CANNOT BE PUBLIC LONG TERM.
  // args = JSON.stringify
  creatorFunc = eval( piece.name + "Creator" )
  return  creatorFunc( {position: piece.position, team: piece.team, tiles: tiles} )
}

// pass objects instead of lists as args
// write function to display possible paths, is good way to display data for error checking
var board = {
  tiles: [],
  boundaries: {
    upperLimit: 63,
    lowerLimit: 0
  },
  deepCopyTiles: function(){
    tiles = board.tiles
    tilesCopy = []
    for(i = 0; i < tiles.length; i++){
      if( tiles[i] !== undefined){
        piece = tiles[i]
        pieceCopy = copyPiece( piece, tilesCopy )
        tilesCopy[i] = pieceCopy
          }
      }
    return tilesCopy
  },
  positions: {
    isSeventhRank: function(position){
      return Math.floor(position / 8) === 6
    },
    isSecondRank: function(position){
      return Math.floor(position / 8) === 1
    }
  },  twoSpacesDownIsEmpty: function(position){
    return this.tiles[position - 16] === undefined
  },  twoSpacesUpIsEmpty: function(position){
    return Math.floor(position / 8) === 1
  },  oneSpaceDownIsEmpty: function(position){
    return this.tiles[position - 8] === undefined
  },  oneSpaceUpIsEmpty: function(position){
    return this.tiles[position + 8] === undefined
  },  stageRightBlackPawnAttackOccupied: function(position){
    return this.tiles[position - 7] !== undefined
  },  stageLeftBlackAttackOccupied: function(position){
    return this.tiles[position - 9] !== undefined
  },  stageLeftWhitePawnnAttackOccupied: function(position){
    return this.tiles[position + 7] !== undefined
  },  stageRightWhitePawnAttackOccupied: function(position){
    return board.tiles[position + 9] !== undefined
  },  inBounds: function(position){
    return position < this.boundaries.upperLimit && position > this.boundaries.lowerLimit
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

    for( i = 0; i < children.length; i ++){
      children[i].remove()
    }
  },
  positionIsOccupiedByTeamMate: function(position, team){
    return (this.tiles[position] !== undefined && this.tiles[position].team === team  )
  },
  deleteOldStuff: function(gridPosition, newGridPosition, piece){ 
      delete board.tiles[piece.position];
      this.undisplayPiece(gridPosition)
      this.undisplayPiece(gridPosition)
      this.undisplayPiece(newGridPosition);
  },
  placeNewStuff: function( piece, newPosition ){
    this.tiles[newPosition] = piece;
    piece.position = newPosition;
    this.displayPiece(piece);
  }
};
function setImgSrc (team, piece){
  var pieceInitial = piece.name[0].toUpperCase()
  if (piece.name === "whitePawn" || piece.name === "blackPawn"){ pieceInitial = "p" }
  if( team == white ){
    piece.imgSrc = "img/chesspieces/wikipedia/w" + pieceInitial + ".png"
  } else {
    piece.imgSrc = "img/chesspieces/wikipedia/b" + pieceInitial + ".png"
  }
};

var rules = {
  movementConstructors: {
    verticalUp: function(){
      return { increment: "+8",  boundaryCheck: "board.inBounds(increment * i + position)                                && board.inBounds(increment * i + position)"}
    },
    verticalDown: function(){
      return { increment: "-8",  boundaryCheck: "board.inBounds(increment * i + position)                                && board.inBounds(increment * i + position)"}
    },
    forwardSlashUp: function(){
      return { increment: "+9",  boundaryCheck: "(increment * i + position) % 8 > (position % 8)                         && board.inBounds(increment * i + position)"}
    },
    forwardSlashDown: function(){
      return { increment: "-9",  boundaryCheck: "(increment * i + position) % 8 < (position % 8)                         && board.inBounds(increment * i + position)"}
    },
    backSlashUp: function(){
      return { increment: "+7",  boundaryCheck: "(increment * i + position) % 8 < (position % 8)                         && board.inBounds(increment * i + position)"}
    },
    backSlashDown: function(){
      return { increment: "-7",  boundaryCheck: "(increment * i + position) % 8 > (position % 8)                         && board.inBounds(increment * i + position)"}
    },
    nightVerticalLeftUp: function(){
     return { increment: "+15", boundaryCheck: "Math.abs( (increment * i + position) % 8 - position % 8 ) === 1         && board.inBounds(increment * i + position)" }
   },
    nightVerticalRightUp: function(){
     return { increment: "+17", boundaryCheck: "Math.abs( (increment * i + position) % 8 - position % 8 ) === 1         && board.inBounds(increment * i + position)" }
   },
    nightHorizontalLeftUp: function(){
     return { increment: "+6",  boundaryCheck: "Math.abs( (increment * i + position) % 8 - position % 8 ) === 2         && board.inBounds(increment * i + position)" }
   },
    nightHorizontalRightUp: function(){
     return { increment: "+10", boundaryCheck: "Math.abs( (increment * i + position) % 8 - position % 8 ) === 2         && board.inBounds(increment * i + position)" }
   },
    nightVerticalLeftDown: function(){
     return { increment: "-15", boundaryCheck: "Math.abs( (increment * i + position) % 8 - position % 8 ) === 1         && board.inBounds(increment * i + position)" }
   },
    nightVerticalRightDown: function(){
     return { increment: "-17", boundaryCheck: "Math.abs( (increment * i + position) % 8 - position % 8 ) === 1         && board.inBounds(increment * i + position)" }
   },
    nightHorizontalLeftDown: function(){
     return { increment: "-6",  boundaryCheck: "Math.abs( (increment * i + position) % 8 - position % 8 ) === 2         && board.inBounds(increment * i + position)" }
   },
    nightHorizontalRightDown: function(){
     return { increment: "-10", boundaryCheck: "Math.abs( (increment * i + position) % 8 - position % 8 ) === 2         && board.inBounds(increment * i + position)" }
   },
    horizontalRight: function(){
     return { increment: "+1",  boundaryCheck: "Math.floor((increment * i + position) / 8) === Math.floor(position / 8) && board.inBounds(increment * i + position)" }
   },
    horizontalLeft: function(){
     return { increment: "-1",  boundaryCheck: "Math.floor((increment * i + position) / 8) === Math.floor(position / 8) && board.inBounds(increment * i + position)" }
   },
    sets: {
      night: function(){
        var moves = [rules.movementConstructors.nightHorizontalRightDown(), rules.movementConstructors.nightHorizontalLeftDown(), rules.movementConstructors.nightVerticalRightDown(),
                      rules.movementConstructors.nightVerticalLeftDown(), rules.movementConstructors.nightHorizontalRightUp(), rules.movementConstructors.nightHorizontalLeftUp(),
                      rules.movementConstructors.nightVerticalRightUp(), rules.movementConstructors.nightVerticalLeftUp()
                    ];
        for (var key in moves) {
          if (moves.hasOwnProperty(key)) {
            moves[key].rangeLimit = 1 ;
          };
        };
        return  moves
      },
      rook: function(){
        var moves = [rules.movementConstructors.horizontalRight(), rules.movementConstructors.horizontalLeft(), rules.movementConstructors.verticalUp(), rules.movementConstructors.verticalDown()]
        for (var key in moves) {
          if (moves.hasOwnProperty(key)) {
            moves[key].rangeLimit = 7 ;
          };
        };
        return moves
      },
      bishop: function(){
        var moves = [rules.movementConstructors.forwardSlashDown(), rules.movementConstructors.forwardSlashUp(), rules.movementConstructors.backSlashDown(), rules.movementConstructors.backSlashUp()]
        for (var key in moves) {
          if (moves.hasOwnProperty(key)) {
            moves[key].rangeLimit = 7 ;
          };
        };
        return moves
      },
      queen: function(){
        return rules.movementConstructors.sets.rook().concat( rules.movementConstructors.sets.bishop() )
      }
    }
    // pawns
    // king
  },

  allPathsFinder: function(piece){
    var possibleMoves = piece.possibleMoves(),
        paths = [],
        position = piece.position,
        team = piece.team;
    for(inc = 0; inc < possibleMoves.length; inc++){
      paths.push(rules.pathFinder(possibleMoves[inc], position, team))
      }
    return paths
  },

  pathFinder: function (move, position, team){
    var increment = move["increment"],
        boundaryCheck = move["boundaryCheck"],
        rangeLimit = move["rangeLimit"],
        path = [];
    for (i = 1; eval( boundaryCheck ) && i <= rangeLimit; i++){
      pathPosition = position + i * increment
      if( board.tiles[pathPosition] !== undefined && board.tiles[pathPosition].team === team ){ break; }
      path.push(pathPosition)
      }
    return path
  },

  positionIsInPaths: function(position, piece){
    var paths = rules.allPathsFinder(piece),
        positionViable = false;
    for( var i = 0; i < paths.length; i ++){
      var path = paths[i]
      for( var j = 0; j < path.length; j++){
        if( path[j] === position ){ positionViable = true }
      };
    };
    return positionViable
  },

  moveIsIllegal: function(piece, newPosition){
    illegal = false
    if ( !board.inBounds(newPosition) ){
      alert('stay on the board, fool')
      illegal = true
    } else if( !rules.positionIsInPaths(newPosition, piece) ){
      alert("that's not how that piece moves")
      illegal = true
    } else if( board.positionIsOccupiedByTeamMate(newPosition, piece.team ) ){
      alert("what, are you trying to capture your own piece?")
      illegal = true
    }
    return illegal
  },

  // kingIsInCheck

  move: function(position, newPosition){
    piece = board.tiles[position]
    if( piece.team !== game.allowedToMove ){
      alert("other team's turn")
      return
    }
  if( this.moveIsIllegal(piece, newPosition) ){
    return
    } else {

      var gridPosition    = board.gridCalculator(piece.position),
          newGridPosition = board.gridCalculator(newPosition);
      board.deleteOldStuff(gridPosition, newGridPosition, piece)
      board.placeNewStuff(piece, newPosition)
      if ( board.tiles[newPosition].team !== piece.team ){
        // capture(newPosition)
        // this is the only place that should be deleting the destination tile
        // it should also move the piece from active pieces into captured pieces
      }
      game.nextTurn()
    } 
  }
};

function setStartPosition(args) {
  var position = args["position"], 
      piece    = args["piece"],
      tiles    = args["tiles"];
  tiles[position] = piece
};

var nightCreator = (function (args){
  var team = args["team"],
      position = args["position"],
      tiles = args["tiles"],
      night = {
        name: "night",
        position: position,
        value: 3,
        team: team,
        possibleMoves: function(){
          return rules.movementConstructors.sets.night()
        },
        isTurn: false
      };
  setImgSrc(team, night)
  setStartPosition({position: position,piece: night, tiles: tiles})
  board.displayPiece(night)
  return night
});

var rookCreator = (function (args){
  var team = args["team"],
      position = args["position"],
      tiles = args["tiles"],
      rook = {
        name: "rook",
        position: position,
        value: 5,
        team: team,
        possibleMoves: function(){
          return rules.movementConstructors.sets.rook()
        },
        isTurn: false
      };
  setImgSrc(team, rook)
  setStartPosition({position: position,piece: rook, tiles: tiles})
  board.displayPiece(rook)
  return rook
});

var bishopCreator = (function (args){
  var team = args["team"],
      position = args["position"],
      tiles = args["tiles"],
      bishop = {
        name: "bishop",
        position: position,
        value: 3,
        team: team,
        possibleMoves: function(){
          return rules.movementConstructors.sets.bishop()
        },
        isTurn: false
      };
  setImgSrc(team, bishop)
  setStartPosition({position: position,piece: bishop, tiles: tiles})
  board.displayPiece(bishop)
  return bishop
});

var kingCreator = (function (args){
  var team = args["team"],
      position = args["position"],
      tiles = args["tiles"],
      king = {
        name: "king",
        position: position,
        value: 0,
        team: team,
        possibleMoves: function(){
          return "(Math.abs(cP - nP) === 1 && " + board.boundaries.horizontalBorderCheck + " ) || (Math.abs(cP - nP) === 7 && " + board.boundaries.diagonalBackSlashMovementBorderCheck + " ) || (Math.abs(cP - nP) === 8) || (Math.abs(cP - nP) === 9 && " + board.boundaries.diagonalForwardSlashMovementBorderCheck + " )"
        },
        isTurn: false
      };
  setImgSrc(team, king)
  setStartPosition({position: position,piece: king, tiles: tiles})
  board.displayPiece(king)
  return king
});

var queenCreator = (function (args){
  var team = args["team"],
      position = args["position"],
      tiles = args["tiles"],
      queen = {
        name: "queen",
        position: position,
        value: 9,
        team: team,
        possibleMoves: function(){
          return rules.movementConstructors.sets.queen()
        },
        isTurn: false
      };
  setImgSrc(team, queen)
  setStartPosition({position: position,piece: queen, tiles: tiles})
  board.displayPiece(queen)
  return queen
});

var whitePawnCreator = (function (args){
  var position = args["position"],
      tiles = args["tiles"],
      pawn = {
    name: "whitePawn",
    position: position,
    value: 1,
    team: white,
    possibleMoves: function(){
      var possibilities = [];
      if( board.positions.isSecondRank(this.position) && board.twoSpacesUpIsEmpty(this.position) ){
        var newPossibility = rules.movementConstructors.verticalUp()
        newPossibility.rangeLimit = 2
        possibilities = possibilities.concat(newPossibility)
      };
      if( board.oneSpaceUpIsEmpty(this.position) ){
        var newPossibility = rules.movementConstructors.verticalUp()
        newPossibility.rangeLimit = 1
        possibilities = possibilities.concat(newPossibility)
      };
      if( board.stageLeftWhitePawnnAttackOccupied(this.position) ){
        var newPossibility = rules.movementConstructors.backSlashUp()
        newPossibility.rangeLimit = 1
        possibilities = possibilities.concat(newPossibility)
      };
      if( board.stageRightWhitePawnAttackOccupied(this.position) ){
        var newPossibility = rules.movementConstructors.forwardSlashUp()
        newPossibility.rangeLimit = 1
        possibilities = possibilities.concat(newPossibility)
      };
      return possibilities
    },
    isTurn: false
  };
  setImgSrc(white, pawn)
  setStartPosition({position: position,piece: pawn, tiles: tiles})
  board.displayPiece(pawn)
  return pawn
});


var blackPawnCreator = (function (args){
  var position = args["position"],
      tiles = args["tiles"],
      pawn = {
    name: "blackPawn",
    position: position,
    value: 1,
    team: black,
    possibleMoves: function(){
      var possibilities = [];
      if( board.positions.isSeventhRank(this.position) && board.twoSpacesDownIsEmpty(this.position) ){
        var newPossibility = rules.movementConstructors.verticalDown()
        newPossibility.rangeLimit = 2
        possibilities = possibilities.concat(newPossibility)
      };

      if( board.oneSpaceDownIsEmpty(this.position) ){
        var newPossibility = rules.movementConstructors.verticalDown()
        newPossibility.rangeLimit = 1
        possibilities = possibilities.concat(newPossibility)
      };

      if( board.stageRightBlackPawnAttackOccupied(this.position) ){
        var newPossibility = rules.movementConstructors.backSlashDown()
        newPossibility.rangeLimit = 1
        possibilities = possibilities.concat(newPossibility)
      };

      if( board.stageLeftBlackAttackOccupied(this.position) ){
        var newPossibility = rules.movementConstructors.forwardSlashDown()
        newPossibility.rangeLimit = 1
        possibilities = possibilities.concat(newPossibility)
      };
      return possibilities
    },
    isTurn: false
  };
  setImgSrc(black, pawn)
  setStartPosition({position: position,piece: pawn, tiles: tiles})
  board.displayPiece(pawn)
  return pawn
});

var game = {
  createTeams: function(){
    window.white = {
      name: "white"
    };
    window.black = {
      name: "black",
    };
    
  },
  begin: function(){
    this.allowedToMove = white
  },
  addWhitePieces: function(){
    white.capturedPieces = []
    white.activePieces = {
      king: kingCreator({ position: 4, team: white, tiles: board.tiles} ),
      pawns: [
        whitePawnCreator({ position: 8, tiles: board.tiles}),
        whitePawnCreator({ position: 9, tiles: board.tiles}),
        whitePawnCreator({ position: 10, tiles: board.tiles}),
        whitePawnCreator({ position: 11, tiles: board.tiles}),
        whitePawnCreator({ position: 12, tiles: board.tiles}),
        whitePawnCreator({ position: 13, tiles: board.tiles}),
        whitePawnCreator({ position: 14, tiles: board.tiles}),
        whitePawnCreator({ position: 15, tiles: board.tiles})
      ],
      minors: [
        nightCreator( { position: 1, team: white, tiles: board.tiles}),
        bishopCreator({ position: 2, team: white, tiles: board.tiles}),
        bishopCreator({ position: 5, team: white, tiles: board.tiles}),
        nightCreator( { position: 6, team: white, tiles: board.tiles}),
      ],
      majors: [
        rookCreator( {position: 0, team: white, tiles: board.tiles}),
        queenCreator({position: 3, team: white, tiles: board.tiles}),
        rookCreator( {position: 7, team: white, tiles: board.tiles}),
      ]
    }
  },
  addBlackPieces: function(){
    black.capturedPieces = []
    black.activePieces = {
      king: kingCreator({position: 60, team: black, tiles: board.tiles}),
      pawns: [
        blackPawnCreator({position: 48, tiles: board.tiles}),
        blackPawnCreator({position: 49, tiles: board.tiles}),
        blackPawnCreator({position: 50, tiles: board.tiles}),
        blackPawnCreator({position: 51, tiles: board.tiles}),
        blackPawnCreator({position: 52, tiles: board.tiles}),
        blackPawnCreator({position: 53, tiles: board.tiles}),
        blackPawnCreator({position: 54, tiles: board.tiles}),
        blackPawnCreator({position: 55, tiles: board.tiles}),
      ],
      minors: [
        nightCreator(  {position: 57, team: black, tiles: board.tiles}),
        bishopCreator( {position: 58, team: black, tiles: board.tiles}),
        bishopCreator( {position: 61, team: black, tiles: board.tiles}),
        nightCreator(  {position: 62, team: black, tiles: board.tiles}),
      ],
      majors: [
        rookCreator(  {position: 56, team: black, tiles: board.tiles}),
        queenCreator( {position: 59, team: black, tiles: board.tiles}),
        rookCreator(  {position: 63, team: black, tiles: board.tiles})
      ]
    }
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
  prepareBlackTurn: function(){
    this.allowedToMove = black
  },
  prepareWhiteTurn: function(){
    this.allowedToMove = white
  },
  whiteMove: function(position, newPosition){
    rules.move(position, newPosition)
  },
  blackMove: function(position, newPosition){
    rules.move(position, newPosition)
  }
};



  // movementTypes: {
  //   isVertical: function(position, newPosition){
  //     return(position - newPosition) % 8 === 0
  //   },
  //   isDiagonalForwardSlash: function(position, newPosition){
  //     return (position - newPosition) % 9 === 0
  //   },
  //   isDiagonalBackSlash: function(position, newPosition){
  //     return (position - newPosition) % 7 === 0
  //   },
  //   isHorizontal: function(position, newPosition){
  //     return (position - newPosition) % 1 === 0
  //   }
  // },
  // movementIncrement: function(position, newPosition){
  //   var increment;
  //   if ( this.movementTypes.isVertical(position, newPosition) && position < newPosition ){
  //     increment = 8
  //   } else if ( this.movementTypes.isVertical(position, newPosition) && position > newPosition ){
  //     increment = -8
  //   }else if ( this.movementTypes.isDiagonalForwardSlash(position, newPosition) && position < newPosition ){
  //     increment = 9
  //   }else if ( this.movementTypes.isDiagonalForwardSlash(position, newPosition) && position > newPosition ){
  //     increment = -9
  //   }else if ( this.movementTypes.isDiagonalBackSlash(position, newPosition) && position < newPosition ){
  //     increment = 7
  //   }else if ( this.movementTypes.isDiagonalBackSlash(position, newPosition) && position > newPosition ){
  //     increment = -7
  //   }else if ( this.movementTypes.isHorizontal(position, newPosition) && position < newPosition){
  //     increment = 1
  //   }else if ( this.movementTypes.isHorizontal(position, newPosition) && position > newPosition){
  //     increment = -1
  //   }
  //   return increment
  // },


  // movements: {
  //   rangedDiagonalsForwardSlash:  "(((cP - nP) % 9 === 0) && " + board.boundaries.diagonalForwardSlashMovementBorderCheck + " )",
  //   rangedDiagonalsBackSlash:     "(((cP - nP) % 7 === 0) && " + board.boundaries.diagonalBackSlashMovementBorderCheck + " )",
  //   rangedVerticals:              "(cP - nP) % 8 === 0",
  //   rangedHorizontals:            "((cP - nP) < 8 && " + board.boundaries.horizontalBorderCheck + " )",
  //   nightMoves:                   "(Math.abs(cP - nP) === 15 && " + board.boundaries.verticalNightMovementBorderCheck + " ) || (Math.abs(cP - nP) === 17 && " + board.boundaries.verticalNightMovementBorderCheck + " ) || (Math.abs(cP - nP) === 10 && " + board.boundaries.horizontalNightMovementCheck + " ) || (Math.abs(cP - nP) === 6 && " + board.boundaries.horizontalNightMovementCheck + " )",
  //   // #segerJokes
  //   // THE DIAGONALS HERE ALL NEED BOUNDARY CHECKS!!
  //   blackPawnTwoStep:             "nP - cP === -16",
  //   blackPawnOneStep:             "nP - cP === -8",
  //   blackPawnCaptureStageRight:   "nP - cP === -7",
  //   blackPawnCaptureStageLeft:    "nP - cP === -9",
  //   whitePawnTwoStep:             "nP - cP === 16",
  //   whitePawnOneStep:             "nP - cP === 8",
  //   whitePawnCaptureStageLeft:    "nP - cP === 7",
  //   whitePawnCaptureStageRight:   "nP - cP === 9"
  // },


  // movementTypeVerifier: function(possibleMoves, currentPosition, newPosition){
  //   var possibleMoves = possibleMoves.replace(/cP/g, currentPosition),
  //     possibleMoves   = possibleMoves.replace(/nP/g, newPosition),
  //     acceptability   = eval(possibleMoves);
  //   return acceptability
  // },


// ▼ removed from board.boundaries
  // diagonalForwardSlashMovementBorderCheck:  "(( ((cP % 8) > (nP % 8)) && (cP > nP) ) || ( ((cP % 8) < (nP % 8) ) && (cP < nP) ))",
  // diagonalBackSlashMovementBorderCheck:     "( ((cP % 8) > (nP % 8)) && (cP < nP) ) || ( ((cP % 8) < (nP % 8) ) && (cP > nP) )",
  // horizontalBorderCheck:                    "Math.floor(cP / 8) === Math.floor(nP / 8)",
  // verticalNightMovementBorderCheck:         "(Math.abs(cP % 8 - nP % 8) === 1 )",
  // horizontalNightMovementCheck:             "(Math.abs(cP % 8 - nP % 8) === 2 )"


  // pathIsBlocked: function(position, newPosition){
  //   var movementIncrement = this.movementIncrement(position, newPosition),
  //       possibleBlocks    = [],
  //       blocked           = false;
  //   for( i = 1; ( i * movementIncrement + position) !== newPosition ; i++ ){
  //     possibleBlocks.push( i * movementIncrement + position )
  //   }
  //   for( i = 0; i < possibleBlocks.length; i++ ){
  //     if ( board.tiles[possibleBlocks[i]] !== undefined ){
  //       blocked = true
  //     }
  //   }
  //   return blocked
  // },

(function gameTest(){
  game.createTeams()
  game.addWhitePieces()
  game.addBlackPieces()
  game.begin()
  setTimeout( function(){ rules.move(1,  18) }, 500)
  setTimeout( function(){ rules.move(50, 42) }, 1000)
  setTimeout( function(){ rules.move(11, 27) }, 1500)
  setTimeout( function(){ rules.move(59, 32) }, 2000)
  setTimeout( function(){ rules.move(3,  19) }, 2500)
  setTimeout( function(){ rules.move(42, 34) }, 3000)
  setTimeout( function(){ rules.move(12, 20) }, 3500)
  setTimeout( function(){ rules.move(34, 27) }, 4000)
  setTimeout( function(){ rules.move(0,  1) },  4500)
  setTimeout( function(){ rules.move(27, 18) }, 5000)
  setTimeout( function(){ rules.move(9,  18) }, 5500)
  setTimeout( function(){ rules.move(51, 35)},  6000)
  setTimeout( function(){ rules.move(15, 23)},  6500)
  setTimeout( function(){ rules.move(58, 23)},  7000)
  setTimeout( function(){ rules.move(19, 33)},  7500)
})()