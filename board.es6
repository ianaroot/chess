class Board {
  // TODO might be easier to store the moveObjects and recreate noatation on demand!!!
  constructor({layOut: layOut, capturedPieces: capturedPieces, gameOver: gameOver, allowedToMove: allowedToMove, movementNotation: movementNotation, previousLayouts: previousLayouts, teamValues: teamValues}){
    this.layOut = layOut|| Layout.default()
    this.capturedPieces = capturedPieces || [];
    this.gameOver = gameOver || false;
    this.allowedToMove = allowedToMove || Board.WHITE;
    this.movementNotation = movementNotation || [];
    this.previousLayouts = previousLayouts || JSON.stringify([])
    // TODO MAGIC STRING
    this.teamValues = teamValues || {0b000000: 39, 0b001000: 39}
  }

  bit_test(num, bit){
    return ((num>>bit) % 2 != 0)
  }

  bit_set(num, bit){
      return num | 1<<bit;
  }

  bit_clear(num, bit){
      return num & ~(1<<bit);
  }

  bit_toggle(num, bit){
      return bit_test(num, bit) ? bit_clear(num, bit) : bit_set(num, bit);
  }

  static get PIECE_AND_COLOR_MASK()  { return 15 }
  static get PIECE_COLOR_BIT()      { return 3 }
  static get EMPTY_BIT()            { return 5 }
//   empty?   moved?   white?    piecetype
//   0        0        0         000




                                          // WHITE QUEEN    //1110
  // static get EMPTY()  { return "e" }      // 0000
  static get PAWN()   { return 0b001 }      // 0001
  static get ROOK()   { return 0b010 }      // 0010
  static get KNIGHT() { return 0b011 }      // 0011
  static get BISHOP() { return 0b100 }      // 0100
  static get KING()   { return 0b101 }      // 0101
  static get QUEEN()  { return 0b110 }      // 0110
  static get DARK()   { return "dark" }   // 0111
  static get LIGHT()  { return "light" }  // 1000
  // static get WHITE()  { return "W" }      // 1001
  // static get BLACK()  { return "B" }      // 1010

  static get WHITE()                { return 0b001000 }
  static get BLACK()                { return 0b000000 }

  static get EMPTY()                { return 0b100000 }
  static get UNMOVED_WHITE_PAWN()   { return 0b001001 }
  static get UNMOVED_WHITE_ROOK()   { return 0b001010 }
  static get UNMOVED_WHITE_KNIGHT() { return 0b001011 }
  static get UNMOVED_WHITE_BISHOP() { return 0b001100 }
  static get UNMOVED_WHITE_KING()   { return 0b001101 }
  static get UNMOVED_WHITE_QUEEN()  { return 0b001110 }

  static get UNMOVED_BLACK_PAWN()   { return 0b000001 }
  static get UNMOVED_BLACK_ROOK()   { return 0b000010 }
  static get UNMOVED_BLACK_KNIGHT() { return 0b000011 }
  static get UNMOVED_BLACK_BISHOP() { return 0b000100 }
  static get UNMOVED_BLACK_KING()   { return 0b000101 }
  static get UNMOVED_BLACK_QUEEN()  { return 0b000110 }



  static get MINOR_PIECES() { return [Board.KNIGHT, Board.BISHOP] }
  static get MAJOR_PIECES() { return [Board.ROOK, Board.QUEEN]}

  static pieceAndColorBits(bits){
    return (bits & Board.PIECE_AND_COLOR_MASK)
  }

  static _boundaries(){
    return { upperLimit: 63, lowerLimit: 0 }
  }

// i know this isn't really making a deep copy
  static _deepCopy(originalObject){
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

  static _inBounds(position){
    return position <= this._boundaries().upperLimit && position >= this._boundaries().lowerLimit
  }

  static emptyBitOn(bits){
    return ( bits >> Board.EMPTY_BIT ) % 2
  }

  static parseTeam( bits ){
    // return ( bits >> Board.PIECE_COLOR_BIT ) % 2
    if (Board.whiteBitOn( bits ) ){
      return Board.WHITE
    } else {
      return Board.BLACK
    }
  }

  static whiteBitOn(bits){
    return ( bits >> Board.PIECE_COLOR_BIT ) % 2
  }

  static parseSpecies( bits ){
    // return string[1]
    return bits & 7
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
      let uncapturedPiece = this.capturedPieces.pop(),
      team = Board.parseTeam(uncapturedPiece),
      species = Board.parseSpecies(uncapturedPiece),
      value = Board.pieceValues()[species];
      this.teamValues[team] = this.teamValues[team] + value
      this.gameOver = false
    }
    this._nextTurn()
  }

  pieceValue(team){
    return this.teamValues[team]
  }

  static pieceValues(){
    let values = {};
    values[Board.EMPTY] = 0;
    values[Board.PAWN] = 1;
    values[Board.KNIGHT] = 3;
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
        // TODO FIX MAGIC STRING
        newBoard = new Board({layOut: newLayout, capturedPieces: newCaptures, allowedToMove: this.allowedToMove, gameOver: this.gameOver, movementNotation: newMovementNotation, previousLayouts: this.previousLayouts, teamValues: {0b001000: this.teamValues[0b001000], 0b000000: this.teamValues[0b000000]}});
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

  _recordNotationFrom({ notationPrefix: notationPrefix, epNotation: epNotation, notationSuffix:  notationSuffix }){
    // if other pieces of same species from same team could move to the same place, attach clarifying file or rank
    // for rooks, if Rb goes to a6, is there already a rook on 6? it could've done that too
    // if it's a queen, is there another queen? if there is another queen, is it on the right rank, file, or square color?
    // if its a bishop, is there another bishop on the right square color?
    // if it it's a night, is there anot

    // oooh! could you bump into your teammate from the position you just assumed!! take their rank and file, compare, apply the difference
    if( /[QNBR]/.exec(notationPrefix) ){

    }

    this.movementNotation.push( notationPrefix + (epNotation || "") + notationSuffix)
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
    let notationPrefix = moveObject.notation()
    let notationSuffix = Rules.postMoveQueries( this, notationPrefix )
    // this.movementNotation.push( prefixNotation + (epNotation || "") + notationSuffix)
    this._recordNotationFrom({ notationPrefix: notationPrefix, epNotation: (epNotation || ""), notationSuffix:  notationSuffix })
    if( !this.gameOver ){ this._nextTurn() }
  }

  _capture(position){
    let pieceObject = this.layOut[position],
      team = Board.parseTeam(pieceObject),
      species = Board.parseSpecies(pieceObject);
    this.capturedPieces.push(pieceObject);
    this.teamValues[team] = this.teamValues[team] -  Board.pieceValues()[species]
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
    if (Rules.checkQuery({board: this, teamString: this.allowedToMove}) ){ return false }
    if (Rules.pieceWillBeAttackedAfterMove({board: this, moveObject: {startPosition: startPosition, endPosition: startPosition + 1 }}) ){ return false }
    return true;
  }

  queenSideCastleViableFor(team, startPosition){
    if( this.pieceObject(startPosition - 4) !== team + Board.ROOK ){ return false }
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
    if (Rules.checkQuery({board: this, teamString: this.allowedToMove}) ){ return false }
    if (Rules.pieceWillBeAttackedAfterMove({board: this, moveObject: {startPosition: startPosition, endPosition: startPosition - 1 } }) ){ return false }
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

// TODO this is very bad name, maybe pieceBits ??
  pieceObject(position){
    return this.layOut[position]
  }

  _emptify(position){
    this.layOut[position] = Board.EMPTY
  }

  _placePiece({position: position, pieceObject: pieceObject}){
    this.layOut[position] = pieceObject
  }

  _promotePawn(position){
    let teamString = this.teamAt(position);
    this.layOut[position] = teamString  + Board.QUEEN
    this.teamValues[teamString] = this.teamValues[teamString] + 8
  }

  empty(position){
    var bits = this.layOut[position];
    return this.bit_test(bits, Board.EMPTY_BIT)
  }

  teamAt(position){
    if( !Board._inBounds(position) || this.empty(position) ){
      return Board.EMPTY
    };
    let pieceObject = this.pieceObject(position),
      teamString = Board.parseTeam( pieceObject );
    return teamString
  }

  // positionsOccupiedByTeam(teamString){
  //   let positions = this._positionsOccupiedByTeam(teamString),
  //   alphaNumericPositions = [];
  //   for (let i = 0; i < positions.length; i++){
  //     alphaNumericPositions.push( Board.gridCalculator( positions[i] ))
  //   }
  //   return alphaNumericPositions;
  // }
  //
  // _positionsOccupiedByOpponentOf(teamString){
  //   let opposingTeam = Board.opposingTeam(teamString); //this was removed and i'm not sure it wasn't a mistake but it's in a commented oput function anyways...
  //   let pieceValue = Board.opposingTeam(teamString);
  //   return this._positionsOccupiedByTeam(opposingTeam)
  // }

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
    let occupantTeam = this.teamAt(position);
    return teamString === occupantTeam
  }

  occupiedByOpponent({position: position, teamString: teamString}){
    let occupantTeam = this.teamAt(position);
    return !this.positionEmpty(position) && teamString !== occupantTeam
  }

  positionEmpty(position){
    let pieceObject = this.pieceObject(position)
    return pieceObject === Board.EMPTY
  }

  pieceTypeAt(position){
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
