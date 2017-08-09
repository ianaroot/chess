// specify whether piece was trying to move through other piece or just onto position it can't hit
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
        notation,
        otherTeam,
        otherTeamsKingPosition,
        checkNotation = "",
        promotionNotation ="";

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

        promotionNotation = this.postMovementRules.pawnPromotionQuery( board ) //this needs to then alter the notation
        // i think checkmate can be determined with some combination of stalemate and check
        // checkmate
        if( this.board.allowedToMove === "white"){
          otherTeam = "black"
        } else {
          otherTeam = "white"
        }
        otherTeamsKingPosition = this.board.kingPosition(otherTeam)
        if( this.pieceMovementRules.kingInCheck( {startPosition: otherTeamsKingPosition, endPosition: otherTeamsKingPosition, board: board} ) ){
          if( this.postMovementRules.stalemate(board) ){
            // technically if you'd been in check three times in the same position this would make what was actually stalemate look like checkmate
            var displayAlert = this.view.displayAlert
            setTimeout( function(){ displayAlert("checkmate") }, 500)
            checkNotation = "#"
          } else{
            var displayAlert = this.view.displayAlert
            setTimeout( function(){ displayAlert("check") }, 500)
            checkNotation = "+"
          }
        }
        this.view.displayBoard(this.board.layOut)
        var stalemate = this.postMovementRules.stalemate(board);
        if( stalemate && checkNotation !== "#" ){
          var displayAlert = this.view.displayAlert
          setTimeout( function(){ displayAlert("stalemate") }, 500)

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
        this.board.recordNotation(notation)
        this.nextTurn()
      } 
    },
    tests: {
      pawnPromotion: function(){
        var gC = GameController.getInstance();
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
        // could break here for en black passant
        setTimeout( function(){ gC.attemptMove(41, 17) }, 6000)
        setTimeout( function(){ gC.attemptMove(26, 34) }, 6500)
        setTimeout( function(){ gC.attemptMove(49, 33) }, 7000)
        setTimeout( function(){ gC.attemptMove(19, 33)},  7500)
        setTimeout( function(){ gC.attemptMove(57, 42)},  8000)
        setTimeout( function(){ gC.attemptMove(33, 49)},  8500)
        setTimeout( function(){ gC.attemptMove(27, 19)},  9000)
      },
      sim2: function(){
        var gC = GameController.getInstance();
        gC.view.displayBoard(gC.board.layOut)
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
      whiteEnPassant: function (){
        var gC = GameController.getInstance();
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
        
      },
      checkmate: function(){
        var gC = GameController.getInstance();
        gC.view.displayBoard(gC.board.layOut)
        setTimeout( function(){ gC.attemptMove(12, 20) }, 500)
        setTimeout( function(){ gC.attemptMove(57, 42) }, 1000)
        setTimeout( function(){ gC.attemptMove(5,  26) }, 1500)
        setTimeout( function(){ gC.attemptMove(42, 32) }, 2000)
        setTimeout( function(){ gC.attemptMove(3,  21) }, 2500)
        setTimeout( function(){ gC.attemptMove(32, 17) }, 3000)
        setTimeout( function(){ gC.attemptMove(21, 53) }, 3500)
      },
      singleMoveTest: function(){
        var gC = GameController.getInstance();
        gC.view.displayBoard(gC.board.layOut)
        setTimeout( function(){ gC.attemptMove(1,  18) }, 500)
      }
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