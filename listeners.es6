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
  	tile.classList.remove("highlight1")
  }

}

var highlightTile = (e) => {
  var target = e.currentTarget,
    img = target.children[0],
    position = Board.gridCalculatorReverse( target.dataset.square ),
    team = "empty";
  unhighlLighTiles();
  if (img) {
    team = teamSet(img.src)
    // debugger
    if (team === gameController.board.allowedToMove){
      var viables = PieceMovementRules.viablePositionsFromKeysOnly( {startPosition: position, board: gameController.board } )
      for (let i = 0; i < viables.length; i++){
        var tilePosition = viables[i],
         alphaNumericPosition = Board.gridCalculator(tilePosition),
         square = document.getElementById(alphaNumericPosition);
        square.classList.add("highlight1")
      }
      target.classList.add("highlight1")
    }
  }

}


setClickListener = () =>{
  var tiles = retrieveTiles();
  for( i = 0 ; i < tiles.length ; i++ ){
  	var tile = tiles[i];
  	tile.addEventListener("click", function(e){ highlightTile(e); });
  }
}

setClickListener()