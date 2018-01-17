const throwIfMissing = p => { throw new Error(`Missing parameter: ${p}`) }

// git training
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
				setTimeout( function(){ displayAlert("checkmate") }, 200)
				checkNotation = "#"
				board.endGame()
			}
			if( !board.gameOver && PieceMovementRules.kingInCheck( {startPosition: otherTeamsKingPosition, endPosition: otherTeamsKingPosition, board: board} )){
				let displayAlert = this.view.displayAlert
				setTimeout( function(){ displayAlert("check") }, 200 )
				checkNotation = "+"
			}
			this.view.displayLayOut(this.board.layOut)
			var stalemate = this.postMovementRules.stalemate(board);
			if( !board.gameOver && stalemate ){
				let displayAlert = this.view.displayAlert
				setTimeout( function(){ displayAlert("stalemate") }, 200 )
				board.endGame()
			}
			if( moveObject.fullNotation ){
        // pretty sure i was supposed to add captureNotation etc... here, but need to check
				notation = moveObject.fullNotation + captureNotation + positionNotation + promotionNotation + checkNotation
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

tests = {
  pawnPromotion: function(){
    gC = new GameController();
    setTimeout( function(){ gC.attemptMove(1,  18) },  500)
    setTimeout( function(){ gC.attemptMove(50, 42) }, 1000)
    setTimeout( function(){ gC.attemptMove(11, 27) }, 1500)
    setTimeout( function(){ gC.attemptMove(59, 41) }, 2000)
    setTimeout( function(){ gC.attemptMove(3,  19) }, 2500)
    setTimeout( function(){ gC.attemptMove(42, 34) }, 3000)
    setTimeout( function(){ gC.attemptMove(14, 22) }, 3500)
    setTimeout( function(){ gC.attemptMove(34, 27) }, 4000)
    setTimeout( function(){ gC.attemptMove(18, 24) }, 4500)
    setTimeout( function(){ gC.attemptMove(51, 43) }, 5000)
    setTimeout( function(){ gC.attemptMove(10, 26) }, 5500)
    // could break here for en black passant
    setTimeout( function(){ gC.attemptMove(41, 17) }, 6000)
    setTimeout( function(){ gC.attemptMove(26, 34) }, 6500)
    setTimeout( function(){ gC.attemptMove(49, 33) }, 7000)
    setTimeout( function(){ gC.attemptMove(19, 33)},  7500)
    setTimeout( function(){ gC.attemptMove(57, 42)},  8000)
    setTimeout( function(){ gC.attemptMove(33, 49)},  8500)
    setTimeout( function(){ gC.attemptMove(27, 19)},  9000)
    setTimeout( function(){ gC.attemptMove(34, 43)},  9500)
    setTimeout( function(){ gC.attemptMove(19, 12)}, 10000)
    setTimeout( function(){ gC.attemptMove(43, 52)}, 10500)
    setTimeout( function(){ gC.attemptMove(12,  5)}, 11000)
    setTimeout( function(){ gC.attemptMove(4,   5)}, 11500)
    setTimeout( function(){ gC.attemptMove(17,  9)}, 12000)
    setTimeout( function(){ gC.attemptMove(52, 61)}, 12500)
  },
  sim2: function(){
    gC = new GameController();
    setTimeout( function(){ gC.attemptMove(1,  18) }, 500)
    setTimeout( function(){ gC.attemptMove(50, 42) }, 1000)
    setTimeout( function(){ gC.attemptMove(11, 27) }, 1500)
    setTimeout( function(){ gC.attemptMove(59, 41) }, 2000)
    setTimeout( function(){ gC.attemptMove(3,  19) }, 2500)
    setTimeout( function(){ gC.attemptMove(42, 34) }, 3000)
    setTimeout( function(){ gC.attemptMove(14, 22) }, 3500)
    setTimeout( function(){ gC.attemptMove(34, 27) }, 4000)
    setTimeout( function(){ gC.attemptMove(0,  1) },  4500)
    setTimeout( function(){ gC.attemptMove(27, 18) }, 5000)
    setTimeout( function(){ gC.attemptMove(9,  18) }, 5500)
    setTimeout( function(){ gC.attemptMove(51, 35)},  6000)
    setTimeout( function(){ gC.attemptMove(15, 23)},  6500)
    setTimeout( function(){ gC.attemptMove(58, 23)},  7000)

  },
  blackEnPassant: function(){
    // should set these up to test left and right
    gC = new GameController();
    setTimeout( function(){ gC.attemptMove(1,  18) }, 500)
    setTimeout( function(){ gC.attemptMove(50, 42) }, 1000)
    setTimeout( function(){ gC.attemptMove(11, 27) }, 1500)
    setTimeout( function(){ gC.attemptMove(59, 41) }, 2000)
    setTimeout( function(){ gC.attemptMove(3,  19) }, 2500)
    setTimeout( function(){ gC.attemptMove(42, 34) }, 3000)
    setTimeout( function(){ gC.attemptMove(14, 22) }, 3500)
    setTimeout( function(){ gC.attemptMove(34, 27) }, 4000)
    setTimeout( function(){ gC.attemptMove(18, 24) }, 4500)
    setTimeout( function(){ gC.attemptMove(51, 43) }, 5000)
    setTimeout( function(){ gC.attemptMove(10, 26) }, 5500)
  },
  whiteEnPassant: function (){
    // should set these up to test left and right
    gC = new GameController();
    setTimeout( function(){ gC.attemptMove(1,  18) }, 500)
    setTimeout( function(){ gC.attemptMove(50, 42) }, 1000)
    setTimeout( function(){ gC.attemptMove(11, 27) }, 1500)
    setTimeout( function(){ gC.attemptMove(59, 41) }, 2000)
    setTimeout( function(){ gC.attemptMove(3,  19) }, 2500)
    setTimeout( function(){ gC.attemptMove(42, 34) }, 3000)
    setTimeout( function(){ gC.attemptMove(14, 22) }, 3500)
    setTimeout( function(){ gC.attemptMove(34, 27) }, 4000)
    setTimeout( function(){ gC.attemptMove(18, 24) }, 4500)
    setTimeout( function(){ gC.attemptMove(51, 43) }, 5000)
    setTimeout( function(){ gC.attemptMove(10, 26) }, 5500)
    setTimeout( function(){ gC.attemptMove(41, 17) }, 6000)
    setTimeout( function(){ gC.attemptMove(26, 34) }, 6500)
    setTimeout( function(){ gC.attemptMove(49, 33) }, 7000)

  },
  checkmate: function(){
    gC = new GameController();
    setTimeout( function(){ gC.attemptMove(12, 20) }, 500)
    setTimeout( function(){ gC.attemptMove(57, 42) }, 1000)
    setTimeout( function(){ gC.attemptMove(5,  26) }, 1500)
    setTimeout( function(){ gC.attemptMove(42, 32) }, 2000)
    setTimeout( function(){ gC.attemptMove(3,  21) }, 2500)
    setTimeout( function(){ gC.attemptMove(32, 17) }, 3000)
    setTimeout( function(){ gC.attemptMove(21, 53) }, 3500)
  },
  queensCastles: function(){
    gC = new GameController();
    setTimeout( function(){ gC.attemptMove(11, 19) }, 500)
    setTimeout( function(){ gC.attemptMove(51, 43) }, 1000)
    setTimeout( function(){ gC.attemptMove(2,  20) }, 1500)
    setTimeout( function(){ gC.attemptMove(58, 44) }, 2000)
    setTimeout( function(){ gC.attemptMove(3,  11) }, 2500)
    setTimeout( function(){ gC.attemptMove(59, 51) }, 3000)
    setTimeout( function(){ gC.attemptMove(1,  18) }, 3500)
    setTimeout( function(){ gC.attemptMove(57, 42) }, 4000)
    setTimeout( function(){ gC.attemptMove(4,   2) }, 4500)
    setTimeout( function(){ gC.attemptMove(60, 58) }, 5000)
  },
  kingsCastles: function(){
    gC = new GameController();
    setTimeout( function(){ gC.attemptMove(12, 20) }, 500)
    setTimeout( function(){ gC.attemptMove(52, 44) }, 1000)
    setTimeout( function(){ gC.attemptMove(5,  12) }, 1500)
    setTimeout( function(){ gC.attemptMove(61, 43) }, 2000)
    setTimeout( function(){ gC.attemptMove(6,  23) }, 2500)
    setTimeout( function(){ gC.attemptMove(62, 52) }, 3000)
    setTimeout( function(){ gC.attemptMove(4,  6) }, 3500)
    setTimeout( function(){ gC.attemptMove(60, 62) }, 4000)
  },
  singleMoveTest: function(){
    gC = new GameController();
    setTimeout( function(){ gC.attemptMove(1,  18) }, 500)
  },
  threeFold: function(){
    gC = new GameController();
    setTimeout( function(){ gC.attemptMove(1, 18) }, 500)
    setTimeout( function(){ gC.attemptMove(62, 45) }, 1000)
    setTimeout( function(){ gC.attemptMove(18,  1) }, 1500)
    setTimeout( function(){ gC.attemptMove(45, 62) }, 2000)
    setTimeout( function(){ gC.attemptMove(1, 18) }, 3000)
    setTimeout( function(){ gC.attemptMove(62, 45) }, 3500)
    setTimeout( function(){ gC.attemptMove(18,  1) }, 4000)
    setTimeout( function(){ gC.attemptMove(45, 62) }, 4500)
  },
  notThreeFold: function(){
    gC = new GameController();
    setTimeout( function(){ gC.attemptMove(1, 18) }, 500)
    setTimeout( function(){ gC.attemptMove(62, 45) }, 1000)
    setTimeout( function(){ gC.attemptMove(18,  1) }, 1500)
    setTimeout( function(){ gC.attemptMove(45, 62) }, 2000)
    setTimeout( function(){ gC.attemptMove(1, 18) }, 3000)
    setTimeout( function(){ gC.attemptMove(62, 45) }, 3500)
    setTimeout( function(){ gC.attemptMove(18,  1) }, 4000)
    setTimeout( function(){ gC.attemptMove(50,  42) }, 4500)
    setTimeout( function(){ gC.attemptMove(1, 18) }, 5000)
    setTimeout( function(){ gC.attemptMove(45, 62) }, 5500)
    setTimeout( function(){ gC.attemptMove(18,  1) }, 6000)
    setTimeout( function(){ gC.attemptMove(62, 45) }, 6500)
  }
}
