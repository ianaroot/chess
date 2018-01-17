// git training
class PostMovementRules {
  pawnPromotionQuery(board){
    for(var i = 0; i < 8; i++){
      if ( board.blackPawnAt(i) ){
        board.promotePawn(i)
        return "=Q"
        //need to change this when i start allowing choice of promotion type
      }
    }
    for(var i = 56; i < 64; i++){
      if( board.whitePawnAt(i) ){
        board.promotePawn(i)
        return "=Q"
        //need to change this when i start allowing choice of promotion type
      }
    }
    return ""
  }
  checkmate(board){
    var otherTeam = board.teamNotMoving(),
      kingPosition = board.kingPosition(otherTeam);
    return PieceMovementRules.kingInCheck({board: board, startPosition: kingPosition, endPosition: kingPosition}) && this.noLegalMoves(board)
  }
  noLegalMoves(board){
    var movingTeamString = board.allowedToMove,
      noLegalMoves = true;
    if(movingTeamString === "black"){
      var onDeckTeamString = "white"
    } else {
      var onDeckTeamString = "black"
    }
    var occcupiedPositions = board.positionsOccupiedByTeam(onDeckTeamString);
    for(var i = 0; i < occcupiedPositions.length && noLegalMoves; i++){
      var startPosition = occcupiedPositions[i],
        viablePositions = PieceMovementRules.viablePositionsFrom({startPosition: startPosition, board: board});
      for( var key in viablePositions ){ // checking only kingInCheck here because everything else is guaranteed by the fact that these positions came from viablePositions
        if( !PieceMovementRules.kingInCheck( {startPosition: startPosition, endPosition: key, board: board}) ){
          noLegalMoves = false
        }
      };
    };
    return noLegalMoves
  }
  threeFoldRepetition(board){
    var  previousLayouts = board.previousLayouts,
      repetitions = 0,
      threeFoldRepetition = false,
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
    return threeFoldRepetition
  }
  stalemate(board){
    return this.threeFoldRepetition(board) || this.noLegalMoves(board)
  }
}
