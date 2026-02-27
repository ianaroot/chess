import Board from "./board.js"
import MoveObject from "./move_object.js"
import MovesCalculator from "./moves_calculator.js"

export default class Rules {

  static getMoveObject(startPosition, endPosition, board) {
    let team = board.teamAt(startPosition),
        moveObject = new MoveObject({ illegal: true })

    if (team == Board.EMPTY) {
      moveObject.alerts.push("that tile is empty")
      return moveObject
    }
    if (team !== board.allowedToMove) {
      moveObject.alerts.push("other team's turn")
      return moveObject
    }

    let movesCalculator = new MovesCalculator({
      board: board,
      startPosition: startPosition,
      kingInCheckFn: Rules.kingInCheck
    })
    for (let key in movesCalculator.viablePositions) {
      if (key == endPosition) {
        moveObject = movesCalculator.viablePositions[key]
      }
    }

    if (!Board.inBounds(endPosition)) {
      moveObject.alerts.push('stay on the board, fool')
      moveObject.illegal = true
    } else if (board.positionIsOccupiedByTeamMate(endPosition, team)) {
      moveObject.alerts.push("what, are you trying to capture your own piece?")
      moveObject.illegal = true
    } else if (moveObject.illegal) {
      moveObject.alerts.push("that's not how that piece moves")
      moveObject.illegal = true
    } else if (Rules.kingInCheck({ startPosition: startPosition, endPosition: endPosition, board: board, additionalActions: moveObject.additionalActions })) {
      moveObject.alerts.push("check yo king fool")
      moveObject.illegal = true
    }

    return moveObject
  }

  static kingInCheck(args) {
    let startPosition      = args["startPosition"],
        endPosition        = args["endPosition"],
        board              = args["board"],
        additionalActions  = args["additionalActions"],
        layOut             = board.layOut,
        teamString         = board.teamAt(startPosition),
        danger             = false,
        newLayout          = Board.deepCopy(layOut),
        opposingTeamString = Board.opposingTeam(teamString),
        newBoard = new Board(newLayout)

    newBoard.movePiece(startPosition, endPosition, additionalActions)
    let kingPosition = newBoard.kingPosition(teamString),
        enemyPositions = newBoard.positionsOccupiedByTeam(opposingTeamString)

    for (let i = 0; i < enemyPositions.length; i++) {
      let enemyPosition = enemyPositions[i],
          enemyPieceType = newBoard.pieceTypeAt(enemyPosition)
      if (enemyPieceType === Board.KING) { continue }
      // No kingInCheckFn needed here — we skip Kings, so no castling logic runs
      let movesCalculator = new MovesCalculator({ board: newBoard, startPosition: enemyPosition }),
          moveObject = new MoveObject({ illegal: true })
      for (let key in movesCalculator.viablePositions) {
        if (parseInt(key) === kingPosition) {
          moveObject = movesCalculator.viablePositions[key]
        }
      }
      if (enemyPieceType !== Board.KING && !moveObject.illegal) {
        danger = true
      }
    }
    return danger
  }

  static viablePositionsFromKeysOnly(args) {
    let movesCalculator = new MovesCalculator({
          board: args["board"],
          startPosition: args["startPosition"],
          kingInCheckFn: Rules.kingInCheck
        }),
        keysOnly = []

    for (let property in movesCalculator.viablePositions) {
      let newArgs = Object.assign({}, args, { endPosition: property })
      if (movesCalculator.viablePositions.hasOwnProperty(property) && !this.kingInCheck(newArgs)) {
        keysOnly.push(parseInt(property))
      }
    }
    return keysOnly
  }

  static pawnPromotionQuery(board) {
    for (let i = 0; i < 8; i++) {
      if (board.blackPawnAt(i)) {
        board.promotePawn(i)
        return "=Q"
      }
    }
    for (let i = 56; i < 64; i++) {
      if (board.whitePawnAt(i)) {
        board.promotePawn(i)
        return "=Q"
      }
    }
    return ""
  }

  static checkmate(board) {
    let otherTeam = board.teamNotMoving(),
        kingPosition = board.kingPosition(otherTeam),
        inCheck = this.kingInCheck({ board: board, startPosition: kingPosition, endPosition: kingPosition }),
        noMoves = this.noLegalMoves(board)
    return inCheck && noMoves
  }

  static noLegalMoves(board) {
    let movingTeamString = board.allowedToMove,
        noLegalMoves = true,
        onDeckTeamString = (movingTeamString === Board.BLACK) ? Board.WHITE : Board.BLACK,
        occupiedPositions = board.positionsOccupiedByTeam(onDeckTeamString)

    for (let i = 0; i < occupiedPositions.length && noLegalMoves; i++) {
      let startPosition = occupiedPositions[i],
          movesCalculator = new MovesCalculator({
            board: board,
            startPosition: startPosition,
            kingInCheckFn: Rules.kingInCheck
          })
      for (let key in movesCalculator.viablePositions) {
        if (!this.kingInCheck({ startPosition: startPosition, endPosition: key, board: board })) {
          noLegalMoves = false
        }
      }
    }
    return noLegalMoves
  }

  static threeFoldRepetition(board) {
    let previousLayouts = board.previousLayouts,
        repetitions = 0,
        currentLayOut = board.layOut

    for (let i = 0; i < previousLayouts.length; i++) {
      let comparisonLayout = previousLayouts[i],
          different = false
      for (let j = 0; j < comparisonLayout.length; j++) {
        if (comparisonLayout[j] !== currentLayOut[j]) {
          different = true
          break
        }
      }
      if (!different) { repetitions++ }
    }
    return repetitions >= 2
  }

  static stalemate(board) {
    return this.threeFoldRepetition(board) || this.noLegalMoves(board)
  }
}
