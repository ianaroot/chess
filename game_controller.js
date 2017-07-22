// singleton JSON stuff object that gets dependency injected into other objects
var board1 = ChessBoard('board1');

var GameController = (function(){
  var instance = {
    view: View.getInstance(),
    rules: (function(){
      var rules = Rules.getInstance();
      rules.pieceControllerSet = {
        Queen: new QueenController(),
        Rook: new RookController(),
        Bishop: new BishopController(),
        Night: new NightController(),
        King: new KingController(),
        BlackPawn: new BlackPawnController(),
        WhitePawn: new WhitePawnController()
      }
      return rules
    })(),
    board: new Board({layOut: 
      
      // ["whiteRook", "whiteNight", "whiteBishop", "whiteQueen", "whiteKing", "whiteBishop", "whiteNight", "whiteRook",
      //  "whitePawn", "whitePawn", "whitePawn", "whitePawn", "whitePawn", "whitePawn", "whitePawn", "whitePawn", 
      //  "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", 
      //  "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", 
      //  "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", 
      //  "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty",
      //  "blackPawn", "blackPawn", "blackPawn", "blackPawn", "blackPawn", "blackPawn", "blackPawn", "blackPawn",  
      //  "blackRook", "blackNight", "blackBishop", "blackQueen", "blackKing", "blackBishop", "blackNight", "blackRook",],

      // ["whiteKing", "empty", "empty", "empty", "empty", "empty", "empty", "whiteQueen", 
      //  "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", 
      //  "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", 
      //  "empty", "empty", "empty", "whitePawn", "empty", "empty", "empty", "empty", 
      //  "empty", "empty", "empty", "blackPawn", "empty", "empty", "empty", "empty", 
      //  "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", 
      //  "whiteRook", "empty", "empty", "empty", "empty", "empty", "empty", "empty", 
      //  "empty", "empty", "empty", "empty", "empty", "empty", "blackKing", "empty", ],

      [
       "blackRook", "blackKing", "empty", "whiteKing", "empty", "empty", "whiteBishop", "empty", 
       "blackPawn", "empty", "empty", "empty", "empty", "empty", "blackPawn", "empty", 
       "empty", "empty", "whiteQueen", "empty", "empty", "empty", "whitePawn", "blackBishop", 
       "whiteRook", "empty", "empty", "empty", "empty", "empty", "BlackPawn", "empty", 
       "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", 
       "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", 
       "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", 
       "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", 
       ],

        allowedToMove: "white"}),
    move: function(position, newPosition){
      board = this.board
      layOut = board.layOut
      pieceString = layOut[position]
      var team = pieceString.substring(0,5) //this gets reused a few times and seems magic and should become a function

      // this can live in rules now that allowed to move will be accessible there
      if( team !== board.allowedToMove ){
        alert("other team's turn")
        return
      }
      if( this.rules.moveIsIllegal(position, newPosition, board) ){
        return
      } else {
        // var gridPosition    = board.gridCalculator(piece.position),
        //     newGridPosition = board.gridCalculator(newPosition);
        // REFACTOR MEEEEEEEEE
        newLayOut = Board.classMethods.deepCopyLayout( layOut )
        board.previousLayouts.push(newLayOut)
        var pieceString = this.board.layOut[position];
        this.board.layOut[position] = "empty"
        capturedPiece = this.board.layOut[newPosition]
        this.board.layOut[newPosition] = pieceString
        this.view.displayBoard(this.board.layOut)
        // this.view.deleteOldStuff(gridPosition, newGridPosition, piece)
        // board.placeNewStuff(piece, newPosition)

        // if ( board.layOut[newPosition].team !== team ){
          // capture(newPosition)
          // this is the only place that should be deleting the destination tile
          // it should also move the piece from active pieces into captured pieces
        // }

        var stalemate = this.rules.stalemate(board);
        if( stalemate ){
          alert("stalemate!")
        }
        // wary of this check occurring after the move is made but before allowedToMove is flipped

      // if the same state occurs twice in previousLayouts, stalemate
      // if the opposing team can't move, stalemate
      // check for en passant, am i white on the fifth rank with a black pawn to the side who used to be on the sixth?
      // or am i black pawn on fourth besidea  white pawn that used to be on the second?
      // pawn promotoion
      // checkmate
      // check
        this.nextTurn()
      } 
    },
    simulate: function (){
      var gC = this;

      gC.createTeams()
      gC.view.displayBoard(gC.board.layOut)
      gC.begin()
      // setTimeout( function(){ gC.move(1,  18) }, 500)
      // setTimeout( function(){ gC.move(50, 42) }, 1000)
      // setTimeout( function(){ gC.move(11, 27) }, 1500)
      // setTimeout( function(){ gC.move(59, 32) }, 2000)
      // setTimeout( function(){ gC.move(3,  19) }, 2500)
      // setTimeout( function(){ gC.move(42, 34) }, 3000)
      // setTimeout( function(){ gC.move(12, 20) }, 3500)
      // setTimeout( function(){ gC.move(34, 27) }, 4000)
      // setTimeout( function(){ gC.move(0,  1) },  4500)
      // setTimeout( function(){ gC.move(27, 18) }, 5000)
      // setTimeout( function(){ gC.move(9,  18) }, 5500)
      // setTimeout( function(){ gC.move(51, 35)},  6000)
      // setTimeout( function(){ gC.move(15, 23)},  6500)
      // setTimeout( function(){ gC.move(58, 23)},  7000)
      // setTimeout( function(){ gC.move(19, 33)},  7500)
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
    whiteMove: function(position, newPosition){
      rules.move(position, newPosition)
    },
    blackMove: function(position, newPosition){
      rules.move(position, newPosition)
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