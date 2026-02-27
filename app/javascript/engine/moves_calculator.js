import MoveObject from "engine/move_object"
import Board from "engine/board"

export default class MovesCalculator {
  // kingInCheckFn is optional — pass it when you need castling validation
  // (breaks circular dep with Rules: Rules passes its own kingInCheck method)
  constructor(options = { startPosition: undefined, board: undefined, kingInCheckFn: undefined }) {
    this.startPosition = options["startPosition"]
    this.board = options["board"]
    this.kingInCheckFn = options["kingInCheckFn"]
    this.moveObjects = []
    this.viablePositions = {}
    this.addMoves()
    this.calculateViablePositions()
  }

  addMoves() {
    if (this.startPosition === undefined || !this.board) {
      throw new Error("moveObject missing startPosition or board in addMovementTypesAndBoundaryChecks")
    } else {
      this.moveObjects = MovesCalculator.pieceSpecificMovements()[this.board.pieceTypeAt(this.startPosition)]({
        startPosition: this.startPosition,
        board: this.board,
        kingInCheckFn: this.kingInCheckFn
      })
    }
  }

  calculateViablePositions() {
    let teamString = this.board.teamAt(this.startPosition)
    for (let i = 0; i < this.moveObjects.length; i++) {
      let move = this.moveObjects[i],
          increment = move.increment,
          rangeLimit = move.rangeLimit,
          boundaryCheck = move.boundaryCheck
      for (let j = 1; j <= rangeLimit; j++) {
        let currentPosition = increment * j + this.startPosition
        if (!boundaryCheck(j, increment, this.startPosition)) {
          break
        }
        if (this.board.positionEmpty(currentPosition)) {
          this.viablePositions[currentPosition] = move
        } else if (this.board.occupiedByOpponent({ position: currentPosition, teamString: teamString })) {
          this.viablePositions[currentPosition] = move
          break
        } else if (this.board.occupiedByTeamMate({ position: currentPosition, teamString: teamString })) {
          break
        }
      }
    }
  }

  static genericMovements() {
    return {
      verticalUp: function () {
        return new MoveObject({
          increment: "+8",
          boundaryCheck: function (i, increment, startPosition) {
            let endPosition = i * increment + startPosition
            return MovesCalculator.boundaryChecks({ endPosition: endPosition }).vertical()
          }
        })
      },
      verticalDown: function () {
        return new MoveObject({
          increment: "-8",
          boundaryCheck: function (i, increment, startPosition) {
            let endPosition = i * increment + startPosition
            return MovesCalculator.boundaryChecks({ endPosition: endPosition }).vertical()
          }
        })
      },
      forwardSlashUp: function () {
        return new MoveObject({
          increment: "+9",
          boundaryCheck: function (i, increment, startPosition) {
            let endPosition = i * increment + startPosition
            return MovesCalculator.boundaryChecks({ startPosition: startPosition, endPosition: endPosition }).diagonalRight()
          }
        })
      },
      forwardSlashDown: function () {
        return new MoveObject({
          increment: "-9",
          boundaryCheck: function (i, increment, startPosition) {
            let endPosition = i * increment + startPosition
            return MovesCalculator.boundaryChecks({ startPosition: startPosition, endPosition: endPosition }).diagonalLeft()
          }
        })
      },
      backSlashUp: function () {
        return new MoveObject({
          increment: "+7",
          boundaryCheck: function (i, increment, startPosition) {
            let endPosition = i * increment + startPosition
            return MovesCalculator.boundaryChecks({ startPosition: startPosition, endPosition: endPosition }).diagonalLeft()
          }
        })
      },
      backSlashDown: function () {
        return new MoveObject({
          increment: "-7",
          boundaryCheck: function (i, increment, startPosition) {
            let endPosition = i * increment + startPosition
            return MovesCalculator.boundaryChecks({ startPosition: startPosition, endPosition: endPosition }).diagonalRight()
          }
        })
      },
      nightVerticalLeftUp: function () {
        return new MoveObject({
          increment: "+15",
          boundaryCheck: function (i, increment, startPosition) {
            let endPosition = i * increment + startPosition
            return MovesCalculator.boundaryChecks({ startPosition: startPosition, endPosition: endPosition }).nightVertical()
          }
        })
      },
      nightVerticalRightUp: function () {
        return new MoveObject({
          increment: "+17",
          boundaryCheck: function (i, increment, startPosition) {
            let endPosition = i * increment + startPosition
            return MovesCalculator.boundaryChecks({ startPosition: startPosition, endPosition: endPosition }).nightVertical()
          }
        })
      },
      nightHorizontalLeftUp: function () {
        return new MoveObject({
          increment: "+6",
          boundaryCheck: function (i, increment, startPosition) {
            let endPosition = i * increment + startPosition
            return MovesCalculator.boundaryChecks({ startPosition: startPosition, endPosition: endPosition }).nightHorizontal()
          }
        })
      },
      nightHorizontalRightUp: function () {
        return new MoveObject({
          increment: "+10",
          boundaryCheck: function (i, increment, startPosition) {
            let endPosition = i * increment + startPosition
            return MovesCalculator.boundaryChecks({ startPosition: startPosition, endPosition: endPosition }).nightHorizontal()
          }
        })
      },
      nightVerticalLeftDown: function () {
        return new MoveObject({
          increment: "-15",
          boundaryCheck: function (i, increment, startPosition) {
            let endPosition = i * increment + startPosition
            return MovesCalculator.boundaryChecks({ startPosition: startPosition, endPosition: endPosition }).nightVertical()
          }
        })
      },
      nightVerticalRightDown: function () {
        return new MoveObject({
          increment: "-17",
          boundaryCheck: function (i, increment, startPosition) {
            let endPosition = i * increment + startPosition
            return MovesCalculator.boundaryChecks({ startPosition: startPosition, endPosition: endPosition }).nightVertical()
          }
        })
      },
      nightHorizontalLeftDown: function () {
        return new MoveObject({
          increment: "-6",
          boundaryCheck: function (i, increment, startPosition) {
            let endPosition = i * increment + startPosition
            return MovesCalculator.boundaryChecks({ startPosition: startPosition, endPosition: endPosition }).nightHorizontal()
          }
        })
      },
      nightHorizontalRightDown: function () {
        return new MoveObject({
          increment: "-10",
          boundaryCheck: function (i, increment, startPosition) {
            let endPosition = i * increment + startPosition
            return MovesCalculator.boundaryChecks({ startPosition: startPosition, endPosition: endPosition }).nightHorizontal()
          }
        })
      },
      horizontalRight: function () {
        return new MoveObject({
          increment: "+1",
          boundaryCheck: function (i, increment, startPosition) {
            let endPosition = i * increment + startPosition
            return MovesCalculator.boundaryChecks({ startPosition: startPosition, endPosition: endPosition }).horizontal()
          }
        })
      },
      horizontalLeft: function () {
        return new MoveObject({
          increment: "-1",
          boundaryCheck: function (i, increment, startPosition) {
            let endPosition = i * increment + startPosition
            return MovesCalculator.boundaryChecks({ startPosition: startPosition, endPosition: endPosition }).horizontal()
          }
        })
      }
    }
  }

  static boundaryChecks(args) {
    let startPosition = args["startPosition"],
        endPosition = args["endPosition"]
    return {
      diagonalRight: function () {
        return (endPosition) % 8 > (startPosition % 8) && Board.inBounds(endPosition)
      },
      vertical: function () {
        return Board.inBounds(endPosition)
      },
      diagonalLeft: function () {
        return (endPosition) % 8 < (startPosition % 8) && Board.inBounds(endPosition)
      },
      nightVertical: function () {
        return Math.abs((endPosition) % 8 - startPosition % 8) === 1 && Board.inBounds(endPosition)
      },
      nightHorizontal: function () {
        return Math.abs((endPosition) % 8 - startPosition % 8) === 2 && Board.inBounds(endPosition)
      },
      horizontal: function () {
        return Math.floor((endPosition) / 8) === Math.floor(startPosition / 8) && Board.inBounds(endPosition)
      }
    }
  }

  static pieceSpecificMovements() {
    return {
      Night: function (args) {
        let moveObjects = [
          MovesCalculator.genericMovements().nightHorizontalRightDown(),
          MovesCalculator.genericMovements().nightHorizontalLeftDown(),
          MovesCalculator.genericMovements().nightVerticalRightDown(),
          MovesCalculator.genericMovements().nightVerticalLeftDown(),
          MovesCalculator.genericMovements().nightHorizontalRightUp(),
          MovesCalculator.genericMovements().nightHorizontalLeftUp(),
          MovesCalculator.genericMovements().nightVerticalRightUp(),
          MovesCalculator.genericMovements().nightVerticalLeftUp()
        ]
        for (let i = 0; i < moveObjects.length; i++) {
          moveObjects[i].rangeLimit = 1
          moveObjects[i].pieceNotation = "N"
        }
        return moveObjects
      },
      Rook: function (args) {
        let moveObjects = [
          MovesCalculator.genericMovements().horizontalRight(),
          MovesCalculator.genericMovements().horizontalLeft(),
          MovesCalculator.genericMovements().verticalUp(),
          MovesCalculator.genericMovements().verticalDown()
        ]
        for (let i = 0; i < moveObjects.length; i++) {
          moveObjects[i].rangeLimit = 7
          moveObjects[i].pieceNotation = "R"
        }
        return moveObjects
      },
      Bishop: function (args) {
        let moveObjects = [
          MovesCalculator.genericMovements().forwardSlashDown(),
          MovesCalculator.genericMovements().forwardSlashUp(),
          MovesCalculator.genericMovements().backSlashDown(),
          MovesCalculator.genericMovements().backSlashUp()
        ]
        for (let i = 0; i < moveObjects.length; i++) {
          moveObjects[i].rangeLimit = 7
          moveObjects[i].pieceNotation = "B"
        }
        return moveObjects
      },
      Queen: function (args) {
        let moveObjects = MovesCalculator.pieceSpecificMovements().Rook(args).concat(MovesCalculator.pieceSpecificMovements().Bishop(args))
        for (let i = 0; i < moveObjects.length; i++) {
          moveObjects[i].rangeLimit = 7
          moveObjects[i].pieceNotation = "Q"
        }
        return moveObjects
      },
      King: function (args) {
        let board = args["board"],
            startPosition = args["startPosition"],
            kingInCheckFn = args["kingInCheckFn"],
            moveObjects = [
              MovesCalculator.genericMovements().horizontalRight(),
              MovesCalculator.genericMovements().horizontalLeft(),
              MovesCalculator.genericMovements().verticalUp(),
              MovesCalculator.genericMovements().verticalDown(),
              MovesCalculator.genericMovements().forwardSlashDown(),
              MovesCalculator.genericMovements().forwardSlashUp(),
              MovesCalculator.genericMovements().backSlashDown(),
              MovesCalculator.genericMovements().backSlashUp()
            ]
        for (let i = 0; i < moveObjects.length; i++) {
          moveObjects[i].rangeLimit = 1
          moveObjects[i].pieceNotation = "K"
        }
        // Castling — only when kingInCheckFn is available (avoids circular dep)
        if (kingInCheckFn) {
          if (board.pieceHasNotMovedFrom(startPosition) && board.kingSideCastleIsClear(startPosition) && board.kingSideRookHasNotMoved(startPosition)
            && !kingInCheckFn({ startPosition: startPosition, endPosition: startPosition, board: board })
            && !kingInCheckFn({ startPosition: startPosition, endPosition: startPosition + 1, board: board })
          ) {
            let castle = MovesCalculator.genericMovements().horizontalLeft()
            castle.increment = +2
            castle.rangeLimit = 1
            castle.fullNotation = "O-O"
            castle.additionalActions = function (args) {
              let pieceObject = this.pieceObject(startPosition + 3)
              this.emptify(startPosition + 3)
              this.placePiece({ position: (startPosition + 1), pieceObject: pieceObject })
            }
            moveObjects.push(castle)
          }
          if (board.pieceHasNotMovedFrom(startPosition) && board.queenSideCastleIsClear(startPosition) && board.queenSideRookHasNotMoved(startPosition)
            && !kingInCheckFn({ startPosition: startPosition, endPosition: startPosition, board: board })
            && !kingInCheckFn({ startPosition: startPosition, endPosition: startPosition - 1, board: board })
          ) {
            let castle = MovesCalculator.genericMovements().horizontalRight()
            castle.increment = -2
            castle.rangeLimit = 1
            castle.fullNotation = "O-O-O"
            castle.additionalActions = function (args) {
              let pieceObject = this.pieceObject(startPosition - 4)
              this.emptify(startPosition - 4)
              this.placePiece({ position: (startPosition - 1), pieceObject: pieceObject })
            }
            moveObjects.push(castle)
          }
        }
        return moveObjects
      },
      Pawn: function (args) {
        let board = args["board"],
            startPosition = args["startPosition"],
            moveObjects = [],
            teamString = board.teamAt(startPosition),
            colorVars = {
              black: {
                nonAttackMove: MovesCalculator.genericMovements().verticalDown(),
                singleStepCheck: board.oneSpaceDownIsEmpty(startPosition),
                doubleStepCheck: Board.isSeventhRank(startPosition) && board.twoSpacesDownIsEmpty(startPosition),
                leftAttackCheck: board.downAndLeftIsAttackable(startPosition),
                leftAttackMove: MovesCalculator.genericMovements().forwardSlashDown(),
                rightAttackCheck: board.downAndRightIsAttackable(startPosition),
                rightAttackMove: MovesCalculator.genericMovements().backSlashDown(),
                rightEnPassantCheck: Board.rank(startPosition) === 4 && board.whitePawnAt(startPosition + 1) && board.whitePawnDoubleSteppedFrom(startPosition - 15),
                leftEnPassantCheck: Board.rank(startPosition) === 4 && board.whitePawnAt(startPosition - 1) && board.whitePawnDoubleSteppedFrom(startPosition - 17),
              },
              white: {
                nonAttackMove: MovesCalculator.genericMovements().verticalUp(),
                singleStepCheck: board.oneSpaceUpIsEmpty(startPosition),
                doubleStepCheck: Board.isSecondRank(startPosition) && board.twoSpacesUpIsEmpty(startPosition),
                leftAttackCheck: board.upAndLeftIsAttackable(startPosition),
                leftAttackMove: MovesCalculator.genericMovements().backSlashUp(),
                rightAttackCheck: board.upAndRightIsAttackable(startPosition),
                rightAttackMove: MovesCalculator.genericMovements().forwardSlashUp(),
                leftEnPassantCheck: Board.rank(startPosition) === 5 && board.blackPawnAt(startPosition - 1) && board.blackPawnDoubleSteppedFrom(startPosition + 15),
                rightEnPassantCheck: Board.rank(startPosition) === 5 && board.blackPawnAt(startPosition + 1) && board.blackPawnDoubleSteppedFrom(startPosition + 17),
              }
            },
            pawnVars = colorVars[teamString]

        if (pawnVars.singleStepCheck) {
          let newPossibility = pawnVars.nonAttackMove
          newPossibility.rangeLimit = 1
          newPossibility.pieceNotation = ""
          moveObjects = moveObjects.concat(newPossibility)
        }
        if (pawnVars.doubleStepCheck) {
          let newPossibility = pawnVars.nonAttackMove
          newPossibility.rangeLimit = 2
          newPossibility.pieceNotation = ""
          moveObjects = moveObjects.concat(newPossibility)
        }
        if (pawnVars.leftAttackCheck) {
          let newPossibility = pawnVars.leftAttackMove
          newPossibility.rangeLimit = 1
          newPossibility.pieceNotation = Board.file(startPosition)
          moveObjects = moveObjects.concat(newPossibility)
        }
        if (pawnVars.rightAttackCheck) {
          let newPossibility = pawnVars.rightAttackMove
          newPossibility.rangeLimit = 1
          newPossibility.pieceNotation = Board.file(startPosition)
          moveObjects = moveObjects.concat(newPossibility)
        }
        if (pawnVars.rightEnPassantCheck) {
          let newPossibility = pawnVars.rightAttackMove
          newPossibility.rangeLimit = 1
          newPossibility.pieceNotation = Board.file(startPosition)
          newPossibility.additionalActions = function (args) {
            return this.capture(startPosition + 1)
          }
          moveObjects = moveObjects.concat(newPossibility)
        }
        if (pawnVars.leftEnPassantCheck) {
          let newPossibility = pawnVars.leftAttackMove
          newPossibility.rangeLimit = 1
          newPossibility.pieceNotation = Board.file(startPosition)
          newPossibility.additionalActions = function (args) {
            return this.capture(startPosition - 1)
          }
          moveObjects = moveObjects.concat(newPossibility)
        }
        return moveObjects
      }
    }
  }
}
