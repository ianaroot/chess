const throwIfMissing = p => { throw new Error(`Missing parameter: ${p}`) }

class GameController {
	constructor(){
		this.board = new Board({});
    this.view = new View(this);
		this._paused = true
		this.view.displayLayOut({board: this.board, alert: ""})
		this.view.setTileClickListener()
		this.view.setUndoClickListener(this)
		this.view.setPauseClickListener(this)
		this.api = new Api({board: this.board, gameController: this});
		this._whiteBot = new Bot(this.api, Board.WHITE)
		this._blackBot = new Bot(this.api, Board.BLACK)
		if(this._whiteBot && !this._paused){ this.queryNextBotMove()}
	}

	pause(){
		this._paused = true
	}

	attemptMove(startPosition = throwIfMissing("startPosition"), endPosition = throwIfMissing("endPosition")) {
		var board = this.board,
		alert = "";
		if( board.gameOver ){
			return
		}
    if ( !Board._inBounds(endPosition) ){
      alert = 'stay on the board, fool'
    } else if( board.occupiedByTeamMate({position: endPosition, teamString: board.allowedToMove}) ){
      alert = "what, are you trying to capture your own piece?"
    } else {

			var moveObject = Rules.getMoveObject(startPosition, endPosition, board);
			if( moveObject.illegal ){
				alert = "illegal move attempted"
			} else {

				board._officiallyMovePiece( moveObject )
				let lastNotation = board.movementNotation[board.movementNotation.length -1];
				alert = moveObject.alert;
				if( /#/.exec(lastNotation) ){
					alert = "checkmate"
				} else if( /\+/.exec(lastNotation) ) {
					alert = "check"
				} else if( board.gameOver === true ){
					alert = "stalemate"
				}
			}
		}
		this.view.displayLayOut({board: board, alert: alert, startPosition: startPosition})
		if(this.movingTeamHasBot() && !this._paused ){
			let queryMove = this.queryNextBotMove.bind(this)
			setTimeout( function(){  queryMove() }, 400)
		}
	}

	movingTeamHasBot(){
		let movingTeam = this.board.allowedToMove
		return ( (movingTeam === Board.WHITE) && this._whiteBot !== undefined ) || ( (movingTeam === Board.BLACK) && this._blackBot !== undefined )
	}

	queryBotMove(team){
		if( team === Board.WHITE ){
			let alphaNumericMove = this._whiteBot.determineMove({ board: this.board, api: this.api })
			this.api.attemptMove(alphaNumericMove.startPosition, alphaNumericMove.endPosition)
		} else {
			let alphaNumericMove = this._blackBot.determineMove({ board: this.board, api: this.api })
			this.api.attemptMove(alphaNumericMove.startPosition, alphaNumericMove.endPosition)
		}
	}

	queryNextBotMove(){
		let team = this.board.allowedToMove;
		this.queryBotMove(team);
	}

	undo(){
		if( JSON.parse( this.board.previousLayouts ).length){
			this.board._undo()
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
gameController = new GameController()

tests = {
	pawnPromotion: 	[1,18, 50,42, 11,27, 59,41, 3,19, 42,34, 14,22, 34,27, 18,24, 51, 43, 10, 26, 41, 17, 26, 34, 49, 33, 19, 33, 57, 42, 33, 49, 27, 19, 34, 43, 19, 12, 43, 52, 12,  5, 4,   5, 17,  9, 52, 61 ],
  sim2: 					[1,18, 50,42, 11,27, 59,41, 3,19, 42,34, 14,22, 34,27, 0,1,   27, 18, 9,  18, 51, 35, 15, 23, 58, 23 ],
  blackEnPassant: [1,18, 50,42, 11,27, 59,41, 3,19, 42,34, 14,22, 34,27, 18,24, 51, 43],// 10,26],
  whiteEnPassant: [1,18, 50,42, 11,27, 59,41, 3,19, 42,34, 14,22, 34,27, 18,24, 51, 43, 10, 26, 41, 17, 26, 34, 49, 33],
  checkmate: 			[12,20, 57,42, 5,26, 42,32, 3,21, 32,17, 21,53],
  queensCastles: 	[11,19, 51,43, 2,20, 58,44, 3,11, 59,51, 1,18, 57,42, 4,2, 60,58],
  kingsCastles: 	[12,20, 52,44, 5,12, 61,43, 6,23, 62,52, 4,6, 60,62],
  singleMoveTest: [1, 18],
  threeFold: 			[1,18, 62,45, 18,1, 45,62, 1,18, 62,45, 18,1, 45,62],

  notThreeFold: 	[1,18, 62,45, 18,1, 45,62, 1,18, 62,45, 18,1, 50,42, 1,18, 45,62, 18,1, 62,45],

	touchKings: 		[12,28, 51,35, 28,35, 60,51, 4,12, 51, 43, 12,20, 43,36, 20,28],
  check: 					[12,20, 57,42, 3,21, 42,32, 21,53, 32,17, ],
}

// runAllTests= function(){
// 	for (let property in tests) {
// 		if (tests.hasOwnProperty(property) ){
// 			gameController.board._reset();
// 			console.log(tests[property])
// 			gameController.runMoves(tests[property])
// 		}
// 	}
// }
