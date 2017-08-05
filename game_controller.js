// should have case sensitivity protection to avoid future blackPawn BlackPawn issues
var board1 = ChessBoard('board1');

var GameController = (function(){
  var instance = {
    view: View.getInstance(),
    pieceMovementRules: PieceMovementRules.getInstance(),
    postMovementRules: PostMovementRules( PieceMovementRules.getInstance() ).getInstance() ,
    board: new Board({layOut: 
      
      ["whiteRook", "whiteNight", "whiteBishop", "whiteQueen", "whiteKing", "whiteBishop", "whiteNight", "whiteRook",
       "whitePawn", "whitePawn", "whitePawn", "whitePawn", "whitePawn", "whitePawn", "whitePawn", "whitePawn", 
       "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", 
       "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", 
       "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", 
       "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty",
       "blackPawn", "blackPawn", "blackPawn", "blackPawn", "blackPawn", "blackPawn", "blackPawn", "blackPawn",  
       "blackRook", "blackNight", "blackBishop", "blackQueen", "blackKing", "blackBishop", "blackNight", "blackRook",],

      // ["whiteKing", "empty", "empty", "empty", "empty", "empty", "empty", "whiteQueen", 
      //  "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", 
      //  "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", 
      //  "empty", "empty", "empty", "whitePawn", "empty", "empty", "empty", "empty", 
      //  "empty", "empty", "empty", "blackPawn", "empty", "empty", "empty", "empty", 
      //  "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", 
      //  "whiteRook", "empty", "empty", "empty", "empty", "empty", "empty", "empty", 
      //  "empty", "empty", "empty", "empty", "empty", "empty", "blackKing", "empty", ],

      // [
      //  "blackRook", "blackKing", "empty", "whiteKing", "empty", "empty", "whiteBishop", "empty", 
      //  "blackPawn", "empty", "empty", "empty", "empty", "empty", "blackPawn", "empty", 
      //  "empty", "empty", "whiteQueen", "empty", "empty", "empty", "whitePawn", "blackBishop", 
      //  "whiteRook", "empty", "empty", "empty", "empty", "empty", "blackPawn", "empty", 
      //  "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", 
      //  "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", 
      //  "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", 
      //  "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", 
      //  ],

    allowedToMove: "white"}),
    attemptMove: function(startPosition, endPosition){
      var board = this.board,
        layOut = board.layOut,
        pieceString = layOut[startPosition],
        team = board.teamAt(startPosition),
        captureNotation,
        notation;

      if( team === "empty" ){
        alert("that tile is empty")
        return
      }
      if( team !== board.allowedToMove ){
        alert("other team's turn")
        return
      }
      var moveObject = this.pieceMovementRules.moveIsIllegal(startPosition, endPosition, board);
      if( moveObject.illegal ){
        this.view.displayAlert(moveObject.alert)
        return
      } else {


        this.board.storeCurrentLayoutAsPrevious()
        captureNotation = this.board.movePiece( startPosition, endPosition, moveObject.additionalActions)

        if( moveObject.fullNotation ){
          notation = moveObject.fullNotation
        }
         else {
          var positionNotation = Board.classMethods.gridCalculator(endPosition),
            pieceNotation = moveObject.pieceNotation,
            captureNotation = captureNotation || moveObject.captureNotation || "";
          notation = pieceNotation + captureNotation + positionNotation
        }
        console.log(notation)
        var stalemate = this.postMovementRules.stalemate(board);
        if( stalemate ){
          // end the game etc..
        // wary of this check occurring after the move is made but before allowedToMove is flipped
        // also problematic that stalemate is announced before the piece actually moves
          alert("stalemate!")
        }

        this.postMovementRules.pawnPromotionQuery( board ) //this nees to then alter the notation

        // this.board.recordNotation(startPosition, endPosition)
        // checkmate
        // check (like if it happens after a legal move, not prevents a move from being legal) also need to verify that for notation
      // if i make modular functions that move pieces and capture pieces, en passant and castling will be simpler to implement

        this.view.displayBoard(this.board.layOut)
        this.nextTurn()
      } 
    },
    simulate: function (){
      var gC = this;
// break these out to separate functions for setting up different movement tests
      gC.view.displayBoard(gC.board.layOut)
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
      // setTimeout( function(){ gC.attemptMove(41, 17) }, 6000)
      // setTimeout( function(){ gC.attemptMove(26, 34) }, 6500)
      // setTimeout( function(){ gC.attemptMove(49, 33) }, 7000)
      
      // setTimeout( function(){ gC.attemptMove(0,  1) },  4500)
      // setTimeout( function(){ gC.attemptMove(27, 18) }, 5000)
      // setTimeout( function(){ gC.attemptMove(9,  18) }, 5500)
      // setTimeout( function(){ gC.attemptMove(51, 35)},  6000)
      // setTimeout( function(){ gC.attemptMove(15, 23)},  6500)
      // setTimeout( function(){ gC.attemptMove(58, 23)},  7000)

      // setTimeout( function(){ gC.attemptMove(14, 22)},  7500)
      // setTimeout( function(){ gC.attemptMove(57, 42)},  8000)


      // setTimeout( function(){ gC.attemptMove(22, 30)},  8500)
      // setTimeout( function(){ gC.attemptMove(60, 58)},  9000)




      // setTimeout( function(){ gC.attemptMove(19, 33)},  7500)
      // setTimeout( function(){ gC.attemptMove(57, 42)},  8000)
      // setTimeout( function(){ gC.attemptMove(33, 49)},  8500)
      // setTimeout( function(){ gC.attemptMove(35, 27)},  9000)
      // setTimeout( function(){ gC.attemptMove(49, 56)},  9500)
      // setTimeout( function(){ gC.attemptMove(60, 51)},  10000)
      // setTimeout( function(){ gC.attemptMove(56, 61)},  10500)
      // setTimeout( function(){ gC.attemptMove(27, 19)},  11500)
      // setTimeout( function(){ gC.attemptMove(61, 54)},  12000)
      // setTimeout( function(){ gC.attemptMove(19, 11)},  12500)
      // setTimeout( function(){ gC.attemptMove(4, 12)},  13000)
      // setTimeout( function(){ gC.attemptMove(11, 3)},  13500)
      
    },
    testing: function(){
      var gC = this;
      gC.view.displayBoard(gC.board.layOut)
      setTimeout( function(){ gC.attemptMove(1,  18) }, 500)
    },
    turn: function(turnNum){
      var turnNum = turnNum || 1
      if( turnNum % 2 === 0  ){
        board.allowedToMove = black
      } else{
        board.allowedToMove = white
      }
    },
    nextTurn: function(){
      if( board.allowedToMove === "white" ){
        this.prepareBlackTurn()
      } else{
        this.prepareWhiteTurn()
      }
    },
    prepareBlackTurn: function(){
      board.allowedToMove = "black"
    },
    prepareWhiteTurn: function(){
      board.allowedToMove = "white"
    },
    whiteMove: function(startPosition, endPosition){
      rules.move(startPosition, endPosition)
    },
    blackMove: function(startPosition, endPosition){
      rules.move(startPosition, endPosition)
    },
    turn: function(turnNum){
      var turnNum = turnNum || 1
      if( turnNum % 2 === 0  ){
        board.allowedToMove = black
      } else{
        board.allowedToMove = white
      }
    },
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