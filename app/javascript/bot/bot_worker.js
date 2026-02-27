// Web Worker entry point for bot decision engine
// Runs in a separate thread so UI stays responsive

import Board from "../engine/board.js"
import DecisionEngine from "./decision_engine.js"
import SwarmRunner from "./swarm_runner.js"

let engine = null
let config = null

self.onmessage = function (event) {
  let data = event.data

  switch (data.type) {
    case "configure":
      config = data.config
      engine = new DecisionEngine(config)
      self.postMessage({ type: "configured" })
      break

    case "select_move":
      if (!engine) {
        self.postMessage({ type: "error", message: "Engine not configured" })
        return
      }
      let board = reconstructBoard(data.boardState)
      let move = engine.selectMove(board)
      self.postMessage({ type: "move_selected", move: move })
      break

    case "run_swarm":
      if (!config) {
        self.postMessage({ type: "error", message: "Engine not configured" })
        return
      }
      let swarmBoard = reconstructBoard(data.boardState)
      let iterations = data.iterations || 50
      let runner = new SwarmRunner(config, iterations)
      let swarmResult = runner.run(swarmBoard)
      self.postMessage({ type: "swarm_complete", result: swarmResult })
      break

    default:
      self.postMessage({ type: "error", message: "Unknown message type: " + data.type })
  }
}

// Reconstruct a Board object from serialized state
function reconstructBoard(state) {
  return new Board(state.layOut, {
    capturedPieces: state.capturedPieces || [],
    gameOver: state.gameOver || false,
    allowedToMove: state.allowedToMove || "white",
    movementNotation: state.movementNotation || [],
    previousLayouts: state.previousLayouts || []
  })
}
