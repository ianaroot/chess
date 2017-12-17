const throwIfMissing = p => { throw new Error(`Missing parameter: ${p}`) }


// specify whether piece was trying to move through other piece or just onto position it can't hit
// should have case sensitivity protection to avoid future blackPawn BlackPawn issues
var board1 = ChessBoard('board1');

class GameController {
	constructor(){
		this.board = new Board();
		// this.pieceMovementRules = PieceMovementRules.getInstance();
		// this.pieceMovementRules = new PieceMovementRules()
		// this.pieceMovementRules = new PieceMovementRules();
		this.postMovementRules = new PostMovementRules
		// this.PostMovementRules = new PostMovementRules();
	    this.view = new View();
		// this.view = new View();
	}
	attemptMove(startPosition = throwIfMissing("startPosition"), endPosition = throwIfMissing("endPosition")) {
		var board = this.board,
			layOut = board.layOut,
			pieceString = layOut[startPosition],
			team = board.teamAt(startPosition),
			checkNotation = "",
			captureNotation = "",
			promotionNotation = "",
			notation = "";
			// debugger
		if( board.gameOver ){
			return
		}
		if( team == "empty" ){
			alert("that tile is empty")
			return
		}
		if( team !== board.allowedToMove ){
			alert( "other team's turn" )
			return
		}
		var moveObject = PieceMovementRules.moveIsIllegal(startPosition, endPosition, board);
		if( moveObject.illegal ){
			this.view.displayAlert(moveObject.alert)
			return
		} else {
			this.board.storeCurrentLayoutAsPrevious()
			captureNotation = this.board.movePiece( startPosition, endPosition, moveObject.additionalActions)
			promotionNotation = this.postMovementRules.pawnPromotionQuery( board )
			let otherTeam = this.board.teamNotMoving()
			let otherTeamsKingPosition = this.board.kingPosition(otherTeam)
			if( this.postMovementRules.checkmate( board )){
				let displayAlert = this.view.displayAlert
				setTimeout( function(){ displayAlert("checkmate") }, 500)
				checkNotation = "#"
				board.endGame()
			}
			if( !board.gameOver && PieceMovementRules.kingInCheck( {startPosition: otherTeamsKingPosition, endPosition: otherTeamsKingPosition, board: board} )){
				let displayAlert = this.view.displayAlert
				setTimeout( function(){ displayAlert("check") }, 500 )
				checkNotation = "+"
			}
			this.view.displayLayOut(this.board.layOut)
			var stalemate = this.postMovementRules.stalemate(board);
			if( !board.gameOver && stalemate ){
				let displayAlert = this.view.displayAlert
				setTimeout( function(){ displayAlert("stalemate") }, 500 )
				board.endGame()
			}
			if( moveObject.fullNotation ){
				notation = moveObject.fullNotation
			} else {
				var positionNotation = Board.gridCalculator(endPosition),
					pieceNotation	= moveObject.pieceNotation,
					captureNotation = captureNotation || moveObject.captureNotation || "";
					notation = pieceNotation + captureNotation + positionNotation + promotionNotation + checkNotation
			}
			this.board.recordNotation(notation)
			if( !board.gameOver ){ this.nextTurn() }
		}
	}

  nextTurn(){
    if( this.board.allowedToMove === "white" ){
      this.prepareBlackTurn()
    } else{
      this.prepareWhiteTurn()
    }
  }

  prepareBlackTurn(){
    this.board.allowedToMove = "black"
  }

  prepareWhiteTurn(){
    this.board.allowedToMove = "white"
  }

}
