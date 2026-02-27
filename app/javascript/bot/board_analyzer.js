import Board from "../engine/board.js"
import Rules from "../engine/rules.js"

// Piece value defaults used for material counting
const DEFAULT_PIECE_VALUES = {
  Pawn: 1, Night: 3, Bishop: 3, Rook: 5, Queen: 9, King: 0
}

// Center squares (d4, e4, d5, e5) and extended center (c3-f3 through c6-f6)
const CENTER_SQUARES = [27, 28, 35, 36]
const EXTENDED_CENTER = [18, 19, 20, 21, 26, 27, 28, 29, 34, 35, 36, 37, 42, 43, 44, 45]
const EDGE_SQUARES = []
for (let i = 0; i < 64; i++) {
  let file = i % 8, rank = Math.floor(i / 8)
  if (file === 0 || file === 7 || rank === 0 || rank === 7) {
    EDGE_SQUARES.push(i)
  }
}

export default class BoardAnalyzer {
  constructor(board, pieceValues) {
    this.board = board
    this.pieceValues = pieceValues || DEFAULT_PIECE_VALUES
  }

  // Returns a features object for the current board state from the perspective of `team`
  analyze(team) {
    let opponent = Board.opposingTeam(team)
    return {
      material: this.materialBalance(team),
      centerControl: this.centerControl(team),
      kingSafety: this.kingSafety(team),
      pieceActivity: this.pieceActivity(team),
      pawnStructure: this.pawnStructure(team),
      threatenedPieces: this.threatenedPieces(team),
      totalPieces: this.board.positionsOccupiedByTeam(team).length + this.board.positionsOccupiedByTeam(opponent).length
    }
  }

  materialBalance(team) {
    let opponent = Board.opposingTeam(team)
    return this.materialCount(team) - this.materialCount(opponent)
  }

  materialCount(team) {
    let positions = this.board.positionsOccupiedByTeam(team),
        total = 0
    for (let i = 0; i < positions.length; i++) {
      let species = this.board.pieceTypeAt(positions[i])
      total += (this.pieceValues[species] || 0)
    }
    return total
  }

  centerControl(team) {
    let score = 0
    let positions = this.board.positionsOccupiedByTeam(team)
    for (let i = 0; i < positions.length; i++) {
      let pos = positions[i]
      if (CENTER_SQUARES.indexOf(pos) !== -1) {
        score += 3
      } else if (EXTENDED_CENTER.indexOf(pos) !== -1) {
        score += 1
      }
    }
    return score
  }

  kingSafety(team) {
    let kingPos = this.board.kingPosition(team)
    if (kingPos === null) return 0
    let score = 0

    // Bonus for having pawns in front of king
    let direction = (team === Board.WHITE) ? 8 : -8
    let shieldPositions = [kingPos + direction, kingPos + direction - 1, kingPos + direction + 1]
    for (let i = 0; i < shieldPositions.length; i++) {
      let pos = shieldPositions[i]
      if (Board.inBounds(pos) && this.board.teamAt(pos) === team && this.board.pieceTypeAt(pos) === Board.PAWN) {
        score += 2
      }
    }

    // Penalty if king is in center during opening/middlegame
    let totalPieces = this.board.positionsOccupiedByTeam(team).length + this.board.positionsOccupiedByTeam(Board.opposingTeam(team)).length
    if (totalPieces > 20) {
      let kingFile = kingPos % 8
      if (kingFile >= 2 && kingFile <= 5) {
        score -= 3 // king in center is dangerous early
      }
    }

    return score
  }

  pieceActivity(team) {
    // Count total number of legal moves available — more = more active pieces
    let positions = this.board.positionsOccupiedByTeam(team),
        moveCount = 0

    // Temporarily set allowedToMove to the team we're analyzing
    let savedTurn = this.board.allowedToMove
    this.board.allowedToMove = team
    for (let i = 0; i < positions.length; i++) {
      let moves = Rules.viablePositionsFromKeysOnly({ board: this.board, startPosition: positions[i] })
      moveCount += moves.length
    }
    this.board.allowedToMove = savedTurn

    return moveCount
  }

  pawnStructure(team) {
    let positions = this.board.positionsOccupiedByTeam(team),
        score = 0,
        pawnFiles = []

    for (let i = 0; i < positions.length; i++) {
      if (this.board.pieceTypeAt(positions[i]) === Board.PAWN) {
        let file = positions[i] % 8
        pawnFiles.push(file)
      }
    }

    // Penalty for doubled pawns
    let fileCounts = {}
    for (let i = 0; i < pawnFiles.length; i++) {
      fileCounts[pawnFiles[i]] = (fileCounts[pawnFiles[i]] || 0) + 1
    }
    for (let file in fileCounts) {
      if (fileCounts[file] > 1) {
        score -= (fileCounts[file] - 1) * 2
      }
    }

    // Penalty for isolated pawns (no friendly pawns on adjacent files)
    for (let i = 0; i < pawnFiles.length; i++) {
      let f = pawnFiles[i],
          hasNeighbor = false
      for (let j = 0; j < pawnFiles.length; j++) {
        if (i !== j && Math.abs(pawnFiles[j] - f) === 1) {
          hasNeighbor = true
          break
        }
      }
      if (!hasNeighbor) score -= 1
    }

    return score
  }

  // Returns list of threatened pieces (pieces that an opponent can capture)
  threatenedPieces(team) {
    let opponent = Board.opposingTeam(team),
        myPositions = this.board.positionsOccupiedByTeam(team),
        threatened = []

    // Get all squares the opponent attacks
    let opponentPositions = this.board.positionsOccupiedByTeam(opponent)
    let attackedSquares = new Set()

    let savedTurn = this.board.allowedToMove
    this.board.allowedToMove = opponent
    for (let i = 0; i < opponentPositions.length; i++) {
      let moves = Rules.viablePositionsFromKeysOnly({ board: this.board, startPosition: opponentPositions[i] })
      for (let j = 0; j < moves.length; j++) {
        attackedSquares.add(moves[j])
      }
    }
    this.board.allowedToMove = savedTurn

    for (let i = 0; i < myPositions.length; i++) {
      if (attackedSquares.has(myPositions[i])) {
        threatened.push({
          position: myPositions[i],
          species: this.board.pieceTypeAt(myPositions[i]),
          value: this.pieceValues[this.board.pieceTypeAt(myPositions[i])] || 0
        })
      }
    }

    return threatened
  }

  // Game phase detection
  gamePhase() {
    let totalPieces = this.board.positionsOccupiedByTeam(Board.WHITE).length +
                      this.board.positionsOccupiedByTeam(Board.BLACK).length
    if (totalPieces >= 28) return "opening"
    if (totalPieces >= 16) return "middlegame"
    return "endgame"
  }

  isEdgeSquare(position) {
    return EDGE_SQUARES.indexOf(position) !== -1
  }
}

export { DEFAULT_PIECE_VALUES, CENTER_SQUARES, EXTENDED_CENTER, EDGE_SQUARES }
