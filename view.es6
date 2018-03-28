class View{
  constructor(_gameController){
    this.boundHighlightTile = this.highlightTile.bind(this)
    this.boundAttemptMove = this.attemptMove.bind(this)
    this._gameController = _gameController
  }

  static get TILE_HEIGHT() { return "49" }

  displayAlerts(messages){
    if(messages){
      for (let i = 0; i < messages.length; i++){
        document.getElementById( 'notifications' ).innerHTML = messages[i];
      };
    }
  };
  clearAlerts(){
    document.getElementById( 'notifications' ).innerHTML = "";
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
      gridPosition = args["gridPosition"];
    elem.setAttribute("src", this.pieceImgSrc( pieceInitials ) );
    elem.setAttribute("height", View.TILE_HEIGHT);
    elem.setAttribute("width", View.TILE_HEIGHT);
    let element = document.getElementById( gridPosition );
    element.appendChild(elem)
  };
  displayLayOut(args){

    let board = args["board"],
        alerts = args["alerts"],
        layOut = board.layOut;
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
		this.updateTeamAllowedToMove(board);
    this.displayAlerts(alerts)
  };
  pieceImgSrc(pieceInitials){
    return "img/chesspieces/wikipedia/" + pieceInitials + ".png"
  };
  pieceInitials(pieceObject){
    // debugger
    // pieceObject = JSON.parse(pieceObject);
    let firstInitial = Board.parseTeam( pieceObject )[0],
      secondInitial = pieceObject.species[0];
    return firstInitial + secondInitial
  };
  highlightTile(){
    if(!this._gameController.board.gameOver){
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
  }
  retrieveTiles(){
    return document.getElementsByClassName("chess-tile")
  }
  teamSet(src){
    let regex = /(\w)[A-Z]\.png$/,
      teamInitial = src.match(regex)[1];
    if( teamInitial === "B"){
      return Board.BLACK;
    }else if (teamInitial === "W") {
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
      capturedPieces = board.capturedPieces;
    blackCaptureDiv.innerHTML = "";
    whiteCaptureDiv.innerHTML = "";
    for (let i = 0; i < capturedPieces.length; i++){
      let pieceObject = capturedPieces[i],
        // team = Board.parseTeam( JSON.parse(pieceObject ) ),
        team = Board.parseTeam( pieceObject ),
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
    this._gameController.attemptMove(startPosition, endPosition);
  }
  setTileClickListener(){
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
      // if ( Board.parseTeam( JSON.parse(capturedPieces[i]) ) === Board.BLACK) { total++ }
      if ( Board.parseTeam( capturedPieces[i] ) === Board.BLACK) { total++ }
    }
    if( total === 11 ){ this.expandBlackCaptureDiv() }
  }

  whiteCaptureDivNeedsExpanding(board){
    let capturedPieces = board.capturedPieces,
      total = 0;
    for(let i = 0; i < capturedPieces.length; i++){
      // if ( Board.parseTeam( JSON.parse(capturedPieces[i]) ) === Board.WHITE) { total++ }
      if ( Board.parseTeam( capturedPieces[i] ) === Board.WHITE) { total++ }
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
  setUndoClickListener(gameController){
    let undoButton = document.getElementById("undo-button");
    undoButton.addEventListener("click", gameController.undo.bind(gameController))
  }
  setPauseClickListener(gameController){
    let pauseButton = document.getElementById("pause-button");
    pauseButton.addEventListener("click", gameController.pause.bind(gameController))
  }
}
