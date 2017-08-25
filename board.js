var Board = function(options){
  var layOut,
    capturedPieces;
    this.defaultLayOut = [
      "whiteRook", "whiteNight", "whiteBishop", "whiteQueen", "whiteKing", "whiteBishop", "whiteNight", "whiteRook",
      "whitePawn", "whitePawn", "whitePawn", "whitePawn", "whitePawn", "whitePawn", "whitePawn", "whitePawn", 
      "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", 
      "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", 
      "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", 
      "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty",
      "blackPawn", "blackPawn", "blackPawn", "blackPawn", "blackPawn", "blackPawn", "blackPawn", "blackPawn",  
      "blackRook", "blackNight", "blackBishop", "blackQueen", "blackKing", "blackBishop", "blackNight", "blackRook"
    ]
  if( options && options["layOut"]){ var layOut = options["layOut"] }else{ var layOut = Board.classMethods.deepCopyLayout( this.defaultLayOut ) };
  if( options && options["gameOver"]){ var gameOver = options["gameOver"] }else{ var gameOver = false };
  if( options && options["capturedPieces"]){ var capturedPieces = options["capturedPieces"] }else{ var capturedPieces = [] };
  if( options && options["allowedToMove"]){ var allowedToMove = options["allowedToMove"] }else{ var allowedToMove = "white" };
  this.layOut = layOut;
  this.capturedPieces = capturedPieces;
  this.gameOver = gameOver;
  this.previousLayouts = [];
  this.allowedToMove = allowedToMove;
  this.movementNotation = [];
};
Board.classMethods = {
  deepCopyLayout: function(layOut){
    var newLayOut = [];
    for( var i = 0; i < layOut.length; i ++){
      newLayOut.push( layOut[i] )
    }
    return newLayOut
  },
  ranks: {
    isSeventh: function(position){
      return Math.floor(position / 8) === 6
    },
    isSecond: function(position){
      return Math.floor(position / 8) === 1
    }
  },
  rank: function(position){
    return Math.floor(position / 8) + 1
  },
  file: function(position){
    var files = "abcdefgh";
    return files[position % 8]
  },
  squareColor: function(position){
    var div = position / 8,
      mod   = position % 8,
      sum   = div + mod,
      squareColor;
    if (sum % 2 === 0){
      squareColor = "dark"
    } else {
      squareColor = "light"
    }
    return squareColor;
  },
  opposingTeam: function(teamString){
    if( teamString === "white" ){
      return "black"
    } else {
      return "white"
    };
  },
  gridCalculator: function(tile){
    // gonna want a reverse lookup sooner or later
    var x = Math.floor(tile % 8),
        y = Math.floor(tile / 8) + 1,
      alphaNum = {
        0: "a",
        1: "b",
        2: "c",
        3: "d",
        4: "e",
        5: "f",
        6: "g",
        7: "h"
      },
      x = alphaNum[x];
    return x + y
  },
  boundaries: {
    upperLimit: 63,
    lowerLimit: 0
  },
    inBounds: function(position){
    return position <= this.boundaries.upperLimit && position >= this.boundaries.lowerLimit
  }
}
Board.prototype = function(){
  var deepCopyLayout = function(){
    Board.classMethods.deepCopyLayout(this.layOut)
  },
  reset = function(){
    // only seems to work once at a go?
    this.layOut = this.defaultLayOut;
    this.capturedPieces = [];
    this.gameOver = false;
    this.allowedToMove = "white";
    this.previousLayouts = [];
    this.movementNotation = [];
  },
  endGame = function(){
    this.gameOver = true
  },
  teamNotMoving = function(){
    var teamNotMoving;
    if( this.allowedToMove === "white"){
      teamNotMoving = "black"
    } else {
      teamNotMoving = "white"
    }
    return teamNotMoving
  },
  recordNotation = function(notation){
    this.movementNotation.push(notation)
  },
  movePiece = function(startPosition, endPosition, additionalActions){
      if( 
        typeof startPosition !== "number" ||
        !(typeof endPosition !== "number" || typeof endPosition !== "string") || //not sure where this got turned into a string...
        !(typeof additionalActions === "function" || typeof additionalActions === "undefined")
      ){
        throw new Error("missing params in movePiece")
      }
    var pieceString = this.layOut[startPosition],
      captureNotation = capture.call(this, endPosition);
    emptify.call( this, startPosition)
    placePiece.call(this, { position: endPosition, pieceString: pieceString })
    if( additionalActions ){ captureNotation = additionalActions.call(this, {position: startPosition} ) }

    return captureNotation
  },
  storeCurrentLayoutAsPrevious = function(){
    var layOutCopy = Board.classMethods.deepCopyLayout( layOut );
    board.previousLayouts.push(layOutCopy)
  },
  capture = function(position){
    if( !positionEmpty.call(this, position) ){
      var pieceString = this.layOut[position];
      this.capturedPieces.push(pieceString)
      emptify(position)
      return captureNotation = "x"
    } else {
      return ""
    }
  },
  lastLayout = function(){
    return this.previousLayouts[this.previousLayouts.length - 1]
  },
  oneSpaceDownIsEmpty = function(position){
    return this.positionEmpty(position - 8)
  },
  twoSpacesDownIsEmpty = function(position){
    return this.positionEmpty(position - 16)
  },
  downAndLeftIsAttackable = function(args){
    var position = args["position"],
      attackingTeamString = args["attackingTeamString"];
    if( Board.classMethods.inBounds( position - 9 )){ 
      var pieceString = this.layOut[position - 9],
        pieceTeam = pieceString.substring(0,5);
      return this.occupiedByOpponent({position: position - 9, teamString: attackingTeamString}) && Board.classMethods.squareColor(position) === Board.classMethods.squareColor(position - 9)
    } else {
      // down and left would be off board
      return false
    }
  },
  downAndRightIsAttackable = function(args){
    var position = args["position"],
      attackingTeamString = args["attackingTeamString"];
    if( Board.classMethods.inBounds( position - 7 ) ){
      var pieceString = this.layOut[position - 7],
        pieceTeam = pieceString.substring(0,5);
      return this.occupiedByOpponent({position: position - 7, teamString: attackingTeamString}) && Board.classMethods.squareColor(position) === Board.classMethods.squareColor(position - 7)
    } else {
      return false
    }
  },
  twoSpacesUpIsEmpty = function(position){
    return this.positionEmpty( position + 16)
  },
  oneSpaceUpIsEmpty = function(position){
    return this.positionEmpty( position + 8)
  },
  upAndLeftIsAttackable = function(args){
    var position = args["position"],
      attackingTeamString = args["attackingTeamString"];
    if( Board.classMethods.inBounds( position + 7)){
      var pieceString = this.layOut[position + 7],
        pieceTeam = pieceString.substring(0,5);
      return this.occupiedByOpponent({position: position + 7, teamString: attackingTeamString}) && Board.classMethods.squareColor(position) === Board.classMethods.squareColor(position + 7)
    } else {
      return false
    }
  },
  upAndRightIsAttackable = function(args){
    var position = args["position"],
      attackingTeamString = args["attackingTeamString"];
    if( Board.classMethods.inBounds( position + 9)){
      var pieceString = this.layOut[position + 9],
        pieceTeam = pieceString.substring(0,5);
      return this.occupiedByOpponent({position: position + 9, teamString: attackingTeamString}) && Board.classMethods.squareColor(position) === Board.classMethods.squareColor(position + 9)
    } else {
      return false
    }
  },
  kingSideCastleIsClear = function(kingPosition){
    return this.positionEmpty(kingPosition + 1) && this.positionEmpty(kingPosition + 2 )
  },
  queenSideCastleIsClear = function(kingPosition){
    return this.positionEmpty(kingPosition - 1 ) && this.positionEmpty(kingPosition - 2 ) && this.positionEmpty(kingPosition - 3 )
  },
  kingSideRookHasNotMoved = function(kingPosition){
    var kingSideRookStartPosition = kingPosition + 3;
    return (this.pieceTypeAt( kingSideRookStartPosition ) ==="Rook") && this.pieceHasNotMovedFrom( kingSideRookStartPosition )
  },
  queenSideRookHasNotMoved = function(kingPosition){
    var queenSideRookStartPosition = kingPosition - 4;
    return (this.pieceTypeAt( queenSideRookStartPosition ) ==="Rook") && this.pieceHasNotMovedFrom( queenSideRookStartPosition )
  },
  pieceHasNotMovedFrom = function(position){
    var pieceString = this.layOut[position],
      previousLayouts = this.previousLayouts,
      pieceHasNotMoved = true;
    for(var i = 0; i < previousLayouts.length; i++){
      var oldLayout= previousLayouts[i];
      if(oldLayout[position] !== pieceString ){
        pieceHasNotMoved = false
        break;
      };
    };
    return pieceHasNotMoved
  },
  emptify = function(position){
    this.layOut[position] = "empty"
  },
  placePiece = function(args){
    var position = args["position"],
      pieceString = args["pieceString"];
    this.layOut[position] = pieceString
  },
  promotePawn = function(position){
    // later i'll make this request input as to what piece to become
    var teamString = this.teamAt(position)
    this.layOut[position] = teamString + "Queen"
    
  },
  teamAt = function(position){
    if( !Board.classMethods.inBounds(position) ){
      return "empty"
    };
    var pieceString = this.layOut[position],
      teamString = pieceString.substring(0,5)
    ;
    return teamString
  },
  positionsOccupiedByTeam = function(teamString){
    var positions = [];
    for( var i = 0; i < this.layOut.length; i++){
      var teamAt = this.teamAt(i);
      if(teamAt === teamString){
        positions.push(i)
      };
    };
    return positions
  },
  occupiedByTeamMate = function(args){
    var position = args["position"],
        teamString = args["teamString"],
        occupantTeam = this.teamAt(position)
    ;
    return teamString === occupantTeam
  },
  occupiedByOpponent = function(args){
    var position = args["position"],
        teamString = args["teamString"],
        occupantTeam = this.teamAt(position);
    return !this.positionEmpty(position) && teamString !== occupantTeam
  },
  pieceTypeAt = function(position){
    pieceString = this.layOut[position]
    pieceType = pieceString.substring(5,pieceString.length)
    return pieceType
  },
  positionEmpty = function(position){
    return this.layOut[position] === "empty"
  },
  kingPosition = function(teamString){
    var layout = this.layOut,
        position;
    for(var i = 0; i < layOut.length; i ++){
      var teamAtPosition = this.teamAt(i),
          pieceType = this.pieceTypeAt(i);
      if(teamAtPosition === teamString && pieceType === "King"){
        position = i
        break
      }
    }
    return position
  };
  return {
    storeCurrentLayoutAsPrevious: storeCurrentLayoutAsPrevious,
    teamAt: teamAt,
    pieceTypeAt: pieceTypeAt,
    occupiedByOpponent: occupiedByOpponent,
    occupiedByTeamMate: occupiedByTeamMate,
    // gameOver: gameOver,
    // allowedToMove: allowedToMove
    movePiece: movePiece,
    teamNotMoving: teamNotMoving,
    kingPosition: kingPosition,
    endGame: endGame,
    recordNotation: recordNotation,
    positionEmpty: positionEmpty,
    lastLayout: lastLayout,
    twoSpacesDownIsEmpty: twoSpacesDownIsEmpty,
    twoSpacesUpIsEmpty: twoSpacesUpIsEmpty,
    oneSpaceUpIsEmpty: oneSpaceUpIsEmpty,
    oneSpaceDownIsEmpty: oneSpaceDownIsEmpty,
    downAndLeftIsAttackable: downAndLeftIsAttackable,
    downAndRightIsAttackable: downAndRightIsAttackable,
    upAndLeftIsAttackable: upAndLeftIsAttackable,
    upAndRightIsAttackable: upAndRightIsAttackable,
    positionsOccupiedByTeam: positionsOccupiedByTeam,
    reset: reset
    // capture: capture, emp
  }
}()