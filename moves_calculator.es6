class MovesCalculator {
  constructor({  startPosition: startPosition, board: board, moveObjects: moveObjects, ignoreCastles: ignoreCastles, endPosition: endPosition
  }){
    this.startPosition = startPosition;
    this.board = board;
    this.moveObjects = moveObjects || [];
    this.viablePositions = {};
    this.ignoreCastles = ignoreCastles || false;
    this.endPosition = endPosition;
    this.addMoves();
    this.calculateViablePositions();
  }
// calculate form of motion by div modding start and end
// check whether the piece at the start is in the list of pieces allowed to make such a movement
// have some conditions under which pawns can move
// also conditions for castling
  addMoves(){
    if ( this.startPosition === undefined || !this.board){
      throw new Error("moveObject missing startPosition or board in addMovementTypesAndBoundaryChecks")
    } else {
      let pieceType = this.board.pieceTypeAt(this.startPosition), //TODO maybe shouldn't rely on Nan below when endPosition is undefined
          pieceSpecificMovements = MovesCalculator.pieceSpecificMovements(pieceType)// , (this.endPosition - this.startPosition ) );
          // the difference between the two refs to pieceSpecificMovements in these couple lines is very unclear
      this.moveObjects = pieceSpecificMovements({startPosition: this.startPosition, board: this.board, ignoreCastles: this.ignoreCastles})
    }
  }

  calculateViablePositions(){
    let teamString = this.board.teamAt(this.startPosition);
    for(let i = 0; i < this.moveObjects.length; i++){
      let move = this.moveObjects[i],
          increment = move.increment,
          rangeLimit = move.rangeLimit,
          boundaryCheck = move.boundaryCheck;
      for(let j = 1; j <= rangeLimit; j++){
        let currentPosition = increment * j + this.startPosition;
        if ( !boundaryCheck(j, increment, this.startPosition) ){
          break
        }
        if ( this.board.positionEmpty(currentPosition) ){
          this.viablePositions[currentPosition] = move
          if( this.endPosition === currentPosition){ return }
        } else if( this.board.occupiedByOpponent({position: currentPosition, teamString: teamString} ) ){
          this.viablePositions[currentPosition] = move
          if( this.endPosition === currentPosition){ return }
          break
        } else if( this.board.occupiedByTeamMate({position: currentPosition, teamString: teamString} ) ){
          break
        };
      };
    };
  }

  static get verticalUpIncrement(){ return 8 }
  static get verticalDownIncrement(){ return -8 }
  static get forwardSlashUpIncrement(){ return 9 }
  static get forwardSlashDownIncrement(){ return -9 }
  static get backSlashUpIncrement(){ return 7 }
  static get backSlashDownIncrement(){ return -7 }
  static get nightVerticalLeftUpIncrement(){ return 15 }
  static get nightVerticalRightUpIncrement(){ return 17 }
  static get nightHorizontalLeftUpIncrement(){ return 6 }
  static get nightHorizontalRightUpIncrement(){ return 10 }
  static get nightVerticalLeftDownIncrement(){ return -15 }
  static get nightVerticalRightDownIncrement(){ return -17 }
  static get nightHorizontalLeftDownIncrement(){ return -6 }
  static get nightHorizontalRightDownIncrement(){ return -10 }
  static get horizontalRightIncrement(){ return 1 }
  static get horizontalLeftIncrement(){ return -1 }


  static genericMovements(increment){
    switch(increment){
      case MovesCalculator.verticalUpIncrement:
        var moveObject = new MoveObject({
          increment: "+8",
          boundaryCheck: function(i, increment, startPosition) {
            let endPosition = i * increment + startPosition;
            return MovesCalculator.boundaryChecks({endPosition: endPosition}).vertical()
          }
        })
        return moveObject
        break;
      case MovesCalculator.verticalDownIncrement:
        var moveObject = new MoveObject({
          increment: "-8",
          boundaryCheck: function(i, increment, startPosition) {
            let endPosition = i * increment + startPosition;
            return MovesCalculator.boundaryChecks({endPosition: endPosition}).vertical()
          }
        })
        return moveObject
        break;
      case MovesCalculator.forwardSlashUpIncrement:
        var moveObject = new MoveObject({
          increment: "+9",
          boundaryCheck: function(i, increment, startPosition) {
            let endPosition = i * increment + startPosition;
            return MovesCalculator.boundaryChecks({startPosition: startPosition, endPosition: endPosition}).diagonalRight()
          }
        })
        return moveObject
        break;
      case MovesCalculator.forwardSlashDownIncrement:
        var moveObject = new MoveObject({
          increment: "-9",
          boundaryCheck: function(i, increment, startPosition) {
            let endPosition = i * increment + startPosition;
            return MovesCalculator.boundaryChecks({startPosition: startPosition, endPosition: endPosition}).diagonalLeft()
          }
        })
        return moveObject
        break;
      case MovesCalculator.backSlashUpIncrement:
        var moveObject = new MoveObject({
          increment: "+7",
          boundaryCheck: function(i, increment, startPosition) {
            let endPosition = i * increment + startPosition;
            return MovesCalculator.boundaryChecks({startPosition: startPosition, endPosition: endPosition}).diagonalLeft()
          }
        })
        return moveObject
        break;
      case MovesCalculator.backSlashDownIncrement:
        var moveObject = new MoveObject({
          increment: "-7",
          boundaryCheck: function(i, increment, startPosition) {
            let endPosition = i * increment + startPosition;
            return MovesCalculator.boundaryChecks({startPosition: startPosition, endPosition: endPosition}).diagonalRight()
          }
        })
        return moveObject
        break;
      case MovesCalculator.horizontalRightIncrement:
        var moveObject = new MoveObject({
          increment: "+1",
          boundaryCheck: function(i, increment, startPosition) {
            let endPosition = i * increment + startPosition;
            return MovesCalculator.boundaryChecks({startPosition: startPosition, endPosition: endPosition}).horizontal()
          }
        })
        return moveObject
        break;
      case MovesCalculator.horizontalLeftIncrement:
        var moveObject = new MoveObject({
          increment: "-1",
          boundaryCheck: function(i, increment, startPosition) {
            let endPosition = i * increment + startPosition;
            return MovesCalculator.boundaryChecks({startPosition: startPosition, endPosition: endPosition}).horizontal()
          }
        })
        return moveObject
        break;
      case MovesCalculator.nightVerticalLeftUpIncrement:
        var moveObject = new MoveObject({
          increment: "+15",
          boundaryCheck: function(i, increment, startPosition) {
            let endPosition = i * increment + startPosition;
            return MovesCalculator.boundaryChecks({startPosition: startPosition, endPosition: endPosition}).nightVertical()
          }
        })
        return moveObject
        break;
      case MovesCalculator.nightVerticalRightUpIncrement:
        var moveObject = new MoveObject({
          increment: "+17",
          boundaryCheck: function(i, increment, startPosition) {
            let endPosition = i * increment + startPosition;
            return MovesCalculator.boundaryChecks({startPosition: startPosition, endPosition: endPosition}).nightVertical()
          }
        })
        return moveObject
        break;
      case MovesCalculator.nightHorizontalLeftUpIncrement:
        var moveObject = new MoveObject({
          increment: "+6",
          boundaryCheck: function(i, increment, startPosition) {
            let endPosition = i * increment + startPosition;
            return MovesCalculator.boundaryChecks({startPosition: startPosition, endPosition: endPosition}).nightHorizontal()
          }
        })
        return moveObject
        break;
      case MovesCalculator.nightHorizontalRightUpIncrement:
        var moveObject = new MoveObject({
          increment: "+10",
          boundaryCheck: function(i, increment, startPosition) {
            let endPosition = i * increment + startPosition;
            return MovesCalculator.boundaryChecks({startPosition: startPosition, endPosition: endPosition}).nightHorizontal()
          }
        })
        return moveObject
        break;
      case MovesCalculator.nightVerticalLeftDownIncrement:
        var moveObject = new MoveObject({
          increment: "-15",
          boundaryCheck: function(i, increment, startPosition) {
            let endPosition = i * increment + startPosition;
            return MovesCalculator.boundaryChecks({startPosition: startPosition, endPosition: endPosition}).nightVertical()
          }
        })
        return moveObject
        break;
      case MovesCalculator.nightVerticalRightDownIncrement:
        var moveObject = new MoveObject({
          increment: "-17",
          boundaryCheck: function(i, increment, startPosition) {
            let endPosition = i * increment + startPosition;
            return MovesCalculator.boundaryChecks({startPosition: startPosition, endPosition: endPosition}).nightVertical()
          }
        })
        return moveObject
        break;
      case MovesCalculator.nightHorizontalLeftDownIncrement:
        var moveObject = new MoveObject({
          increment: "-6",
          boundaryCheck: function(i, increment, startPosition) {
            let endPosition = i * increment + startPosition;
            return MovesCalculator.boundaryChecks({startPosition: startPosition, endPosition: endPosition}).nightHorizontal()
          }
        })
        return moveObject
        break;
      case MovesCalculator.nightHorizontalRightDownIncrement:
        var moveObject = new MoveObject({
          increment: "-10",
          boundaryCheck: function(i, increment, startPosition) {
            let endPosition = i * increment + startPosition;
            return MovesCalculator.boundaryChecks({startPosition: startPosition, endPosition: endPosition}).nightHorizontal()
          }
        })
        return moveObject
        break;
    }
  }

  static boundaryChecks(args){
    let startPosition = args["startPosition"],
        endPosition = args["endPosition"]
    return {
      diagonalRight: function(){
        return (endPosition) % 8 > (startPosition % 8) && Board._inBounds(endPosition)
      },
      vertical: function(){
        return Board._inBounds(endPosition)
      },
      diagonalLeft: function(){
        return (endPosition) % 8 < (startPosition % 8) && Board._inBounds(endPosition)
      },
      nightVertical: function(){
        return Math.abs( (endPosition) % 8 - startPosition % 8 ) === 1 && Board._inBounds(endPosition)
      },
      nightHorizontal: function(){
        return Math.abs( (endPosition) % 8 - startPosition % 8 ) === 2 && Board._inBounds(endPosition)
      },
      horizontal: function(){
        return Math.floor((endPosition) / 8) === Math.floor(startPosition / 8) && Board._inBounds(endPosition)
      }
    }
  }

  static get allIncrements(){
    return [MovesCalculator.verticalUpIncrement, MovesCalculator.verticalDownIncrement, MovesCalculator.forwardSlashUpIncrement, MovesCalculator.forwardSlashDownIncrement,
      MovesCalculator.backSlashUpIncrement, MovesCalculator.backSlashDownIncrement, MovesCalculator.nightVerticalLeftUpIncrement, MovesCalculator.nightVerticalRightUpIncrement,
      MovesCalculator.nightHorizontalLeftUpIncrement, MovesCalculator.nightHorizontalRightUpIncrement, MovesCalculator.nightVerticalLeftDownIncrement, MovesCalculator.nightVerticalRightDownIncrement,
      MovesCalculator.nightHorizontalLeftDownIncrement, MovesCalculator.nightHorizontalRightDownIncrement, MovesCalculator.horizontalRightIncrement, MovesCalculator.horizontalLeftIncrement
    ]
  }

  static getCommonMoveObjects(arr1, arr2){
    let commons = []
    for(let i = 0; i < arr1.length; i++){
      for(let j = 0; j < arr2.length; j++){
        if( arr1[i].increment === arr2[j].increment && !(commons.includes(arr1[i]) ) ){
          commons.push(arr1[i])
        }
      }
    }
    return commons
  }
 // static getCommonMoveObjects(arrays){//Assumes that we are dealing with an array of arrays of integers
    // var currentValues = {};
    // var commonValues = {};
    // for (var i = arrays[0].length-1; i >=0; i--){//Iterating backwards for efficiency
    //   currentValues[arrays[0][i]] = 1; //Doesn't really matter what we set it to
    // }
    // for (var i = arrays.length-1; i>0; i--){
    //   var currentArray = arrays[i];
    //   for (var j = currentArray.length-1; j >=0; j--){
    //     if (currentArray[j] in currentValues){
    //       commonValues[currentArray[j]] = 1; //Once again, the `1` doesn't matter
    //     }
    //   }
    //   currentValues = commonValues;
    //   commonValues = {};
    // }
    // return Object.keys(currentValues).map(function(value){
    //   return parseInt(value);
    // });
  // }

  static pieceSpecificMovements(species, differential){

    // if( differential ){
    //   var possibleMovesTowardsEndPosition = []
    //   for( let i = 0; i < MovesCalculator.allIncrements.length; i++){
    //     let increment = MovesCalculator.allIncrements[i];
    //     if( differential % increment === 0 ){
    //       possibleMovesTowardsEndPosition.push( MovesCalculator.genericMovements( increment ) )
    //     }
    //   }
    // };

    switch(species){
      case "P":
        return function({board: board, startPosition: startPosition}){
          var moveObjects = [],
            teamString = board.teamAt(startPosition),
            colorVars = {
              B: {
                startRank: 7,
                nonAttackMove: MovesCalculator.genericMovements( MovesCalculator.verticalDownIncrement),
                singleStepCheck: board._oneSpaceDownIsEmpty(startPosition),
                doubleStepCheck: Board.isSeventhRank(startPosition) && board._twoSpacesDownIsEmpty(startPosition),
                leftAttackCheck: board._downAndLeftIsAttackable(startPosition),
                leftAttackMove: MovesCalculator.genericMovements( MovesCalculator.forwardSlashDownIncrement),
                rightAttackCheck: board._downAndRightIsAttackable(startPosition),
                rightAttackMove: MovesCalculator.genericMovements( MovesCalculator.backSlashDownIncrement),
                rightEnPassantCheck: Board.rank(startPosition) === 4 && board._whitePawnAt(startPosition + 1) && board.whitePawnDoubleSteppedTo(startPosition + 1),//board.whitePawnDoubleSteppedFrom(startPosition - 15),
                leftEnPassantCheck: Board.rank(startPosition) === 4 && board._whitePawnAt(startPosition - 1) && board.whitePawnDoubleSteppedTo(startPosition - 1)// board.whitePawnDoubleSteppedFrom(startPosition - 17),
              },
              W: {
                startRank: 2,
                nonAttackMove: MovesCalculator.genericMovements( MovesCalculator.verticalUpIncrement),
                singleStepCheck: board._oneSpaceUpIsEmpty(startPosition),
                doubleStepCheck: Board.isSecondRank(startPosition) && board._twoSpacesUpIsEmpty( startPosition ),
                leftAttackCheck: board._upAndLeftIsAttackable(startPosition),
                leftAttackMove: MovesCalculator.genericMovements( MovesCalculator.backSlashUpIncrement),
                rightAttackCheck: board._upAndRightIsAttackable(startPosition ),
                rightAttackMove: MovesCalculator.genericMovements( MovesCalculator.forwardSlashUpIncrement),
                leftEnPassantCheck: Board.rank(startPosition) === 5 && board._blackPawnAt(startPosition - 1) && board.blackPawnDoubleSteppedTo(startPosition - 1),//board.blackPawnDoubleSteppedFrom(startPosition + 15),
                rightEnPassantCheck: Board.rank(startPosition) === 5 && board._blackPawnAt(startPosition + 1) && board.blackPawnDoubleSteppedTo(startPosition + 1)//board.blackPawnDoubleSteppedFrom(startPosition + 17),
              }
            },
            pawnVars = colorVars[teamString];
          if ( pawnVars.singleStepCheck ) {
            let moveObject = pawnVars.nonAttackMove
            moveObject.rangeLimit = 1
            moveObject.pieceNotation = ""
            moveObject.startPosition = startPosition
            moveObjects = moveObjects.concat(moveObject)
          }
          if ( pawnVars.doubleStepCheck ){
              let moveObject = pawnVars.nonAttackMove
            moveObject.rangeLimit = 2
            moveObject.pieceNotation = ""
            moveObject.startPosition = startPosition
            moveObjects = moveObjects.concat(moveObject)
          }
          if ( pawnVars.leftAttackCheck ) {
            let moveObject = pawnVars.leftAttackMove
            moveObject.rangeLimit = 1
            moveObject.startPosition = startPosition
            moveObject.pieceNotation = Board.file(startPosition)
            moveObjects = moveObjects.concat(moveObject)
          }
          if( pawnVars.rightAttackCheck ) {
            let moveObject = pawnVars.rightAttackMove
            moveObject.rangeLimit = 1
            moveObject.startPosition = startPosition
            moveObject.pieceNotation = Board.file(startPosition)
            moveObjects = moveObjects.concat(moveObject)
          };
          if( pawnVars.rightEnPassantCheck ){
            let moveObject = pawnVars.rightAttackMove
            moveObject.rangeLimit = 1
            moveObject.startPosition = startPosition
            moveObject.pieceNotation = Board.file(startPosition)
            moveObject.additionalActions = function(args){
              let position = args["position"],
                captureNotation = this._capture(startPosition + 1) + "e.p.";
              return captureNotation
            }
            moveObjects = moveObjects.concat(moveObject)
          }
          if( pawnVars.leftEnPassantCheck ){
            let moveObject = pawnVars.leftAttackMove
            moveObject.rangeLimit = 1
            moveObject.startPosition = startPosition
            moveObject.pieceNotation = Board.file(startPosition)
            moveObject.additionalActions = function(args){
              let position = args["position"];
              let captureNotation = this._capture(startPosition - 1) + "e.p.";
              return captureNotation
            }
            moveObjects = moveObjects.concat(moveObject)
          }
        return moveObjects;
      };
      case "N":
        return function({board: board, startPosition: startPosition}){
          var moveObjects = [MovesCalculator.genericMovements( MovesCalculator.nightHorizontalRightDownIncrement), MovesCalculator.genericMovements( MovesCalculator.nightHorizontalLeftDownIncrement), MovesCalculator.genericMovements( MovesCalculator.nightVerticalRightDownIncrement),
              MovesCalculator.genericMovements( MovesCalculator.nightVerticalLeftDownIncrement), MovesCalculator.genericMovements( MovesCalculator.nightHorizontalRightUpIncrement), MovesCalculator.genericMovements( MovesCalculator.nightHorizontalLeftUpIncrement),
              MovesCalculator.genericMovements( MovesCalculator.nightVerticalRightUpIncrement), MovesCalculator.genericMovements( MovesCalculator.nightVerticalLeftUpIncrement)
            ];
          //
          // if( possibleMovesTowardsEndPosition ){
          //   moveObjects = MovesCalculator.getCommonMoveObjects(moveObjects, possibleMovesTowardsEndPosition)
          // }


          for (let i = 0; i < moveObjects.length; i++ ) {
              moveObjects[i].rangeLimit = 1;
              moveObjects[i].pieceNotation = "N";;
              moveObjects[i].startPosition = startPosition
          };
          return  moveObjects
        };
      case "R":
        return function({board: board, startPosition: startPosition}){
          var moveObjects = [MovesCalculator.genericMovements( MovesCalculator.horizontalRightIncrement), MovesCalculator.genericMovements( MovesCalculator.horizontalLeftIncrement), MovesCalculator.genericMovements( MovesCalculator.verticalUpIncrement), MovesCalculator.genericMovements( MovesCalculator.verticalDownIncrement)]
          //
          // if( possibleMovesTowardsEndPosition ){
          //   moveObjects = MovesCalculator.getCommonMoveObjects(moveObjects, possibleMovesTowardsEndPosition)
          // }

          for (let i = 0; i < moveObjects.length; i++ ) {
            moveObjects[i].rangeLimit = 7;
            moveObjects[i].pieceNotation = "R";
            moveObjects[i].startPosition = startPosition
          };
          return moveObjects
        };
      case "B":
        return function({board: board, startPosition: startPosition}){
          var moveObjects = [MovesCalculator.genericMovements( MovesCalculator.forwardSlashDownIncrement), MovesCalculator.genericMovements( MovesCalculator.forwardSlashUpIncrement), MovesCalculator.genericMovements( MovesCalculator.backSlashDownIncrement), MovesCalculator.genericMovements( MovesCalculator.backSlashUpIncrement)]
          //
          // if( possibleMovesTowardsEndPosition ){
          //   moveObjects = MovesCalculator.getCommonMoveObjects(moveObjects, possibleMovesTowardsEndPosition)
          // }

          for (let i = 0; i < moveObjects.length; i++ ) {
            moveObjects[i].rangeLimit = 7;
            moveObjects[i].pieceNotation = "B";
            moveObjects[i].startPosition = startPosition
          };
          return moveObjects
        };
      case "Q":
        return function({board: board, startPosition: startPosition}){
          // var moveObjects =  MovesCalculator.pieceSpecificMovements("R", differential)({startPosition: startPosition, board: board}).concat( MovesCalculator.pieceSpecificMovements("B", differential)({startPosition: startPosition, board: board}) )
          //
          var moveObjects = [MovesCalculator.genericMovements( MovesCalculator.forwardSlashDownIncrement), MovesCalculator.genericMovements( MovesCalculator.forwardSlashUpIncrement),
            MovesCalculator.genericMovements( MovesCalculator.backSlashDownIncrement), MovesCalculator.genericMovements( MovesCalculator.backSlashUpIncrement),
            MovesCalculator.genericMovements( MovesCalculator.horizontalRightIncrement), MovesCalculator.genericMovements( MovesCalculator.horizontalLeftIncrement),
            MovesCalculator.genericMovements( MovesCalculator.verticalUpIncrement), MovesCalculator.genericMovements( MovesCalculator.verticalDownIncrement)
          ];
          //
          // if( possibleMovesTowardsEndPosition ){
          //   moveObjects = MovesCalculator.getCommonMoveObjects(moveObjects, possibleMovesTowardsEndPosition)
          // }

          for (let i = 0; i < moveObjects.length; i++ ) {
            moveObjects[i].rangeLimit = 7;
            moveObjects[i].pieceNotation = "Q";
            moveObjects[i].startPosition = startPosition
          };
          return moveObjects
        };
      case "K":
        return function({board: board, startPosition: startPosition, ignoreCastles: ignoreCastles}){

        var moveObjects = [MovesCalculator.genericMovements( MovesCalculator.horizontalRightIncrement), MovesCalculator.genericMovements( MovesCalculator.horizontalLeftIncrement), MovesCalculator.genericMovements( MovesCalculator.verticalUpIncrement), MovesCalculator.genericMovements( MovesCalculator.verticalDownIncrement),
            MovesCalculator.genericMovements( MovesCalculator.forwardSlashDownIncrement), MovesCalculator.genericMovements( MovesCalculator.forwardSlashUpIncrement), MovesCalculator.genericMovements( MovesCalculator.backSlashDownIncrement), MovesCalculator.genericMovements( MovesCalculator.backSlashUpIncrement)
          ],
          team = board.teamAt(startPosition);
          //
          // if( possibleMovesTowardsEndPosition ){
          //   moveObjects = MovesCalculator.getCommonMoveObjects(moveObjects, possibleMovesTowardsEndPosition)
          // }

        for (let i = 0; i < moveObjects.length; i++ ) {
          moveObjects[i].rangeLimit = 1;
          moveObjects[i].pieceNotation = "K";
          moveObjects[i].startPosition = startPosition
        };
        if ( !ignoreCastles && board.kingSideCastleViableFor(team) ){
          let moveObject = MovesCalculator.genericMovements( MovesCalculator.horizontalLeftIncrement)
          moveObject.increment = + 2
          moveObject.rangeLimit = 1
          moveObject.fullNotation = "O-O";
          moveObject.startPosition = startPosition;
          moveObject.additionalActions = function(args){
            let position = args["position"],
                pieceObject = this.pieceObject( startPosition + 3 );
            this._emptify( startPosition + 3)
            this._placePiece({ position: (startPosition + 1), pieceObject: pieceObject })
          }
          moveObjects.push(moveObject)
        };
        if ( !ignoreCastles && board.queenSideCastleViableFor(team) ){
          let moveObject = MovesCalculator.genericMovements( MovesCalculator.horizontalRightIncrement)
          moveObject.increment = - 2
          moveObject.rangeLimit = 1
          moveObject.fullNotation = "O-O-O";
          moveObject.startPosition = startPosition;
          moveObject.additionalActions = function(args){
            let position = args["position"],
                pieceObject = this.pieceObject( startPosition - 4 );
            this._emptify( startPosition - 4)
            this._placePiece({ position: (startPosition - 1), pieceObject: pieceObject })
          }
          moveObjects.push(moveObject)
        };
        return moveObjects
      };
    }
  }

}
