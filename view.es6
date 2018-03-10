class View{
	//TODO pretty sure this could be a singleton even on a server with several games running
  // priority clean up alternations position vs gridCalculator
  constructor(_gameController){
    this.boundHighlightTile = this.highlightTile.bind(this)
    this.boundAttemptMove = this.attemptMove.bind(this)
    this._gameController = _gameController
  }

  static get TILE_HEIGHT() { return "49" }

  displayAlert(messages){
    for (let i = 0; i < messages.length; i++){
      $('#notifications').text(messages[i])
    };
  };
  clearAlerts(){
    $('#notifications').text("")
  };
  undisplayPiece(gridPosition){
    let element = document.getElementById( gridPosition ),
      children  = element.children;
    for( let i = 0; i < children.length; i ++){
      children[i].remove()
    };
  };
  displayPiece(args){
    let elem = document.createElement("img"),
      pieceInitials = args["pieceInitials"],
      // TODO turns out gridPosition is more like element class, and it has to be unique, so it should probably be element id
      gridPosition = args["gridPosition"];
    elem.setAttribute("src", this.pieceImgSrc( pieceInitials ) );
    elem.setAttribute("height", View.TILE_HEIGHT);
    elem.setAttribute("width", View.TILE_HEIGHT);
    let element = document.getElementById( gridPosition );
    element.appendChild(elem)
  };
  displayLayOut(board){
    let layOut = board.layOut;
    for( let i = 0; i < layOut.length; i++){
      let gridPosition = Board.gridCalculator(i),
          pieceInitials = this.pieceInitials(layOut[i]);
      this.undisplayPiece(gridPosition);
      let pieceObject = board.pieceObject( i )
      if( Board.parseTeam( pieceObject) !== Board.EMPTY ){
        this.displayPiece({pieceInitials: pieceInitials, gridPosition: gridPosition})
      };
    };
    this.setTileClickListener();
    this.blackCaptureDivNeedsExpanding(board);
    this.whiteCaptureDivNeedsExpanding(board);
    this.updateCaptures(board);
    this.clearAlerts();
  };
  pieceImgSrc(pieceInitials){
    return "img/chesspieces/wikipedia/" + pieceInitials + ".png"
  };
  pieceInitials(pieceObject){
    pieceObject = JSON.parse(pieceObject);
    let firstInitial = Board.parseTeam( pieceObject )[0],
      secondInitial = pieceObject.species[0];
    return firstInitial + secondInitial
  };
  highlightTile(){
    let target = arguments[0].currentTarget,
      img = target.children[0],
      position = Board.gridCalculatorReverse( target.id ),
      team = Board.EMPTY;
    this.unhighlLighTiles();
    this.setTileClickListener();
    if (img) {
      team = this.teamSet(img.src)
      if (team === this._gameController.board.allowedToMove){
        let viables = Rules.viablePositionsFromKeysOnly( {startPosition: position, board: this._gameController.board } )
        for (let i = 0; i < viables.length; i++){
          let tilePosition = viables[i],
           alphaNumericPosition = Board.gridCalculator(tilePosition),
           square = document.getElementById(alphaNumericPosition);
          square.classList.add("highlight2")
          square.removeEventListener("click", this.boundHighlightTile )
          square.addEventListener("click", this.boundAttemptMove )
        }
        target.classList.add("highlight1")
        target.classList.add("startPosition");
      }
    }
  }
  retrieveTiles(){
    return document.getElementsByClassName("chess-tile")
  }
  teamSet(src){
    let regex = /(\w)[A-Z]\.png$/,
      teamInitial = src.match(regex)[1];
    if( teamInitial === "b"){
      return Board.BLACK;
    }else if (teamInitial === "w") {
      return Board.WHITE;
    }else {
      throw new Error("error in teamSet")
    }
  }
  unhighlLighTiles(){
    let tiles = this.retrieveTiles();
    for(let i = 0 ; i < tiles.length ; i++ ){
    	var tile = tiles[i];
      tile.removeEventListener("click", this.boundHighlightTile);
      tile.removeEventListener("click", this.boundAttemptMove);
      tile.classList.remove("startPosition");
    	tile.classList.remove("highlight1");
    	tile.classList.remove("highlight2");
    }
  }
  updateTeamAllowedToMove(board){
    let span = document.getElementById("team-allowed-to-move");
    span.innerText = board.allowedToMove
  }
  updateCaptures(board){
    let blackCaptureDiv = document.getElementById("black-captures"),
      whiteCaptureDiv = document.getElementById("white-captures"),
      // board would be accessible here if it was passed into displayLayOut
      capturedPieces = board.capturedPieces;
    blackCaptureDiv.innerHTML = "";
    whiteCaptureDiv.innerHTML = "";
    for (let i = 0; i < capturedPieces.length; i++){
      let pieceObject = capturedPieces[i],
        team = Board.parseTeam( JSON.parse(pieceObject ) ),
        pieceInitials = this.pieceInitials(pieceObject);
      this.displayPiece({pieceInitials: pieceInitials, gridPosition: team + "-captures"})
    }
  }
  attemptMove(){
    let target = arguments[0].currentTarget,
      endPosition = Board.gridCalculatorReverse( target.id ),
      startElement = document.getElementsByClassName("startPosition")[0],
      startPosition = Board.gridCalculatorReverse( startElement.id );
    this.unhighlLighTiles();
    this.setTileClickListener();
    // TODO not quite sure how to disentangle the global gameController here
    // maybe there's some way the gameController could inject itself when setting the click listeners?
    this._gameController.attemptMove(startPosition, endPosition);
  }
  setTileClickListener(){
    // TODO currently needlessly passing in a gameController above,
    // want to be able to pass it in as an argument on highlightTile
    let tiles = this.retrieveTiles();
    for(let i = 0 ; i < tiles.length ; i++ ){
    	var tile = tiles[i];
    	tile.addEventListener("click", this.boundHighlightTile );
    }
  }
  blackCaptureDivNeedsExpanding(board){
    let capturedPieces = board.capturedPieces,
      total = 0;
    for(let i = 0; i < capturedPieces.length; i++){
      // TODO priority make more generalized parse on board
      if ( Board.parseTeam( JSON.parse(capturedPieces[i]) ) === Board.BLACK) { total++ }
    }
    if( total === 11 ){ this.expandBlackCaptureDiv() }
  }

  whiteCaptureDivNeedsExpanding(board){
    let capturedPieces = board.capturedPieces,
      total = 0;
    for(let i = 0; i < capturedPieces.length; i++){
      // TODO priority make more generalized parse on board
      if ( Board.parseTeam( JSON.parse(capturedPieces[i]) ) === Board.WHITE) { total++ }
    }
    if( total === 11 ){ this.expandWhiteCaptureDiv() }
  }
  expandWhiteCaptureDiv(){
    let div = document.getElementById("white-captures")
    div.style.height = 98
  }
  expandBlackCaptureDiv(){
    let div = document.getElementById("black-captures")
    div.style.height = 98
  }
  setUndoClickListener(gameConr){
    let undoButton = document.getElementById("undo-button");
    undoButton.addEventListener("click", gameConr.undo.bind(gameConr))
  }
}
