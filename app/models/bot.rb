class Bot < ApplicationRecord
  has_many :white_matches, class_name: "Match", foreign_key: :white_bot_id, dependent: :destroy
  has_many :black_matches, class_name: "Match", foreign_key: :black_bot_id, dependent: :destroy

  validates :name, presence: true
  validates :config, presence: true

  before_validation :set_default_config, on: :create

  def matches
    Match.where("white_bot_id = ? OR black_bot_id = ?", id, id)
  end

  def record
    "#{wins}W / #{losses}L / #{draws}D"
  end

  def self.default_config
    {
      "weights" => {
        "material" => 70, "centerControl" => 40, "kingSafety" => 50,
        "pieceActivity" => 30, "pawnStructure" => 20
      },
      "pieceValues" => { "Pawn" => 1, "Night" => 3, "Bishop" => 3, "Rook" => 5, "Queen" => 9 },
      "triggers" => [],
      "quirks" => {
        "lovesKnights" => false, "edgePhobic" => false, "castleASAP" => false,
        "aggressivePawns" => false, "tradeHappy" => false, "tradeAverse" => false,
        "centerMagnet" => false, "chaotic" => false
      },
      "randomness" => 15
    }
  end

  private

  def set_default_config
    self.config ||= Bot.default_config
  end
end
