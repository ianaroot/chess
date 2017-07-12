function Board(options){
  var layOut;
  if( options && options["layOut"]){ layOut = options["layOut"] }else{ layOut = [] };
  var capturedPieces;
  if( options && options["capturedPieces"]){ capturedPieces = options["capturedPieces"] }else{ capturedPieces = [] };
  this.layOut = layOut
  this.capturedPieces = capturedPieces;
  this.blackInCheck;
  this.whiteInCheck;
  // return classMethods
};
Board.classMethods = {
  ranks: {
    isSeventh: function(position){
      return Math.floor(position / 8) === 6
    },
    isSecond: function(position){
      return Math.floor(position / 8) === 1
    }
  },
  squareColor: function(position){
    var div = position / 8,
      mod   = position % 8,
      sum   = div + mod,
      squareColor;
    if (sum % 2 === 0){
      squareColor = "dark"
    } else {
      squareColor = "light"
    }
    return squareColor;
  },
  gridCalculator: function(tile){
    var x = Math.floor(tile % 8),
        y = Math.floor(tile / 8) + 1,
      alphaNum = {
        0: "a",
        1: "b",
        2: "c",
        3: "d",
        4: "e",
        5: "f",
        6: "g",
        7: "h"
      },
      x = alphaNum[x];
    return "square-" + x + y
  },
  boundaries: {
    upperLimit: 63,
    lowerLimit: 0
  },
    inBounds: function(position){
    return position < this.boundaries.upperLimit && position > this.boundaries.lowerLimit
  }
}
Board.prototype = {

  teamAt: function(position){
    pieceString = this.layOut[position]
    teamString = pieceString.substring(0,5)
    return teamString
  },
  occupancy: {
    twoSpacesUp: function(position){
      return this.tileSet[position]  !== "empty"
    }
  },


// positionIsOccupied
// positionIsoccupiedByOpponent
// occupant
  positionIsOccupiedByTeamMate: function(position, team){
    // factory out this !== empty nonsense
    return (this.layOut[position] !== "empty" && this.layOut[position].team === team  )
  },

  // isAttacked: function( args ){
  //   var position      = args["position"],
  //       team          = args["team"],
  //       danger        = false,
  //       opposingTeam;
  //   if( team === white ){
  //     opposingTeam = black
  //   } else {
  //     opposingTeam = white
  //   };
  //   var activeOpposingTeamPieces = opposingTeam.activePieces;
  //   for (var i = 0; i < activeOpposingTeamPieces.length; i++){
  //     if( isAttackedBy({piece: activeOpposingTeamPieces[i], position: position}) ){ danger = true }
  //   }
  // },
  isAttackedByRnbq: function(args){
    // will give false positives on pawns attacking empty positions
    var piece     = args["piece"],
        position = args["position"];
    return rules.positionIsInPaths({position: position, piece: piece})
  },
  isAttackedByPawn: function(args){
    // will give fals positives on whether pawns can attack space if it's not yet occupied[]
    var pawn             = args["piece"],
        attackingPosition = pawn.position
        defendingPosition = args["position"],
        possibleMoves = pawn.possibleMoves(),
        attacked = false;
    for( var i = 0; i < possibleMoves.length; i++){
      var increment     = possibleMoves[i]["increment"],
        boundaryCheck = possibleMoves[i]["boundaryCheck"].replace(/\* i/g, "").replace(/position/, "attackingPosition");
      // could factor out the logic below and throw in a nifty object key or function name like "pawnAttacks" that's a horrible name, sit on it a while
      // debugger
      if( attackingPosition + increment === defendingPosition && boundaryCheck && (Math.abs(increment) === 7 || Math.abs(increment) === 9)){
        attacked = true;
      }
      return attacked
    }
  },
  isAttackedByKing: function(args){
    var piece     = args["piece"],
        position = args["position"];
  }
}