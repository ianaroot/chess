// pieceControllerSet must be defined by the gameController when creating Rules singleton, not the best approach,
// but there were lots of arguments on the internet about dependency injection and singltons in js, and i just wanted something to work. will address later
var Rules = function () {
  var instance = {
    moveIsIllegal: function(startPosition, endPosition, board){
      var layOut = board.layOut,
        pieceString = layOut[startPosition],
        stringLength = pieceString.length,
        pieceType = pieceString.substring(5, stringLength),
        team = board.teamAt(startPosition);
      if( pieceType === "Pawn" ){ pieceType = pieceString.charAt(0).toUpperCase() + pieceString.slice(1) }
      pieceController = this.pieceControllerSet[pieceType]
      illegal = false
      // debugger
      if ( !Board.classMethods.inBounds(endPosition) ){
        alert('stay on the board, fool')
        illegal = true

      } else if( !pieceController.positionViable( {startPosition: startPosition, endPosition: endPosition, layOut: layOut} ) ) {
      // else if( !pieceController.positionIsInPaths({position: position, endPosition: endPosition, board: board}) ){

        alert("that's not how that piece moves")
        illegal = true
      } else if( board.positionIsOccupiedByTeamMate(endPosition, team ) ){
        alert("what, are you trying to capture your own piece?")
        illegal = true
      } //else if( this.kingCheck( {piece: startPosition, endPosition: endPosition, board: board})){
      //   alert("check yo king fool")
      //   illegal = true
      // }
      return illegal
    },
    kingCheck: function(args){
      var startPosition     = args["startPosition"],
          endPosition       = args["endPosition"]
          board             = args["board"],
          teamString        = board.teamAt[startPosition],
          kingPosition      = board.kingPosition(teamString)
          // activeTeamPieces  = team.activePieces,
          danger            = false,
          opposingTeam;
      if( teamString === "white" ){
        opposingTeamString = "black"
      } else {
        opposingTeamString = "white"
      };
      // var activeOpposingTeamPieces = opposingTeam.activePieces;
      // for (var i = 0; i < activeOpposingTeamPieces.length; i++){
      //   if( isAttackedBy({piece: activeOpposingTeamPieces[i], position: kingPosition}) ){ danger = true }
      // }





      // danger = board.isAttacked({position: position, piece: pieceCopy, tiles: tilesCopy});
      return danger
      // pretend king has all movement abilities. stretch outward with them until hittting block, see if that block has the ability that was used to get to the king,
      // maybe iterate across movements testing each individualy
    },
    // castling  these can both refer to the previous board states to answer the question, so knowing about board states doesn't become a pieces job
    // en passant  these can both refer to the previous board states to answer the question, so knowing about board states doesn't become a pieces job 
    // stalemate
  }

  function createInstance() {
      var object = new Object("I am the instance");
      return object;
  }
  return {
    getInstance: function(controllerSet) {
      if (!instance) {
        instance = createInstance(controllerSet);
      }
      return instance;
    },
  };
}();
