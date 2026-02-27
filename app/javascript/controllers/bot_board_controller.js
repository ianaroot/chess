import { Controller } from "@hotwired/stimulus"
import Board from "engine/board"
import Api from "engine/api"

export default class extends Controller {
  static targets = ["board", "status", "notation"]
  static values = { config: Object }

  connect() {
    this.board = new Board()
    this.api = new Api(this.board)
    this.selectedSquare = null
    this.render()
  }

  render() {
    const boardEl = this.boardTarget
    boardEl.innerHTML = ""
    boardEl.className = "grid grid-cols-8 border-2 border-gray-600 w-fit"

    // Render from rank 8 (top) to rank 1 (bottom)
    for (let rank = 7; rank >= 0; rank--) {
      for (let file = 0; file < 8; file++) {
        const position = rank * 8 + file
        const square = document.createElement("div")
        const isLight = (rank + file) % 2 === 1
        square.className = `w-12 h-12 flex items-center justify-center cursor-pointer text-2xl select-none ${isLight ? "bg-amber-200" : "bg-amber-800"}`
        square.dataset.position = position
        square.dataset.action = "click->bot-board#clickSquare"

        const piece = this.board.pieceObject(position)
        if (Board.parseTeam(piece) !== Board.EMPTY) {
          square.textContent = this.pieceUnicode(piece)
        }

        if (this.selectedSquare === position) {
          square.classList.add("ring-2", "ring-yellow-400", "ring-inset")
        }

        boardEl.appendChild(square)
      }
    }

    if (this.hasStatusTarget) {
      this.statusTarget.textContent = this.board.gameOver
        ? "Game Over"
        : `${this.board.allowedToMove}'s turn`
    }

    if (this.hasNotationTarget) {
      this.notationTarget.textContent = this.board.movementNotation.join(" ")
    }
  }

  clickSquare(event) {
    const position = parseInt(event.currentTarget.dataset.position)

    if (this.selectedSquare !== null) {
      // Try to make the move
      const result = this.api.attemptMove(this.selectedSquare, position)
      if (result.success) {
        this.selectedSquare = null
        this.render()
        this.dispatch("moved", { detail: { board: this.board } })
        return
      }
    }

    // Select this square if it has a piece of the right team
    const piece = this.board.pieceObject(position)
    if (Board.parseTeam(piece) === this.board.allowedToMove) {
      this.selectedSquare = position
    } else {
      this.selectedSquare = null
    }
    this.render()
  }

  reset() {
    this.board.reset()
    this.selectedSquare = null
    this.render()
  }

  getBoardState() {
    return {
      layOut: this.board.layOut,
      capturedPieces: this.board.capturedPieces,
      gameOver: this.board.gameOver,
      allowedToMove: this.board.allowedToMove,
      movementNotation: this.board.movementNotation,
      previousLayouts: this.board.previousLayouts
    }
  }

  pieceUnicode(piece) {
    const map = {
      "white-King": "\u2654", "white-Queen": "\u2655", "white-Rook": "\u2656",
      "white-Bishop": "\u2657", "white-Night": "\u2658", "white-Pawn": "\u2659",
      "black-King": "\u265A", "black-Queen": "\u265B", "black-Rook": "\u265C",
      "black-Bishop": "\u265D", "black-Night": "\u265E", "black-Pawn": "\u265F"
    }
    return map[`${Board.parseTeam(piece)}-${Board.parseSpecies(piece)}`] || ""
  }
}
