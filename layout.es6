class Layout{
  static default(){
    let layOut = [
      Board.WHITE + Board.ROOK, Board.WHITE + Board.NIGHT, Board.WHITE + Board.BISHOP, Board.WHITE + Board.QUEEN, Board.WHITE + Board.KING, Board.WHITE + Board.BISHOP, Board.WHITE + Board.NIGHT, Board.WHITE + Board.ROOK,
      Board.WHITE + Board.PAWN, Board.WHITE + Board.PAWN, Board.WHITE + Board.PAWN, Board.WHITE + Board.PAWN, Board.WHITE + Board.PAWN, Board.WHITE + Board.PAWN, Board.WHITE + Board.PAWN, Board.WHITE + Board.PAWN,
      Board.EMPTY + Board.EMPTY, Board.EMPTY + Board.EMPTY, Board.EMPTY + Board.EMPTY, Board.EMPTY + Board.EMPTY, Board.EMPTY + Board.EMPTY, Board.EMPTY + Board.EMPTY, Board.EMPTY + Board.EMPTY, Board.EMPTY + Board.EMPTY,
      Board.EMPTY + Board.EMPTY, Board.EMPTY + Board.EMPTY, Board.EMPTY + Board.EMPTY, Board.EMPTY + Board.EMPTY, Board.EMPTY + Board.EMPTY, Board.EMPTY + Board.EMPTY, Board.EMPTY + Board.EMPTY, Board.EMPTY + Board.EMPTY,
      Board.EMPTY + Board.EMPTY, Board.EMPTY + Board.EMPTY, Board.EMPTY + Board.EMPTY, Board.EMPTY + Board.EMPTY, Board.EMPTY + Board.EMPTY, Board.EMPTY + Board.EMPTY, Board.EMPTY + Board.EMPTY, Board.EMPTY + Board.EMPTY,
      Board.EMPTY + Board.EMPTY, Board.EMPTY + Board.EMPTY, Board.EMPTY + Board.EMPTY, Board.EMPTY + Board.EMPTY, Board.EMPTY + Board.EMPTY, Board.EMPTY + Board.EMPTY, Board.EMPTY + Board.EMPTY, Board.EMPTY + Board.EMPTY,
      Board.BLACK + Board.PAWN, Board.BLACK + Board.PAWN, Board.BLACK + Board.PAWN, Board.BLACK + Board.PAWN, Board.BLACK + Board.PAWN, Board.BLACK + Board.PAWN, Board.BLACK + Board.PAWN, Board.BLACK + Board.PAWN,
      Board.BLACK + Board.ROOK, Board.BLACK + Board.NIGHT, Board.BLACK + Board.BISHOP, Board.BLACK + Board.QUEEN, Board.BLACK + Board.KING, Board.BLACK + Board.BISHOP, Board.BLACK + Board.NIGHT, Board.BLACK + Board.ROOK
    ];
    return layOut
  }

  static approachingStale(){
    let layOut = [
      "ee", "ee", "ee", "ee", "WK", "ee", "ee", "ee",
      "ee", "ee", "ee", "WP", "WN", "WP", "WP", "ee",
      "ee", "ee", "ee", "ee", "ee", "ee", "ee", "WR",
      "WP", "WB", "ee", "ee", "ee", "ee", "ee", "ee",
      "ee", "ee", "ee", "ee", "WQ", "ee", "ee", "ee",
      "ee", "ee", "ee", "ee", "BP", "ee", "ee", "ee",
      "ee", "ee", "ee", "ee", "ee", "BK", "ee", "ee",
      "ee", "ee", "ee", "ee", "ee", "ee", "ee", "WR"
    ]
    return layOut
  }

  static failedQueenTrapBlackFirst(){
    let layOut = [
      "WR", "WN", "WB", "WQ", "WK", "WB", "WN", "WR",
      "WP", "WP", "WP", "WP", "ee", "WP", "WP", "WP",
      "ee", "ee", "ee", "ee", "ee", "ee", "ee", "ee",
      "ee", "ee", "ee", "ee", "WP", "ee", "ee", "ee",
      "ee", "ee", "ee", "ee", "ee", "ee", "ee", "ee",
      "ee", "ee", "ee", "ee", "ee", "ee", "ee", "ee",
      "BP", "BP", "BP", "BP", "BP", "BP", "BP", "BP",
      "BR", "BN", "BB", "BQ", "BK", "BB", "BN", "BR"
    ]
    return layOut
  }

  static queenDanger(){
    let layOut = [
      "WR", "WN", "ee", "ee", "ee", "WB", "ee", "WR",
      "WP", "WP", "ee", "WK", "WP", "WP", "WP", "WP",
      "ee", "ee", "WP", "WP", "WB", "WN", "ee", "ee",
      "ee", "ee", "ee", "ee", "WQ", "ee", "ee", "ee",
      "ee", "ee", "BB", "BP", "BP", "ee", "ee", "ee",
      "ee", "ee", "BN", "ee", "BB", "BN", "ee", "ee",
      "BP", "BP", "BP", "ee", "ee", "BP", "BP", "BP",
      "BR", "ee", "ee", "BQ", "BK", "ee", "ee", "BR"
  ]
  return layOut
  }

  static causesErrorIfBlackTurn(){
    let layOut = [
      "BN", "WN", "ee", "ee", "ee", "WB", "ee", "WR",
      "WP", "WP", "ee", "WK", "WP", "WP", "ee", "WP",
      "ee", "ee", "ee", "ee", "ee", "WN", "WB", "ee",
      "ee", "ee", "ee", "WP", "ee", "ee", "WP", "ee",
      "ee", "ee", "ee", "BP", "WQ", "ee", "BP", "ee",
      "BP", "BP", "BP", "ee", "BP", "BN", "ee", "BP",
      "ee", "ee", "ee", "ee", "BK", "BP", "ee", "ee",
      "BR", "ee", "BB", "BQ", "ee", "BB", "ee", "BR"
    ]
    return layOut
  }

  static whyNotCaptureBlackTurn(){
    let layOut = [
      "WR", "WN", "ee", "WQ", "ee", "WR", "WK", "ee",
      "ee", "ee", "ee", "WB", "WP", "WP", "ee", "ee",
      "ee", "ee", "WP", "ee", "ee", "ee", "WP", "WN",
      "WP", "WP", "ee", "ee", "ee", "ee", "ee", "WP",
      "BP", "ee", "BB", "BN", "ee", "ee", "ee", "BP",
      "ee", "ee", "ee", "ee", "BP", "BP", "BP", "ee",
      "ee", "BP", "ee", "BB", "ee", "ee", "ee", "ee",
      "BR", "ee", "ee", "BQ", "BK", "ee", "ee", "BR"
    ]
    return layOut
  }

  static nWeights(){
    let layOut = [
      "WR", "WN", "WB", "WQ", "WK", "WB", "ee", "WR",
      "WP", "WP", "WP", "ee", "WN", "ee", "WP", "WP",
      "ee", "ee", "ee", "ee", "ee", "WP", "ee", "ee",
      "ee", "ee", "ee", "ee", "BN", "ee", "ee", "ee",
      "ee", "ee", "ee", "ee", "WP", "ee", "ee", "ee",
      "ee", "ee", "BN", "ee", "ee", "ee", "ee", "ee",
      "BP", "BP", "BP", "BP", "ee", "BP", "BP", "BP",
      "BR", "ee", "BB", "BQ", "BK", "BB", "ee", "BR"
    ]
    return layOut
  }

  static approachingMate(){
    let layOut = [
      Board.WHITE + Board.ROOK,  Board.EMPTY + Board.EMPTY, Board.WHITE + Board.BISHOP,  Board.WHITE + Board.QUEEN, Board.WHITE + Board.KING,  Board.EMPTY + Board.EMPTY,   Board.WHITE + Board.NIGHT, Board.WHITE + Board.ROOK,
      Board.WHITE + Board.PAWN,  Board.WHITE + Board.PAWN,  Board.WHITE + Board.PAWN,    Board.WHITE + Board.PAWN,  Board.EMPTY + Board.EMPTY, Board.WHITE + Board.PAWN,    Board.WHITE + Board.PAWN,  Board.WHITE + Board.PAWN,
      Board.EMPTY + Board.EMPTY, Board.EMPTY + Board.EMPTY, Board.WHITE + Board.NIGHT,   Board.EMPTY + Board.EMPTY, Board.WHITE + Board.PAWN,  Board.EMPTY + Board.EMPTY,   Board.EMPTY + Board.EMPTY, Board.EMPTY + Board.EMPTY,
      Board.EMPTY + Board.EMPTY, Board.EMPTY + Board.EMPTY, Board.WHITE + Board.BISHOP,  Board.EMPTY + Board.EMPTY, Board.EMPTY + Board.EMPTY, Board.EMPTY + Board.EMPTY,   Board.EMPTY + Board.EMPTY, Board.EMPTY + Board.EMPTY,
      Board.EMPTY + Board.EMPTY, Board.EMPTY + Board.EMPTY, Board.EMPTY + Board.EMPTY,   Board.EMPTY + Board.EMPTY, Board.BLACK + Board.PAWN,  Board.EMPTY + Board.EMPTY,   Board.EMPTY + Board.EMPTY, Board.EMPTY + Board.EMPTY,
      Board.BLACK + Board.NIGHT, Board.EMPTY + Board.EMPTY, Board.EMPTY + Board.EMPTY,   Board.BLACK + Board.PAWN,  Board.EMPTY + Board.EMPTY, Board.EMPTY + Board.EMPTY,   Board.EMPTY + Board.EMPTY, Board.EMPTY + Board.EMPTY,
      Board.BLACK + Board.PAWN,  Board.BLACK + Board.PAWN,  Board.BLACK + Board.PAWN,    Board.EMPTY + Board.EMPTY, Board.EMPTY + Board.EMPTY,Board.BLACK + Board.PAWN,   Board.BLACK + Board.PAWN,  Board.BLACK + Board.PAWN,
      Board.BLACK + Board.ROOK,  Board.EMPTY + Board.EMPTY, Board.BLACK + Board.BISHOP,  Board.BLACK + Board.QUEEN, Board.BLACK + Board.KING,  Board.BLACK + Board.BISHOP,  Board.BLACK + Board.NIGHT, Board.BLACK + Board.ROOK
    ];//approachingMate used for training bot to seek mate

    return layOut
  }
}
