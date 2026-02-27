import Board from "../engine/board.js"
import BoardAnalyzer from "./board_analyzer.js"

export default class MoveScorer {
  constructor(config) {
    this.weights = config.weights || {
      material: 70, centerControl: 40, kingSafety: 50,
      pieceActivity: 30, pawnStructure: 20
    }
    this.pieceValues = config.pieceValues || {
      Pawn: 1, Night: 3, Bishop: 3, Rook: 5, Queen: 9
    }
    this.skipPieceActivity = config.skipPieceActivity || false
  }

  // Score a single move by simulating it and comparing before/after features
  scoreMove(board, move, team) {
    let analyzerBefore = new BoardAnalyzer(board, this.pieceValues)
    let featuresBefore = this.skipPieceActivity
      ? this.analyzeFast(analyzerBefore, team)
      : analyzerBefore.analyze(team)

    // Simulate the move on a copy
    let tempBoard = board.deepCopy()
    tempBoard.storeCurrentLayoutAsPrevious()
    tempBoard.movePiece(move.from, move.to)

    // Handle pawn promotion on temp board
    for (let i = 0; i < 8; i++) {
      if (tempBoard.blackPawnAt(i)) tempBoard.promotePawn(i)
    }
    for (let i = 56; i < 64; i++) {
      if (tempBoard.whitePawnAt(i)) tempBoard.promotePawn(i)
    }

    let analyzerAfter = new BoardAnalyzer(tempBoard, this.pieceValues)
    let featuresAfter = this.skipPieceActivity
      ? this.analyzeFast(analyzerAfter, team)
      : analyzerAfter.analyze(team)

    // Compute weighted score from feature deltas
    let score = 0
    score += (featuresAfter.material - featuresBefore.material) * this.weights.material
    score += (featuresAfter.centerControl - featuresBefore.centerControl) * this.weights.centerControl
    score += (featuresAfter.kingSafety - featuresBefore.kingSafety) * this.weights.kingSafety
    score += (featuresAfter.pawnStructure - featuresBefore.pawnStructure) * this.weights.pawnStructure

    if (!this.skipPieceActivity) {
      score += (featuresAfter.pieceActivity - featuresBefore.pieceActivity) * this.weights.pieceActivity
    }

    return score
  }

  // Fast analysis that skips expensive pieceActivity calculation
  analyzeFast(analyzer, team) {
    return {
      material: analyzer.materialBalance(team),
      centerControl: analyzer.centerControl(team),
      kingSafety: analyzer.kingSafety(team),
      pieceActivity: 0,
      pawnStructure: analyzer.pawnStructure(team)
    }
  }

  // Score all moves and return sorted array of { move, score }
  scoreAllMoves(board, moves, team) {
    let scored = []
    for (let i = 0; i < moves.length; i++) {
      let score = this.scoreMove(board, moves[i], team)
      scored.push({ move: moves[i], score: score })
    }
    scored.sort((a, b) => b.score - a.score)
    return scored
  }
}
