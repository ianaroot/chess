class View{
	// pretty sure this could be a singleton even on a server with several games running
  // captures don't show up in the browser if the moves are made through the consoler
  // capture display occasionally bugs out and throws in extra pieceString, error is not coming from board
  // clean up alternations position vs gridCalculator
  constructor(){
    this.boundHighlightTile = this.highlightTile.bind(this)
    this.boundAttemptMove = this.attemptMove.bind(this)
  }
  displayAlert(message){
    alert(message)
  }
  undisplayPiece(gridPosition){
    var element = document.getElementById( gridPosition ),
      children  = element.children;
    for( var i = 0; i < children.length; i ++){
      children[i].remove()
    }
  }
  displayPiece(args){
    var elem = document.createElement("img"),
      pieceInitials = args["pieceInitials"],
      // turns out gridPosition is more like element class, and it has to be unique, so it should probably be element id
      gridPosition = args["gridPosition"];
    elem.setAttribute("src", this.pieceImgSrc( pieceInitials ) );
    elem.setAttribute("height", "49");
    elem.setAttribute("width", "49");
    var element = document.getElementById( gridPosition );
    element.appendChild(elem)
  }
  displayLayOut(layOut){
    for( var i = 0; i < layOut.length; i++){
      var gridPosition = Board.gridCalculator(i),
          pieceInitials = this.pieceInitials(layOut[i]);
      this.undisplayPiece(gridPosition);
      if( JSON.parse(layOut[i]).color !== "empty" ){
        this.displayPiece({pieceInitials: pieceInitials, gridPosition: gridPosition})
      }
    }
  }
  pieceImgSrc(pieceInitials){
    return "img/chesspieces/wikipedia/" + pieceInitials + ".png"
  }
  pieceInitials(pieceObject){
    var pieceObject = JSON.parse(pieceObject),
      firstInitial = pieceObject.color[0],
      secondInitial = pieceObject.species[0];
    return firstInitial + secondInitial
  }
  highlightTile(){
    var target = event.currentTarget,
      img = target.children[0],
      position = Board.gridCalculatorReverse( target.id ),
      team = "empty";
    this.unhighlLighTiles();
    this.setClickListener();
    if (img) {
      team = this.teamSet(img.src)
      if (team === gameController.board.allowedToMove){
        var viables = PieceMovementRules.viablePositionsFromKeysOnly( {startPosition: position, board: gameController.board } )
        for (let i = 0; i < viables.length; i++){
          var tilePosition = viables[i],
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
    var regex = /(\w)[A-Z]\.png$/,
      teamInitial = src.match(regex)[1];
    if( teamInitial === "b"){
      return "black";
    }else if (teamInitial === "w") {
      return "white";
    }else {
      alert("error in teamSet")
    }
  }

  unhighlLighTiles(){
    var tiles = this.retrieveTiles();
    for(let i = 0 ; i < tiles.length ; i++ ){
    	var tile = tiles[i];
      tile.removeEventListener("click", this.boundHighlightTile);
      tile.removeEventListener("click", this.boundAttemptMove);
      tile.classList.remove("startPosition");
    	tile.classList.remove("highlight1");
    	tile.classList.remove("highlight2");
    }

  }

  updateTeamAllowedToMove(){
    var span = document.getElementById("team-allowed-to-move");
    span.innerText = gameController.board.allowedToMove
  }

  updateCaptures(){
    var blackCaptureDiv = document.getElementById("black-captures"),
      whiteCaptureDiv = document.getElementById("white-captures"),
      capturedPieces = gameController.board.capturedPieces;
    blackCaptureDiv.innerHTML = "";
    whiteCaptureDiv.innerHTML = "";
    for (let i = 0; i < capturedPieces.length; i++){
      var pieceObject = capturedPieces[i],
        team = JSON.parse(pieceObject).color,
        pieceInitials = this.pieceInitials(pieceObject);
      this.displayPiece({pieceInitials: pieceInitials, gridPosition: team + "-captures"})
    }
  }

  attemptMove(){
    var target = event.currentTarget,
      endPosition = Board.gridCalculatorReverse( target.id ),
      startElement = document.getElementsByClassName("startPosition")[0],
      startPosition = Board.gridCalculatorReverse( startElement.id );
    this.unhighlLighTiles();
    this.setClickListener();
    gameController.attemptMove(startPosition, endPosition);
    this.setClickListener()
    this.updateTeamAllowedToMove()
    this.blackCaptureDivNeedsExpanding()
    this.whiteCaptureDivNeedsExpanding()
    this.updateCaptures()
  }


  clickHighlight(){
    highlightTile();
  }

  setClickListener(){
    var tiles = this.retrieveTiles();
    for(let i = 0 ; i < tiles.length ; i++ ){
    	var tile = tiles[i];
    	tile.addEventListener("click", this.boundHighlightTile );
    }
  }

  blackCaptureDivNeedsExpanding(){
    var capturedPieces = gameController.board.capturedPieces,
      total = 0;
    for(let i = 0; i < capturedPieces.length; i++){
      if (JSON.parse(capturedPieces[i]).color === "black") { total++ }
    }
    // console.log(total + " black")
    if( total === 11 ){ this.expandBlackCaptureDiv() }
  }

  whiteCaptureDivNeedsExpanding(){
    var capturedPieces = gameController.board.capturedPieces,
      total = 0;
    for(let i = 0; i < capturedPieces.length; i++){
      if (JSON.parse(capturedPieces[i]).color === "white") { total++ }
    }
    // console.log(total + " white")
    if( total === 11 ){ this.expandWhiteCaptureDiv() }
  }

  expandWhiteCaptureDiv(){
    var div = document.getElementById("white-captures")
    div.style.height = 98
  }
  expandBlackCaptureDiv(){
    var div = document.getElementById("black-captures")
    div.style.height = 98
  }
}
