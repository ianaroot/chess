class Board {
  // TODO might be easier to store the moveObjects and recreate noatation on demand!!!
  constructor({layOut: layOut, capturedPieces: capturedPieces, gameOver: gameOver, allowedToMove: allowedToMove, movementNotation: movementNotation, previousLayouts: previousLayouts}){
    // this.layOut = layOut|| Layout.approachingMate()
    this.layOut = layOut|| Layout.default()
    this.capturedPieces = capturedPieces || [];
    this.gameOver = gameOver || false;
    this.allowedToMove = allowedToMove || Board.WHITE;
    this.movementNotation = movementNotation || [];
    this.previousLayouts = previousLayouts || JSON.stringify([])
  }

  static get WHITE()  { return "W" }
  static get BLACK()  { return "B" }
  static get EMPTY()  { return "e" }
  static get PAWN()   { return "P" }
  static get ROOK()   { return "R" }
  static get NIGHT()  { return "N" }
  static get BISHOP() { return "B" }
  static get QUEEN()  { return "Q" }
  static get KING()   { return "K" }
  static get DARK()   { return "dark" }
  static get LIGHT()  { return "light" }
  static get MINOR_PIECES() { return [Board.NIGHT, Board.BISHOP] }
  static get MAJOR_PIECES() { return [Board.ROOK, Board.QUEEN]}

  static _boundaries(){
    return { upperLimit: 63, lowerLimit: 0 }
  }

  static _deepCopy(originalObject){
    let newObject = [];
    for( let i = 0; i < originalObject.length; i ++){
      newObject.push( originalObject[i] )
    }
    return newObject
  }

  static isSeventhRank(position){
    position = Board.convertPositionFromAlphaNumeric(position)
    return Math.floor(position / 8) === 6
  }

  static isSecondRank(position){
    position = Board.convertPositionFromAlphaNumeric(position)
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
    position = Board.convertPositionFromAlphaNumeric(position)
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

  static _inBounds(position){
    return position <= this._boundaries().upperLimit && position >= this._boundaries().lowerLimit
  }

  static parseTeam(string){
    return string[0]
  }

  static parseSpecies(string){
    return string[1]
  }

  _nextTurn(){
    if( this.allowedToMove === Board.WHITE ){
      this._prepareBlackTurn()
    } else{
      this._prepareWhiteTurn()
    }
  }

  _prepareBlackTurn(){
    this.allowedToMove = Board.BLACK
  }

  _prepareWhiteTurn(){
    this.allowedToMove = Board.WHITE
  }

  _undo(){
    // this.layOut = this.lastLayout()
    let parsedPrevious = JSON.parse(this.previousLayouts);
    this.layOut = parsedPrevious.pop();
    this.previousLayouts = JSON.stringify(parsedPrevious)
    let undoneNotation = this.movementNotation.pop(),
      captureNotationMatch = undoneNotation.match(/x/);
    if( captureNotationMatch ){
      this.capturedPieces.pop()
    }
    this._nextTurn()
  }

  remainingPieceValueFor(team){
    let subtractedValue = 0,
        captures = this.capturedPieces;
    for( let i = 0; i < captures.length; i++){
      let piece = captures[i] ;
      if( Board.parseTeam( piece ) === team ){
        subtractedValue = subtractedValue + Board.pieceValues()[ Board.parseSpecies( piece ) ]
      }
    }
    return 39 - subtractedValue;
  }

  static pieceValues(){
    let values = {};
    values[Board.PAWN] = 1;
    values[Board.NIGHT] = 3;
    values[Board.BISHOP] = 3;
    values[Board.ROOK] = 5;
    values[Board.QUEEN] = 9;
    values[Board.KING] = 0;
    return values;
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

  static convertPositionFromAlphaNumeric(position){
    if( typeof( position ) === 'string' && position.match(/[a-z]\d/) && position.length === 2){
      return Board.gridCalculatorReverse( position )
    } else {
      return position
    }
  }

  _blackPawnAt(position){
    return Board.parseTeam( this.pieceObject(position) )=== Board.BLACK && Board.parseSpecies( this.pieceObject(position) ) === Board.PAWN
  }

  _whitePawnAt(position){
    return Board.parseTeam( this.pieceObject(position) )=== Board.WHITE && Board.parseSpecies( this.pieceObject(position) ) === Board.PAWN
  }

  blackPawnDoubleSteppedTo(position){// only to be called if already know the black pawn is at rank 4 and in "position"
    var result;
    let blackMoves = this.movesNotationFor(Board.BLACK),
      square = Board.gridCalculator(position),
      hypotheticalSingleStepSquare = square[0] + '6'; //e.g. if the double step would've been to a4, then the single step it may have taken would've been to a3
    if( blackMoves[blackMoves.length -1] === square ){
      result = true;
    } else {
      return false //this means that even if it did at some point double step, it wasn't the last move to occur
    }
    for(let i = 0; i < blackMoves; i < blackMoves.length){
      if( blackMoves[i] === hypotheticalSingleStepSquare || blackMoves[i] === hypotheticalSingleStepSquare + "+" ){
        result = false;
        break
      }
    }
    return result
  }


  whitePawnDoubleSteppedTo(position){// only to be called if already know the white pawn is at rank 4 and in "position"
    var result;
    let whiteMoves = this.movesNotationFor(Board.WHITE),
      square = Board.gridCalculator(position),
      hypotheticalSingleStepSquare = square[0] + '3'; //e.g. if the double step would've been to a4, then the single step it may have taken would've been to a3
    if( whiteMoves[whiteMoves.length -1] === square ){
      result = true;
    } else {
      return false //this means that even if it did at some point double step, it wasn't the last move to occur
    }
    for(let i = 0; i < whiteMoves; i < whiteMoves.length){
      if( whiteMoves[i] === hypotheticalSingleStepSquare || whiteMoves[i] === hypotheticalSingleStepSquare + "+" ){
        result = false;
        break
      }
    }
    return result
  }

  movesNotationFor(team){
    let teamMoves = [];
    if( team === Board.WHITE ){
      var initialElement = 0
    } else if (team === Board.BLACK ){
      var initialElement = 1
    } else {
      alert( "bad input for board.movesNotationFor: " + team )
    }
    for(let i = initialElement; i < this.movementNotation.length; i = i + 2 ){
      teamMoves.push( this.movementNotation[i] )
    }
    return teamMoves;
  }

  deepCopy(){
    let newLayout = Board._deepCopy(this.layOut),
        newCaptures = Board._deepCopy(this.capturedPieces),
        newMovementNotation = Board._deepCopy(this.movementNotation),
        newBoard = new Board({layOut: newLayout, capturedPieces: newCaptures, allowedToMove: this.allowedToMove, gameOver: this.gameOver, movementNotation: newMovementNotation, previousLayouts: this.previousLayouts});
    return newBoard;
  }

  _reset(){
    this.layOut = Layout.default();
    this.capturedPieces = [];
    this.gameOver = false;
    this.allowedToMove = Board.WHITE;
    // this.previousLayouts = [];
    this.movementNotation = [];
  }

  _endGame(team){
    this.gameOver = true
    this._winner = team
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

  _recordNotationFrom({ moveObject: moveObject, epNotation: epNotation, notationSuffix:  notationSuffix }){
    // if other pieces of same species from same team could move to the same place, attach clarifying file or rank
    // for rooks, if Rb goes to a6, is there already a rook on 6? it could've done that too
    // if it's a queen, is there another queen? if there is another queen, is it on the right rank, file, or square color?
    // if its a bishop, is there another bishop on the right square color?
    // if it it's a night, is there anot

    // oooh! could you bump into your teammate from the position you just assumed!! take their rank and file, compare, apply the difference
    let pieceNotation = moveObject.pieceNotation
    if( /[QNBR]/.exec(pieceNotation) ){

    }

    this.movementNotation.push( moveObject.notation() + (epNotation || "") + notationSuffix)
  }

  _hypotheticallyMovePiece( moveObject ){ // ONLY USE THIS TO SEE IF A MOVE WOULD RESULT IN MATE. there's a lot of space between _officiallyMovePiece and hypothetical. eg  not recording any data on hypothetical moves
    let startPosition = moveObject.startPosition,
      endPosition = moveObject.endPosition,
      additionalActions = moveObject.additionalActions;
      let pieceObject = this.pieceObject(startPosition);
    this._emptify(startPosition)
    this._placePiece({ position: endPosition, pieceObject: pieceObject })
    if( additionalActions ){ additionalActions.call(this, startPosition) }
  }

  _officiallyMovePiece( moveObject ){
    // if( !MoveObject.prototype.isPrototypeOf( moveObject ) ){ throw new Error("missing params in movePiece") }
    let startPosition = moveObject.startPosition,
      endPosition = moveObject.endPosition,
      additionalActions = moveObject.additionalActions,
      pieceObject = this.pieceObject(startPosition);


    let stringyLayOut = JSON.stringify(this.layOut)
    if(/,/.exec(this.previousLayouts)){
      this.previousLayouts = this.previousLayouts.replace(/]$/, "," + stringyLayOut + "]" )
    } else {
      this.previousLayouts = "[" + stringyLayOut + "]"
    }

    this._emptify(startPosition)
    if( !this.positionEmpty(endPosition) ){ this._capture(endPosition); }
    this._placePiece({ position: endPosition, pieceObject: pieceObject })
    if( additionalActions ){ var epNotation = additionalActions.call(this, startPosition) }
    // if( additionalActions ){ additionalActions({position: startPosition}) }
    let prefixNotation = moveObject.notation()
    let notationSuffix = Rules.postMoveQueries( this, prefixNotation )
    // this.movementNotation.push( prefixNotation + (epNotation || "") + notationSuffix)
    this._recordNotationFrom({ moveObject: moveObject, epNotation: (epNotation || ""), notationSuffix:  notationSuffix })
    if( !this.gameOver ){ this._nextTurn() }
  }

  _capture(position){
    let pieceObject = this.layOut[position];
    this.capturedPieces.push(pieceObject);
  }

  _oneSpaceDownIsEmpty(position){
    return this.positionEmpty(position - 8)
  }

  _twoSpacesDownIsEmpty(position){
    return this.positionEmpty(position - 16)
  }

  _downAndLeftIsAttackable(startPosition){
    let positionDownAndLeft = startPosition - 9;
    if( Board._inBounds( positionDownAndLeft )){
      let pieceObject = this.layOut[positionDownAndLeft],
        pieceTeam = Board.parseTeam(pieceObject);
      return this.occupiedByOpponent({position: positionDownAndLeft, teamString: Board.BLACK}) && Board.squareColor(startPosition) === Board.squareColor(positionDownAndLeft)
    } else { // down and left would be off board
      return false
    }
  }

  _downAndRightIsAttackable(startPosition){
    let positionDownAndRight = startPosition - 7;
    if( Board._inBounds( positionDownAndRight ) ){
      let pieceObject = this.layOut[positionDownAndRight],
        pieceTeam = Board.parseTeam(pieceObject);
      return this.occupiedByOpponent({position: positionDownAndRight, teamString: Board.BLACK}) && Board.squareColor(startPosition) === Board.squareColor(positionDownAndRight)
    } else {
      return false
    }
  }

  _twoSpacesUpIsEmpty(position){
    return this.positionEmpty( position + 16)
  }

  _oneSpaceUpIsEmpty(position){
    return this.positionEmpty( position + 8)
  }

  _upAndLeftIsAttackable(startPosition){
    let positionUpAndLeft = startPosition + 7;
    if( Board._inBounds( positionUpAndLeft)){
      let pieceObject = this.pieceObject(positionUpAndLeft),
        pieceTeam = Board.parseTeam(pieceObject);
      return this.occupiedByOpponent({position: positionUpAndLeft, teamString: Board.WHITE}) && Board.squareColor(startPosition) === Board.squareColor(positionUpAndLeft)
    } else {
      return false
    }
  }

  _upAndRightIsAttackable(startPosition){
    let positionUpAndRight = startPosition + 9;
    if( Board._inBounds( positionUpAndRight)){
      let pieceObject = this.layOut[positionUpAndRight],
        pieceTeam = Board.parseTeam(pieceObject);
      return this.occupiedByOpponent({position: positionUpAndRight, teamString: Board.WHITE}) && Board.squareColor(startPosition) === Board.squareColor(positionUpAndRight)
    } else {
      return false
    }
  }

  static backRankFor(team){
    let rankArray = {
      black: 8,
      white: 1
    }
    return rankArray[team]
  }

  kingSideCastleViableFor(team, startPosition){
    if( this.pieceObject(startPosition + 3) !== team + Board.ROOK ){ return false }
    if (Rules.checkQuery({board: this, teamString: this.allowedToMove}) ){ return false }
    // thinks you can castle if rook was captured but never moved!
    let moveNotations = this.movesNotationFor(team),
      regexes = [/Rh/, /Rg/, /Rf/];
    if(team === Board.WHITE){
      if( startPosition !== 4 ){ return false }
      var necessaryEmptyPositions = [5,6];
      regexes.push(/Ke2/, /Kd1/, /Kd2/, /Kf1/, /Kf2/, /Kg1/, /Kc1/)
    } else if( team === Board.BLACK){
      if( startPosition !== 60 ){ return false }
      var necessaryEmptyPositions = [61,62];
        regexes.push(/Ke7/, /Kd8/, /Kd7/, /Kf8/, /Kf7/, /Kg8/, /Kc8/)
    } else {
      alert('bad input for board.kingSideCastleViableFor :' + team)
    }
    for( let i = 0; i < necessaryEmptyPositions.length; i++){
      let necessaryEmptyPosition = necessaryEmptyPositions[i];
      if( !this.positionEmpty( necessaryEmptyPosition ) ){ return false }
    }
    for(let j = 0; j < moveNotations.length; j++){
      let notation = moveNotations[j];
      for(let i = 0; i < regexes.length; i++){
        let regex = regexes[i];
        if( regex.exec(notation) ){ return false }
      }
    }
    return true;
  }

  queenSideCastleViableFor(team, startPosition){
    if( this.pieceObject(startPosition - 4) !== team + Board.ROOK ){ return false }
    if (Rules.checkQuery({board: this, teamString: this.allowedToMove}) ){ return false }
    // thinks you can castle if rook was captured but never moved!
    let moveNotations = this.movesNotationFor(team),
      regexes = [/Ra/, /Rb/, /Rc/, /Rd/];
    if(team === Board.WHITE){
      if( startPosition !== 4 ){ return false }
      var necessaryEmptyPositions = [1,2,3];
        regexes.push(/Ke2/, /Kd1/, /Kd2/, /Kf1/, /Kf2/, /Kg1/, /Kc1/);
    } else if( team === Board.BLACK){
      if( startPosition !== 60 ){ return false }
      var necessaryEmptyPositions = [59,58,57];
        regexes.push(/Ke7/, /Kd8/, /Kd7/, /Kf8/, /Kf7/, /Kg8/, /Kc8/)
    } else {
      alert('bad input for board.kingSideCastleViableFor :' + team)
    }
    for( let i = 0; i < necessaryEmptyPositions.length; i++){
      let necessaryEmptyPosition = necessaryEmptyPositions[i];
      if( !this.positionEmpty( necessaryEmptyPosition ) ){ return false }
    }
    for(let j = 0; j < moveNotations.length; j++){
      let notation = moveNotations[j];
      for(let i = 0; i < regexes.length; i++){
        let regex = regexes[i];
        if( regex.exec(notation) ){ return false }
      }
    }
    return true;
  }

  _kingSideCastleIsClear(kingPosition){
    return this.positionEmpty(kingPosition + 1) && this.positionEmpty(kingPosition + 2 )
  }

  _queenSideCastleIsClear(kingPosition){
    return this.positionEmpty(kingPosition - 1 ) && this.positionEmpty(kingPosition - 2 ) && this.positionEmpty(kingPosition - 3 )
  }

  _kingSideRookHasNotMoved(kingPosition){
    let kingSideRookStartPosition = kingPosition + 3;
    return (this.pieceTypeAt( kingSideRookStartPosition ) ===Board.ROOK) && this.pieceHasNotMovedFrom( kingSideRookStartPosition )
  }

  _queenSideRookHasNotMoved(kingPosition){
    let queenSideRookStartPosition = kingPosition - 4;

    return (this.pieceTypeAt( queenSideRookStartPosition ) ===Board.ROOK) && this.pieceHasNotMovedFrom( queenSideRookStartPosition )
  }

  pieceObject(position){
    position = Board.convertPositionFromAlphaNumeric(position)
    return this.layOut[position]
  }

  _emptify(position){
    this.layOut[position] = Board.EMPTY + Board.EMPTY
  }

  _placePiece({position: position, pieceObject: pieceObject}){
    this.layOut[position] = pieceObject
  }

  _promotePawn(position){
    let teamString = this.teamAt(position);
    this.layOut[position] = teamString  + Board.QUEEN
  }

  teamAt(position){
    position = Board.convertPositionFromAlphaNumeric(position)
    if( !Board._inBounds(position) ){
      return Board.EMPTY
    };
    let pieceObject = this.pieceObject(position),
      teamString = Board.parseTeam( pieceObject );
    return teamString
  }

  positionsOccupiedByTeam(teamString){
    let positions = this._positionsOccupiedByTeam(teamString),
    alphaNumericPositions = [];
    for (let i = 0; i < positions.length; i++){
      alphaNumericPositions.push( Board.gridCalculator( positions[i] ))
    }
    return alphaNumericPositions;
  }

  _positionsOccupiedByOpponentOf(teamString){
    let opposingTeam = Board.opposingTeam(teamString);
    return this._positionsOccupiedByTeam(opposingTeam)
  }

  _positionsOccupiedByTeam(teamString){
    let positions = [];
    for( let i = 0; i < this.layOut.length && positions.length < 16; i++){
      let teamAt = this.teamAt(i);
      if(teamAt === teamString){
        positions.push(i)
      };
    };
    return positions
  }

  occupiedByTeamMate({position: position, teamString: teamString}){
    position = Board.convertPositionFromAlphaNumeric(position)
    let occupantTeam = this.teamAt(position);
    return teamString === occupantTeam
  }

  occupiedByOpponent({position: position, teamString: teamString}){
    position = Board.convertPositionFromAlphaNumeric(position)
    let occupantTeam = this.teamAt(position);
    return !this.positionEmpty(position) && teamString !== occupantTeam
  }

  positionEmpty(position){
    position = Board.convertPositionFromAlphaNumeric(position)
    let pieceObject = this.pieceObject(position)
    return Board.parseTeam( pieceObject ) === Board.EMPTY
  }

  pieceTypeAt(position){
    position = Board.convertPositionFromAlphaNumeric(position)
    let pieceObject = this.pieceObject(position),
      pieceType = Board.parseSpecies( pieceObject );
    return pieceType
  }

  kingPosition(teamString){
    let position = this._kingPosition(teamString);
    return Board.gridCalculator(position);
  }

  _kingPosition(teamString){
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
