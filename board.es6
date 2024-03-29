class Board {
  constructor(layOut, options = { capturedPieces: [], gameOver: false, allowedToMove: Board.WHITE, movementNotation: [], previousLayouts: []}){
    this.layOut = layOut || Board.defaultLayOut()
    this.capturedPieces = options["capturedPieces"];
    this.gameOver = options["gameOver"];
    this.allowedToMove = options["allowedToMove"];
    this.movementNotation = options["movementNotation"];
    this.previousLayouts = options["previousLayouts"];
  }

  static get WHITE()  { return "white" }
  static get BLACK()  { return "black" }
  static get EMPTY()  { return "empty" }
  static get PAWN()   { return "Pawn" }
  static get ROOK()   { return "Rook" }
  static get NIGHT()  { return "Night" }
  static get BISHOP() { return "Bishop" }
  static get QUEEN()  { return "Queen" }
  static get KING()   { return "King" }
  static get DARK()   { return "dark" }
  static get LIGHT()  { return "light" }


  static defaultLayOut(){
    let layOut = [
      {color: Board.WHITE, species: Board.ROOK}, {color: Board.WHITE, species: Board.NIGHT}, {color: Board.WHITE, species: Board.BISHOP}, {color: Board.WHITE, species: Board.QUEEN}, {color: Board.WHITE, species: Board.KING}, {color: Board.WHITE, species: Board.BISHOP}, {color: Board.WHITE, species: Board.NIGHT}, {color: Board.WHITE, species: Board.ROOK},
      {color: Board.WHITE, species: Board.PAWN}, {color: Board.WHITE, species: Board.PAWN}, {color: Board.WHITE, species: Board.PAWN}, {color: Board.WHITE, species: Board.PAWN}, {color: Board.WHITE, species: Board.PAWN}, {color: Board.WHITE, species: Board.PAWN}, {color: Board.WHITE, species: Board.PAWN}, {color: Board.WHITE, species: Board.PAWN},
      {color: Board.EMPTY, species: Board.EMPTY}, {color: Board.EMPTY, species: Board.EMPTY}, {color: Board.EMPTY, species: Board.EMPTY}, {color: Board.EMPTY, species: Board.EMPTY}, {color: Board.EMPTY, species: Board.EMPTY}, {color: Board.EMPTY, species: Board.EMPTY}, {color: Board.EMPTY, species: Board.EMPTY}, {color: Board.EMPTY, species: Board.EMPTY},
      {color: Board.EMPTY, species: Board.EMPTY}, {color: Board.EMPTY, species: Board.EMPTY}, {color: Board.EMPTY, species: Board.EMPTY}, {color: Board.EMPTY, species: Board.EMPTY}, {color: Board.EMPTY, species: Board.EMPTY}, {color: Board.EMPTY, species: Board.EMPTY}, {color: Board.EMPTY, species: Board.EMPTY}, {color: Board.EMPTY, species: Board.EMPTY},
      {color: Board.EMPTY, species: Board.EMPTY}, {color: Board.EMPTY, species: Board.EMPTY}, {color: Board.EMPTY, species: Board.EMPTY}, {color: Board.EMPTY, species: Board.EMPTY}, {color: Board.EMPTY, species: Board.EMPTY}, {color: Board.EMPTY, species: Board.EMPTY}, {color: Board.EMPTY, species: Board.EMPTY}, {color: Board.EMPTY, species: Board.EMPTY},
      {color: Board.EMPTY, species: Board.EMPTY}, {color: Board.EMPTY, species: Board.EMPTY}, {color: Board.EMPTY, species: Board.EMPTY}, {color: Board.EMPTY, species: Board.EMPTY}, {color: Board.EMPTY, species: Board.EMPTY}, {color: Board.EMPTY, species: Board.EMPTY}, {color: Board.EMPTY, species: Board.EMPTY}, {color: Board.EMPTY, species: Board.EMPTY},
      {color: Board.BLACK, species: Board.PAWN}, {color: Board.BLACK, species: Board.PAWN}, {color: Board.BLACK, species: Board.PAWN}, {color: Board.BLACK, species: Board.PAWN}, {color: Board.BLACK, species: Board.PAWN}, {color: Board.BLACK, species: Board.PAWN}, {color: Board.BLACK, species: Board.PAWN}, {color: Board.BLACK, species: Board.PAWN},
      {color: Board.BLACK, species: Board.ROOK}, {color: Board.BLACK, species: Board.NIGHT}, {color: Board.BLACK, species: Board.BISHOP}, {color: Board.BLACK, species: Board.QUEEN}, {color: Board.BLACK, species: Board.KING}, {color: Board.BLACK, species: Board.BISHOP}, {color: Board.BLACK, species: Board.NIGHT}, {color: Board.BLACK, species: Board.ROOK}
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

  static deepCopy(originalObject){
    let newObject = [];
    for( let i = 0; i < originalObject.length; i ++){
      newObject.push( originalObject[i] )
    }
    return newObject
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
    let files = "abcdefgh";
    return files[position % 8]
  }

  static squareColor(position){
    let div = Math.floor(position / 8),
      mod   = position % 8,
      sum   = div + mod,
      squareColor = "";
    if (sum % 2 === 0){
      squareColor = Board.DARK
    } else {
      squareColor = Board.LIGHT
    }
    return squareColor;
  }

  static opposingTeam(teamString){
    if( teamString === Board.WHITE ){
      return Board.BLACK
    } else {
      return Board.WHITE
    };
  }

  static gridCalculator(position){
    let x = Math.floor(position % 8),
        y = Math.floor(position / 8) + 1,
      alphaNum = {
        0: "a",
        1: "b",
        2: "c",
        3: "d",
        4: "e",
        5: "f",
        6: "g",
        7: "h"
      };
    return alphaNum[x] + y
  }

  static gridCalculatorReverse(alphaNumericPosition){
    let letter = alphaNumericPosition[0],
      number = alphaNumericPosition[1],
     alphaNum = {
        a: 0,
        b: 1,
        c: 2,
        d: 3,
        e: 4,
        f: 5,
        g: 6,
        h: 7
      },
      file = alphaNum[letter],
      rank = (number - 1) * 8
    return rank + file
  }

  static inBounds(position){
    return position <= this.boundaries().upperLimit && position >= this.boundaries().lowerLimit
  }

  static parseTeam(string){
    return string.color
  }

  static parseSpecies(string){
    return string.species
  }

  undo(){
    this.layOut = this.lastLayout()
    this.previousLayouts.pop()
    let undoneNotation = this.movementNotation.pop(),
      captureNotationMatch = undoneNotation.match(/x/);
    if( captureNotationMatch ){
      this.capturedPieces.pop()
    }
    //TODO  could add e.p. to notation for simplification UPDATe 3/8/18 no idea what this comment means
  }

  consoleLogBlackPov(){
    for( let i = 0; i < 64; i = i + 8 ){
      let row = ""
      for( let j = 0; j < 8; j++){
        let pieceObject = this.pieceObject(i + j)
        if( Board.parseTeam(pieceObject) === Board.EMPTY ){
          var text = "  __  "
        } else {
          var text = "  " + Board.parseTeam(pieceObject)[0] + Board.parseSpecies( pieceObject )[0] + "  "
        }
        row = row + text
      }
      console.log(row)
      console.log(" ")
    }
  }

  consoleLogWhitePov(){
    for( let i = 56; i > -1; i = i - 8 ){
      let row = ""
      for( let j = 0; j < 8; j++){
        let pieceObject = this.pieceObject(i + j)
        if( Board.parseTeam(pieceObject) === Board.EMPTY ){
          var text = "  __  "
        } else {
          var text = "  " + Board.parseTeam(pieceObject)[0] + Board.parseSpecies( pieceObject )[0] + "  "
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
    return Board.parseTeam( this.pieceObject(position) )=== Board.BLACK && Board.parseSpecies( this.pieceObject(position) ) === Board.PAWN
  }

  whitePawnAt(position){
    return Board.parseTeam( this.pieceObject(position) )=== Board.WHITE && Board.parseSpecies( this.pieceObject(position) ) === Board.PAWN
  }

  // TODO room for refactoring wetness
  blackPawnDoubleSteppedFrom(position){
    return this.previousLayouts.length && this.positionEmpty(position) && Board.parseTeam( this.pieceObjectFromLastLayout(position) ) === Board.BLACK && Board.parseSpecies( this.pieceObjectFromLastLayout(position) ) === Board.PAWN
  }

  whitePawnDoubleSteppedFrom(position){
    return this.previousLayouts.length && this.positionEmpty(position) && Board.parseTeam( this.pieceObjectFromLastLayout(position) ) === Board.WHITE && Board.parseSpecies( this.pieceObjectFromLastLayout(position) ) === Board.PAWN
  }
  //
  // deepCopyLayout(){
  //   Board.deepCopyLayout(this.layOut)
  // }

  deepCopy(){
    let newLayOut = Board.deepCopy(this.layOut),
        newCapturedPieces = Board.deepCopy(this.capturedPieces),
        newMovementNotation = this.movementNotation,
        newPreviousLayouts = Board.deepCopy(this.previousLayouts),
        // NEED TO BE CAREFUL THAT PREVIOUS LAYOUTS ARE QUERIED NOT MUTATED!!!
        newBoard = new Board( newLayOut, {capturedPieces: newCapturedPieces, allowedToMove: this.allowedToMove, gameOver: this.gameOver, previousLayouts: newPreviousLayouts});
    return newBoard;
    // TODO maybe include the previous board states, will slow things down, but maybe it's not unreasonable for people to htink that a hypothetical board would still offer
    // accurate information with regards to stalemate, also i guess you'd get inaccurate result
  }

  reset(){
    this.layOut = Board.defaultLayOut();
    this.capturedPieces = [];
    this.gameOver = false;
    this.allowedToMove = Board.WHITE;
    this.previousLayouts = [];
    this.movementNotation = [];
  }

  endGame(){
    this.gameOver = true
  }

  teamNotMoving(){
    let teamNotMoving;

    if( this.allowedToMove === Board.WHITE){
      teamNotMoving = Board.BLACK
    } else {
      teamNotMoving = Board.WHITE
    }
    return teamNotMoving
  }

  recordNotation(notation){
    this.movementNotation.push(notation)
  }

  movePiece(startPosition, endPosition, additionalActions){
      if(
        typeof startPosition !== "number" ||
        !(typeof endPosition !== "number" || typeof endPosition !== "string") || // TODO not sure where this got turned into a string...
        !(typeof additionalActions === "function" || typeof additionalActions === "undefined")
      ){
        throw new Error("missing params in movePiece")
      }
    let pieceObject = this.pieceObject(startPosition),
      captureNotation = this.capture(endPosition);

    this.emptify(startPosition)
    this.placePiece({ position: endPosition, pieceObject: pieceObject })
    if( additionalActions ){ captureNotation = additionalActions.call(this, {position: startPosition} ) }

    return captureNotation
  }

  storeCurrentLayoutAsPrevious(){
    let layOutCopy = Board.deepCopy( this.layOut );

    this.previousLayouts.push(layOutCopy)
  }

  capture(position){
    let captureNotation = ""
    if( !this.positionEmpty(position) ){
      let pieceObject = this.layOut[position];
      this.capturedPieces.push(pieceObject)
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

  downAndLeftIsAttackable(startPosition){
    let positionDownAndLeft = startPosition - 9;
    if( Board.inBounds( positionDownAndLeft )){
      let pieceObject = this.layOut[positionDownAndLeft],
        pieceTeam = Board.parseTeam(pieceObject);
      return this.occupiedByOpponent({position: positionDownAndLeft, teamString: Board.BLACK}) && Board.squareColor(startPosition) === Board.squareColor(positionDownAndLeft)
    } else { // down and left would be off board
      return false
    }
  }

  downAndRightIsAttackable(startPosition){
    let positionDownAndRight = startPosition - 7;

    if( Board.inBounds( positionDownAndRight ) ){
      let pieceObject = this.layOut[positionDownAndRight],
        pieceTeam = Board.parseTeam(pieceObject);

      return this.occupiedByOpponent({position: positionDownAndRight, teamString: Board.BLACK}) && Board.squareColor(startPosition) === Board.squareColor(positionDownAndRight)
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

  upAndLeftIsAttackable(startPosition){
    let positionUpAndLeft = startPosition + 7;

    if( Board.inBounds( positionUpAndLeft)){
      let pieceObject = this.pieceObject(positionUpAndLeft),
        pieceTeam = Board.parseTeam(pieceObject);
      return this.occupiedByOpponent({position: positionUpAndLeft, teamString: Board.WHITE}) && Board.squareColor(startPosition) === Board.squareColor(positionUpAndLeft)
    } else {
      return false
    }
  }

  upAndRightIsAttackable(startPosition){
    let positionUpAndRight = startPosition + 9;

    if( Board.inBounds( positionUpAndRight)){
      let pieceObject = this.layOut[positionUpAndRight],
        pieceTeam = Board.parseTeam(pieceObject);

      return this.occupiedByOpponent({position: positionUpAndRight, teamString: Board.WHITE}) && Board.squareColor(startPosition) === Board.squareColor(positionUpAndRight)
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
    let kingSideRookStartPosition = kingPosition + 3;

    return (this.pieceTypeAt( kingSideRookStartPosition ) ===Board.ROOK) && this.pieceHasNotMovedFrom( kingSideRookStartPosition )
  }

  queenSideRookHasNotMoved(kingPosition){
    let queenSideRookStartPosition = kingPosition - 4;

    return (this.pieceTypeAt( queenSideRookStartPosition ) ===Board.ROOK) && this.pieceHasNotMovedFrom( queenSideRookStartPosition )
  }

  pieceHasNotMovedFrom(position){
    let pieceObject = this.layOut[position],
      previousLayouts = this.previousLayouts,
      pieceHasNotMoved = true;

    for(let i = 0; i < previousLayouts.length; i++){
      let oldLayout= previousLayouts[i];

      if(oldLayout[position] !== pieceObject ){
        pieceHasNotMoved = false
        break;
      };
    };
    return pieceHasNotMoved
  }

  emptify(position){
    this.layOut[position] = JSON.stringify({color: Board.EMPTY, species: Board.EMPTY})
  }

  placePiece(args){
    let position = args["position"],
      pieceObject = args["pieceObject"];

    this.layOut[position] = JSON.stringify(pieceObject)
  }

  promotePawn(position){
    // TODO secondary make this request input as to what piece to become
    let teamString = this.teamAt(position);

    this.layOut[position] = JSON.stringify({color: teamString , species: Board.QUEEN})

  }

  teamAt(position){
    if( !Board.inBounds(position) ){
      return Board.EMPTY
    };
    let pieceObject = this.pieceObject(position),
      teamString = Board.parseTeam( pieceObject );

    return teamString
  }

  positionsOccupiedByTeam(teamString){
    let positions = [];
    for( let i = 0; i < this.layOut.length; i++){
      let teamAt = this.teamAt(i);
      if(teamAt === teamString){
        positions.push(i)
      };
    };
    return positions
  }

  occupiedByTeamMate(args){
    let position = args["position"],
      teamString = args["teamString"],
      occupantTeam = this.teamAt(position);

    return teamString === occupantTeam
  }

  occupiedByOpponent(args){
    let position = args["position"],
      teamString = args["teamString"],
      occupantTeam = this.teamAt(position);

    return !this.positionEmpty(position) && teamString !== occupantTeam
  }

  pieceTypeAt(position){
    let pieceObject = this.pieceObject(position),
      pieceType = Board.parseSpecies( pieceObject );

    return pieceType
  }

  positionIsOccupiedByTeamMate(position, team){
    return ( !this.positionEmpty(position) && this.teamAt(position) === team  )
  }

  positionEmpty(position){
    let pieceObject = this.pieceObject(position)
    return Board.parseTeam( pieceObject ) === Board.EMPTY
  }

  kingPosition(teamString){
    let layOut = this.layOut,
      position = null;

    for(let i = 0; i < layOut.length; i ++){
      let teamAtPosition = this.teamAt(i),
        pieceType = this.pieceTypeAt(i);

      if(teamAtPosition === teamString && pieceType === Board.KING){
        position = i
        break
      }
    }
    return position
  }
}
