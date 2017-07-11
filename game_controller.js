var board1 = ChessBoard('board1');

var GameController = (function(){
  var instance = {
    view: View.getInstance(),
    rules: Rules.getInstance(),
    currentBoard: new Board({layOut: ["whiteRook", "whiteNight", "whiteBishop", "whiteQueen", "whiteKing", "whiteBishop", "whiteNight", "whiteRook",
                             "whitePawn", "whitePawn", "whitePawn", "whitePawn", "whitePawn", "whitePawn", "whitePawn", "whitePawn", 
                             "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", 
                             "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", 
                             "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", 
                             "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty",
                             "blackPawn", "blackPawn", "blackPawn", "blackPawn", "blackPawn", "blackPawn", "blackPawn", "blackPawn",  
                             "blackRook", "blackNight", "blackBishop", "blackQueen", "blackKing", "blackBishop", "blackNight", "blackRook",
    ]}),
    move: function(position, newPosition){
      // debugger
      currentBoard = this.currentBoard
      layOut = currentBoard.layOut
      pieceString = layOut[position]
      var team = pieceString.substring(0,5)
      // debugger
      if( team !== this.allowedToMove ){
        alert("other team's turn")
        return
      }
      if( this.rules.moveIsIllegal(position, newPosition, currentBoard) ){
        return
      } else {

        // var gridPosition    = board.gridCalculator(piece.position),
        //     newGridPosition = board.gridCalculator(newPosition);


// REFACTOR MEEEEEEEEE
        var pieceString = this.currentBoard.layOut[position];
        this.currentBoard.layOut[position] = "empty"
        capturedPiece = this.currentBoard.layOut[newPosition]
        this.currentBoard.layOut[newPosition] = pieceString
        this.view.displayBoard(this.currentBoard.layOut)
        // this.view.deleteOldStuff(gridPosition, newGridPosition, piece)
        // board.placeNewStuff(piece, newPosition)

        // if ( currentBoard.layOut[newPosition].team !== team ){
          // capture(newPosition)
          // this is the only place that should be deleting the destination tile
          // it should also move the piece from active pieces into captured pieces
        // }
        console.log('next turn comin')
        this.nextTurn()
        console.log('next turn came')
      } 
    },
    simulate: function (){
      var gC = this

      gC.createTeams()
      gC.view.displayBoard(gC.currentBoard.layOut)
      gC.begin()
      setTimeout( function(){ gC.move(1,  18) }, 500)
      setTimeout( function(){ gC.move(50, 42) }, 1000)
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
      window.white = {
        name: "white"
      };
      window.black = {
        name: "black",
      };
      
    },
    begin: function(){
      this.allowedToMove = "white"
      this.view.displayBoard
    },
    turn: function(turnNum){
      var turnNum = turnNum || 1
      if( turnNum % 2 === 0  ){
        this.allowedToMove = black
      } else{
        this.allowedToMove = white
      }
    },
    nextTurn: function(){
      console.log("doin the damned thang")
      if( this.allowedToMove === "white" ){
        this.prepareBlackTurn()
      } else{
        this.prepareWhiteTurn()
      }
    },
    prepareBlackTurn: function(){
      this.allowedToMove = "black"
    },
    prepareWhiteTurn: function(){
      this.allowedToMove = "white"
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
        this.allowedToMove = black
      } else{
        this.allowedToMove = white
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