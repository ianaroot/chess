class PieceMovementTypesFactory{
  static complexFactory({pieceType: pieceType, startPosition: startPosition, board: board, ignoreCastles: ignoreCastles, attacksOnly: attacksOnly}){
    switch(pieceType){
      case "P":
        return PieceMovementTypesFactory.P({startPosition: startPosition, board: board, attacksOnly: attacksOnly})
        break;
      case "K":
        return PieceMovementTypesFactory.K({startPosition: startPosition, board: board, ignoreCastles: ignoreCastles, attacksOnly: attacksOnly})
        break
    }
  }
  static simpleFactory(pieceType){
    switch(pieceType){
      case "N":
        return PieceMovementTypesFactory.N()
        break;
      case "R":
        return PieceMovementTypesFactory.R()
        break;
      case "B":
        return PieceMovementTypesFactory.B()
        break;
      case "Q":
        return PieceMovementTypesFactory.Q()
        break;
    }

  }

  static P({startPosition: startPosition, board: board, attacksOnly: attacksOnly}){
    var movementTypes = [],
      teamString = board.teamAt(startPosition);
    if( teamString === Board.BLACK ){
      var pawnVars = {
        startRank: 7,
        nonAttackMove: MovementType.verticalDownIncrement,
        singleStepCheck: board._oneSpaceDownIsEmpty(startPosition),
        doubleStepCheck: Board.isSeventhRank(startPosition) && board._twoSpacesDownIsEmpty(startPosition) && board._oneSpaceDownIsEmpty(startPosition),
        leftAttackCheck: board._downAndLeftIsAttackable(startPosition),
        leftAttackMove: MovementType.forwardSlashDownIncrement,
        rightAttackCheck: board._downAndRightIsAttackable(startPosition),
        rightAttackMove: MovementType.backSlashDownIncrement,
        rightEnPassantCheck: Board.rank(startPosition) === 4 && board._whitePawnAt(startPosition + 1) && board.whitePawnDoubleSteppedTo(startPosition + 1),//board.whitePawnDoubleSteppedFrom(startPosition - 15),
        leftEnPassantCheck: Board.rank(startPosition) === 4 && board._whitePawnAt(startPosition - 1) && board.whitePawnDoubleSteppedTo(startPosition - 1)// board.whitePawnDoubleSteppedFrom(startPosition - 17),
      }
    } else if( teamString === Board.WHITE ){
      var pawnVars = {
        startRank: 2,
        nonAttackMove: MovementType.verticalUpIncrement,
        singleStepCheck: board._oneSpaceUpIsEmpty(startPosition),
        doubleStepCheck: Board.isSecondRank(startPosition) && board._twoSpacesUpIsEmpty( startPosition ) && board._oneSpaceUpIsEmpty(startPosition),
        leftAttackCheck: board._upAndLeftIsAttackable(startPosition),
        leftAttackMove: MovementType.backSlashUpIncrement,
        rightAttackCheck: board._upAndRightIsAttackable(startPosition ),
        rightAttackMove: MovementType.forwardSlashUpIncrement,
        leftEnPassantCheck: Board.rank(startPosition) === 5 && board._blackPawnAt(startPosition - 1) && board.blackPawnDoubleSteppedTo(startPosition - 1),//board.blackPawnDoubleSteppedFrom(startPosition + 15),
        rightEnPassantCheck: Board.rank(startPosition) === 5 && board._blackPawnAt(startPosition + 1) && board.blackPawnDoubleSteppedTo(startPosition + 1)//board.blackPawnDoubleSteppedFrom(startPosition + 17),
      }
    }
    if ( pawnVars.doubleStepCheck && !attacksOnly ){
      let movementType = pawnVars.nonAttackMove({
        rangeLimit: 2,
        pieceNotation: "",
      })
      movementTypes.push(movementType)
    } else if ( pawnVars.singleStepCheck && !attacksOnly ) {
      let movementType = pawnVars.nonAttackMove({
        rangeLimit: 1,
        pieceNotation: "",
      })
      movementTypes.push(movementType)
    }
    if ( pawnVars.leftAttackCheck || attacksOnly) {
      let movementType = pawnVars.leftAttackMove({
        rangeLimit: 1,
        pieceNotation: Board.file(startPosition)
      })
      movementTypes.push(movementType)
    }else if( pawnVars.leftEnPassantCheck ){
      // let capture = board._capture.bind(board)
      let movementType = pawnVars.leftAttackMove({
        rangeLimit: 1, startPosition: startPosition, pieceNotation: Board.file(startPosition), captureNotation: "x",
        additionalActions: function(startPosition){
          this._capture(startPosition - 1)
          this._emptify(startPosition - 1)
          return "e.p."
        }
      })
      movementTypes.push(movementType)
    }
    if( pawnVars.rightAttackCheck || attacksOnly) {
      let movementType = pawnVars.rightAttackMove({
        rangeLimit: 1,
        pieceNotation: Board.file(startPosition)
      })
      movementTypes.push(movementType)
    }else if( pawnVars.rightEnPassantCheck ){
      // let capture = board._capture.bind(board)
      let movementType = pawnVars.rightAttackMove({
        rangeLimit: 1, startPosition: startPosition, pieceNotation: Board.file(startPosition), captureNotation: "x",
        additionalActions: function(startPosition){
          this._capture(startPosition + 1)
          this._emptify(startPosition + 1)
          return "e.p."
        }
      })
      movementTypes.push(movementType)
    }
    return movementTypes
  }

  static N(){
    var movementTypes = [MovementType.nightHorizontalRightDownIncrement(), MovementType.nightHorizontalLeftDownIncrement(), MovementType.nightVerticalRightDownIncrement(),
        MovementType.nightVerticalLeftDownIncrement(), MovementType.nightHorizontalRightUpIncrement(), MovementType.nightHorizontalLeftUpIncrement(),
        MovementType.nightVerticalRightUpIncrement(), MovementType.nightVerticalLeftUpIncrement()
      ]
    return  movementTypes
  }
  static R(){
    var movementTypes = [MovementType.horizontalRightIncrement({rangeLimit: 7, pieceNotation: "R" }), MovementType.horizontalLeftIncrement({rangeLimit: 7, pieceNotation: "R" }),
    MovementType.verticalUpIncrement({rangeLimit: 7, pieceNotation: "R" }), MovementType.verticalDownIncrement({rangeLimit: 7, pieceNotation: "R" })]
    return movementTypes
  }
  static B(){
    var movementTypes = [MovementType.forwardSlashDownIncrement({rangeLimit: 7, pieceNotation: "B" }), MovementType.forwardSlashUpIncrement({rangeLimit: 7, pieceNotation: "B" }),
    MovementType.backSlashDownIncrement({rangeLimit: 7, pieceNotation: "B" }), MovementType.backSlashUpIncrement({rangeLimit: 7, pieceNotation: "B" })]
    return movementTypes
  }
  static Q(){
    var movementTypes = [MovementType.forwardSlashDownIncrement({rangeLimit: 7, pieceNotation: "Q" }), MovementType.forwardSlashUpIncrement({rangeLimit: 7, pieceNotation: "Q" }),
      MovementType.backSlashDownIncrement({rangeLimit: 7, pieceNotation: "Q" }), MovementType.backSlashUpIncrement({rangeLimit: 7, pieceNotation: "Q" }),
      MovementType.horizontalRightIncrement({rangeLimit: 7, pieceNotation: "Q" }), MovementType.horizontalLeftIncrement({rangeLimit: 7, pieceNotation: "Q" }),
      MovementType.verticalUpIncrement({rangeLimit: 7, pieceNotation: "Q" }), MovementType.verticalDownIncrement({rangeLimit: 7, pieceNotation: "Q" })
    ]
    return movementTypes
  }
  static K({startPosition: startPosition, board: board, ignoreCastles: ignoreCastles, attacksOnly: attacksOnly}){
    var movementTypes = [MovementType.horizontalRightIncrement({rangeLimit: 1, pieceNotation: "K" }), MovementType.horizontalLeftIncrement({rangeLimit: 1, pieceNotation: "K" }), MovementType.verticalUpIncrement({rangeLimit: 1, pieceNotation: "K" }), MovementType.verticalDownIncrement({rangeLimit: 1, pieceNotation: "K" }),
        MovementType.forwardSlashDownIncrement({rangeLimit: 1, pieceNotation: "K" }), MovementType.forwardSlashUpIncrement({rangeLimit: 1, pieceNotation: "K" }), MovementType.backSlashDownIncrement({rangeLimit: 1, pieceNotation: "K" }), MovementType.backSlashUpIncrement({rangeLimit: 1, pieceNotation: "K" })
      ],
      team = board.teamAt(startPosition)
    if ( !ignoreCastles && board.kingSideCastleViableFor(team, startPosition) && !attacksOnly){
      let movementType = MovementType.horizontalLeftIncrement({
        increment: 2, rangeLimit: 1, pieceNotation: "O-O",
        additionalActions: function(startPosition){
          let rook = this.pieceObject( startPosition + 3 )
          this._placePiece({ position: (startPosition + 1), pieceObject: rook })
          this._emptify( startPosition + 3)
          return ""
        }
      })
      movementTypes.push(movementType)
    }
    if ( !ignoreCastles && board.queenSideCastleViableFor(team, startPosition) && !attacksOnly){
      let movementType = MovementType.horizontalRightIncrement({
        increment: -2, rangeLimit: 1, pieceNotation: "O-O-O",
        additionalActions: function(startPosition){
          let rook = this.pieceObject( startPosition - 4 )
          this._placePiece({ position: (startPosition - 1), pieceObject: rook })
          this._emptify( startPosition - 4)
          return ""
        }
      })
      movementTypes.push(movementType)
    }
    return movementTypes
  }

}
