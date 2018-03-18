const throwIfMissing = p => { throw new Error(`Missing parameter: ${p}`) }
// TODO priority stalemate by insufficient material, and 50 move rule
// TODO priority get e.p. appended to en passant notation
// TODO tiles stay highlighted if you move via console
// TODO priority kings can attack each other, bad!

class GameController {
	constructor(){
		this.board = new Board();
    this.view = new View(this);
		this.view.displayLayOut({board: this.board})
		this.view.setTileClickListener()
		this.view.setUndoClickListener(this)
		this.api = new Api({board: this.board, gameController: this});
		this._whiteBot = new Bot()
		this._blackBot = new Bot()
		if(this._whiteBot){ this.queryNextBotMove()}
	}
	attemptMove(startPosition = throwIfMissing("startPosition"), endPosition = throwIfMissing("endPosition")) {
		var board = this.board;
		if( board.gameOver ){
			return
		}

		var moveObject = Rules.getMoveObject(startPosition, endPosition, board);
		if( moveObject.illegal ){
			this.view.displayAlerts(moveObject.alerts)
			return
		} else {
			board.officiallyMovePiece( moveObject )

			this.view.displayLayOut({board: board, alerts: moveObject.alerts, startPosition: startPosition})

			if(this.movingTeamHasBot() ){
				let queryMove = this.queryNextBotMove.bind(this)
				setTimeout( function(){  queryMove() }, 200)
			}
		}
	}

	movingTeamHasBot(){
		let movingTeam = this.board.allowedToMove
		return ( (movingTeam === Board.WHITE) && this._whiteBot !== undefined ) || ( (movingTeam === Board.BLACK) && this._blackBot !== undefined )
	}

	// nextTurn(){
	// 	if( this.board.allowedToMove === Board.WHITE ){
	// 		this.prepareBlackTurn()
	// 	} else{
	// 		this.prepareWhiteTurn()
	// 	}
	// }
	//
	// prepareBlackTurn(){
	// 	this.board.allowedToMove = Board.BLACK
	// }
	//
	// prepareWhiteTurn(){
	// 	this.board.allowedToMove = Board.WHITE
	// }

	queryBotMove(team){
		if( team === Board.WHITE ){
			let alphaNumericMove = this._whiteBot.determineMove({ board: this.board, api: this.api })
			this.api.attemptMove(alphaNumericMove[0], alphaNumericMove[1])
			// debugger
		} else {
			let alphaNumericMove = this._blackBot.determineMove({ board: this.board, api: this.api })
			this.api.attemptMove(alphaNumericMove[0], alphaNumericMove[1])
		}
	}

	queryNextBotMove(){
		let team = this.board.allowedToMove;
		this.queryBotMove(team);
	}

	// runBotsOnlyGame(){
	// 	// debugger
	// 	while( !this.board.gameOver && this.board.movementNotation.length < 50){
	// 		this.queryNextBotMove();
	// 	}
	// 	this.view.displayLayOut({board: this.board})
	// }

	// get bot(){
	// 	this._bot
	// }
	//
	// set bot(newBot){
	// 	this._bot =  newBot
	// }



	undo(){
		if( this.board.previousLayouts.length){
			this.board.undo()
			this.view.displayLayOut({board: this.board})
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
