class PieceMovementTypesFactory{
  static factory({pieceType: pieceType, startPosition: startPosition, board: board, ignoreCastles: ignoreCastles, attacksOnly: attacksOnly}){
    switch(pieceType){
      case "P":
        return PieceMovementTypesFactory.P({startPosition: startPosition, board: board, attacksOnly: attacksOnly})
        break;
      case "N":
        return PieceMovementTypesFactory.N({startPosition: startPosition, board: board})
        break;
      case "R":
        return PieceMovementTypesFactory.R({startPosition: startPosition, board: board})
        break;
      case "B":
        return PieceMovementTypesFactory.B({startPosition: startPosition, board: board})
        break;
      case "Q":
        return PieceMovementTypesFactory.Q({startPosition: startPosition, board: board})
        break;
      case "K":
        return PieceMovementTypesFactory.K({startPosition: startPosition, board: board, ignoreCastles: ignoreCastles, attacksOnly: attacksOnly})
        break
    }
  }

  static P({startPosition: startPosition, board: board, attacksOnly: attacksOnly}){
    var movementTypes = [],
      teamString = board.teamAt(startPosition);
    if( teamString === Board.BLACK ){
      var pawnVars = {
        startRank: 7,
        nonAttackMove: MovementType.verticalDownIncrement({}),
        singleStepCheck: board._oneSpaceDownIsEmpty(startPosition),
        doubleStepCheck: Board.isSeventhRank(startPosition) && board._twoSpacesDownIsEmpty(startPosition) && board._oneSpaceDownIsEmpty(startPosition),
        leftAttackCheck: board._downAndLeftIsAttackable(startPosition),
        leftAttackMove: MovementType.forwardSlashDownIncrement({}),
        rightAttackCheck: board._downAndRightIsAttackable(startPosition),
        rightAttackMove: MovementType.backSlashDownIncrement({}),
        rightEnPassantCheck: Board.rank(startPosition) === 4 && board._whitePawnAt(startPosition + 1) && board.whitePawnDoubleSteppedTo(startPosition + 1),//board.whitePawnDoubleSteppedFrom(startPosition - 15),
        leftEnPassantCheck: Board.rank(startPosition) === 4 && board._whitePawnAt(startPosition - 1) && board.whitePawnDoubleSteppedTo(startPosition - 1)// board.whitePawnDoubleSteppedFrom(startPosition - 17),
      }
    } else if( teamString === Board.WHITE ){
      var pawnVars = {
        startRank: 2,
        nonAttackMove: MovementType.verticalUpIncrement({}),
        singleStepCheck: board._oneSpaceUpIsEmpty(startPosition),
        doubleStepCheck: Board.isSecondRank(startPosition) && board._twoSpacesUpIsEmpty( startPosition ) && board._oneSpaceUpIsEmpty(startPosition),
        leftAttackCheck: board._upAndLeftIsAttackable(startPosition),
        leftAttackMove: MovementType.backSlashUpIncrement({}),
        rightAttackCheck: board._upAndRightIsAttackable(startPosition ),
        rightAttackMove: MovementType.forwardSlashUpIncrement({}),
        leftEnPassantCheck: Board.rank(startPosition) === 5 && board._blackPawnAt(startPosition - 1) && board.blackPawnDoubleSteppedTo(startPosition - 1),//board.blackPawnDoubleSteppedFrom(startPosition + 15),
        rightEnPassantCheck: Board.rank(startPosition) === 5 && board._blackPawnAt(startPosition + 1) && board.blackPawnDoubleSteppedTo(startPosition + 1)//board.blackPawnDoubleSteppedFrom(startPosition + 17),
      }
    }
    if ( pawnVars.doubleStepCheck && !attacksOnly ){
      let movementType = pawnVars.nonAttackMove
      movementType.rangeLimit = 2
      movementType.pieceNotation = ""
      movementType.startPosition = startPosition
      movementTypes.push(movementType)
    } else if ( pawnVars.singleStepCheck && !attacksOnly ) {
      let movementType = pawnVars.nonAttackMove
      movementType.rangeLimit = 1
      movementType.pieceNotation = ""
      movementType.startPosition = startPosition
      movementTypes.push(movementType)
    }
    if ( pawnVars.leftAttackCheck || attacksOnly) {
      let movementType = pawnVars.leftAttackMove
      movementType.rangeLimit = 1
      movementType.startPosition = startPosition
      movementType.pieceNotation = Board.file(startPosition)
      movementTypes.push(movementType)
    }
    if( pawnVars.rightAttackCheck || attacksOnly) {
      let movementType = pawnVars.rightAttackMove
      movementType.rangeLimit = 1
      movementType.startPosition = startPosition
      movementType.pieceNotation = Board.file(startPosition)
      movementTypes.push(movementType)
    }
    if( pawnVars.rightEnPassantCheck ){
      let movementType = pawnVars.rightAttackMove
      movementType.rangeLimit = 1
      movementType.startPosition = startPosition
      movementType.pieceNotation = Board.file(startPosition)// + "x"
      movementType.captureNotation = "x"
      // let capture = board._capture.bind(board)
      movementType.additionalActions = function(startPosition){
        this._capture(startPosition + 1)
        this._emptify(startPosition + 1)
        return "e.p."
      }
      movementTypes.push(movementType)
    }
    if( pawnVars.leftEnPassantCheck ){
      let movementType = pawnVars.leftAttackMove
      movementType.rangeLimit = 1
      movementType.startPosition = startPosition
      movementType.pieceNotation = Board.file(startPosition)// + "x"
      movementType.captureNotation = "x"
      // let capture = board._capture.bind(board)
      movementType.additionalActions = function(startPosition){
        this._capture(startPosition - 1)
        this._emptify(startPosition - 1)
        return "e.p."
      }
      movementTypes.push(movementType)
    }
      // debugger
    return movementTypes
  }

  static N({startPosition: startPosition, board: board}){
    let pieceNotation = "N",
      rangeLimit = 1
    var movementTypes = [MovementType.nightHorizontalRightDownIncrement({startPosition: startPosition, rangeLimit: rangeLimit, pieceNotation: pieceNotation }), MovementType.nightHorizontalLeftDownIncrement({startPosition: startPosition, rangeLimit: rangeLimit, pieceNotation: pieceNotation }), MovementType.nightVerticalRightDownIncrement({startPosition: startPosition, rangeLimit: rangeLimit, pieceNotation: pieceNotation }),
        MovementType.nightVerticalLeftDownIncrement({startPosition: startPosition, rangeLimit: rangeLimit, pieceNotation: pieceNotation }), MovementType.nightHorizontalRightUpIncrement({startPosition: startPosition, rangeLimit: rangeLimit, pieceNotation: pieceNotation }), MovementType.nightHorizontalLeftUpIncrement({startPosition: startPosition, rangeLimit: rangeLimit, pieceNotation: pieceNotation }),
        MovementType.nightVerticalRightUpIncrement({startPosition: startPosition, rangeLimit: rangeLimit, pieceNotation: pieceNotation }), MovementType.nightVerticalLeftUpIncrement({startPosition: startPosition, rangeLimit: rangeLimit, pieceNotation: pieceNotation })
      ]
    // if( possibleMovesTowardsEndPosition ){
    //   movementTypes = MovesCalculator.getCommonMoveObjects(movementTypes, possibleMovesTowardsEndPosition)
    // }
    // for (let i = 0; i < movementTypes.length; i++ ) {
    //     movementTypes[i].rangeLimit = 1
    //     movementTypes[i].pieceNotation = "N";
    //     movementTypes[i].startPosition = startPosition
    // }
    return  movementTypes
  }
  static R({startPosition: startPosition, board: board}){
    let pieceNotation = "R",
      rangeLimit = 7;
    var movementTypes = [MovementType.horizontalRightIncrement({startPosition: startPosition, rangeLimit: rangeLimit, pieceNotation: pieceNotation }), MovementType.horizontalLeftIncrement({startPosition: startPosition, rangeLimit: rangeLimit, pieceNotation: pieceNotation }), MovementType.verticalUpIncrement({startPosition: startPosition, rangeLimit: rangeLimit, pieceNotation: pieceNotation }), MovementType.verticalDownIncrement({startPosition: startPosition, rangeLimit: rangeLimit, pieceNotation: pieceNotation })]
    // if( possibleMovesTowardsEndPosition ){
    //   movementTypes = MovesCalculator.getCommonMoveObjects(movementTypes, possibleMovesTowardsEndPosition)
    // }
    // for (let i = 0; i < movementTypes.length; i++ ) {
    //   movementTypes[i].rangeLimit = 7
    //   movementTypes[i].pieceNotation = "R"
    //   movementTypes[i].startPosition = startPosition
    // }
    return movementTypes
  }
  static B({startPosition: startPosition, board: board}){
    let pieceNotation = "B",
      rangeLimit = 7;
    var movementTypes = [MovementType.forwardSlashDownIncrement({startPosition: startPosition, rangeLimit: rangeLimit, pieceNotation: pieceNotation }), MovementType.forwardSlashUpIncrement({startPosition: startPosition, rangeLimit: rangeLimit, pieceNotation: pieceNotation }), MovementType.backSlashDownIncrement({startPosition: startPosition, rangeLimit: rangeLimit, pieceNotation: pieceNotation }), MovementType.backSlashUpIncrement({startPosition: startPosition, rangeLimit: rangeLimit, pieceNotation: pieceNotation })]
    // if( possibleMovesTowardsEndPosition ){
    //   movementTypes = MovesCalculator.getCommonMoveObjects(movementTypes, possibleMovesTowardsEndPosition)
    // }
    // for (let i = 0; i < movementTypes.length; i++ ) {
    //   movementTypes[i].rangeLimit = 7
    //   movementTypes[i].pieceNotation = "B"
    //   movementTypes[i].startPosition = startPosition
    // }
    return movementTypes
  }
  static Q({startPosition: startPosition, board: board}){
    let pieceNotation = "Q",
      rangeLimit = 7;
    // var movementTypes =  MovesCalculator.pieceSpecificMovements("R", differential)({startPosition: startPosition, board: board}).concat( MovesCalculator.pieceSpecificMovements("B", differential)({startPosition: startPosition, board: board}) )
    //
    var movementTypes = [MovementType.forwardSlashDownIncrement({startPosition: startPosition, rangeLimit: rangeLimit, pieceNotation: pieceNotation }), MovementType.forwardSlashUpIncrement({startPosition: startPosition, rangeLimit: rangeLimit, pieceNotation: pieceNotation }),
      MovementType.backSlashDownIncrement({startPosition: startPosition, rangeLimit: rangeLimit, pieceNotation: pieceNotation }), MovementType.backSlashUpIncrement({startPosition: startPosition, rangeLimit: rangeLimit, pieceNotation: pieceNotation }),
      MovementType.horizontalRightIncrement({startPosition: startPosition, rangeLimit: rangeLimit, pieceNotation: pieceNotation }), MovementType.horizontalLeftIncrement({startPosition: startPosition, rangeLimit: rangeLimit, pieceNotation: pieceNotation }),
      MovementType.verticalUpIncrement({startPosition: startPosition, rangeLimit: rangeLimit, pieceNotation: pieceNotation }), MovementType.verticalDownIncrement({startPosition: startPosition, rangeLimit: rangeLimit, pieceNotation: pieceNotation })
    ]
    // if( possibleMovesTowardsEndPosition ){
    //   movementTypes = MovesCalculator.getCommonMoveObjects(movementTypes, possibleMovesTowardsEndPosition)
    // }
    // for (let i = 0; i < movementTypes.length; i++ ) {
    //   movementTypes[i].rangeLimit = 7
    //   movementTypes[i].pieceNotation = "Q"
    //   movementTypes[i].startPosition = startPosition
    // }
    return movementTypes
  }
  static K({startPosition: startPosition, board: board, ignoreCastles: ignoreCastles, attacksOnly: attacksOnly}){
    let pieceNotation = "K",
      rangeLimit = 1;
    var movementTypes = [MovementType.horizontalRightIncrement({startPosition: startPosition, rangeLimit: rangeLimit, pieceNotation: pieceNotation }), MovementType.horizontalLeftIncrement({startPosition: startPosition, rangeLimit: rangeLimit, pieceNotation: pieceNotation }), MovementType.verticalUpIncrement({startPosition: startPosition, rangeLimit: rangeLimit, pieceNotation: pieceNotation }), MovementType.verticalDownIncrement({startPosition: startPosition, rangeLimit: rangeLimit, pieceNotation: pieceNotation }),
        MovementType.forwardSlashDownIncrement({startPosition: startPosition, rangeLimit: rangeLimit, pieceNotation: pieceNotation }), MovementType.forwardSlashUpIncrement({startPosition: startPosition, rangeLimit: rangeLimit, pieceNotation: pieceNotation }), MovementType.backSlashDownIncrement({startPosition: startPosition, rangeLimit: rangeLimit, pieceNotation: pieceNotation }), MovementType.backSlashUpIncrement({startPosition: startPosition, rangeLimit: rangeLimit, pieceNotation: pieceNotation })
      ],
      team = board.teamAt(startPosition)
      //
      // if( possibleMovesTowardsEndPosition ){
      //   movementTypes = MovesCalculator.getCommonMoveObjects(movementTypes, possibleMovesTowardsEndPosition)
      // }

    // for (let i = 0; i < movementTypes.length; i++ ) {
    //   movementTypes[i].rangeLimit = 1
    //   movementTypes[i].pieceNotation = "K"
    //   movementTypes[i].startPosition = startPosition
    // }
    if ( !ignoreCastles && board.kingSideCastleViableFor(team, startPosition) && !attacksOnly){
      let movementType = MovementType.horizontalLeftIncrement({startPosition: startPosition, rangeLimit: rangeLimit, pieceNotation: pieceNotation })
      movementType.increment = + 2
      movementType.rangeLimit = 1
      movementType.pieceNotation = "O-O"
      movementType.startPosition = startPosition
      // let _emptify = board._emptify.bind(board),
      //   _placePiece = board._placePiece.bind(board),
      //   pieceObject = board.pieceObject.bind(board)
      movementType.additionalActions = function(startPosition){
        let rook = this.pieceObject( startPosition + 3 )
        this._placePiece({ position: (startPosition + 1), pieceObject: rook })
        this._emptify( startPosition + 3)
        return ""
      }
      movementTypes.push(movementType)
    }
    if ( !ignoreCastles && board.queenSideCastleViableFor(team, startPosition) && !attacksOnly){
      let movementType = MovementType.horizontalRightIncrement({startPosition: startPosition, rangeLimit: rangeLimit, pieceNotation: pieceNotation })
      movementType.increment = - 2
      movementType.rangeLimit = 1
      movementType.pieceNotation = "O-O-O"
      movementType.startPosition = startPosition
      // let _emptify = board._emptify.bind(board),
      //   _placePiece = board._placePiece.bind(board),
      //   pieceObject = board.pieceObject.bind(board)
      movementType.additionalActions = function(startPosition){
        let rook = this.pieceObject( startPosition - 4 )
        this._placePiece({ position: (startPosition - 1), pieceObject: rook })
        this._emptify( startPosition - 4)
        return ""
      }
      movementTypes.push(movementType)
    }
    return movementTypes
  }

}
