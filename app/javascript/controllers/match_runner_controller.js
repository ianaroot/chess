import { Controller } from "@hotwired/stimulus"
import Board from "engine/board"
import HeadlessGame from "engine/headless_game"
import DecisionEngine from "bot/decision_engine"

export default class extends Controller {
  static targets = ["board", "status", "log", "runButton"]
  static values = { whiteConfig: Object, blackConfig: Object, matchId: Number, saveUrl: String }

  connect() {
    this.game = null
    this.whiteEngine = null
    this.blackEngine = null
    this.running = false
    this.moveLog = []
  }

  run() {
    this.game = new HeadlessGame()
    this.whiteEngine = new DecisionEngine(this.whiteConfigValue)
    this.blackEngine = new DecisionEngine(this.blackConfigValue)
    this.running = true
    this.moveLog = []

    if (this.hasRunButtonTarget) {
      this.runButtonTarget.disabled = true
      this.runButtonTarget.textContent = "Running..."
    }

    this.renderBoard()
    this.playNextMove()
  }

  playNextMove() {
    if (!this.running || this.game.isGameOver()) {
      this.finish()
      return
    }

    const board = this.game.getBoardState()
    const team = this.game.whoseTurn()
    const engine = team === "white" ? this.whiteEngine : this.blackEngine

    const move = engine.selectMove(board, { skipPieceActivity: true })
    if (!move) {
      this.finish()
      return
    }

    const result = this.game.makeMove(move.from, move.to)
    if (result.success) {
      this.moveLog.push({
        from: move.from,
        to: move.to,
        notation: result.notation,
        side: team,
        moveNumber: Math.ceil(this.moveLog.length / 2) + 1
      })

      this.renderBoard()
      this.updateLog()

      if (this.hasStatusTarget) {
        this.statusTarget.textContent = `Move ${this.moveLog.length}: ${result.notation}`
      }
    }

    if (this.game.isGameOver()) {
      this.finish()
    } else {
      // Animate with a slight delay for visual effect
      setTimeout(() => this.playNextMove(), 50)
    }
  }

  finish() {
    this.running = false
    const result = this.game.getResult()

    if (this.hasStatusTarget && result) {
      this.statusTarget.textContent = `Game Over: ${result.result} (${result.termination})`
    }

    if (this.hasRunButtonTarget) {
      this.runButtonTarget.disabled = false
      this.runButtonTarget.textContent = "Run Again"
    }

    // Save result to server if we have a match ID
    if (this.matchIdValue && result) {
      this.saveResult(result)
    }
  }

  async saveResult(result) {
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content
    const url = this.saveUrlValue || `/matches/${this.matchIdValue}`

    try {
      await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken
        },
        body: JSON.stringify({
          match: {
            result: result.result,
            termination: result.termination,
            move_count: this.moveLog.length
          },
          moves: this.moveLog.map((m, i) => ({
            move_number: m.moveNumber,
            side: m.side,
            from_square: m.from.toString(),
            to_square: m.to.toString(),
            notation: m.notation
          }))
        })
      })
    } catch (e) {
      console.error("Failed to save match result:", e)
    }
  }

  renderBoard() {
    if (!this.hasBoardTarget || !this.game) return

    const board = this.game.getBoardState()
    const boardEl = this.boardTarget
    boardEl.innerHTML = ""
    boardEl.className = "grid grid-cols-8 border-2 border-gray-600 w-fit"

    for (let rank = 7; rank >= 0; rank--) {
      for (let file = 0; file < 8; file++) {
        const position = rank * 8 + file
        const square = document.createElement("div")
        const isLight = (rank + file) % 2 === 1
        square.className = `w-12 h-12 flex items-center justify-center text-2xl select-none ${isLight ? "bg-amber-200" : "bg-amber-800"}`

        const piece = board.pieceObject(position)
        if (Board.parseTeam(piece) !== Board.EMPTY) {
          square.textContent = this.pieceUnicode(piece)
        }

        boardEl.appendChild(square)
      }
    }
  }

  updateLog() {
    if (!this.hasLogTarget) return

    const last10 = this.moveLog.slice(-10)
    let html = ""
    last10.forEach(m => {
      html += `<div class="text-xs font-mono"><span class="text-gray-500">${m.moveNumber}.</span> <span class="${m.side === 'white' ? 'text-white' : 'text-gray-400'}">${m.notation}</span></div>`
    })
    this.logTarget.innerHTML = html
    this.logTarget.scrollTop = this.logTarget.scrollHeight
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
