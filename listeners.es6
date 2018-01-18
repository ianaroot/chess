var retrieveTiles = () => {
  return document.getElementsByClassName("chess-tile")
}

var teamSet = (src) => {
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

var unhighlLighTiles = () => {
  var tiles = retrieveTiles();
  for( i = 0 ; i < tiles.length ; i++ ){
  	var tile = tiles[i];
    tile.removeEventListener("click", highlightTile )
    tile.removeEventListener("click", attemptMove )
    tile.classList.remove("startPosition" )
  	tile.classList.remove("highlight1")
  	tile.classList.remove("highlight2")
  }

}

var updateTeamAllowedToMove = () => {
  var span = document.getElementById("team-allowed-to-move");
  span.innerText = gameController.board.allowedToMove
}

var updateCaptures = () => {
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
  for (i = 0; i < capturedPieces.length; i++){
    var pieceObject = capturedPieces[i],
      team = JSON.parse(pieceObject).color,
      pieceInitials = gameController.view.pieceInitials(pieceObject);
    gameController.view.displayPiece({pieceInitials: pieceInitials, gridPosition: team + "-captures"})
  }
}

var attemptMove = () => {
  var target = event.currentTarget,
    endPosition = Board.gridCalculatorReverse( target.dataset.square ),
    startElement = document.getElementsByClassName("startPosition")[0],
    startPosition = Board.gridCalculatorReverse( startElement.dataset.square );
  unhighlLighTiles();
  setClickListener()
  gameController.attemptMove(startPosition, endPosition);
  setClickListener()
  updateTeamAllowedToMove()
  updateCaptures()
}

var highlightTile = () => {
  var target = event.currentTarget,
    img = target.children[0],
    position = Board.gridCalculatorReverse( target.dataset.square ),
    team = "empty";
  unhighlLighTiles();
  setClickListener()
  if (img) {
    team = teamSet(img.src)
    if (team === gameController.board.allowedToMove){
      var viables = PieceMovementRules.viablePositionsFromKeysOnly( {startPosition: position, board: gameController.board } )
      for (let i = 0; i < viables.length; i++){
        var tilePosition = viables[i],
         alphaNumericPosition = Board.gridCalculator(tilePosition),
         square = document.getElementById(alphaNumericPosition);
        square.classList.add("highlight2")
        square.removeEventListener("click", highlightTile )
        square.addEventListener("click", attemptMove)
      }
      target.classList.add("highlight1")
      target.classList.add("startPosition");
    }
  }

}

var clickHighlight = () => {
  debugger
  highlightTile();
}

var setClickListener = () =>{
  var tiles = retrieveTiles();
  for( i = 0 ; i < tiles.length ; i++ ){
  	var tile = tiles[i];
  	tile.addEventListener("click", highlightTile );
  }
}


setClickListener()
