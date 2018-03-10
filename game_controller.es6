const throwIfMissing = p => { throw new Error(`Missing parameter: ${p}`) }
// TODO tiles stay highlighted if you move via console
// if board.movePiece accepted a move object, then it could maybe mutate that move object
// such to add the capture notation to it, and then have all notation calculated on the object

class GameController {
	constructor(){
		this.board = new Board();
    this.view = new View(this);
		this.view.displayLayOut(this.board)
		this.view.setTileClickListener(this)
		this.view.setUndoClickListener(this)
	}
	attemptMove(startPosition = throwIfMissing("startPosition"), endPosition = throwIfMissing("endPosition")) {
		var board = this.board,
			layOut = board.layOut,
			pieceObject = layOut[startPosition],
			team = board.teamAt(startPosition),
			checkNotation = "",
			captureNotation = "",
			promotionNotation = "",
			notation = "";
		if( board.gameOver ){
			return
		}

		var moveObject = Rules.getMoveObject(startPosition, endPosition, board);

		if( moveObject.illegal ){
			this.view.displayAlert(moveObject.alerts)
			return
		} else {
			this.board.storeCurrentLayoutAsPrevious()
			captureNotation = this.board.movePiece( startPosition, endPosition, moveObject.additionalActions) //TODO secondary seems wonky to set the capture notation as the return here.
			var promotionNotation = Rules.pawnPromotionQuery( board ),
					otherTeam = this.board.teamNotMoving(),
					otherTeamsKingPosition = this.board.kingPosition(otherTeam);
			moveObject.alerts.push( "" )
			if( Rules.checkmate( board )){
				moveObject.alerts.push( "checkmate" )
				var checkNotation = "#";
				board.endGame()
			}
			if( !board.gameOver && Rules.kingInCheck( {startPosition: otherTeamsKingPosition, endPosition: otherTeamsKingPosition, board: board} )){
				moveObject.alerts.push( "check" )
				var checkNotation = "+";
			}
			this.view.displayLayOut(this.board)
			var stalemate = Rules.stalemate(board);
			if( !board.gameOver && stalemate ){
				moveObject.alerts.push( "stalemate" )
				board.endGame()
			}
			if( moveObject.fullNotation ){ //TODO couldn't standard notation moves calculate their own notation too?
				notation = moveObject.fullNotation + captureNotation + positionNotation + promotionNotation + checkNotation
			} else {
				var positionNotation = Board.gridCalculator(endPosition),
					pieceNotation	= moveObject.pieceNotation,
					captureNotation = captureNotation || moveObject.captureNotation || "",
					notation = pieceNotation + captureNotation + positionNotation + promotionNotation + checkNotation;
			}
			this.board.recordNotation(notation)
			if( !board.gameOver ){ this.nextTurn() }
			this.view.updateTeamAllowedToMove(this.board);
			let displayAlert = this.view.displayAlert
			if(moveObject.alerts){setTimeout( function(){ displayAlert(moveObject.alerts) }, 200)}
		}
	}

  nextTurn(){
    if( this.board.allowedToMove === Board.WHITE ){
      this.prepareBlackTurn()
    } else{
      this.prepareWhiteTurn()
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

  prepareBlackTurn(){
    this.board.allowedToMove = Board.BLACK
  }

  prepareWhiteTurn(){
    this.board.allowedToMove = Board.WHITE
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
