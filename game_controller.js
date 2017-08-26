// reset function on here that calls board.reset and then view.display
// specify whether piece was trying to move through other piece or just onto position it can't hit
// should have case sensitivity protection to avoid future blackPawn BlackPawn issues
var board1 = ChessBoard('board1');

var GameController = (function(){
  var view = View.getInstance(),
  rules = Rules.getInstance(),
  board = new Board(),
  attemptMove = function(startPosition, endPosition){
    // var board = board,
      var layOut = board.layOut,
      pieceString = layOut[startPosition],
      team = board.teamAt(startPosition),
      captureNotation,
      notation,
      otherTeam,
      otherTeamsKingPosition,
      checkNotation = "",
      promotionNotation;
    if( board.gameOver ){
      return
    }
    if( team === "empty" ){
      alert("that tile is empty")
      return
    }
    if( team !== board.allowedToMove ){
      alert("other team's turn")
      return
    }
    var moveObject = rules.moveIsIllegal(startPosition, endPosition, board);
    if( moveObject.illegal ){
      view.displayAlert(moveObject.alert)
      return
    } else {

      
      board.storeCurrentLayoutAsPrevious()
      captureNotation = board.movePiece( startPosition, endPosition, moveObject.additionalActions)
      promotionNotation = rules.pawnPromotionQuery( board )
      otherTeam = board.teamNotMoving()
      otherTeamsKingPosition = board.kingPosition(otherTeam)

      console.log("bout to call checkmate from gameCon")
//this function is removing the opposing team's king
      if( rules.checkmate( board ) ){
//
        var displayAlert = view.displayAlert
        setTimeout( function(){ displayAlert("checkmate") }, 500)
        checkNotation = "#"
        board.endGame()
      }
      if( !board.gameOver && rules.kingInCheck( {startPosition: otherTeamsKingPosition, endPosition: otherTeamsKingPosition, board: board} ) ){
        var displayAlert = view.displayAlert
        setTimeout( function(){ displayAlert("check") }, 500)
        checkNotation = "+"
      }
      view.displayBoard(board.layOut)
      var stalemate = rules.stalemate(board);
      if( !board.gameOver && stalemate ){
        var displayAlert = view.displayAlert
        setTimeout( function(){ displayAlert("stalemate") }, 500)
        board.endGame()

      }
      if( moveObject.fullNotation ){
        notation = moveObject.fullNotation
      }
       else {
        var positionNotation = Board.classMethods.gridCalculator(endPosition),
          pieceNotation = moveObject.pieceNotation,
          captureNotation = captureNotation || moveObject.captureNotation || "";
        notation = pieceNotation + captureNotation + positionNotation + promotionNotation + checkNotation
      }
      board.recordNotation(notation)
      if( !board.gameOver ){ nextTurn() }
    } 
  },
  tests = {
    runAll: function(){
      // setTimeout( function(){ var = GameController.getInstance(); }, 0)
      setTimeout( function(){ tests.simpleStalemate() }, 0)
      setTimeout( function(){ board.reset() }, 600)
      setTimeout( function(){ view.displayBoard( board.layOut ) }, 600)

      setTimeout( function(){ tests.complexStalemate() }, 600)
      setTimeout( function(){ board.reset() }, )
      setTimeout( function(){ view.displayBoard( board.layOut ) }, )

      setTimeout( function(){ tests.pawnPromotion() }, )
      setTimeout( function(){ board.reset() }, )
      setTimeout( function(){ view.displayBoard( board.layOut ) }, )

      setTimeout( function(){ tests.sim2() }, )
      setTimeout( function(){ board.reset() }, )
      setTimeout( function(){ view.displayBoard( board.layOut ) }, )

      setTimeout( function(){ tests.blackEnPassant() }, )
      setTimeout( function(){ board.reset() }, )
      setTimeout( function(){ view.displayBoard( board.layOut ) }, )

      setTimeout( function(){ tests.whiteEnPassant() }, )
      setTimeout( function(){ board.reset() }, )
      setTimeout( function(){ view.displayBoard( board.layOut ) }, )

      setTimeout( function(){ tests.checkmate() }, )
      setTimeout( function(){ board.reset() }, )
      setTimeout( function(){ view.displayBoard( board.layOut ) }, )

      setTimeout( function(){ tests.queensCastles() }, )
      setTimeout( function(){ board.reset() }, )
      setTimeout( function(){ view.displayBoard( board.layOut ) }, )

      setTimeout( function(){ tests.kingsCastles() }, )
      setTimeout( function(){ board.reset() }, )
      setTimeout( function(){ view.displayBoard( board.layOut ) }, )


    },
    simpleStalemate: function(){
      // var = GameController.getInstance();
      newBoard = new Board({ layOut: 
        ["whiteKing", "empty", "empty", "empty", "empty", "empty", "empty", "whiteQueen", 
          "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", 
          "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", 
          "empty", "empty", "empty", "whitePawn", "empty", "empty", "empty", "empty", 
          "empty", "empty", "empty", "blackPawn", "empty", "empty", "empty", "empty", 
          "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", 
          "whiteRook", "empty", "empty", "empty", "empty", "empty", "empty", "empty", 
          "empty", "empty", "empty", "empty", "empty", "empty", "blackKing", "empty"
        ],
      })
      board = newBoard
      view.displayBoard(board.layOut)
      setTimeout( function(){ attemptMove(7, 47) },  500)

    },
    complexStalemate: function(){
      // var = GameController.getInstance();
      newBoard = new Board({ layOut: 
        [
          "blackRook", "blackKing", "empty", "whiteKing", "empty", "empty", "whiteBishop", "empty", 
          "blackPawn", "empty", "empty", "empty", "empty", "empty", "blackPawn", "empty", 
          "empty", "empty", "whiteQueen", "empty", "empty", "empty", "whitePawn", "blackBishop", 
          "whiteRook", "empty", "empty", "empty", "empty", "empty", "blackPawn", "empty", 
           "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", 
          "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", 
          "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", 
          "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", 
        ],
      })
      board = newBoard
      view.displayBoard(board.layOut)
      setTimeout( function(){ attemptMove(24, 16) },  500)

     },
    pawnPromotion: function(){
      // var = GameController.getInstance();
      view.displayBoard(board.layOut)
      setTimeout( function(){ attemptMove(1,  18) },  500)
      setTimeout( function(){ attemptMove(50, 42) }, 1000)
      setTimeout( function(){ attemptMove(11, 27) }, 1500)
      setTimeout( function(){ attemptMove(59, 41) }, 2000)
      setTimeout( function(){ attemptMove(3,  19) }, 2500)
      setTimeout( function(){ attemptMove(42, 34) }, 3000)
      setTimeout( function(){ attemptMove(14, 22) }, 3500)
      setTimeout( function(){ attemptMove(34, 27) }, 4000)
      setTimeout( function(){ attemptMove(18, 24) }, 4500)
      setTimeout( function(){ attemptMove(51, 43) }, 5000)
      setTimeout( function(){ attemptMove(10, 26) }, 5500)
      // could break here for en black passant
      setTimeout( function(){ attemptMove(41, 17) }, 6000)
      setTimeout( function(){ attemptMove(26, 34) }, 6500)
      setTimeout( function(){ attemptMove(49, 33) }, 7000)
      setTimeout( function(){ attemptMove(19, 33)},  7500)
      setTimeout( function(){ attemptMove(57, 42)},  8000)
      setTimeout( function(){ attemptMove(33, 49)},  8500)
      setTimeout( function(){ attemptMove(27, 19)},  9000)
      setTimeout( function(){ attemptMove(34, 43)},  9500)
      setTimeout( function(){ attemptMove(19, 12)}, 10000)
      setTimeout( function(){ attemptMove(43, 52)}, 10500)
      setTimeout( function(){ attemptMove(12,  5)}, 11000)
      setTimeout( function(){ attemptMove(4,   5)}, 11500)
      setTimeout( function(){ attemptMove(17,  9)}, 12000)
      setTimeout( function(){ attemptMove(52, 61)}, 12500)
    },
    sim2: function(){
      // var = GameController.getInstance();
      view.displayBoard(board.layOut)
      setTimeout( function(){ attemptMove(1,  18) }, 500)
      setTimeout( function(){ attemptMove(50, 42) }, 1000)
      setTimeout( function(){ attemptMove(11, 27) }, 1500)
      setTimeout( function(){ attemptMove(59, 41) }, 2000)
      setTimeout( function(){ attemptMove(3,  19) }, 2500)
      setTimeout( function(){ attemptMove(42, 34) }, 3000)
      setTimeout( function(){ attemptMove(14, 22) }, 3500)
      setTimeout( function(){ attemptMove(34, 27) }, 4000)
      setTimeout( function(){ attemptMove(0,  1) },  4500)
      setTimeout( function(){ attemptMove(27, 18) }, 5000)
      setTimeout( function(){ attemptMove(9,  18) }, 5500)
      setTimeout( function(){ attemptMove(51, 35)},  6000)
      setTimeout( function(){ attemptMove(15, 23)},  6500)
      setTimeout( function(){ attemptMove(58, 23)},  7000)

    },
    blackEnPassant: function(){
      // should set these up to test left and right
      // var = GameController.getInstance();
      view.displayBoard(board.layOut)
      setTimeout( function(){ attemptMove(1,  18) }, 500)
      setTimeout( function(){ attemptMove(50, 42) }, 1000)
      setTimeout( function(){ attemptMove(11, 27) }, 1500)
      // setTimeout( function(){ attemptMove(59, 41) }, 2000)
      // setTimeout( function(){ attemptMove(3,  19) }, 2500)
      // setTimeout( function(){ attemptMove(42, 34) }, 3000)
      // setTimeout( function(){ attemptMove(14, 22) }, 3500)
      // setTimeout( function(){ attemptMove(34, 27) }, 4000)
      // setTimeout( function(){ attemptMove(18, 24) }, 4500)
      // setTimeout( function(){ attemptMove(51, 43) }, 5000)
      // setTimeout( function(){ attemptMove(10, 26) }, 5500)
    },
    whiteEnPassant: function (){
      // should set these up to test left and right
      // var = GameController.getInstance();
      view.displayBoard(board.layOut)
      setTimeout( function(){ attemptMove(1,  18) }, 500)
      setTimeout( function(){ attemptMove(50, 42) }, 1000)
      setTimeout( function(){ attemptMove(11, 27) }, 1500)
      setTimeout( function(){ attemptMove(59, 41) }, 2000)
      setTimeout( function(){ attemptMove(3,  19) }, 2500)
      setTimeout( function(){ attemptMove(42, 34) }, 3000)
      setTimeout( function(){ attemptMove(14, 22) }, 3500)
      setTimeout( function(){ attemptMove(34, 27) }, 4000)
      setTimeout( function(){ attemptMove(18, 24) }, 4500)
      setTimeout( function(){ attemptMove(51, 43) }, 5000)
      setTimeout( function(){ attemptMove(10, 26) }, 5500)
      setTimeout( function(){ attemptMove(41, 17) }, 6000)
      setTimeout( function(){ attemptMove(26, 34) }, 6500)
      setTimeout( function(){ attemptMove(49, 33) }, 7000)
      
    },
    checkmate: function(){
      // var = GameController.getInstance();
      view.displayBoard(board.layOut)
      setTimeout( function(){ attemptMove(12, 20) }, 500)
      setTimeout( function(){ attemptMove(57, 42) }, 1000)
      setTimeout( function(){ attemptMove(5,  26) }, 1500)
      setTimeout( function(){ attemptMove(42, 32) }, 2000)
      setTimeout( function(){ attemptMove(3,  21) }, 2500)
      setTimeout( function(){ attemptMove(32, 17) }, 3000)
      setTimeout( function(){ attemptMove(21, 53) }, 3500)
    },
    queensCastles: function(){
      // var = GameController.getInstance();
      view.displayBoard(board.layOut)
      setTimeout( function(){ attemptMove(11, 19) }, 500)
      setTimeout( function(){ attemptMove(51, 43) }, 1000)
      setTimeout( function(){ attemptMove(2,  20) }, 1500)
      setTimeout( function(){ attemptMove(58, 44) }, 2000)
      setTimeout( function(){ attemptMove(3,  11) }, 2500)
      setTimeout( function(){ attemptMove(59, 51) }, 3000)
      setTimeout( function(){ attemptMove(1,  18) }, 3500)
      setTimeout( function(){ attemptMove(57, 42) }, 4000)
      setTimeout( function(){ attemptMove(4,   2) }, 4500)
      setTimeout( function(){ attemptMove(60, 58) }, 5000)
    },
    kingsCastles: function(){
      // var = GameController.getInstance();
      view.displayBoard(board.layOut)
      setTimeout( function(){ attemptMove(12, 20) }, 500)
      setTimeout( function(){ attemptMove(52, 44) }, 1000)
      setTimeout( function(){ attemptMove(5,  12) }, 1500)
      setTimeout( function(){ attemptMove(61, 43) }, 2000)
      setTimeout( function(){ attemptMove(6,  23) }, 2500)
      setTimeout( function(){ attemptMove(62, 52) }, 3000)
      setTimeout( function(){ attemptMove(4,  6) }, 3500)
      setTimeout( function(){ attemptMove(60, 62) }, 4000)      },
    singleMoveTest: function(){
      // var = GameController.getInstance();
      view.displayBoard(board.layOut)
      setTimeout( function(){ attemptMove(1,  18) }, 500)
    }
  },
  turn = function(turnNum){
    var turnNum = turnNum || 1
    if( turnNum % 2 === 0  ){
      board.allowedToMove = black
    } else{
      board.allowedToMove = white
    }
  },
  nextTurn = function(){
    if( board.allowedToMove === "white" ){
      prepareBlackTurn()
    } else{
      prepareWhiteTurn()
    }
  },
  prepareBlackTurn = function(){
    board.allowedToMove = "black"
  },
  prepareWhiteTurn = function(){
    board.allowedToMove = "white"
  },
  whiteMove = function(startPosition, endPosition){
    rules.move(startPosition, endPosition)
  },
  blackMove = function(startPosition, endPosition){
    rules.move(startPosition, endPosition)
  },
  turn = function(turnNum){
    var turnNum = turnNum || 1
    if( turnNum % 2 === 0  ){
      board.allowedToMove = black
    } else{
      board.allowedToMove = white
    }
  },
  instance = {
    tests: tests,
    attemptMove: attemptMove,
    board: board
  }

  function createInstance() {
    var object  = new Object("yo soy el instancio")
    return object;
  };
  return{
    getInstance: function(){
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    }
  };
}());