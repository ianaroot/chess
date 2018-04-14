class Bot {
  // SHOULDN"T BE AB LE TO CASTLE OUT OF CHECK
  // UNDO FROM MATE SEEMS BORKED. PROBABLY DIDN"T UNEND GAME
  // test weird edge cases of check, like castling towards kings touching
  constructor(api, team){
    this.api = api;
    this.homeTeam = team;
    this.opponent = Board.opposingTeam(team)
    this.castledHomeTeam = false
    this.castledOpponent = false
  }

  teamModifier(team){
    if( team === this.homeTeam ){
      return 1
    } else if ( team === this.opponent ){
      return -1
    } else {
      alert("bad input at bot.teamModifier :" + team)
    }
  }

  setInstanceVars(board){
    this.baseBoard = board;
    this.bestBranchValue = null;
    this.hometeamStartingPieceValue = this.baseBoard.pieceValue(this.homeTeam);
    this.opponentStartingPieceValue = this.baseBoard.pieceValue(this.opponent);
    this.startingNotationLength = this.baseBoard.movementNotation.length
    this.homeTeamStartingControlValue = this.weightAccessibleSquares({board: this.baseBoard, team: this.homeTeam})
    this.opponentStartingControlValue = this.weightAccessibleSquares({board: this.baseBoard, team: this.opponent})
    this.baseCaseBranchDepth = 4
    this.projectMoveForHomeTeam = this.pingHomeTeam
    this.projectMoveForOpponent = this.pongOpponent
    // it would make more sense for the funcs to return their chosen node at a given depth
    // as opposed to just returning the value of all nodes at that depth and having the other team's func declare which one
    // their opponent is better off choosing
    // this could be accomplished by having pingPongMovesStart first iterate across all possible moves
    // passing the new board into pongOpponent and letting pongOpponent determine the newpossible moves and pass them into
    // ping homteam, etc.. etc..
    // each function would then have the capacity to value it's own options, and return them to the prior function
    // could even calculate gamePhase separately for opponent
  }

  determineMove(board){
    this.setInstanceVars(board);
    // this.calculateGamePhase({team: this.homeTeam, board: this.baseBoard})
    // this.calculateGamePhase({team: this.opponent, board: this.baseBoard})
    let lastMoveNotation = this.baseBoard.movementNotation[this.baseBoard.movementNotation.length -1]
    if(/0/.exec(lastMoveNotation)){this.castledOpponent = true }
        // weightMoves = this.gamePhasePriorities[gamePhase],
        // start as opening
        // switch to mid when back rank has no minors and castle has either occurred or isn't viable (king has moved, rook has moved, capture has occurred at a/h 1 or 8)
        // declare endgame after piecevalue drops below x (13?)

    let  weightedMoves = this.pingPongMovesStart()


    let moveIdeas = this.pickNweightiestMovesFrom(weightedMoves, 5)
    let move = moveIdeas[Math.floor(Math.random()*moveIdeas.length)];
    // console.log(this.homeTeam)
    // console.log(weightedMoves)
    // console.log(moveIdeas);
    // console.log(Board.gridCalculator(move.startPosition), Board.gridCalculator(move.endPosition), move.pieceNotation || 'p', move.captureNotation || 'no capt')
    // console.log(move);
    if(/0/.exec(move.pieceNotation)){
      this.castledHomeTeam = true
    }
    return move

  }

  pingPongMovesStart(){
    let startTime = Math.floor(Date.now() / 1000);
    let moves = this.api.availableMovesDefault();
    for(let  i = 0; i < moves.length; i++){
      let move = moves[i];
      let weightAndNotation = this.projectMoveForHomeTeam({board: this.baseBoard, move: move});
      if(!weights){
        var weights = {},
          notations = {};
        weights[weightAndNotation.value] = [move]
        notations[weightAndNotation.value] = [weightAndNotation.notation]
        this.bestBranchValue = weightAndNotation.value
      } else if(weights[weightAndNotation.value]){
        weights[weightAndNotation.value].push(move)
        notations[weightAndNotation.value].push(weightAndNotation.notation)
      } else {
        weights[weightAndNotation.value] = [move]
        notations[weightAndNotation.value] = [weightAndNotation.notation]
      }
      if( weightAndNotation.value > this.bestBranchValue ){ this.bestBranchValue = weightAndNotation.value}
    }
    let endTime = Math.floor(Date.now() / 1000)
    // console.log(notations);
    console.log( endTime - startTime)
    return weights
  }

  pingHomeTeam({board: board, move: move}){
    let newBoard = this.api.resultOfHypotheticalMove({board: board, moveObject: move});
    if( newBoard.gameOver){
      if(newBoard._winner === this.homeTeam){
        return {value: 1000, notation: newBoard.moveNotation}
      } else if (newBoard._winner === undefined){
        return {value: 0, notation: newBoard.moveNotation}
        // gotta determine whether we wanted to play for stale, maybe just return zero, and if the other options are all negative, that ain't so bad?
      }
    }else if( (newBoard.movementNotation.length - this.startingNotationLength) >= this.baseCaseBranchDepth ){
      // for( let i = 0; i < newMoves.length; i++){
      //   let newMove = newMoves[i];
      //   if( !move.captureNotation || newBoard.pieceTypeAt(newMove.endPosition) === Board.PAWN || currentBranchDepth === 7 ){

      var value = 0;
      // }//NEED TO RUN SOME REGEX ON THE INTERVENING NOTATIONS, SPLITTING THEM BASED ON TEAM
      // MIGHT BE ABLE TO USE THAT TO ACCOUNT FOR PAWN PROMOTION AS WELL
      let homeTeamPieceValueLoss = newBoard.pieceValue(this.homeTeam) - this.hometeamStartingPieceValue,
      opponentPieceValueLoss = newBoard.pieceValue(this.opponent) - this.opponentStartingPieceValue,
      homeTeamSquareControlDifferential = this.weightAccessibleSquares({board: newBoard, team: this.homeTeam}) - this.homeTeamStartingControlValue,
      opponSquareControlDifferential = this.weightAccessibleSquares({board: newBoard, team: this.opponent}) - this.opponentStartingControlValue;
      value = homeTeamPieceValueLoss - opponentPieceValueLoss + homeTeamSquareControlDifferential - opponSquareControlDifferential;
      value = Math.round( value * 100 )/100

      return {value: value, notation: newBoard.movementNotation}
    }else {
      var newMoves = this.api.availableMovesFor({board: newBoard, movingTeam: this.opponent})
      for( let i = 0; i < newMoves.length; i++){
        let responseValue = this.projectMoveForOpponent({board: newBoard, move: newMoves[i]});
        if ( !selectedValue ){
          var selectedValue = responseValue
        } else if( responseValue.value < selectedValue.value ){
          selectedValue = responseValue
        }

        if( this.bestBranchValue ){
          if( selectedValue.value + 1.01 < this.bestBranchValue ){
            return selectedValue
          }
        }
      }
      return selectedValue
    }
  }

  pongOpponent({board: board, move: move}){
    let newBoard = this.api.resultOfHypotheticalMove({board: board, moveObject: move});
    if( newBoard.gameOver){
      if(newBoard._winner === this.opponent){
        return {value: -1000, notation: newBoard.moveNotation}
      } else if (newBoard._winner === undefined){
        return {value: 0, notation: newBoard.moveNotation}
        // gotta determine whether we wanted to allow opponent to get stale, but probably again, if we return zero, and other branches are higher, then cool.
      }
    }else if( (newBoard.movementNotation.length - this.startingNotationLength) >= this.baseCaseBranchDepth ){
      // for( let i = 0; i < newMoves.length; i++){
      //   let newMove = newMoves[i];
      //   if( !move.captureNotation || newBoard.pieceTypeAt(newMove.endPosition) === Board.PAWN || currentBranchDepth === 7 ){
      var value = 0;
      let homeTeamPieceValueLoss = newBoard.pieceValue(this.homeTeam) - this.hometeamStartingPieceValue,
      opponentPieceValueLoss = newBoard.pieceValue(this.opponent) - this.opponentStartingPieceValue,
      homeTeamSquareControlDifferential = this.weightAccessibleSquares({board: newBoard, team: this.homeTeam}) - this.homeTeamStartingControlValue,
      opponSquareControlDifferential = this.weightAccessibleSquares({board: newBoard, team: this.opponent}) - this.opponentStartingControlValue;
      value = homeTeamPieceValueLoss- opponentPieceValueLoss + homeTeamSquareControlDifferential - opponSquareControlDifferential;
      value = Math.round( value * 100 )/100
      return {value: value, notation: newBoard.movementNotation}
    } else {
      var newMoves = this.api.availableMovesFor({board: newBoard, movingTeam: this.homeTeam});
      for( let i = 0; i < newMoves.length; i++){
        let responseValue = this.projectMoveForHomeTeam({board: newBoard, move: newMoves[i]});
        if ( !selectedValue ){
          var selectedValue = responseValue
        } else if( responseValue.value > selectedValue.value ){
          selectedValue = responseValue
        }
      }
      return selectedValue
    }
  }

  selectRandomMove(){
    let availableMoves = this.api.availableMovesDefault(),
      move = availableMoves[Math.floor(Math.random()*availableMoves.length)];
    return move
  }

  pretendRandomMoveIsWeighted(){
    let move = this.selectRandomMove()
    return {1: [move]} //this is the data structure necesary to mimic the return of weightedMoves
  }

  get gamePhasePriorities(){
    return {
      opening: this.weightMovesForOpening.bind(this),
      middle: this.weightMovesForMiddle.bind(this),
      end: this.pretendRandomMoveIsWeighted.bind(this),
    }
  }

  calculateGamePhase({team: team, board: board}){
    let kingPosition = board.kingPosition(team);
    if ( board.pieceValue( Board.opposingTeam(team) ) <= 13 ) {
      if( team === this.homeTeam){
        this.projectMoveForHomeTeam = this.endGameHomeTeam
      } else if(team === this.opponent){
        this.projectMoveForOpponent = this.endGameOpponent
      } else {
        alert("bad input for team in calculateGamePhase :", team)
      }
    } else if ( !this.backRankHasMinorPieces({team: team, board: board})) {
      if( team === this.homeTeam ){
        this.projectMoveForHomeTeam = this.midGameHomeTeam
      } else if( team === this.opponent ){
        this.projectMoveForOpponent = this.midGameOpponent
      } else {
        alert("bad input for team in calculateGamePhase :", team)
      }
    } else {
      if( team === this.homeTeam){
        this.projectMoveForHomeTeam = this.pingHomeTeam
      } else if(team === this.opponent){
        this.projectMoveForOpponent = this.pongOpponent
      } else {
        alert("bad input for team in calculateGamePhase :", team)
      }

    }
    // } else if ( this.backRankHasMinorPieces({team: team, board: board}) && board.pieceHasNotMovedFrom(kingPosition) ){
    //   return "opening";
  }

  backRankHasMinorPieces({team: team, board: board}){
    let backRank = this.backRank({team: team, board: board})
    for( let i = 0; i < backRank.length; i++){
      let pieceObject = backRank[i],
          pieceSpecies = Board.parseSpecies( pieceObject ),
          pieceTeam = Board.parseTeam( pieceObject );
      if( pieceTeam === team && Board.MINOR_PIECES.includes(pieceSpecies) ){ return true}
    }
  }

  backRank({team: team, board: board}){
    if( team === Board.WHITE){
      var squares = ["a1", "b1", "c1", "d1", "e1", "f1", "g1", "h1"]
    } else {
      // do i want to reverse this to mimic looking at the board from black's perspective? computer doesn't care, but human user might appreciate? that's me.. this is my bot not the api
      var squares = ["a8", "b8", "c8", "d8", "e8", "f8", "g8", "h8"]
    }
    let backRankPieces =  []
    for(let i = 0; i < squares.length; i ++){
      let square = squares[i];
      backRankPieces.push( board.pieceObject(square)  )
    }
    return backRankPieces
  }

  noNonPawnsUnderAttack({moves: moves, board: board}){
    for(let i = 0; i < moves.length; i++){
      let move = moves[i]
      if( move.captureNotation && !board.pieceTypeAt(move.endPosition) === Board.PAWN ){
        return true
      }
    }
  }



  // weightMovesRecursivelyForOpening(board, N){
  //   let moves = this.api.availableMovesDefault(),
  //   weights = {}
  //   for(let  i = 0; i < moves.length; i++){
  //     let move = moves[i];
  //     this.baseNode = move
  //     if( [Board.KING, Board.QUEEN, Board.ROOK].includes(move.pieceNotation) && !move.captureNotation ){ continue };
  //     let weight = (this.recursivelyProjectMoves({board: board, move: move, team: Board.WHITE, value: 0, depth: N, iteration: 0}));
  //     if(weights[weight]){
  //       weights[weight].push(move)
  //     } else {
  //       weights[weight] = [move]
  //     }
  //   }
  //   return weights
  // }
  //
	// seekCheckMate(board, move, team){
  //   let newBoard = this.api.resultOfHypotheticalMove({board: board, moveObject: move})
  //   if( board._winner === team){
  //     return 1000
  //   } else {
  //     return 0
  //   }
  // }
  //
  // doubleMoveInOpeningPenalty(board, move){
  //   if( !board.pieceHasNotMovedFrom(move.startPosition)){
  //     return -5
  //   } else {
  //     return 0
  //   }
  // }
  //
  // discourageEarlyQueenMovement(board, move){
  //   let pieceType = board.pieceTypeAt(move.startPosition);
  //   if( pieceType === Board.QUEEN ){
  //     return - 10
  //   } else {
  //     return 0
  //   }
  // }
  //
  // limitNonCastleKingMoves(board, move){
  //   let pieceType = board.pieceTypeAt(move.startPosition);
  //   if( pieceType === Board.KING && !Bot.CASTLEENDPOSITIONS.includes(move.endPosition) ){
  //     return - 10
  //   } else {
  //     return 0
  //   }
  // }

  weightAccessibleSquares({board: board, team: team}){
    let squareValues = 0,
      controlledPositions = Rules.positionsControlledByTeam({board: board, team: team, exemptions: [Board.KING, Board.ROOK, Board.QUEEN]}) ;//should be made accessible through the api
    for( let i = 0; i < controlledPositions.length; i++){
      let square = controlledPositions[i],
        squareValue = Bot.SQUAREWEIGHTS[square];
      squareValues = squareValues + squareValue
    }
    squareValues = Math.round( squareValues * 100 )/100
    return squareValues
  }

  static get SQUAREWEIGHTS() {
    return {

      35: .2,
      36: .2,
      27: .2,
      28: .2,

      18: .09,
      19: .09,
      20: .09,
      21: .09,
      26: .09,
      29: .09,
      34: .09,
      37: .09,
      42: .09,
      43: .09,
      44: .09,
      45: .09,


      9:  .04,
      10: .04,
      11: .04,
      12: .04,
      13: .04,
      14: .04,

      17: .04,
      22: .04,
      25: .04,
      30: .04,
      33: .04,
      38: .04,
      41: .04,
      46: .04,

      49: .04,
      50: .04,
      51: .04,
      52: .04,
      53: .04,
      54: .04,

      0: .01,
      1: .01,
      2: .01,
      3: .01,
      4: .01,
      5: .01,
      6: .01,
      7: .01,

      8:  .01,
      16: .01,
      24: .01,
      32: .01,
      40: .01,
      48: .01,

      56: .01,
      57: .01,
      58: .01,
      59: .01,
      60: .01,
      61: .01,
      62: .01,
      63: .01,

      15: .01,
      23: .01,
      31: .01,
      39: .01,
      47: .01,
      55: .01,
    }
  }


  sortArray(array){
    let sortNumber = function(a,b) {
        return a - b;
    }
    return array.sort(sortNumber);
  }


  pickNweightiestMovesFrom(weightedMoves, n){
    let nWeights = [],
      weights = Object.keys(weightedMoves),
      sortedWeights = this.sortArray(weights),
      highestWeight = sortedWeights[sortedWeights.length -1];
    for(let i = sortedWeights.length -1 ; i > -1 && nWeights.length < n; i--){
      let weight = sortedWeights[i],
        moves = weightedMoves[weight];
      if((highestWeight - 1) < weight){
        for( let j = 0; j < moves.length; j++){
          nWeights.push(moves[j])
        }
      }
    }
    return nWeights
  }

}
