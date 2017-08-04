var View = (function(){
  var instance = {
    undisplayPiece: function(gridPosition){
      var element = document.getElementsByClassName( gridPosition )[0],
        children  = element.children;
      for( var i = 0; i < children.length; i ++){
        children[i].remove()
      }
    },
    displayPiece: function(args){
      var elem = document.createElement("img"),
        pieceInitials = args["pieceInitials"],
        gridPosition = args["gridPosition"];
      elem.setAttribute("src", this.pieceImgSrc( pieceInitials ) );
      elem.setAttribute("height", "49");
      elem.setAttribute("width", "49");
      var element = document.getElementsByClassName( gridPosition )[0];
      element.appendChild(elem)
    },
    displayBoard: function(layOut){
      for( var i = 0; i < layOut.length; i++){
        var gridPosition = "square-" +Board.classMethods.gridCalculator(i),
            pieceInitials = this.pieceInitials(layOut[i]);
        this.undisplayPiece(gridPosition);
        this.undisplayPiece(gridPosition);
        if( layOut[i] !== "empty" ){
          this.displayPiece({pieceInitials: pieceInitials, gridPosition: gridPosition})
        }
      }
    },
    pieceImgSrc: function(pieceInitials){
      return "img/chesspieces/wikipedia/" + pieceInitials + ".png"
    },
    pieceInitials: function(string){
      var firstInitial = string[0],
        secondInitial;
      for (i = 0; i < string.length; i++){
        if( string[i] === string[i].toUpperCase() ){ secondInitial = string[i] }
      };
      return firstInitial + secondInitial
    }
  };

  function createInstance() {
      var object = new Object("I am the instance");
      return object;
  }
  return {
      getInstance: function() {
          if (!instance) {
              instance = createInstance();
          }
          return instance;
      },
  };
})();