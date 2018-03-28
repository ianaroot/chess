class Board {

  constructor({layOut: layOut, capturedPieces: capturedPieces, gameOver: gameOver, allowedToMove: allowedToMove, movementNotation: movementNotation, previousLayouts: previousLayouts}){
    this._layOut = JSON.stringify(layOut) || Board._defaultLayOut()
    this._capturedPieces = JSON.stringify(capturedPieces || []);
    this.gameOver = gameOver || false;
    this.allowedToMove = allowedToMove || Board.WHITE;
    // TODO stringify notation and previousLayouts
    this.movementNotation = movementNotation || [];
    this.previousLayouts = previousLayouts || [];
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
  static get MINOR_PIECES() { return [Board.NIGHT, Board.BISHOP] }
  static get MAJOR_PIECES() { return [Board.ROOK, Board.QUEEN]}



  static _defaultLayOut(){
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

    // let layOut = [{color: "white", species: "Rook"},{color: "empty", species: "empty"},{color: "white", species: "Bishop"},{color: "white", species: "Queen"},{color: "white", species: "King"},{color: "white", species: "Bishop"},
    //   {color: "white", species: "Night"},{color: "white", species: "Rook"},{color: "white", species: "Pawn"},
    //   {color: "white", species: "Pawn"},{color: "white", species: "Pawn"},{color: "white", species: "Pawn"},{color: "empty", species: "empty"},{color: "white", species: "Pawn"},{color: "white", species: "Pawn"},
    //   {color: "white", species: "Pawn"},{color: "empty", species: "empty"},{color: "empty", species: "empty"},{color: "white", species: "Night"},{color: "empty", species: "empty"},{color: "white", species: "Pawn"},
    //   {color: "empty", species: "empty"},{color: "empty", species: "empty"},{color: "empty", species: "empty"},{color: "empty", species: "empty"},{color: "empty", species: "empty"},{color: "empty", species: "empty"},
    //   {color: "empty", species: "empty"},{color: "empty", species: "empty"},{color: "empty", species: "empty"},{color: "empty", species: "empty"},{color: "empty", species: "empty"},{color: "empty", species: "empty"},
    //   {color: "empty", species: "empty"},{color: "empty", species: "empty"},{color: "empty", species: "empty"},{color: "black", species: "Pawn"},{color: "empty", species: "empty"},{color: "empty", species: "empty"},
    //   {color: "empty", species: "empty"},{color: "black", species: "Night"},{color: "empty", species: "empty"},{color: "empty", species: "empty"},{color: "empty", species: "empty"},{color: "empty", species: "empty"},
    //   {color: "empty", species: "empty"},{color: "empty", species: "empty"},{color: "empty", species: "empty"},{color: "black", species: "Pawn"},{color: "black", species: "Pawn"},{color: "black", species: "Pawn"},
    //   {color: "black", species: "Pawn"},{color: "empty", species: "empty"},{color: "black", species: "Pawn"},{color: "black", species: "Pawn"},{color: "black", species: "Pawn"},{color: "black", species: "Rook"},
    //   {color: "empty", species: "empty"},{color: "black", species: "Bishop"},{color: "black", species: "Queen"},{color: "black", species: "King"},{color: "black", species: "Bishop"},{color: "black", species: "Night"},
    //   {color: "black", species: "Rook"}]; //approachingMate used for training bot to seek mate

    // for(let i = 0; i < layOut.length; i ++){
    //   let pieceObject = layOut[i]
    //   layOut[i] = JSON.stringify(pieceObject)
    // }
    return JSON.stringify(layOut)
  }

  get layOut() {
    return JSON.parse(this._layOut)
  }

  get capturedPieces(){
    return JSON.parse(this._capturedPieces)
  }

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
    return string.color
  }

  static parseSpecies(string){
    return string.species
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
    this.layOut = this.lastLayout()
    this.previousLayouts.pop()
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
      // let piece = JSON.parse( captures[i] );
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

  pieceObject(position){
    position = Board.convertPositionFromAlphaNumeric(position)
    // return JSON.parse(this.layOut[position])
    return this.layOut[position]
  }

  // pieceObjectFromLastLayout(position){
  //   position = Board.convertPositionFromAlphaNumeric(position)
  //   return JSON.parse( this.lastLayout()[position] )
  // }

  _blackPawnAt(position){
    return Board.parseTeam( this.pieceObject(position) )=== Board.BLACK && Board.parseSpecies( this.pieceObject(position) ) === Board.PAWN
  }

  _whitePawnAt(position){
    return Board.parseTeam( this.pieceObject(position) )=== Board.WHITE && Board.parseSpecies( this.pieceObject(position) ) === Board.PAWN
  }

  // blackPawnDoubleSteppedFrom(position){
  //   return this.previousLayouts.length && this.positionEmpty(position) && Board.parseTeam( this.pieceObjectFromLastLayout(position) ) === Board.BLACK && Board.parseSpecies( this.pieceObjectFromLastLayout(position) ) === Board.PAWN
  // }

  blackPawnDoubleSteppedTo(position){
    // only to be called if already know the black pawn is at rank 4
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
      }
    }
    return result
  }

  // whitePawnDoubleSteppedFrom(position){
  //   return this.previousLayouts.length && this.positionEmpty(position) && Board.parseTeam( this.pieceObjectFromLastLayout(position) ) === Board.WHITE && Board.parseSpecies( this.pieceObjectFromLastLayout(position) ) === Board.PAWN
  // }

  whitePawnDoubleSteppedTo(position){
    // debugger
    // only to be called if already know the black pawn is at rank 4
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
      }
    }
    return result
  }

  movesNotationFor(team){
    // var initialElement;
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
    // let newLayOut = Board._deepCopy(this.layOut),
    //     newCapturedPieces = Board._deepCopy(this.capturedPieces),
      let newMovementNotation = Board._deepCopy(this.movementNotation),
        newPreviousLayouts = Board._deepCopy(this.previousLayouts),

        newBoard = new Board({layOut: this.layOut, capturedPieces: this.capturedPieces, allowedToMove: this.allowedToMove, gameOver: this.gameOver, previousLayouts: newPreviousLayouts, movementNotation: newMovementNotation});
    return newBoard;
  }

  _reset(){
    this.layOut = Board._defaultLayOut();
    this.capturedPieces = [];
    this.gameOver = false;
    this.allowedToMove = Board.WHITE;
    this.previousLayouts = [];
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

  _recordNotationFrom(moveObject){
    if( moveObject.fullNotation ){
      var notation = moveObject.fullNotation + moveObject.captureNotation + moveObject.positionNotation + moveObject.promotionNotation + moveObject.checkNotation
    } else {
      moveObject.positionNotation = Board.gridCalculator(moveObject.endPosition);
      var	notation = moveObject.pieceNotation + moveObject.captureNotation + moveObject.positionNotation + moveObject.promotionNotation + moveObject.checkNotation;
    }
    this.movementNotation.push(notation)
  }

  _hypotheticallyMovePiece( moveObject ){
    // there's a lot of space between _officiallyMovePiece and hypothetical. eg  not recording any data on hypothetical moves
    let startPosition = moveObject.startPosition,
      endPosition = moveObject.endPosition,
      additionalActions = moveObject.additionalActions;
      let pieceObject = this.pieceObject(startPosition);
    this._emptify(startPosition)
    this._placePiece({ position: endPosition, pieceObject: pieceObject })
    if( additionalActions ){ additionalActions.call(this, {position: startPosition} ) }
  }

  _officiallyMovePiece( moveObject ){
    if( !MoveObject.prototype.isPrototypeOf( moveObject ) ){ throw new Error("missing params in movePiece") }
    let startPosition = moveObject.startPosition,
      endPosition = moveObject.endPosition,
      additionalActions = moveObject.additionalActions,
      pieceObject = this.pieceObject(startPosition);
    this._storeCurrentLayoutAsPrevious()
    this._emptify(startPosition)
    moveObject.captureNotation = this._capture(endPosition);
    this._placePiece({ position: endPosition, pieceObject: pieceObject })
    if( additionalActions ){ moveObject.captureNotation = additionalActions.call(this, {position: startPosition} ) }
    Rules.pawnPromotionQuery({board: this, moveObject: moveObject} );
		Rules.checkmateQuery({board: this, moveObject: moveObject})
    if( !this.gameOver ){
      var otherTeam = this.teamNotMoving(),
        otherTeamsKingPosition = this._kingPosition(otherTeam);
      Rules.checkQuery( {startPosition: otherTeamsKingPosition, endPosition: otherTeamsKingPosition, board: this, moveObject: moveObject} )
      Rules.stalemateQuery({board: this, moveObject: moveObject});
    }
    this._recordNotationFrom(moveObject)
    if( !this.gameOver ){ this._nextTurn() }
  }

  _storeCurrentLayoutAsPrevious(){
    let layOutCopy = Board._deepCopy( this.layOut );
    this.previousLayouts.push(layOutCopy)
  }

  addToCaptures(pieceObject){
    let captures = this.capturedPieces;
    captures.push(pieceObject);
    this._capturedPieces = JSON.stringify(captures)
  }

  _capture(position){
    let captureNotation = ""
    if( !this.positionEmpty(position) ){
      let pieceObject = this.layOut[position];
      this.addToCaptures(pieceObject)
      this._emptify(position)
      captureNotation = "x"
    } else {
      return captureNotation
    }
      return captureNotation
  }

  lastLayout(){
    return this.previousLayouts[this.previousLayouts.length - 1]
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

  // kingSideCastleViableFrom(position){
  // let teamRank = Board.backRankFor( team )

  // position = Board.convertPositionFromAlphaNumeric(position)
  // return(
  //   this.pieceHasNotMovedFrom(position) && this._kingSideCastleIsClear(position) && this._kingSideRookHasNotMoved(position)
  //   && !Rules.checkQuery({startPosition: position, endPosition: position, board: this })
  //   && !Rules.checkQuery({startPosition: (position), endPosition: (position + 1), board: this })
  // )


  // rook hasn't moved
  // king hasn't moved
  // space between is opened
  kingSideCastleViableFor(team){
    let moveNotations = this.movesNotationFor(team),
      regexes = [/Rh/, /Rg/, /Rf/];
    if(team === Board.WHITE){
      var necessaryEmptyPositions = [5,6];
      regexes = regexes.concat([/Ke2/, /Kd1/, /Kd2/, /Kf1/, /Kf2/, /Kg1/, /Kc1/])
    } else if( team === Board.BLACK){
      var necessaryEmptyPositions = [61,62];
        regexes = regexes.concat([/Ke7/, /Kd8/, /Kd7/, /Kf8/, /Kf7/, /Kg8/, /Kc8/])
    } else {
      alert('bad input for board.kingSideCastleViableFor :' + team)
    }
    for(let j = 0; j < moveNotations.length; j++){
      let notation = moveNotations[j];
      for(let i = 0; i < regexes.length; i++){
        let regex = regexes[i];
        if( regex.exec(notation) ){ return false }
      }
    }
    for( let i = 0; i < necessaryEmptyPositions.length; i++){
      let necessaryEmptyPosition = necessaryEmptyPositions[i];
      if( !this.positionEmpty( necessaryEmptyPosition ) ){ return false }
    }
    return true;
  }

  // queenSideCastleViableFrom(position){
  //   position = Board.convertPositionFromAlphaNumeric(position)
  //   return(
  //     this.pieceHasNotMovedFrom(position) && this._queenSideCastleIsClear(position) && this._queenSideRookHasNotMoved(position)
  //     && !Rules.checkQuery({startPosition: position, endPosition: position, board: this })
  //     && !Rules.checkQuery({startPosition: (position), endPosition: (position - 1), board: this })
  //   )
  queenSideCastleViableFor(team){
    let moveNotations = this.movesNotationFor(team),
      regexes = [/Ra/, /Rb/, /Rc/, /Rd/];
    if(team === Board.WHITE){
      var necessaryEmptyPositions = [1,2,3];
        regexes = regexes.concat([/Ke2/, /Kd1/, /Kd2/, /Kf1/, /Kf2/, /Kg1/, /Kc1/]);
    } else if( team === Board.BLACK){
      var necessaryEmptyPositions = [59,58,57];
        regexes = regexes.concat([/Ke7/, /Kd8/, /Kd7/, /Kf8/, /Kf7/, /Kg8/, /Kc8/])
    } else {
      alert('bad input for board.kingSideCastleViableFor :' + team)
    }
    for(let j = 0; j < moveNotations.length; j++){
      let notation = moveNotations[j];
      for(let i = 0; i < regexes.length; i++){
        let regex = regexes[i];
        if( regex.exec(notation) ){ return false }
      }
    }
    for( let i = 0; i < necessaryEmptyPositions.length; i++){
      let necessaryEmptyPosition = necessaryEmptyPositions[i];
      if( !this.positionEmpty( necessaryEmptyPosition ) ){ return false }
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

  pieceHasNotMovedFrom(position){
    position = Board.convertPositionFromAlphaNumeric(position)
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

  setLayOut(position, pieceObject){
    let layOut = JSON.parse(this._layOut);
    layOut[position] = pieceObject;
    this._layOut = JSON.stringify(layOut)
  }

  _emptify(position){
    // this.layOut[position] = JSON.stringify({color: Board.EMPTY, species: Board.EMPTY})
    // this._layOut[position] = {color: Board.EMPTY, species: Board.EMPTY}
    this.setLayOut(position, {color: Board.EMPTY, species: Board.EMPTY})
  }

  _placePiece({position: position, pieceObject: pieceObject}){
    // this.layOut[position] = JSON.stringify(pieceObject)
    this.setLayOut(position, pieceObject)
  }

  _promotePawn(position){
    let teamString = this.teamAt(position);
    // this.layOut[position] = JSON.stringify({color: teamString , species: Board.QUEEN})
    this.setLayOut(position, {color: teamString , species: Board.QUEEN})
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
    for( let i = 0; i < this.layOut.length; i++){
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
