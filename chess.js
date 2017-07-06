var board = {
  tiles: [],
  boundaries: {
    upperLimit: 63,
    lowerLimit: 0,
    diagonalForwardSlashMovementBorderCheck: "(( ((cP % 8) > (nP % 8)) && (cP > nP) ) || ( ((cP % 8) < (nP % 8) ) && (cP < nP) ))",
    diagonalBackSlashMovementBorderCheck: "( ((cP % 8) > (nP % 8)) && (cP < nP) ) || ( ((cP % 8) < (nP % 8) ) && (cP > nP) )",
    horizontalBorderCheck: "Math.floor(cP / 8) === Math.floor(nP / 8)",
    verticalNightMovementBorderCheck: "(Math.abs(cP % 8 - nP % 8) === 1 )",
    horizontalNightMovementCheck: "(Math.abs(cP % 8 - nP % 8) === 2 )"
  },

  positions: {
    isSeventhRank: function(position){
      return Math.floor(position / 8) === 6
    },
    isSecondRank: function(position){
      return Math.floor(position / 8) === 1
    }
  },

  twoSpacesDownIsEmpty: function(position){
    return this.tiles[position - 16] === undefined
  },

  twoSpacesUpIsEmpty: function(position){
    return Math.floor(position / 8) === 1
  },

  oneSpaceDownIsEmpty: function(position){
    return this.tiles[position - 8] === undefined
  },

  oneSpaceUpIsEmpty: function(position){
    return this.tiles[position + 8] === undefined
  },

  stageRightBlackPawnAttackOccupied: function(position){
    return this.tiles[position - 7] !== undefined
  },

  stageLeftBlackAttackOccupied: function(position){
    return this.tiles[position - 9] !== undefined
  },

  stageLeftWhitePawnnAttackOccupied: function(position){
    return this.tiles[position + 7] !== undefined
  },

  stageRightWhitePawnAttackOccupied: function(position){
    return board.tiles[position + 9] !== undefined
  },

  outOfbounds: function(position){
    position > this.boundaries.upperLimit || position < this.boundaries.lowerLimit
  },

  gridCalculator: function(tile){
    var x = Math.floor(tile % 8)
    var y = Math.floor(tile / 8) + 1
    var alphaNum = {
      0: "a",
      1: "b",
      2: "c",
      3: "d",
      4: "e",
      5: "f",
      6: "g",
      7: "h"
    } 

    var x = alphaNum[x]
    return "square-" + x + y
  },

  displayPiece: function(piece){
    var elem = document.createElement("img"),
      gridPosition = this.gridCalculator(piece.position);

    elem.setAttribute("src", piece.imgSrc);
    elem.setAttribute("height", "49");
    elem.setAttribute("width", "49");
    // console.log(gridPosition)
    document.getElementsByClassName( gridPosition )[0].appendChild(elem)
  },

  undisplayPiece: function(gridPosition){
    var element = document.getElementsByClassName( gridPosition )[0],
      children = element.children;
    for( i = 0; i < children.length; i ++){
      children[i].remove()
    }
  },

  pathIsBlocked: function(position, newPosition){
    var movementIncrement = this.movementIncrement(position, newPosition),
      possibleBlocks = [],
      blocked = false;
    for( i = 1; ( i * movementIncrement + position) !== newPosition ; i++ ){
      possibleBlocks.push( i * movementIncrement + position )
    }
    // console.log(possibleBlocks)
    for( i = 0; i < possibleBlocks.length; i++ ){
      if ( board.tiles[possibleBlocks[i]] !== undefined ){
        blocked = true
      }
    }
    // console.log("blocked is " + blocked)
    return blocked
  },

  positionIsOccupiedByTeamMate: function(position, team){
    return (this.tiles[position] !== undefined && this.tiles[position].team === team  )
  },

  movementTypes: {
    isVertical: function(position, newPosition){
      return(position - newPosition) % 8 === 0
    },
    isDiagonalForwardSlash: function(position, newPosition){
      return (position - newPosition) % 9 === 0
    },
    isDiagonalBackSlash: function(position, newPosition){
      return (position - newPosition) % 7 === 0
    },
    isHorizontal: function(position, newPosition){
      return (position - newPosition) % 1 === 0
    }
  },

  movementIncrement: function(position, newPosition){
    var increment;
    if ( this.movementTypes.isVertical(position, newPosition) && position < newPosition ){
      increment = 8
    } else if ( this.movementTypes.isVertical(position, newPosition) && position > newPosition ){
      increment = -8
    }else if ( this.movementTypes.isDiagonalForwardSlash(position, newPosition) && position < newPosition ){
      increment = 9
    }else if ( this.movementTypes.isDiagonalForwardSlash(position, newPosition) && position > newPosition ){
      increment = -9
    }else if ( this.movementTypes.isDiagonalBackSlash(position, newPosition) && position < newPosition ){
      increment = 7
    }else if ( this.movementTypes.isDiagonalBackSlash(position, newPosition) && position > newPosition ){
      increment = -7
    }else if ( this.movementTypes.isHorizontal(position, newPosition) && position < newPosition){
      increment = 1
    }else if ( this.movementTypes.isHorizontal(position, newPosition) && position > newPosition){
      increment = -1
    }
    // console.log("increment is " + increment)
    return increment
  },

  deleteOldStuff: function(gridPosition, newGridPosition, piece){ 
      delete board.tiles[piece.position];
      this.undisplayPiece(gridPosition)
      this.undisplayPiece(gridPosition)
      // probably elsewhere, but track captures, maybe even display on side of board
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
  if( team == "white" ){
    piece.imgSrc = "img/chesspieces/wikipedia/w" + pieceInitial + ".png"
  } else {
    piece.imgSrc = "img/chesspieces/wikipedia/b" + pieceInitial + ".png"
  }
  
};

var rules = {

  movements: {
    rangedDiagonals: "(((cP - nP) % 9 === 0) && " + board.boundaries.diagonalForwardSlashMovementBorderCheck + " ) || (((cP - nP) % 7 === 0) && " + board.boundaries.diagonalBackSlashMovementBorderCheck + " )",
    rangedOrthogonals: "(cP - nP) % 8 === 0 || ((cP - nP) < 8 && " + board.boundaries.horizontalBorderCheck + " )",
    nightMoves: // #segerJokes
      "(Math.abs(cP - nP) === 15 && " + board.boundaries.verticalNightMovementBorderCheck + " ) || (Math.abs(cP - nP) === 17 && " + board.boundaries.verticalNightMovementBorderCheck + " ) || (Math.abs(cP - nP) === 10 && " + board.boundaries.horizontalNightMovementCheck + " ) || (Math.abs(cP - nP) === 6 && " + board.boundaries.horizontalNightMovementCheck + " )",
    blackPawnTwoStep: "nP - cP === -16",
    blackPawnOneStep: "nP - cP === -8",
    blackPawnCaptureStageRight: "nP -cP === -7",
    blackPawnCaptureStageLeft: "nP -cP === -9",
    whitePawnTwoStep: "nP - cP === 16",
    whitePawnOneStep: "nP - cP === 8",
    whitePawnCaptureStageLeft: "nP -cP === 7",
    whitePawnCaptureStageRight: "nP -cP === 9"
  },

  movementTypeVerifier: function(possibleMoves, currentPosition, newPosition){
    possibleMoves = possibleMoves.replace(/cP/g, currentPosition)
    possibleMoves = possibleMoves.replace(/nP/g, newPosition)
    var acceptability = eval(possibleMoves)

    return acceptability
  },

  kingIsInCheckChecker(team, oldPosition, newPosition){
    var tiles = board.tiles;
    if (oldPosition && newPosition){
      // clone tiles, delete piece from old position, drop piece into new position
      // 
      // 
    };
    var king = team.king;
// pretend king has all movement abilities. stretch outward with them until hittting block, see if that block has the ability that was used to get to the king,
// maybe iterate across movements testing each individualy
  },
  moveIsIllegal: function(piece, newPosition){
    legal = false
    if ( board.outOfbounds(newPosition) ){
      alert('stay on the board, fool')
      legal = true
    } else if( !this.movementTypeVerifier(piece.possibleMoves(), piece.position, newPosition, piece.team) ){
      alert("that's not how that piece moves")
      legal = true
    } else if( board.pathIsBlocked(piece.position, newPosition) && piece.name !== "night" ){
      alert("that position is blocked")
      legal = true
    } else if( board.positionIsOccupiedByTeamMate(newPosition, piece.team ) ){
      alert("what, are you trying to capture your own piece?")
      legal = true
    }
    return legal
  },
  move: function(piece, newPosition){
    if( piece.team !== game.allowedToMove ){
      alert("other team's turn")
      return
    }
// NOT IMPLEMENTED YET
// 
// 
    if ( rules.kingIsInCheckChecker(piece.team, piece.position, newPosition) ){
      alert("illegal move, check yo' king before you wreck yo' king")
      return
    }
// 
// 

  if( this.moveIsIllegal(piece, newPosition) ){
    return
    } else if ( board.tiles[newPosition] === undefined ){
      gridPosition = board.gridCalculator(piece.position)
      newGridPosition = board.gridCalculator(newPosition);
      board.deleteOldStuff(gridPosition, newGridPosition, piece)
      board.placeNewStuff(piece, newPosition)
      game.nextTurn()
      // console.log("up here")
    } else if ( board.tiles[newPosition].team !== piece.team ){
// track captured pieces
// 
// lots of duplication with the above function
      gridPosition = board.gridCalculator(piece.position)
      newGridPosition = board.gridCalculator(newPosition);
      board.deleteOldStuff(gridPosition, newGridPosition, piece)
      board.placeNewStuff(piece, newPosition)
      game.nextTurn()
      // console.log("down here")
    }
  }
};


function setStartPosition(position, piece) {
  board.tiles[position] = piece
};


var nightCreator = (function (team, position){
  var night = {
    name: "night",
    position: position,
    value: 3,
    team: team,
    possibleMoves: function(){
      return rules.movements.nightMoves
    },
    isTurn: false
  };

  setImgSrc(team, night)
  setStartPosition(position, night)
  board.displayPiece(night)

  return night
});


var rookCreator = (function (team, position){
  var rook = {
    name: "rook",
    position: position,
    value: 5,
    team: team,
    possibleMoves: function(){
      return rules.movements.rangedOrthogonals
    },
    isTurn: false
  };


  setImgSrc(team, rook)
  setStartPosition(position, rook)
  board.displayPiece(rook)

  return rook
});

var bishopCreator = (function (team, position){
  var bishop = {
    name: "bishop",
    position: position,
    value: 3,
    team: team,
    possibleMoves: function(){
      return rules.movements.rangedDiagonals
    },
    isTurn: false
  };

  setImgSrc(team, bishop)
  setStartPosition(position, bishop)
  board.displayPiece(bishop)

  return bishop
});

var kingCreator = (function (team, position){
  var king = {
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
  setStartPosition(position, king)
  board.displayPiece(king)

  return king
});

var queenCreator = (function (team, position){
  var queen = {
    name: "queen",
    position: position,
    value: 9,
    team: team,
    possibleMoves: function(){
      return rules.movements.rangedDiagonals + " || " + rules.movements.rangedOrthogonals
    },
    isTurn: false
  };


  setImgSrc(team, queen)
  setStartPosition(position, queen)
  board.displayPiece(queen)

  return queen
});

var whitePawnCreator = (function (position){
  var pawn = {
    name: "pawn",
    position: position,
    value: 1,
    team: "white",
    addPossibleMoves: function(move, possibilities){
      if (possibilities === ""){
        possibilities = move
      } else{
        possibilities = possibilities + " || " + move
      }
      return possibilities
    },
    possibleMoves: function(){
      var possibilities = "";
      if( board.positions.isSecondRank(this.position) && board.twoSpacesUpIsEmpty(this.position) ){
        possibilities = this.addPossibleMoves( rules.movements.whitePawnTwoStep, possibilities )
      };
      if( board.oneSpaceUpIsEmpty(this.position) ){
        possibilities = this.addPossibleMoves( rules.movements.whitePawnOneStep, possibilities )
      };
      if( board.stageLeftWhitePawnnAttackOccupied(this.position) ){
        possibilities = this.addPossibleMoves( rules.movements.whitePawnCaptureStageLeft, possibilities)
      };
      if( board.stageRightWhitePawnAttackOccupied(this.position) ){
        possibilities = this.addPossibleMoves( rules.movements.whitePawnCaptureStageRight, possibilities)
      };
      return possibilities
    },
    isTurn: false
  };
  setImgSrc("white", pawn)
  setStartPosition(position, pawn)
  board.displayPiece(pawn)

  return pawn
});


var blackPawnCreator = (function (position){
  var pawn = {
    name: "pawn",
    position: position,
    value: 1,
    team: "black",
    addPossibleMoves: function(move, possibilities){
      if (possibilities === ""){
        possibilities = move
      } else{
        possibilities = possibilities + " || " + move
      }
      return possibilities
    },
    possibleMoves: function(){
      var possibilities = "";
      if( board.positions.isSeventhRank(this.position) && board.twoSpacesDownIsEmpty(this.position) ){
        possibilities = this.addPossibleMoves( rules.movements.blackPawnTwoStep, possibilities )
      };

      if( board.oneSpaceDownIsEmpty(this.position) ){
        possibilities = this.addPossibleMoves( rules.movements.blackPawnOneStep, possibilities )
      };

      if( board.stageRightBlackPawnAttackOccupied(this.position) ){
        possibilities = this.addPossibleMoves( rules.movements.blackPawnCaptureStageRight, possibilities)
      };

      if( board.stageLeftBlackAttackOccupied(this.position) ){
        possibilities = this.addPossibleMoves( rules.movements.blackPawnCaptureStageLeft, possibilities)
      };
      return possibilities
    },
    isTurn: false
  };
  setImgSrc("black", pawn)
  setStartPosition(position, pawn)
  board.displayPiece(pawn)

  return pawn
});

var game = {
  allowedToMove: "white",
  createTeams: function(){
    window.white = {
      king: kingCreator( "white", 4),
      pawns: [
        whitePawnCreator(8),
        whitePawnCreator(9),
        whitePawnCreator(10),
        whitePawnCreator(11),
        whitePawnCreator(12),
        whitePawnCreator(13),
        whitePawnCreator(14),
        whitePawnCreator(15)
      ],
      minors: [
        nightCreator(   "white", 1),
        bishopCreator(  "white", 2),
        bishopCreator(  "white", 5),
        nightCreator(   "white", 6),
      ],
      majors: [
        rookCreator(    "white", 0),
        queenCreator(   "white", 3),
        rookCreator(    "white", 7),
      ]
    };

    window.black = {

      king: kingCreator(    "black", 60),
      pawns: [
        blackPawnCreator(48),
        blackPawnCreator(49),
        blackPawnCreator(50),
        blackPawnCreator(51),
        blackPawnCreator(52),
        blackPawnCreator(53),
        blackPawnCreator(54),
        blackPawnCreator(55),
      ],
      minors: [
        nightCreator(   "black", 57),
        bishopCreator(  "black", 58),
        bishopCreator(  "black", 61),
        nightCreator(   "black", 62),
      ],
      majors: [
        rookCreator(    "black", 56),
        queenCreator(   "black", 59),
        rookCreator(    "black", 63)
      ]
    }
  },
  turn: function(turnNum){
    var turnNum = turnNum || 1
    if( turnNum % 2 === 0  ){
      this.allowedToMove = "black"
    } else{
      this.allowedToMove = "white"
    }
  },
  nextTurn: function(){
    if( this.allowedToMove === "white" ){
      this.allowedToMove = "black"
    } else{
      this.allowedToMove = "white"
    }
  },
  whiteMove: function(){
  },
  blackMove: function(){
  }
}

game.createTeams()
setTimeout( function(){ rules.move(board.tiles[1], 18) }, 500)
setTimeout( function(){ rules.move(board.tiles[50], 42) }, 1000)
setTimeout( function(){ rules.move(board.tiles[11], 27) }, 1500)
setTimeout( function(){ rules.move(board.tiles[59], 32) }, 2000)
setTimeout( function(){ rules.move(board.tiles[3], 19) }, 2500)
setTimeout( function(){ rules.move(board.tiles[42], 34) }, 3000)
setTimeout( function(){ rules.move(board.tiles[12], 20) }, 3500)
setTimeout( function(){ rules.move(board.tiles[34], 27) }, 4000)
setTimeout( function(){ rules.move(board.tiles[0], 1) }, 4500)
setTimeout( function(){ rules.move(board.tiles[27], 18) }, 5000)
setTimeout( function(){ rules.move(board.tiles[9], 18) }, 5500)
setTimeout( function(){ rules.move(board.tiles[51], 35)}, 6000)

