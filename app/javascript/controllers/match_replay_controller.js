import { Controller } from "@hotwired/stimulus"
import Board from "engine/board"
import Api from "engine/api"

export default class extends Controller {
  static targets = ["board", "status", "moveList", "moveIndex"]
  static values = { moves: Array }

  connect() {
    this.board = new Board()
    this.api = new Api(this.board)
    this.currentMove = 0
    this.render()
    this.highlightCurrentMove()
  }

  render() {
    const boardEl = this.boardTarget
    boardEl.innerHTML = ""
    boardEl.className = "grid grid-cols-8 border-2 border-gray-600 w-fit"

    for (let rank = 7; rank >= 0; rank--) {
      for (let file = 0; file < 8; file++) {
        const position = rank * 8 + file
        const square = document.createElement("div")
        const isLight = (rank + file) % 2 === 1
        square.className = `w-12 h-12 flex items-center justify-center text-2xl select-none ${isLight ? "bg-amber-200" : "bg-amber-800"}`

        const piece = this.board.pieceObject(position)
        if (Board.parseTeam(piece) !== Board.EMPTY) {
          square.textContent = this.pieceUnicode(piece)
        }

        boardEl.appendChild(square)
      }
    }

    if (this.hasMoveIndexTarget) {
      this.moveIndexTarget.textContent = `Move ${this.currentMove} / ${this.movesValue.length}`
    }
  }

  stepForward() {
    if (this.currentMove >= this.movesValue.length) return
    const move = this.movesValue[this.currentMove]
    const from = parseInt(move.from_square)
    const to = parseInt(move.to_square)
    this.api.attemptMove(from, to)
    this.currentMove++
    this.render()
    this.highlightCurrentMove()
  }

  stepBackward() {
    if (this.currentMove <= 0) return
    // Reset and replay up to currentMove - 1
    this.board.reset()
    this.api = new Api(this.board)
    this.currentMove--
    for (let i = 0; i < this.currentMove; i++) {
      const move = this.movesValue[i]
      this.api.attemptMove(parseInt(move.from_square), parseInt(move.to_square))
    }
    this.render()
    this.highlightCurrentMove()
  }

  jumpToStart() {
    this.board.reset()
    this.api = new Api(this.board)
    this.currentMove = 0
    this.render()
    this.highlightCurrentMove()
  }

  jumpToEnd() {
    this.board.reset()
    this.api = new Api(this.board)
    for (let i = 0; i < this.movesValue.length; i++) {
      const move = this.movesValue[i]
      this.api.attemptMove(parseInt(move.from_square), parseInt(move.to_square))
    }
    this.currentMove = this.movesValue.length
    this.render()
    this.highlightCurrentMove()
  }

  highlightCurrentMove() {
    if (!this.hasMoveListTarget) return
    const items = this.moveListTarget.querySelectorAll("[data-move-index]")
    items.forEach(item => {
      const idx = parseInt(item.dataset.moveIndex)
      if (idx === this.currentMove - 1) {
        item.classList.add("bg-amber-900/50", "border-amber-500")
      } else {
        item.classList.remove("bg-amber-900/50", "border-amber-500")
      }
    })
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
