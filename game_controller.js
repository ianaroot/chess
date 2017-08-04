// not loggin notation on en passant
// i think there is an edge case where the captured pawn in en passant isn't removed yet during kingInCheck but it's removal would result in check
// clarify difference between trying to move wrong color, and trying to move from empty space
// moveIsLegal returns the moves occuring as an object
// movements can have a followUpMove property which indicates any additional movements... not sure how that would accomplishment en passant, i guess instead 
// of a position it could have "capture", or a function even. you ever feel like i'm not properly making us of functional programming?

// singleton JSON stuff object that gets dependency injected into other objects
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
    move: function(startPosition, endPosition){
      // attempt move is probably a better name for this func
      var board = this.board,
        layOut = board.layOut,
        pieceString = layOut[startPosition],
        team = pieceString.substring(0,5), //this gets reused a few times and seems magic and should become a function
        captureNotation;

      if( team !== board.allowedToMove ){
        alert("other team's turn")
        return
      }
      var moveObject = this.pieceMovementRules.moveIsIllegal(startPosition, endPosition, board);
      // could maybe pass the message back out to here instead of alerting it from the piece_movement_rules
      if( moveObject.illegal ){
        return
      } else {

        // REFACTOR MEEEEEEEEE
        newLayOut = Board.classMethods.deepCopyLayout( layOut )
        board.previousLayouts.push(newLayOut)
        var pieceString = this.board.layOut[startPosition];
        this.board.emptify(startPosition)
        // fo real, refac

        if( !this.board.positionEmpty(endPosition) ){
          // this.board.capturedPieces.push( this.board.layOut[endPosition] )
          this.board.capture(endPosition)
          captureNotation = "x"
        }


        this.board.placePiece({ position: endPosition, pieceString: pieceString })

        if( moveObject.additionalActions ){
          moveObject.additionalActions.call(this, {position: startPosition, board: board} )
        }
         
        if( moveObject.fullNotation ){
          notation = moveObject.fullNotation
        }
         else {
          positionNotation = Board.classMethods.gridCalculator(endPosition)
          pieceNotation = moveObject.pieceNotation
          captureNotation = captureNotation || moveObject.captureNotation || ""
          notation = pieceNotation + captureNotation + positionNotation
        }
        // if ( board.layOut[endPosition].team !== team ){
          // capture(endPosition)
          // this is the only place that should be deleting the destination tile
          // it should also move the piece from active pieces into captured pieces
        // }

        var stalemate = this.postMovementRules.stalemate(board);
        if( stalemate ){
          // end the game etc..
        // wary of this check occurring after the move is made but before allowedToMove is flipped
        // also problematic that stalemate is announced before the piece actually moves
          alert("stalemate!")
        }

        this.postMovementRules.pawnPromotionQuery( board )

        // this.board.recordNotation(startPosition, endPosition)
        // this.postMovementRules.castle()
        // moveIsLegal could return most of the necessary information for recording notation i think 
        // this.postMovementRules.enPassant()

      // checkmate
      // check (like if it happens after a legal move, not prevents a move from being legal)


      // if i make modular functions that move pieces and capture pieces, en passant and castling will be simpler to implement
      // for castling, iterate across previous boards, and just check whether the king, or rooks ever weren't in their starting position
      // king will have to add this to his directionMoves

        this.view.displayBoard(this.board.layOut)
        this.nextTurn()
      } 
    },
    simulate: function (){
      var gC = this;

      gC.createTeams()
      gC.view.displayBoard(gC.board.layOut)
      gC.begin()
      setTimeout( function(){ gC.move(1,  18) }, 500)
      setTimeout( function(){ gC.move(50, 42) }, 1000)
      setTimeout( function(){ gC.move(11, 27) }, 1500)
      setTimeout( function(){ gC.move(59, 41) }, 2000)
      setTimeout( function(){ gC.move(3,  19) }, 2500)
      setTimeout( function(){ gC.move(42, 34) }, 3000)
      setTimeout( function(){ gC.move(14, 22) }, 3500)
      setTimeout( function(){ gC.move(34, 27) }, 4000)
      setTimeout( function(){ gC.move(18, 24) }, 4500)
      setTimeout( function(){ gC.move(51, 43) }, 5000)
      setTimeout( function(){ gC.move(10, 26) }, 5500)
      setTimeout( function(){ gC.move(41, 17) }, 6000)
      setTimeout( function(){ gC.move(26, 34) }, 6500)
      setTimeout( function(){ gC.move(49, 33) }, 7000)
      
      // setTimeout( function(){ gC.move(0,  1) },  4500)
      // setTimeout( function(){ gC.move(27, 18) }, 5000)
      // setTimeout( function(){ gC.move(9,  18) }, 5500)
      // setTimeout( function(){ gC.move(51, 35)},  6000)
      // setTimeout( function(){ gC.move(15, 23)},  6500)
      // setTimeout( function(){ gC.move(58, 23)},  7000)

      // setTimeout( function(){ gC.move(14, 22)},  7500)
      // setTimeout( function(){ gC.move(57, 42)},  8000)


      // setTimeout( function(){ gC.move(22, 30)},  8500)
      // setTimeout( function(){ gC.move(60, 58)},  9000)




      // setTimeout( function(){ gC.move(19, 33)},  7500)
      // setTimeout( function(){ gC.move(57, 42)},  8000)
      // setTimeout( function(){ gC.move(33, 49)},  8500)
      // setTimeout( function(){ gC.move(35, 27)},  9000)
      // setTimeout( function(){ gC.move(49, 56)},  9500)
      // setTimeout( function(){ gC.move(60, 51)},  10000)
      // setTimeout( function(){ gC.move(56, 61)},  10500)
      // setTimeout( function(){ gC.move(27, 19)},  11500)
      // setTimeout( function(){ gC.move(61, 54)},  12000)
      // setTimeout( function(){ gC.move(19, 11)},  12500)
      // setTimeout( function(){ gC.move(4, 12)},  13000)
      // setTimeout( function(){ gC.move(11, 3)},  13500)
      
    },
    testing: function(){
      game.createTeams()
      game.addWhitePieces()
      game.addBlackPieces()
      game.begin()
      setTimeout( function(){ rules.move(1,  18) }, 500)
    },
    createTeams: function(){
      // not really applying the globality or the team at all in the way i had planned
      window.white = {
        name: "white"
      };
      window.black = {
        name: "black",
      };
      
    },
    begin: function(){
      this.view.displayBoard
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