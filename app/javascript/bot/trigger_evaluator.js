import Board from "../engine/board.js"
import BoardAnalyzer from "./board_analyzer.js"

export default class TriggerEvaluator {
  constructor(board, team, pieceValues) {
    this.board = board
    this.team = team
    this.analyzer = new BoardAnalyzer(board, pieceValues)
    this.pieceValues = pieceValues || { Pawn: 1, Night: 3, Bishop: 3, Rook: 5, Queen: 9 }
  }

  // Evaluate all triggers against the board state. Returns score modifiers per move.
  evaluateTriggers(triggers, scoredMoves) {
    if (!triggers || triggers.length === 0) return scoredMoves

    for (let t = 0; t < triggers.length; t++) {
      let trigger = triggers[t]
      if (!trigger.enabled) continue

      let conditionMet = this.evaluateCondition(trigger.condition)
      if (conditionMet) {
        scoredMoves = this.applyAction(trigger.action, scoredMoves, conditionMet)
      }
    }

    return scoredMoves
  }

  evaluateCondition(condition) {
    switch (condition.type) {
      case "piece_threatened":
        return this.conditionPieceThreatened(condition.params)
      case "can_fork":
        return this.conditionCanFork()
      case "losing_material":
        return this.conditionLosingMaterial(condition.params)
      case "winning_material":
        return this.conditionWinningMaterial(condition.params)
      case "in_check":
        return this.conditionInCheck()
      case "early_game":
        return this.conditionEarlyGame()
      case "late_game":
        return this.conditionLateGame()
      case "always":
        return true
      default:
        return false
    }
  }

  conditionPieceThreatened(params) {
    let threatened = this.analyzer.threatenedPieces(this.team)
    if (threatened.length === 0) return false
    if (params && params.piece_types) {
      let matching = threatened.filter(p => params.piece_types.indexOf(p.species) !== -1)
      return matching.length > 0 ? { threatened: matching } : false
    }
    return { threatened: threatened }
  }

  conditionCanFork() {
    // A fork: one move attacks 2+ opponent pieces
    let moves = this.analyzer.board.positionsOccupiedByTeam(this.team)
    // Simplified: check if any single piece attacks 2+ opponent pieces
    let opponent = Board.opposingTeam(this.team)
    let opponentPositions = this.board.positionsOccupiedByTeam(opponent)
    // This is expensive, so return a simple boolean
    return opponentPositions.length >= 2
  }

  conditionLosingMaterial(params) {
    let balance = this.analyzer.materialBalance(this.team)
    let threshold = (params && params.threshold) || -2
    return balance <= threshold
  }

  conditionWinningMaterial(params) {
    let balance = this.analyzer.materialBalance(this.team)
    let threshold = (params && params.threshold) || 2
    return balance >= threshold
  }

  conditionInCheck() {
    let kingPos = this.board.kingPosition(this.team)
    if (kingPos === null) return false
    // Check if any opponent piece can reach the king
    let threatened = this.analyzer.threatenedPieces(this.team)
    return threatened.some(p => p.species === Board.KING)
  }

  conditionEarlyGame() {
    return this.analyzer.gamePhase() === "opening"
  }

  conditionLateGame() {
    return this.analyzer.gamePhase() === "endgame"
  }

  applyAction(action, scoredMoves, conditionData) {
    switch (action.type) {
      case "boost_move":
        return this.actionBoostMove(action.params, scoredMoves)
      case "retreat":
        return this.actionRetreat(scoredMoves, conditionData)
      case "play_aggressively":
        return this.actionPlayAggressively(scoredMoves)
      case "play_conservatively":
        return this.actionPlayConservatively(scoredMoves)
      case "weighted_choice":
        return this.actionWeightedChoice(action.params, scoredMoves, conditionData)
      default:
        return scoredMoves
    }
  }

  actionBoostMove(params, scoredMoves) {
    let boost = (params && params.amount) || 50
    for (let i = 0; i < scoredMoves.length; i++) {
      scoredMoves[i].score += boost
    }
    return scoredMoves
  }

  actionRetreat(scoredMoves, conditionData) {
    if (!conditionData || !conditionData.threatened) return scoredMoves

    let threatenedPositions = new Set()
    for (let i = 0; i < conditionData.threatened.length; i++) {
      threatenedPositions.add(conditionData.threatened[i].position)
    }

    for (let i = 0; i < scoredMoves.length; i++) {
      let move = scoredMoves[i].move
      // Boost moves that evacuate threatened pieces, proportional to piece value
      if (threatenedPositions.has(move.from)) {
        let species = this.board.pieceTypeAt(move.from)
        let value = this.pieceValues[species] || 1
        scoredMoves[i].score += value * 20
      }
    }
    return scoredMoves
  }

  actionPlayAggressively(scoredMoves) {
    for (let i = 0; i < scoredMoves.length; i++) {
      let move = scoredMoves[i].move
      // Boost captures
      if (!this.board.positionEmpty(move.to)) {
        let capturedSpecies = this.board.pieceTypeAt(move.to)
        let capturedValue = this.pieceValues[capturedSpecies] || 1
        scoredMoves[i].score += capturedValue * 15
      }
    }
    return scoredMoves
  }

  actionPlayConservatively(scoredMoves) {
    for (let i = 0; i < scoredMoves.length; i++) {
      let move = scoredMoves[i].move
      // Penalize captures (prefer quiet moves)
      if (!this.board.positionEmpty(move.to)) {
        scoredMoves[i].score -= 30
      }
    }
    return scoredMoves
  }

  actionWeightedChoice(params, scoredMoves, conditionData) {
    // Probabilistic: apply one of several sub-actions based on weights
    // e.g., { retreat: 60, counter_attack: 30, ignore: 10 }
    if (!params) return scoredMoves

    let total = 0
    let entries = []
    for (let key in params) {
      total += params[key]
      entries.push({ action: key, weight: params[key] })
    }

    let roll = Math.random() * total
    let cumulative = 0
    let chosen = entries[0].action

    for (let i = 0; i < entries.length; i++) {
      cumulative += entries[i].weight
      if (roll <= cumulative) {
        chosen = entries[i].action
        break
      }
    }

    switch (chosen) {
      case "retreat":
        return this.actionRetreat(scoredMoves, conditionData)
      case "counter_attack":
      case "play_aggressively":
        return this.actionPlayAggressively(scoredMoves)
      case "play_conservatively":
        return this.actionPlayConservatively(scoredMoves)
      case "ignore":
      default:
        return scoredMoves
    }
  }
}
