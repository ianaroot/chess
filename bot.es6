class Bot {
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
  // var iterations = 100;
  // console.time("bench")
  // for(var i = 0; i < iterations; i++ ){
  // 	gameController._whiteBot.determineMove(gameController.board)
  // }
  // console.timeEnd("bench")

  setInstanceVars(board){
    this.baseBoard = board;
    this.bestBranchValue = null;
    this.hometeamStartingPieceValue = this.baseBoard.pieceValue(this.homeTeam);
    this.opponentStartingPieceValue = this.baseBoard.pieceValue(this.opponent);
    this.startingNotationLength = this.baseBoard.movementNotation.length
    this.baseCaseBranchDepth = 4
    this.homeTeamStartingBackRankMinorCount = this.backRankMinorsCount({team: this.homeTeam, board: this.baseBoard})
    this.opponentStartingBackRankMinorCount = this.backRankMinorsCount({team: this.opponent, board: this.baseBoard})
    this.homeTeamStartingKingControlValue = this.kingAndOpposingRanksControl( this.baseBoard, this.homeTeam )
    this.opponentStartingKingControlValue = this.kingAndOpposingRanksControl( this.baseBoard, this.opponent )
    this.homeTeamStartingCenterControlValue = this.weightAccessibleSquares({board: this.baseBoard, team: this.homeTeam})
    this.opponentStartingCenterControlValue = this.weightAccessibleSquares({board: this.baseBoard, team: this.opponent})
    this.calculateGamePhase();
    // it would make more sense for the funcs to return their chosen node at a given depth
    // as opposed to just returning the value of all nodes at that depth and having the other team's func declare which one
    // their opponent is better off choosing
    // this could be accomplished by having startMoveProjections first iterate across all possible moves
    // passing the new board into pongOpponent and letting pongOpponent determine the newpossible moves and pass them into
    // ping homteam, etc.. etc..
    // each function would then have the capacity to value it's own options, and return them to the prior function
    // could even calculate gamePhase separately for opponent
  }

  determineMove(board){
    this.setInstanceVars(board);
    let lastMoveNotation = this.baseBoard.movementNotation[this.baseBoard.movementNotation.length -1]
    if(/O/.exec(lastMoveNotation)){this.castledOpponent = true }
    let  weightedMoves = this.startMoveProjections()
    let moveIdeas = this.pickNweightiestMovesFrom(weightedMoves, 5)
    let move = moveIdeas[Math.floor(Math.random()*moveIdeas.length)];
    console.log(Board.gridCalculator(move.startPosition), Board.gridCalculator(move.endPosition), move.pieceNotation || 'p', move.captureNotation || 'no capt')
    if(/O/.exec(move.pieceNotation)){
      this.castledHomeTeam = true
    }
    return move
  }

  startMoveProjections(){
    let startTime = Math.floor(Date.now() / 1000);
    let moves = this.api.availableMovesDefault();
    for(let  i = 0; i < moves.length; i++){
      let move = moves[i];
      let weightAndNotation = this.pingHomeTeam({board: this.baseBoard, move: move});
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
    console.log(this.homeTeam)
    console.log(notations);
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
    }else {
      var newMoves = this.api.availableMovesFor({board: newBoard, movingTeam: this.opponent})
      for( let i = 0; i < newMoves.length; i++){
        let responseValue = this.projectMoveValues({board: newBoard, move: newMoves[i]});
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
      var value = 0;
      let newNotations = newBoard.movementNotation.slice([this.startingNotationLength],newBoard.movementNotation.length)
      for(let i = 0; i < newNotations.length; i++){
        if(i % 2 === 0){ //homeTeam
          if(/O/.exec(newNotations[i])){
            value = value + 1.5
          } else if( /[KQR]/.exec(newNotations[i]) ){
            value = value - 1
          }
        } else {//opponent
          if(/O/.exec(newNotations[i])){
            value = value - 1.5
          } else if( /[KQR]/.exec(newNotations[i]) ){
            value = value + 1
          }
        }
      }
      // if the mov was a capture, and the differential is tied or favors the opponent we could keep going

      let homeTeamBackRankMinorDifferential = ( this.homeTeamStartingBackRankMinorCount - this.backRankMinorsCount({team: this.homeTeam, board: newBoard}) ) * .1,
      opponentBackRankMinorDifferential = ( this.opponentStartingBackRankMinorCount - this.backRankMinorsCount({team: this.opponent, board: newBoard}) ) * .1,
      homeTeamPieceValueLoss = newBoard.pieceValue(this.homeTeam) - this.hometeamStartingPieceValue,
      opponentPieceValueLoss = newBoard.pieceValue(this.opponent) - this.opponentStartingPieceValue,
      homeTeamCenterControlDifferential = this.weightAccessibleSquares({board: newBoard, team: this.homeTeam}) - this.homeTeamStartingCenterControlValue,
      opponentCenterControlDifferential = this.weightAccessibleSquares({board: newBoard, team: this.opponent}) - this.opponentStartingCenterControlValue;
      value = value + homeTeamPieceValueLoss - opponentPieceValueLoss + homeTeamCenterControlDifferential - opponentCenterControlDifferential + homeTeamBackRankMinorDifferential - opponentBackRankMinorDifferential;
      value = Math.round( value * 100 )/100;
      let responseValue = {value: value, notation: newNotations}
      return responseValue
    } else {
      var newMoves = this.api.availableMovesFor({board: newBoard, movingTeam: this.homeTeam});
      for( let i = 0; i < newMoves.length; i++){
        let responseValue = this.pingHomeTeam({board: newBoard, move: newMoves[i]});
        if ( !selectedValue ){
          var selectedValue = responseValue
        } else if( responseValue.value > selectedValue.value ){
          selectedValue = responseValue
        }
      }
      return selectedValue
    }
  }

  midGameOpponent({board: board, move: move}){
    let newBoard = this.api.resultOfHypotheticalMove({board: board, moveObject: move});
    if( newBoard.gameOver){
      if(newBoard._winner === this.opponent){
        return {value: -1000, notation: newBoard.moveNotation}
      } else if (newBoard._winner === undefined){
        return {value: 0, notation: newBoard.moveNotation}
        // gotta determine whether we wanted to allow opponent to get stale, but probably again, if we return zero, and other branches are higher, then cool.
      }
    }else if( (newBoard.movementNotation.length - this.startingNotationLength) >= this.baseCaseBranchDepth ){
      var value = 0;
      let newNotations = newBoard.movementNotation.slice([this.startingNotationLength],newBoard.movementNotation.length)
      for(let i = 0; i < newNotations.length; i++){
        if(i % 2 === 0){ //homeTeam
          if(/O/.exec(newNotations[i])){
            value = value + 1
          }
        } else {//opponent
          if(/O/.exec(newNotations[i])){
            value = value - 1
          }
        }
      }
      let homeTeamPieceValueLoss = newBoard.pieceValue(this.homeTeam) - this.hometeamStartingPieceValue,
        opponentPieceValueLoss = newBoard.pieceValue(this.opponent) - this.opponentStartingPieceValue,
        homeTeamKingControlDifferential = this.kingAndOpposingRanksControl(newBoard, this.homeTeam) - this.homeTeamStartingKingControlValue,
        opponentKingControlDifferential = this.kingAndOpposingRanksControl(newBoard, this.opponent) - this.opponentStartingKingControlValue,
        homeTeamBackRankMinorDifferential = ( this.homeTeamStartingBackRankMinorCount - this.backRankMinorsCount({team: this.homeTeam, board: newBoard}) ) * .1,
        opponentBackRankMinorDifferential = ( this.opponentStartingBackRankMinorCount - this.backRankMinorsCount({team: this.opponent, board: newBoard}) ) * .1,
        homeTeamCenterControlDifferential = this.weightAccessibleSquares({board: newBoard, team: this.homeTeam}) - this.homeTeamStartingCenterControlValue * .1,
        opponentCenterControlDifferential = this.weightAccessibleSquares({board: newBoard, team: this.opponent}) - this.opponentStartingCenterControlValue * .1;
        // TODO weight squares on opponents side of board, increasing weight as approaching back rank
      value = value + homeTeamPieceValueLoss - opponentPieceValueLoss + homeTeamCenterControlDifferential - opponentCenterControlDifferential + homeTeamKingControlDifferential - opponentKingControlDifferential + homeTeamBackRankMinorDifferential - opponentBackRankMinorDifferential;
      value = Math.round( value * 100 )/100
      return {value: value, notation: newBoard.movementNotation}
    } else {
      var newMoves = this.api.availableMovesFor({board: newBoard, movingTeam: this.homeTeam});
      for( let i = 0; i < newMoves.length; i++){
        let responseValue = this.pingHomeTeam({board: newBoard, move: newMoves[i]});
        if ( !selectedValue ){
          var selectedValue = responseValue
        } else if( responseValue.value > selectedValue.value ){
          selectedValue = responseValue
        }
      }
      return selectedValue
    }
  }

  endGameOpponent({board: board, move: move}){
    let newBoard = this.api.resultOfHypotheticalMove({board: board, moveObject: move});
    if( newBoard.gameOver){
      if(newBoard._winner === this.opponent){
        return {value: -1000, notation: newBoard.moveNotation}
      } else if (newBoard._winner === undefined){
        return {value: 0, notation: newBoard.moveNotation}
        // gotta determine whether we wanted to allow opponent to get stale, but probably again, if we return zero, and other branches are higher, then cool.
      }
    }else if( (newBoard.movementNotation.length - this.startingNotationLength) >= this.baseCaseBranchDepth ){
      var value = 0;
      let newNotations = newBoard.movementNotation.slice([this.startingNotationLength],newBoard.movementNotation.length)
      for(let i = 0; i < newNotations.length; i++){
        if(i % 2 === 0){ //homeTeam
          if(/O/.exec(newNotations[i])){
            value = value + 1
          }
        } else {//opponent
          if(/O/.exec(newNotations[i])){
            value = value - 1
          }
        }
      }
      let homeTeamPieceValueLoss = newBoard.pieceValue(this.homeTeam) - this.hometeamStartingPieceValue,
        opponentPieceValueLoss = newBoard.pieceValue(this.opponent) - this.opponentStartingPieceValue,
        homeTeamKingControlDifferential = this.kingAndOpposingRanksControl(newBoard, this.homeTeam) - this.homeTeamStartingKingControlValue,
        opponentKingControlDifferential = this.kingAndOpposingRanksControl(newBoard, this.opponent) - this.opponentStartingKingControlValue;
      value = value + homeTeamPieceValueLoss- opponentPieceValueLoss + homeTeamKingControlDifferential - opponentKingControlDifferential;
      value = Math.round( value * 100 )/100
      return {value: value, notation: newBoard.movementNotation}
    } else {
      var newMoves = this.api.availableMovesFor({board: newBoard, movingTeam: this.homeTeam});
      for( let i = 0; i < newMoves.length; i++){
        let responseValue = this.pingHomeTeam({board: newBoard, move: newMoves[i]});
        if ( !selectedValue ){
          var selectedValue = responseValue
        } else if( responseValue.value > selectedValue.value ){
          selectedValue = responseValue
        }
      }
      return selectedValue
    }
  }

  kingAndOpposingRanksControl(board, team){
    let occcupiedPositions = board._positionsOccupiedByTeam(team),
      otherTeam = Board.opposingTeam(team),
      kingAdjacentSquares = this.kingAdjacentSquares(board, otherTeam),
      kingOutterAdjacencies = this.kingOutterAdjacencies(board, otherTeam),
      control = 0;
    if( team === Board.WHITE ){
      var opposingRanks = { 8: .1, 7: .08 ,6: .04 ,5: .02 }
    } else if( team === Board.BLACK ){
      var opposingRanks = { 1: .1, 2: .08, 3: .04, 4: .02 }
    }
    for( let i = 0; i < occcupiedPositions.length; i++ ){
      let position = occcupiedPositions[i],
        controlledPositions = new MovesCalculator({board: board, startPosition: occcupiedPositions[i], attacksOnly: true}).endPositions,
        controlledKingAdjacentPositionCount = controlledPositions.filter(function(n) { return kingAdjacentSquares.indexOf(n) !== -1; }).length;
      control = control + .3 * controlledKingAdjacentPositionCount
      let controlledKingOutterAdjacentPositionCount = controlledPositions.filter(function(n) { return kingOutterAdjacencies.indexOf(n) !== -1; }).length;
      control = control + .08 * controlledKingOutterAdjacentPositionCount
      for( let j = 0; j < controlledPositions.length; j++){
        control = control + (opposingRanks[controlledPositions[j]] || 0)
      }
    }
    return control
  }

  kingOutterAdjacencies(board, team){
    let kingPosition = board._kingPosition(team),
      squares = [kingPosition],
      outterLeveLAdjacencies = [2, -1, 16, 16, 15, -15, 17, -17, 10, -10, 18, -18];
    for( let i = 0; i < outterLeveLAdjacencies.length; i++ ){
      let adjacency = outterLeveLAdjacencies[i]
      if( kingPosition + adjacency >= 0 && kingPosition + adjacency <= 63 ){
        squares.push(kingPosition + adjacency)
      }
    }
    return squares
  }

  kingAdjacentSquares(board, team){
    let kingPosition = board._kingPosition(team),
      squares = [kingPosition],
      adjacencies = [-7,-8,-9,-1,1,7,8,9];
    for( let i = 0; i < adjacencies.length; i++ ){
      let adjacency = adjacencies[i]
      if( kingPosition + adjacency >= 0 && kingPosition + adjacency <= 63 ){
        squares.push(kingPosition + adjacency)
      }
    }
    return squares
  }

  get gamePhasePriorities(){
    return {
      opening: this.weightMovesForOpening.bind(this),
      middle: this.weightMovesForMiddle.bind(this),
      end: this.pretendRandomMoveIsWeighted.bind(this),
    }
  }

  calculateGamePhase(){
    let board = this.baseBoard,
      kingPosition = board.kingPosition(this.homeTeam);
    if ( board.pieceValue( this.opponent ) <= 18 || board.pieceValue( this.homeTeam ) <= 18 ) {
      this.projectMoveValues = this.endGameOpponent
      // this.baseCaseBranchDepth = 6
    } else if ( !this.backRankHasMinorPieces({team: this.homeTeam, board: board}) || this.castledHomeTeam ) {
      this.projectMoveValues = this.midGameOpponent
    } else {
      this.projectMoveValues = this.pongOpponent
    }
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
      var squares = [0,1,2,3,4,5,6,7]
    } else {
      // do i want to reverse this to mimic looking at the board from black's perspective? computer doesn't care, but human user might appreciate? that's me.. this is my bot not the api
      var squares = [63,62,61,60,59,58,57,56]
    }
    let backRankPieces =  []
    for(let i = 0; i < squares.length; i ++){
      let square = squares[i];
      backRankPieces.push( board.pieceObject(square)  )
    }
    return backRankPieces
  }

  backRankMinorsCount({team: team, board: board}){
    if( team === Board.WHITE){
      var squares = [0,1,2,3,4,5,6,7]
    } else {
      // do i want to reverse this to mimic looking at the board from black's perspective? computer doesn't care, but human user might appreciate? that's me.. this is my bot not the api
      var squares = [63,62,61,60,59,58,57,56]
    }
    let backRankMinorsCount = 0
    for(let i = 0; i < squares.length; i ++){
      let square = squares[i],
        pieceObject = board.pieceObject(square);
      if( Board.pieceValues()[Board.parseSpecies(pieceObject)] === 3 ){
        backRankMinorsCount++
      }
    }
    return backRankMinorsCount
  }


  noNonPawnsUnderAttack({moves: moves, board: board}){
    for(let i = 0; i < moves.length; i++){
      let move = moves[i]
      if( move.captureNotation && !board.pieceTypeAt(move.endPosition) === Board.PAWN ){
        return true
      }
    }
  }

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

      35: .2, 36: .2, 27: .2, 28: .2,


      18: .09, 19: .09, 20: .09, 21: .09, 26: .09, 29: .09, 34: .09, 37: .09, 42: .09, 43: .09, 44: .09, 45: .09,


      9:  0, 10: 0, 11: 0, 12: 0, 13: 0, 14: 0,

      17: 0, 22: 0, 25: 0, 30: 0, 33: 0, 38: 0, 41: 0, 46: 0,

      49: 0, 50: 0, 51: 0, 52: 0, 53: 0, 54: 0,



      0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0,

      8:  0, 16: 0, 24: 0, 32: 0, 40: 0, 48: 0,

      56: 0, 57: 0, 58: 0, 59: 0, 60: 0, 61: 0, 62: 0, 63: 0,

      15: 0, 23: 0, 31: 0, 39: 0, 47: 0, 55: 0,
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
