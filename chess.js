var board = {
  tiles: [],
  boundaries: {
    upperLimit: 63,
    lowerLimit: 0,
    diagonalForwardSlashMovementBorder: "(( ((cP % 8) > (nP % 8)) && (cP > nP) ) || ( ((cP % 8) < (nP % 8) ) && (cP < nP) ))",
    diagonalBackSlashMovementBorder: "( ((cP % 8) > (nP % 8)) && (cP < nP) ) || ( ((cP % 8) < (nP % 8) ) && (cP > nP) )",
    horizontalBorder: "Math.floor(cP / 8) === Math.floor(nP / 8)"
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
    var elem = document.createElement("img");
    elem.setAttribute("src", piece.imgSrc);
    elem.setAttribute("height", "49");
    elem.setAttribute("width", "49");
    var gridPosition = this.gridCalculator(piece.position)
    console.log(gridPosition)
    document.getElementsByClassName( gridPosition )[0].appendChild(elem)
  },

  undisplayPiece: function(gridPosition){
    var element = document.getElementsByClassName( gridPosition )[0]
    // debugger
    var children = element.children
    for( i = 0; i < children.length; i ++){
      children[i].remove()
    }
  },

  positionBlocked: function(position, newPosition){
    var movementIncrement = this.movementIncrement(position, newPosition)
    var possibleBlocks = []
    var blocked = false
    for( i = 1; ( i * movementIncrement + position) !== newPosition ; i++ ){
      possibleBlocks.push( i * movementIncrement + position )
    }
    console.log(possibleBlocks)
    for( i = 0; i < possibleBlocks.length; i++ ){
      if ( board.tiles[possibleBlocks[i]] !== undefined ){
        blocked = true
      }
    }
    console.log("blocked is " + blocked)
    return blocked
  },

  movementIncrement: function(position, newPosition){
    // this function feels out of place
    var increment
    // refactor into functions like "movementIsVertical"
    if ( (position - newPosition) % 8 === 0 && position < newPosition ){
      increment = 8
    } else if ( (position - newPosition) % 8 === 0 && position > newPosition ){
      increment = -8
    }else if ( (position - newPosition) % 9 === 0 && position < newPosition ){
      increment = 9
    }else if ( (position - newPosition) % 9 === 0 && position > newPosition ){
      increment = -9
    }else if ( (position - newPosition) % 7 === 0 && position < newPosition ){
      increment = 7
    }else if ( (position - newPosition) % 7 === 0 && position > newPosition ){
      increment = -7
    }else if ( (position - newPosition) % 1 === 0 && position < newPosition){
      increment = 1
    }else if ( (position - newPosition) % 1 === 0 && position > newPosition){
      increment = -1
    }
    console.log("increment is " + increment)
    return increment
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
  if( team == "white" ){
    piece.imgSrc = "img/chesspieces/wikipedia/w" + pieceInitial + ".png"
  } else {
    piece.imgSrc = "img/chesspieces/wikipedia/b" + pieceInitial + ".png"
  }
  
};

var rules = {

  movements: {
    rangedDiagonals: "(((cP - nP) % 9 === 0) && " + board.boundaries.diagonalForwardSlashMovementBorder + " ) || (((cP - nP) % 7 === 0) && " + board.boundaries.diagonalBackSlashMovementBorder + " )",
    rangedOrthogonals: "(cP - nP) % 8 === 0 || ((cP - nP) < 8 && " + board.boundaries.horizontalBorder + " )",
    nightMoves: // #segerJokes
      "(Math.abs(cP - nP) === 15 && (Math.abs(cP % 8 - nP % 8) === 1 )) || (Math.abs(cP - nP) === 17 && (Math.abs(cP % 8 - nP % 8) === 1 )) || (Math.abs(cP - nP) === 10 && (Math.abs(cP % 8 - nP % 8) === 2 )) || (Math.abs(cP - nP) === 6 && (Math.abs(cP % 8 - nP % 8) === 2 ))"
  },

  movementTypeVerifier: function(possibleMoves, currentPosition, newPosition, team){
    if (board.tiles[newPosition] !== undefined && board.tiles[newPosition].team === team  ){
      var acceptability = false
    } else {
      possibleMoves = possibleMoves.replace(/cP/g, currentPosition)
      possibleMoves = possibleMoves.replace(/nP/g, newPosition)
      var acceptability = eval(possibleMoves)
    }

    return acceptability
  },

  kingIsInCheckChecker(team, oldPosition, newPosition){
    var tiles = board.tiles
    if (oldPosition && newPosition){
      // clone tiles, delete piece from old position, drop piece into new position
      // 
      // 
    };
    var king = team.king

  },

  move: function(piece, newPosition){
    if( piece.team !== game.allowedToMove ){
      alert("hey man!")
      return
    }
    if( piece.name === "pawn" ){
// this is hideous, make them all functions or something
// 
// 
      var possibleMoves = piece.possibleMoves()
    } else {
      var possibleMoves = piece.possibleMoves
    }

// NOT IMPLEMENTED YET
// 
// 
    if ( rules.kingIsInCheckChecker(piece.team, piece.position, newPosition) ){
      alert("hey man!")
      return
    }
// 
    if ( board.outOfbounds(newPosition)  ||
      !this.movementTypeVerifier(possibleMoves, piece.position, newPosition, piece.team)  ||
      (board.positionBlocked(piece.position, newPosition) && piece.name !== "night" ) ){
      alert("hey man!")
      return
    } else if ( board.tiles[newPosition] === undefined ){
      gridPosition = board.gridCalculator(piece.position)
      newGridPosition = board.gridCalculator(newPosition);
      
      board.deleteOldStuff(gridPosition, newGridPosition, piece)
      // stupid bug is making me repeat this
      board.placeNewStuff(piece, newPosition)

      game.nextTurn()
      console.log("up here")

    } else if ( board.tiles[newPosition].team !== piece.team ){
// track captured pieces
// 
// 
      gridPosition = board.gridCalculator(piece.position)
      newGridPosition = board.gridCalculator(newPosition);
      
      board.deleteOldStuff(gridPosition, newGridPosition, piece)
      // stupid bug is making me repeat this
      board.placeNewStuff(piece, newPosition)

      game.nextTurn()
      console.log("down here")
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
    possibleMoves: rules.movements.nightMoves,
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
    possibleMoves: rules.movements.rangedOrthogonals,
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
    possibleMoves: rules.movements.rangedDiagonals,
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
    possibleMoves: "(Math.abs(cP - nP) === 1 && " + board.boundaries.horizontalBorder + " ) || (Math.abs(cP - nP) === 7 && " + board.boundaries.diagonalBackSlashMovementBorder + " ) || (Math.abs(cP - nP) === 8) || (Math.abs(cP - nP) === 9 && " + board.boundaries.diagonalForwardSlashMovementBorder + " )",
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
    possibleMoves: rules.movements.rangedDiagonals + " || " + rules.movements.rangedOrthogonals,
    isTurn: false
  };


  setImgSrc(team, queen)
  setStartPosition(position, queen)
  board.displayPiece(queen)

  return queen
});

var pawnCreator = (function (team, position){
  var pawn = {
    name: "pawn",
    position: position,
    value: 1,
    team: team,
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
      if( this.team === "white" ){
        // debugger
        if( Math.floor(this.position / 8) === 1 && board.tiles[this.position + 16] === undefined ){
          possibilities = this.addPossibleMoves( "nP - cP === 16", possibilities )
        };
        if( board.tiles[this.position + 8] === undefined ){
          possibilities = this.addPossibleMoves( "nP - cP === 8", possibilities )
        };
        if( board.tiles[this.position + 7] !== undefined ){
          possibilities = this.addPossibleMoves( "nP -cP === 7", possibilities)
        };
        if( board.tiles[this.position + 9] !== undefined ){
          possibilities = this.addPossibleMoves( "nP -cP === 9", possibilities)
        };
      } else{

        if( Math.floor(this.position / 8) === 6 && board.tiles[this.position - 16] === undefined ){
          possibilities = this.addPossibleMoves( "nP - cP === -16", possibilities )
        };

        if( board.tiles[this.position - 8] === undefined ){
          possibilities = this.addPossibleMoves( "nP - cP === -8", possibilities )
        };

        if( board.tiles[this.position - 7] !== undefined ){
          possibilities = this.addPossibleMoves( "nP -cP === -7", possibilities)
        };

        if( board.tiles[this.position - 9] !== undefined ){
          possibilities = this.addPossibleMoves( "nP -cP === -9", possibilities)
        };
      }
      return possibilities
    },
    isTurn: false
  };


  setImgSrc(team, pawn)
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
        pawnCreator(    "white", 8),
        pawnCreator(    "white", 9),
        pawnCreator(    "white", 10),
        pawnCreator(    "white", 11),
        pawnCreator(    "white", 12),
        pawnCreator(    "white", 13),
        pawnCreator(    "white", 14),
        pawnCreator(    "white", 15)
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
        pawnCreator(    "black", 48),
        pawnCreator(    "black", 49),
        pawnCreator(    "black", 50),
        pawnCreator(    "black", 51),
        pawnCreator(    "black", 52),
        pawnCreator(    "black", 53),
        pawnCreator(    "black", 54),
        pawnCreator(    "black", 55),
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

