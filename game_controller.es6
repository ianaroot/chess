const throwIfMissing = p => { throw new Error(`Missing parameter: ${p}`) }
// TODO priority stalemate by insufficient material, and 50 move rule
// TODO priority get e.p. appended to en passant notation
// TODO tiles stay highlighted if you move via console

class GameController {
	constructor(){
		this.board = new Board();
    this.view = new View(this);
		this.view.displayLayOut({board: this.board, alerts: [""]})
		this.view.setTileClickListener(this)
		this.view.setUndoClickListener(this)
		this.api = new Api(this.board);
	}
	attemptMove(startPosition = throwIfMissing("startPosition"), endPosition = throwIfMissing("endPosition")) {
		var board = this.board;
		if( board.gameOver ){
			return
		}

		var moveObject = Rules.getMoveObject(startPosition, endPosition, board);

		if( moveObject.illegal ){
			this.view.displayAlert(moveObject.alerts)
			return
		} else {
			// TODO having all of these checks on the gameController makes hypothetical moves rather complicated
			//
			board.movePiece( moveObject )

			Rules.pawnPromotionQuery({board: board, moveObject: moveObject} );

			Rules.checkmateQuery({board: board, moveObject: moveObject})

			if( !board.gameOver ){
				var otherTeam = board.teamNotMoving(),
					otherTeamsKingPosition = board.kingPosition(otherTeam);
					// TODO separate check query that doesn't insist on a move occuring
				Rules.checkQuery( {startPosition: otherTeamsKingPosition, endPosition: otherTeamsKingPosition, board: board, moveObject: moveObject} )
				Rules.stalemateQuery({board: board, moveObject: moveObject});
			}

			this.board.recordNotationFrom(moveObject)

			if( !board.gameOver ){ board.nextTurn() }

			this.view.displayLayOut({board: board, alerts: moveObject.alerts})

// 36-66 can all just move over to board.movePiece, and then that function can return any necessary alerts.
// in fact, if we passed in the moveObject, and mutated it's alerts, that should hold over here too
		}
	}



	undo(){
		if( this.board.previousLayouts.length){
			this.board.undo()
			this.nextTurn() //TODO this is a really jenky dangerous way to switch whose turn it is. also the board should maybe know whose turn it is
			this.view.updateTeamAllowedToMove(this.board);
			this.view.displayLayOut(this.board)
		}
	}
	runMoves(moveArray){
		var func = this.runMoves.bind(this)
		if (moveArray.length > 1 ) {
			// console.log('move is ' + moveArray[0] + ' to ' + moveArray[1])
			this.attemptMove( moveArray[0], moveArray[1] )
			moveArray.shift()
			moveArray.shift()
			setTimeout( function(){ func(moveArray)  }, 500)
		}
	}
}
gameController = new GameController() //TODO this globally accessible gameController is critical to the view functioning, that seems not good

// TODO some tests just setup the move they're testing but don't perform it (enPassants)
tests = {
	pawnPromotion: [1,  18, 50, 42, 11, 27, 59, 41, 3,  19, 42, 34, 14, 22, 34, 27, 18, 24, 51, 43, 10, 26, 41, 17, 26, 34, 49, 33, 19, 33, 57, 42, 33, 49, 27, 19, 34, 43, 19, 12, 43, 52, 12,  5, 4,   5, 17,  9, 52, 61 ],
  sim2: [1,  18, 50, 42, 11, 27, 59, 41, 3,  19, 42, 34, 14, 22, 34, 27, 0,  1, 27, 18, 9,  18, 51, 35, 15, 23, 58, 23 ],
  blackEnPassant: [1,  18, 50, 42, 11, 27, 59, 41, 3,  19, 42, 34, 14, 22, 34, 27, 18, 24, 51, 43, 10, 26],
  whiteEnPassant: [1,  18, 50, 42, 11, 27, 59, 41, 3,  19, 42, 34, 14, 22, 34, 27, 18, 24, 51, 43, 10, 26, 41, 17, 26, 34, 49, 33],
  checkmate: [12, 20, 57, 42, 5,  26, 42, 32, 3,  21, 32, 17, 21, 53],
  queensCastles: [11, 19, 51, 43, 2,  20, 58, 44, 3,  11, 59, 51, 1,  18, 57, 42, 4,   2, 60, 58],
  kingsCastles: [12, 20, 52, 44, 5,  12, 61, 43, 6,  23, 62, 52, 4,  6, 60, 62],
  singleMoveTest: [1,  18],
  threeFold: [1, 18, 62, 45, 18,  1, 45, 62, 1, 18, 62, 45, 18,  1, 45, 62],
  notThreeFold: [1, 18, 62, 45, 18,  1, 45, 62, 1, 18, 62, 45, 18,  1, 50,  42, 1, 18, 45, 62, 18,  1, 62, 45]
}

// runAllTests= function(){
// 	for (let property in tests) {
// 		if (tests.hasOwnProperty(property) ){
// 			gameController.board.reset();
// 			console.log(tests[property])
// 			gameController.runMoves(tests[property])
// 		}
// 	}
// }
