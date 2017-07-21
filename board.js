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
  deepCopyLayout: function(layOut){
    var newLayOut = [];
    for( var i = 0; i < layOut.length; i ++){
      newLayOut.push( layOut[i] )
    }
    return newLayOut
  },
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
    return position <= this.boundaries.upperLimit && position >= this.boundaries.lowerLimit
  }
}
Board.prototype = {

  teamAt: function(position){
    if( !Board.classMethods.inBounds(position) ){
      return "empty"
    };
    var pieceString = this.layOut[position],
      teamString = pieceString.substring(0,5)
    ;
    return teamString
  },
  positionsOccupiedByTeam: function(teamString){
    var positions = [];
    for( i = 0; i < this.layOut.length; i++){
      var teamAt = this.teamAt(i);
      if(teamAt === teamString){
        positions.push(i)
      };
    };
    return positions
  },
  occupiedByTeamMate: function(args){
    var position = args["position"],
        teamString = args["teamString"],
        occupantTeam = this.teamAt(position)
    ;
    return teamString === occupantTeam
  },
  occupiedByOpponent: function(args){
    var position = args["position"],
        teamString = args["teamString"],
        occupantTeam = this.teamAt(position);
    return !this.positionEmpty(position) && teamString !== occupantTeam
  },
  pieceTypeAt: function(position){
    pieceString = this.layOut[position]
    pieceType = pieceString.substring(5,pieceString.length)
    return pieceType
  },
  // positionIsOccupied,
  // positionIsoccupiedByOpponent,
  // occupant,
  positionIsOccupiedByTeamMate: function(position, team){
    // factor out this !== empty nonsense
    return ( !this.positionEmpty(position) && this.teamAt(position) === team  )
  },
  positionEmpty: function(position){
    return this.layOut[position] === "empty"
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

  kingPosition: function(teamString){
    var layout = this.layOut,
        position;
    for(i = 0; i < layOut.length; i ++){
      var teamAtPosition = this.teamAt(i),
          pieceType = this.pieceTypeAt(i);
      if(teamAtPosition === teamString && pieceType === "King"){
        position = i
        break
      }
    }
    return position
  },
}