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

var attemptMove = () => {
  var target = event.currentTarget,
    endPosition = Board.gridCalculatorReverse( target.dataset.square ),
    startElement = document.getElementsByClassName("startPosition")[0],
    startPosition = Board.gridCalculatorReverse( startElement.dataset.square );
  unhighlLighTiles();
  setClickListener()
  gameController.attemptMove(startPosition, endPosition);
  setClickListener()
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
