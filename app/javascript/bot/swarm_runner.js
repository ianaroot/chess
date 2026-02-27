import DecisionEngine from "./decision_engine.js"

export default class SwarmRunner {
  constructor(config, iterations = 50) {
    this.engine = new DecisionEngine(config)
    this.iterations = iterations
  }

  // Run the decision engine N times on the same board position
  // Returns frequency map of destination squares and detailed results
  run(board) {
    let frequencies = {}    // "from,to" -> count
    let destinations = {}   // to -> count (for heatmap)
    let moveDetails = []    // array of selected moves

    for (let i = 0; i < this.iterations; i++) {
      let boardCopy = board.deepCopy()
      let move = this.engine.selectMove(boardCopy, { skipPieceActivity: true })

      if (!move) continue

      let key = move.from + "," + move.to
      frequencies[key] = (frequencies[key] || 0) + 1
      destinations[move.to] = (destinations[move.to] || 0) + 1
      moveDetails.push(move)
    }

    // Build sorted results
    let results = []
    for (let key in frequencies) {
      let parts = key.split(",")
      results.push({
        from: parseInt(parts[0]),
        to: parseInt(parts[1]),
        count: frequencies[key],
        percentage: Math.round((frequencies[key] / this.iterations) * 100)
      })
    }
    results.sort((a, b) => b.count - a.count)

    return {
      iterations: this.iterations,
      results: results,
      destinations: destinations,
      topMove: results.length > 0 ? results[0] : null
    }
  }
}
