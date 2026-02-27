import { Controller } from "@hotwired/stimulus"
import Board from "engine/board"
import SwarmRunner from "bot/swarm_runner"

export default class extends Controller {
  static targets = ["canvas", "results", "runButton"]
  static values = { config: Object }
  static outlets = ["bot-board"]

  connect() {
    this.swarmData = null
  }

  runSwarm() {
    if (!this.hasBotBoardOutlet) return

    const boardState = this.botBoardOutlet.getBoardState()
    const board = new Board(boardState.layOut, {
      capturedPieces: boardState.capturedPieces,
      gameOver: boardState.gameOver,
      allowedToMove: boardState.allowedToMove,
      movementNotation: boardState.movementNotation,
      previousLayouts: boardState.previousLayouts
    })

    const config = this.configValue
    const runner = new SwarmRunner(config, 50)

    if (this.hasRunButtonTarget) {
      this.runButtonTarget.textContent = "Running..."
      this.runButtonTarget.disabled = true
    }

    // Run in a setTimeout so the UI can update
    setTimeout(() => {
      this.swarmData = runner.run(board)
      this.renderHeatmap(board)
      this.renderResults()

      if (this.hasRunButtonTarget) {
        this.runButtonTarget.textContent = "Run Swarm (50x)"
        this.runButtonTarget.disabled = false
      }
    }, 10)
  }

  renderHeatmap(board) {
    if (!this.hasCanvasTarget || !this.swarmData) return

    const canvas = this.canvasTarget
    const ctx = canvas.getContext("2d")
    const squareSize = 48
    canvas.width = squareSize * 8
    canvas.height = squareSize * 8

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const destinations = this.swarmData.destinations
    const maxCount = Math.max(...Object.values(destinations), 1)

    for (let posStr in destinations) {
      const pos = parseInt(posStr)
      const count = destinations[pos]
      const file = pos % 8
      const rank = Math.floor(pos / 8)
      const x = file * squareSize
      const y = (7 - rank) * squareSize // flip for display

      // Color intensity based on frequency
      const intensity = count / maxCount
      const r = Math.round(255 * intensity)
      const g = Math.round(100 * (1 - intensity))
      const b = 50

      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.3 + intensity * 0.5})`
      ctx.fillRect(x, y, squareSize, squareSize)

      // Count number
      ctx.fillStyle = "white"
      ctx.font = "bold 14px monospace"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(count.toString(), x + squareSize / 2, y + squareSize / 2)
    }
  }

  renderResults() {
    if (!this.hasResultsTarget || !this.swarmData) return

    const results = this.swarmData.results.slice(0, 8)
    let html = '<div class="space-y-1">'
    results.forEach(r => {
      const fromAlpha = Board.gridCalculator(r.from)
      const toAlpha = Board.gridCalculator(r.to)
      const barWidth = Math.round((r.count / this.swarmData.iterations) * 100)
      html += `
        <div class="flex items-center gap-2 text-sm">
          <span class="w-16 text-gray-300">${fromAlpha}-${toAlpha}</span>
          <div class="flex-1 bg-gray-700 rounded h-4 overflow-hidden">
            <div class="bg-amber-500 h-full rounded" style="width: ${barWidth}%"></div>
          </div>
          <span class="w-12 text-right text-gray-400">${r.percentage}%</span>
        </div>
      `
    })
    html += "</div>"
    this.resultsTarget.innerHTML = html
  }

  // Re-run swarm when board changes
  boardMoved() {
    if (this.swarmData) {
      this.runSwarm()
    }
  }
}
