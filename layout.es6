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
    let layOut = ["ee", "ee", "ee", "ee", "WK", "ee", "ee", "ee",
                  "ee", "ee", "ee", "WP", "WN", "WP", "WP", "ee",
                  "ee", "ee", "ee", "ee", "ee", "ee", "ee", "WR",
                  "WP", "WB", "ee", "ee", "ee", "ee", "ee", "ee",
                  "ee", "ee", "ee", "ee", "WQ", "ee", "ee", "ee",
                  "ee", "ee", "ee", "ee", "BP", "ee", "ee", "ee",
                  "ee", "ee", "ee", "ee", "ee", "BK", "ee", "ee",
                  "ee", "ee", "ee", "ee", "ee", "ee", "ee", "WR"]
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
