

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
