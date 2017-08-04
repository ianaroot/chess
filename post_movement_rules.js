var PostMovementRules = function (pieceMovementRules) {
  var instance = {
    pawnPromotionQuery: function(board){
      var layOut = board.layOut;
      for(var i = 0; i < 8; i++){
        if (layOut[i] === "blackPawn" ){
          board.promotePawn(i)
        }
      }
      for(var i = 56; i < 64; i++){
        if(layOut[i] === "whitePawn" ){
          board.promotePawn(i)
        }
      }
    },
    stalemate: function(board){
      var movingTeamString = board.allowedToMove,
        previousLayouts = board.previousLayouts,
        repetitions = 0,
        threeFoldRepetition = false,
        noLegalMoves = true,
        currentLayOut = board.layOut
        different;
      for( var i = 0; i < previousLayouts.length; i++ ){
        var comparisonLayout = previousLayouts[i],
          different = false;
        for( var j = 0; j < comparisonLayout.length; j++){
          if( comparisonLayout[j] !== currentLayOut[j] ){
            different = true
            break
          }
        };
        if( !different ){ repetitions ++ }
      };
      if(repetitions >= 2){
        threeFoldRepetition = true
      }


      if(movingTeamString === "black"){
        var onDeckTeamString = "white"        
      } else {
        var onDeckTeamString = "black"
      }
      var occcupiedPositions = board.positionsOccupiedByTeam(onDeckTeamString);
      for(var i = 0; i < occcupiedPositions.length && noLegalMoves; i++){

        // parts of this need to move over to the pieceMvementPostMovementRules
        var startPosition = occcupiedPositions[i],
          pieceController = pieceMovementRules.retrieveControllerForPosition({position: startPosition, layOut: board.layOut}),
          viablePositions = pieceMovementRules.viablePositionsFrom({startPosition: startPosition, board: board, pieceMovements: pieceController});
        // for(var j = 0; j < viablePositions.length && noLegalMoves; j++){
        for( var key in viablePositions ){
          // var endPosition = viablePositions[j];
          // only checking kingCheck here because everything else is guaranteed by the fact that these positions came from viablePositions
          if( !pieceMovementRules.kingInCheck( {startPosition: startPosition, endPosition: key, board: board}) ){
            noLegalMoves = false
          }
        };
      };
      return threeFoldRepetition || noLegalMoves
    },
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
};
