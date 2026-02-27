import Board from "./board.js"
import Rules from "./rules.js"

export default class Api {
  constructor(board) {
    this.board = board
  }

  whoseTurn() {
    return this.board.allowedToMove
  }

  capturedPieces() {
    let captures = []
    for (let i = 0; i < this.board.capturedPieces.length; i++) {
      captures.push(JSON.parse(this.board.capturedPieces[i]))
    }
    return captures
  }

  movementNotation() {
    return this.board.movementNotation
  }

  availableMoves() {
    let movingTeam = this.board.allowedToMove,
        positions = this.board.positionsOccupiedByTeam(movingTeam),
        availableMoves = []

    for (let i = 0; i < positions.length; i++) {
      let movesFrom = this.availableMovesFromIndex(positions[i])
      for (let j = 0; j < movesFrom.length; j++) {
        availableMoves.push({
          from: positions[i],
          to: movesFrom[j],
          fromAlpha: Board.gridCalculator(positions[i]),
          toAlpha: Board.gridCalculator(movesFrom[j])
        })
      }
    }
    return availableMoves
  }

  // Returns numeric position indices (used internally by bot engine)
  availableMovesFromIndex(position) {
    return Rules.viablePositionsFromKeysOnly({ board: this.board, startPosition: position })
  }

  // Returns alphanumeric positions (for display/API consumers)
  availableMovesFrom(position) {
    let alphaNumericMoves = [],
        viableMoves = Rules.viablePositionsFromKeysOnly({ board: this.board, startPosition: position })
    for (let i = 0; i < viableMoves.length; i++) {
      alphaNumericMoves.push(Board.gridCalculator(viableMoves[i]))
    }
    return alphaNumericMoves
  }

  attemptMove(startPosition, endPosition) {
    let board = this.board
    if (board.gameOver) {
      return { success: false, alerts: ["game is over"] }
    }

    let moveObject = Rules.getMoveObject(startPosition, endPosition, board)

    if (moveObject.illegal) {
      return { success: false, alerts: moveObject.alerts }
    }

    board.storeCurrentLayoutAsPrevious()
    let captureNotation = board.movePiece(startPosition, endPosition, moveObject.additionalActions)
    let promotionNotation = Rules.pawnPromotionQuery(board)
    let checkNotation = ""
    let result = { success: true, alerts: [] }

    let otherTeam = board.teamNotMoving(),
        otherTeamsKingPosition = board.kingPosition(otherTeam)

    if (Rules.checkmate(board)) {
      result.alerts.push("checkmate")
      checkNotation = "#"
      result.termination = "checkmate"
      result.winner = board.allowedToMove
      board.endGame()
    }

    if (!board.gameOver && Rules.kingInCheck({ startPosition: otherTeamsKingPosition, endPosition: otherTeamsKingPosition, board: board })) {
      result.alerts.push("check")
      checkNotation = "+"
    }

    let stalemate = Rules.stalemate(board)
    if (!board.gameOver && stalemate) {
      result.alerts.push("stalemate")
      result.termination = "stalemate"
      board.endGame()
    }

    // Build notation
    let notation
    if (moveObject.fullNotation) {
      let positionNotation = Board.gridCalculator(endPosition)
      notation = moveObject.fullNotation + captureNotation + positionNotation + promotionNotation + checkNotation
    } else {
      let positionNotation = Board.gridCalculator(endPosition),
          pieceNotation = moveObject.pieceNotation
      captureNotation = captureNotation || ""
      notation = pieceNotation + captureNotation + positionNotation + promotionNotation + checkNotation
    }
    board.recordNotation(notation)
    result.notation = notation

    if (!board.gameOver) {
      // Switch turns
      if (board.allowedToMove === Board.WHITE) {
        board.allowedToMove = Board.BLACK
      } else {
        board.allowedToMove = Board.WHITE
      }
    }

    return result
  }
}
