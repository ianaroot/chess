import Board from "engine/board"
import Api from "engine/api"
import MoveScorer from "bot/move_scorer"
import TriggerEvaluator from "bot/trigger_evaluator"
import BoardAnalyzer, { EDGE_SQUARES } from "bot/board_analyzer"

export default class DecisionEngine {
  constructor(config) {
    this.config = Object.assign({}, DecisionEngine.defaultConfig(), config)
  }

  static defaultConfig() {
    return {
      weights: {
        material: 70, centerControl: 40, kingSafety: 50,
        pieceActivity: 30, pawnStructure: 20
      },
      pieceValues: { Pawn: 1, Night: 3, Bishop: 3, Rook: 5, Queen: 9 },
      triggers: [],
      quirks: {
        lovesKnights: false, edgePhobic: false, castleASAP: false,
        aggressivePawns: false, tradeHappy: false, tradeAverse: false,
        centerMagnet: false, chaotic: false
      },
      randomness: 15
    }
  }

  // Main entry: given a board, select a move
  selectMove(board, options = {}) {
    let team = board.allowedToMove
    let api = new Api(board)
    let availableMoves = api.availableMoves()

    if (availableMoves.length === 0) return null
    if (availableMoves.length === 1) return availableMoves[0]

    // 1. Score all moves
    let scorer = new MoveScorer({
      weights: this.config.weights,
      pieceValues: this.config.pieceValues,
      skipPieceActivity: options.skipPieceActivity || false
    })
    let scoredMoves = scorer.scoreAllMoves(board, availableMoves, team)

    // 2. Apply triggers
    let triggerEval = new TriggerEvaluator(board, team, this.config.pieceValues)
    scoredMoves = triggerEval.evaluateTriggers(this.config.triggers, scoredMoves)

    // 3. Apply quirks
    scoredMoves = this.applyQuirks(scoredMoves, board, team)

    // 4. Softmax weighted selection with randomness as temperature
    let temperature = this.config.randomness / 20
    if (this.config.quirks.chaotic) {
      temperature = Math.max(temperature, 2.0) // chaotic = high temperature
    }

    return this.softmaxSelect(scoredMoves, temperature)
  }

  applyQuirks(scoredMoves, board, team) {
    let quirks = this.config.quirks

    for (let i = 0; i < scoredMoves.length; i++) {
      let move = scoredMoves[i].move
      let species = board.pieceTypeAt(move.from)

      // lovesKnights: bonus to knight moves
      if (quirks.lovesKnights && species === Board.NIGHT) {
        scoredMoves[i].score += 20
      }

      // edgePhobic: penalty for moving to edge squares
      if (quirks.edgePhobic && EDGE_SQUARES.indexOf(move.to) !== -1) {
        scoredMoves[i].score -= 30
      }

      // castleASAP: big bonus for castling moves
      if (quirks.castleASAP && species === Board.KING && Math.abs(move.to - move.from) === 2) {
        scoredMoves[i].score += 100
      }

      // aggressivePawns: bonus for pawn advances
      if (quirks.aggressivePawns && species === Board.PAWN) {
        scoredMoves[i].score += 15
      }

      // tradeHappy: bonus for captures
      if (quirks.tradeHappy && !board.positionEmpty(move.to)) {
        scoredMoves[i].score += 25
      }

      // tradeAverse: penalty for captures
      if (quirks.tradeAverse && !board.positionEmpty(move.to)) {
        scoredMoves[i].score -= 25
      }

      // centerMagnet: bonus for moving toward center
      if (quirks.centerMagnet) {
        let toFile = move.to % 8, toRank = Math.floor(move.to / 8)
        let distFromCenter = Math.abs(toFile - 3.5) + Math.abs(toRank - 3.5)
        scoredMoves[i].score += (7 - distFromCenter) * 5
      }
    }

    return scoredMoves
  }

  softmaxSelect(scoredMoves, temperature) {
    if (temperature <= 0.01) {
      // Deterministic: pick the best
      return scoredMoves[0].move
    }

    // Compute softmax probabilities
    let maxScore = -Infinity
    for (let i = 0; i < scoredMoves.length; i++) {
      if (scoredMoves[i].score > maxScore) maxScore = scoredMoves[i].score
    }

    let expScores = []
    let sumExp = 0
    for (let i = 0; i < scoredMoves.length; i++) {
      let expVal = Math.exp((scoredMoves[i].score - maxScore) / (temperature * 100))
      expScores.push(expVal)
      sumExp += expVal
    }

    let roll = Math.random() * sumExp
    let cumulative = 0
    for (let i = 0; i < scoredMoves.length; i++) {
      cumulative += expScores[i]
      if (roll <= cumulative) {
        return scoredMoves[i].move
      }
    }

    return scoredMoves[scoredMoves.length - 1].move
  }
}
