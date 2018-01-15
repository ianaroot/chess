class Board {
  constructor(layOut, options = { capturedPieces: [], gameOver: false, allowedToMove: "white", movementNotation: [], previousLayouts: []}){
    this.layOut = layOut || Board.defaultLayOut()
    this.capturedPieces = options["capturedPieces"];
    this.gameOver = options["gameOver"];
    this.allowedToMove = options["allowedToMove"];
    this.movementNotation = options["movementNotation"];
    this.previousLayouts = options["previousLayouts"];
  }

  static defaultLayOut(){
    var layOut = [
      {color: "white", species: "Rook"}, {color: "white", species: "Night"}, {color: "white", species: "Bishop"}, {color: "white", species: "Queen"}, {color: "white", species: "King"}, {color: "white", species: "Bishop"}, {color: "white", species: "Night"}, {color: "white", species: "Rook"},
      {color: "white", species: "Pawn"}, {color: "white", species: "Pawn"}, {color: "white", species: "Pawn"}, {color: "white", species: "Pawn"}, {color: "white", species: "Pawn"}, {color: "white", species: "Pawn"}, {color: "white", species: "Pawn"}, {color: "white", species: "Pawn"}, 
      {color: "empty", species: "empty"}, {color: "empty", species: "empty"}, {color: "empty", species: "empty"}, {color: "empty", species: "empty"}, {color: "empty", species: "empty"}, {color: "empty", species: "empty"}, {color: "empty", species: "empty"}, {color: "empty", species: "empty"}, 
      {color: "empty", species: "empty"}, {color: "empty", species: "empty"}, {color: "empty", species: "empty"}, {color: "empty", species: "empty"}, {color: "empty", species: "empty"}, {color: "empty", species: "empty"}, {color: "empty", species: "empty"}, {color: "empty", species: "empty"}, 
      {color: "empty", species: "empty"}, {color: "empty", species: "empty"}, {color: "empty", species: "empty"}, {color: "empty", species: "empty"}, {color: "empty", species: "empty"}, {color: "empty", species: "empty"}, {color: "empty", species: "empty"}, {color: "empty", species: "empty"}, 
      {color: "empty", species: "empty"}, {color: "empty", species: "empty"}, {color: "empty", species: "empty"}, {color: "empty", species: "empty"}, {color: "empty", species: "empty"}, {color: "empty", species: "empty"}, {color: "empty", species: "empty"}, {color: "empty", species: "empty"},
      {color: "black", species: "Pawn"}, {color: "black", species: "Pawn"}, {color: "black", species: "Pawn"}, {color: "black", species: "Pawn"}, {color: "black", species: "Pawn"}, {color: "black", species: "Pawn"}, {color: "black", species: "Pawn"}, {color: "black", species: "Pawn"},  
      {color: "black", species: "Rook"}, {color: "black", species: "Night"}, {color: "black", species: "Bishop"}, {color: "black", species: "Queen"}, {color: "black", species: "King"}, {color: "black", species: "Bishop"}, {color: "black", species: "Night"}, {color: "black", species: "Rook"}
    ];
    for(let i = 0; i < layOut.length; i ++){
      let pieceObject = layOut[i]
      layOut[i] = JSON.stringify(pieceObject)
    }
    return layOut
  }

  static boundaries(){
    return { upperLimit: 63, lowerLimit: 0 }
  }

  static deepCopyLayout(layOut){
    var newLayOut = [];
    for( let i = 0; i < layOut.length; i ++){
      newLayOut.push( layOut[i] )
    }
    return newLayOut
  }

  static isSeventhRank(position){
    return Math.floor(position / 8) === 6
  }

  static isSecondRank(position){
    return Math.floor(position / 8) === 1
  }

  static rank(position){
    return Math.floor(position / 8) + 1
  }

  static file(position){
    var files = "abcdefgh";
    return files[position % 8]
  }

  static squareColor(position){
    var div = Math.floor(position / 8),
      mod   = position % 8,
      sum   = div + mod,
      squareColor = "";
    if (sum % 2 === 0){
      squareColor = "dark"
    } else {
      squareColor = "light"
    }
    return squareColor;
  }

  static opposingTeam(teamString){
    if( teamString === "white" ){
      return "black"
    } else {
      return "white"
    };
  }

  static gridCalculator(tile){
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
  }

  static inBounds(position){
    return position <= this.boundaries().upperLimit && position >= this.boundaries().lowerLimit
  }

  static parseTeam(string){
    return string.color
  }

  consoleLog(){
    for( let i = 0; i < 64; i = i + 8 ){
      var row = ""
      for( let j = 0; j < 8; j++){
        let cell = JSON.parse(this.layOut[ i+ j ] )
        if( cell.color === "empty" ){
          var text = "  __  "
        } else {
          var text = "  " + cell.color[0] + cell.species[0] + "  "
        }
        row = row + text
      }
      console.log(row)
      console.log(" ")
    }
  }

  pieceObject(position){
    return JSON.parse(this.layOut[position])
  }

  pieceObjectFromLastLayout(position){
    return JSON.parse( this.lastLayout()[position] )
  }

  blackPawnAt(position){
    return this.pieceObject(position).color === "black" && this.pieceObject(position).species === "Pawn"
  }

  whitePawnAt(position){
    return this.pieceObject(position).color === "white" && this.pieceObject(position).species === "Pawn"  
  }

// room for refactoring wetness
  blackPawnDoubleSteppedFrom(position){
    return this.previousLayouts.length && this.positionEmpty(position) && this.pieceObjectFromLastLayout(position).color === "black" && this.pieceObjectFromLastLayout(position).species === "Pawn"
  }

  whitePawnDoubleSteppedFrom(position){
    return this.previousLayouts.length && this.positionEmpty(position) && this.pieceObjectFromLastLayout(position).color === "white" && this.pieceObjectFromLastLayout(position).species === "Pawn"
  }

  deepCopyLayout(){
    Board.deepCopyLayout(this.layOut)
  }

  reset(){
    this.layOut = Board.defaultLayOut();
    this.capturedPieces = [];
    this.gameOver = false;
    this.allowedToMove = "white";
    this.previousLayouts = [];
    this.movementNotation = [];
  }

  endGame(){
    this.gameOver = true
  }

  teamNotMoving(){
    var teamNotMoving;

    if( this.allowedToMove === "white"){
      teamNotMoving = "black"
    } else {
      teamNotMoving = "white"
    }
    return teamNotMoving
  }

  recordNotation(notation){
    this.movementNotation.push(notation)
  }

  movePiece(startPosition, endPosition, additionalActions){
      if( 
        typeof startPosition !== "number" ||
        !(typeof endPosition !== "number" || typeof endPosition !== "string") || //not sure where this got turned into a string...
        !(typeof additionalActions === "function" || typeof additionalActions === "undefined")
      ){
        throw new Error("missing params in movePiece")
      }
      // pieceString should be pieceObject now
    var pieceString = JSON.parse(this.layOut[startPosition]),
      captureNotation = this.capture(endPosition);

    this.emptify(startPosition)
    this.placePiece({ position: endPosition, pieceString: pieceString })
    if( additionalActions ){ captureNotation = additionalActions.call(this, {position: startPosition} ) }

    return captureNotation
  }

  storeCurrentLayoutAsPrevious(){
    var layOutCopy = Board.deepCopyLayout( this.layOut );

    this.previousLayouts.push(layOutCopy)
  }

  capture(position){
    var captureNotation = ""
    if( !this.positionEmpty(position) ){
      var pieceString = this.layOut[position];
// coiuld maybe switch this to store capture by color, but it should work fine
      this.capturedPieces.push(pieceString)
      this.emptify(position)
      captureNotation = "x"
    } else {
      return captureNotation
    }
      return captureNotation
  }

  lastLayout(){
    return this.previousLayouts[this.previousLayouts.length - 1]
  }

  oneSpaceDownIsEmpty(position){
    return this.positionEmpty(position - 8)
  }

  twoSpacesDownIsEmpty(position){
    return this.positionEmpty(position - 16)
  }

  downAndLeftIsAttackable(args){
    var position = args["position"],
      attackingTeamString = args["attackingTeamString"],
      positionDownAndLeft = position - 9;
    if( Board.inBounds( positionDownAndLeft )){ 
      var pieceString = this.layOut[positionDownAndLeft],
        pieceTeam = Board.parseTeam(pieceString);

      return this.occupiedByOpponent({position: positionDownAndLeft, teamString: attackingTeamString}) && Board.squareColor(position) === Board.squareColor(positionDownAndLeft)
    } else {
      // down and left would be off board
      return false
    }
  }

  downAndRightIsAttackable(args){
    var position = args["position"],
      attackingTeamString = args["attackingTeamString"],
      positionDownAndRight = position - 7;

    if( Board.inBounds( positionDownAndRight ) ){
      var pieceString = this.layOut[positionDownAndRight],
        pieceTeam = Board.parseTeam(pieceString);

      return this.occupiedByOpponent({position: positionDownAndRight, teamString: attackingTeamString}) && Board.squareColor(position) === Board.squareColor(positionDownAndRight)
    } else {
      return false
    }
  }

  twoSpacesUpIsEmpty(position){
    return this.positionEmpty( position + 16)
  }

  oneSpaceUpIsEmpty(position){
    return this.positionEmpty( position + 8)
  }

  upAndLeftIsAttackable(args){
    var position = args["position"],
      attackingTeamString = args["attackingTeamString"],
      positionUpAndLeft = position + 7;

    if( Board.inBounds( positionUpAndLeft)){
      var pieceObject = JSON.parse(this.layOut[positionUpAndLeft]),
      // there are places i'm not using parse team where i should be
        pieceTeam = Board.parseTeam(pieceObject);
      return this.occupiedByOpponent({position: positionUpAndLeft, teamString: attackingTeamString}) && Board.squareColor(position) === Board.squareColor(positionUpAndLeft)
    } else {
      return false
    }
  }

  upAndRightIsAttackable(args){
    var position = args["position"],
      attackingTeamString = args["attackingTeamString"],
      positionUpAndRight = position + 9;

    if( Board.inBounds( positionUpAndRight)){
      var pieceString = this.layOut[positionUpAndRight],
        pieceTeam = Board.parseTeam(pieceString);

      return this.occupiedByOpponent({position: positionUpAndRight, teamString: attackingTeamString}) && Board.squareColor(position) === Board.squareColor(positionUpAndRight)
    } else {
      return false
    }
  }

  kingSideCastleIsClear(kingPosition){
    return this.positionEmpty(kingPosition + 1) && this.positionEmpty(kingPosition + 2 )
  }

  queenSideCastleIsClear(kingPosition){
    return this.positionEmpty(kingPosition - 1 ) && this.positionEmpty(kingPosition - 2 ) && this.positionEmpty(kingPosition - 3 )
  }

  kingSideRookHasNotMoved(kingPosition){
    var kingSideRookStartPosition = kingPosition + 3;

    return (this.pieceTypeAt( kingSideRookStartPosition ) ==="Rook") && this.pieceHasNotMovedFrom( kingSideRookStartPosition )
  }

  queenSideRookHasNotMoved(kingPosition){
    var queenSideRookStartPosition = kingPosition - 4;

    return (this.pieceTypeAt( queenSideRookStartPosition ) ==="Rook") && this.pieceHasNotMovedFrom( queenSideRookStartPosition )
  }

  pieceHasNotMovedFrom(position){
    var pieceString = this.layOut[position],
      previousLayouts = this.previousLayouts,
      pieceHasNotMoved = true;

    for(let i = 0; i < previousLayouts.length; i++){
      var oldLayout= previousLayouts[i];

      if(oldLayout[position] !== pieceString ){
        pieceHasNotMoved = false
        break;
      };
    };
    return pieceHasNotMoved
  }

  emptify(position){
    this.layOut[position] = JSON.stringify({color: "empty", species: "empty"})
  }

  placePiece(args){
    var position = args["position"],
      pieceString = args["pieceString"];

    this.layOut[position] = JSON.stringify(pieceString)
  }

  promotePawn(position){
    // later i'll make this request input as to what piece to become
    var teamString = this.teamAt(position);

    this.layOut[position] = JSON.stringify({color: teamString , species: "Queen"})
    
  }

  teamAt(position){
    if( !Board.inBounds(position) ){
      return "empty"
    };
    var pieceString = JSON.parse(this.layOut[position]),
      teamString = pieceString.color;

    return teamString
  }

  positionsOccupiedByTeam(teamString){
    var positions = [];
    for( var i = 0; i < this.layOut.length; i++){
      var teamAt = this.teamAt(i);
      if(teamAt === teamString){
        positions.push(i)
      };
    };
    return positions
  }

  occupiedByTeamMate(args){
    var position = args["position"],
      teamString = args["teamString"],
      occupantTeam = this.teamAt(position);

    return teamString === occupantTeam
  }

  occupiedByOpponent(args){
    var position = args["position"],
      teamString = args["teamString"],
      occupantTeam = this.teamAt(position);

    return !this.positionEmpty(position) && teamString !== occupantTeam
  }

  pieceTypeAt(position){
    var pieceObject = JSON.parse(this.layOut[position]),
      pieceType = pieceObject.species;

    return pieceType
  }

  positionIsOccupiedByTeamMate(position, team){
    return ( !this.positionEmpty(position) && this.teamAt(position) === team  )
  }

  positionEmpty(position){
    return JSON.parse(this.layOut[position]).color === "empty"
  }

  kingPosition(teamString){
    var layOut = this.layOut,
      position = null;

    for(let i = 0; i < layOut.length; i ++){
      let teamAtPosition = this.teamAt(i),
        pieceType = this.pieceTypeAt(i);

      if(teamAtPosition === teamString && pieceType === "King"){
        position = i
        break
      }
    }
    return position
  }
}