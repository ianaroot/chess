import Board from "engine/board"
import Api from "engine/api"

export default class HeadlessGame {
  constructor() {
    this.board = new Board()
    this.api = new Api(this.board)
    this.moveHistory = []
    this.moveLimit = 200 // half-moves
  }

  whoseTurn() {
    return this.api.whoseTurn()
  }

  isGameOver() {
    return this.board.gameOver || this.moveHistory.length >= this.moveLimit
  }

  availableMoves() {
    return this.api.availableMoves()
  }

  makeMove(from, to) {
    if (this.isGameOver()) {
      return { success: false, alerts: ["game is over"] }
    }

    let result = this.api.attemptMove(from, to)
    if (result.success) {
      this.moveHistory.push({
        moveNumber: Math.floor(this.moveHistory.length / 2) + 1,
        side: this.moveHistory.length % 2 === 0 ? "white" : "black",
        from: from,
        to: to,
        fromAlpha: Board.gridCalculator(from),
        toAlpha: Board.gridCalculator(to),
        notation: result.notation
      })

      if (this.moveHistory.length >= this.moveLimit && !this.board.gameOver) {
        result.termination = "move_limit"
        result.alerts.push("move limit reached")
        this.board.endGame()
      }
    }
    return result
  }

  getResult() {
    if (!this.isGameOver()) return null

    let lastMove = this.moveHistory[this.moveHistory.length - 1]
    if (lastMove && lastMove.notation && lastMove.notation.includes("#")) {
      // The side that just moved delivered checkmate
      let winner = lastMove.side
      return { result: winner === "white" ? "1-0" : "0-1", termination: "checkmate", winner: winner }
    }
    return { result: "1/2-1/2", termination: "draw", winner: null }
  }

  getBoardState() {
    return this.board
  }

  getMoveHistory() {
    return this.moveHistory
  }

  reset() {
    this.board.reset()
    this.moveHistory = []
  }
}
