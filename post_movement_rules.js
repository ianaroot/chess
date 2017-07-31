var PostMovementRules = function (pieceMovementRules) {
  console.log("pieceMovementRules is " + pieceMovementRules)
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
        currentLayOut = board.layOut;
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
        console.log("repetitions is: " + repetitions)
      };
      if(repetitions >= 2){
        threeFoldRepetition = true
      }


      if(movingTeamString === "black"){
        onDeckTeamString = "white"        
      } else {
        onDeckTeamString = "black"
      }
      var occcupiedPositions = board.positionsOccupiedByTeam(onDeckTeamString);
      for(var i = 0; i < occcupiedPositions.length && noLegalMoves; i++){

        var startPosition = occcupiedPositions[i],
        // parts of this need to move over to the pieceMvementPostMovementRules
        pieceController = pieceMovementRules.retrieveControllerForPosition(startPosition),

        viablePositions = pieceMovementRules.viablePositionsFrom({startPosition: startPosition, board: board, pieceMovements: pieceController});
        for(var j = 0; j < viablePositions.length && noLegalMoves; j++){
          var endPosition = viablePositions[j];
          // only checking kingCheck here because everything else is guaranteed by the fact that these positions came from viablePositions
          if( !pieceMovementRules.kingCheck( {startPosition: startPosition, endPosition: endPosition, board: board}) ){
            noLegalMoves = false
          }
        };
      };
      console.log("threeFoldRepetition is: " + threeFoldRepetition)
      console.log("noLegalMoves is: " + noLegalMoves)
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
