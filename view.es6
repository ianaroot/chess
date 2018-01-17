// git training
class View{
	// pretty sure this could be a singleton even on a server with several games running
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
    // var firstInitial = string[0],
    //   secondInitial;
    // for (var i = 0; i < string.length; i++){
    //   if( string[i] === string[i].toUpperCase() ){ secondInitial = string[i] }
    // };
    return firstInitial + secondInitial
  }
}
