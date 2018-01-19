class View{
	// pretty sure this could be a singleton even on a server with several games running
  constructor(){
    this.boundHighlightTile = this.highlightTile.bind(this)
    this.boundAttemptMove = this.attemptMove.bind(this)
  }

  displayAlert(message){
    alert(message)
  }
  undisplayPiece(gridPosition){
    var element = document.getElementsByClassName( gridPosition )[0],
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
    var element = document.getElementsByClassName( gridPosition )[0];
    element.appendChild(elem)
  }
  displayLayOut(layOut){
    for( var i = 0; i < layOut.length; i++){
      var gridPosition = "square-" + Board.gridCalculator(i),
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
      position = Board.gridCalculatorReverse( target.dataset.square ),
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
    var blackCaptureDivChildren = document.getElementsByClassName("black-captures")[0].children,
      whiteCaptureDivChildren = document.getElementsByClassName("white-captures")[0].children,
      capturedPieces = gameController.board.capturedPieces;
    for( let i = 0; i < blackCaptureDivChildren.length; i ++){
      blackCaptureDivChildren[i].remove()
    };
    for( let i = 0; i < whiteCaptureDivChildren.length; i ++){
      whiteCaptureDivChildren[i].remove()
    };
    // some kinda off by one error or something going on, no idea why i need to repeat this
    for( let i = 0; i < blackCaptureDivChildren.length; i ++){
      blackCaptureDivChildren[i].remove()
    };
    for( let i = 0; i < whiteCaptureDivChildren.length; i ++){
      whiteCaptureDivChildren[i].remove()
    };
    for (let i = 0; i < capturedPieces.length; i++){
      var pieceObject = capturedPieces[i],
        team = JSON.parse(pieceObject).color,
        pieceInitials = this.pieceInitials(pieceObject);
      this.displayPiece({pieceInitials: pieceInitials, gridPosition: team + "-captures"})
    }
  }

  attemptMove(){
    var target = event.currentTarget,
      endPosition = Board.gridCalculatorReverse( target.dataset.square ),
      startElement = document.getElementsByClassName("startPosition")[0],
      startPosition = Board.gridCalculatorReverse( startElement.dataset.square );
    this.unhighlLighTiles();
    this.setClickListener();
    gameController.attemptMove(startPosition, endPosition);
    this.setClickListener()
    this.updateTeamAllowedToMove()
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
}
