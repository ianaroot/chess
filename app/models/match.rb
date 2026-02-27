class Match < ApplicationRecord
  belongs_to :white_bot, class_name: "Bot"
  belongs_to :black_bot, class_name: "Bot"
  has_many :match_moves, dependent: :destroy

  validates :result, inclusion: { in: %w[1-0 0-1 1/2-1/2], allow_nil: true }

  def winner
    case result
    when "1-0" then white_bot
    when "0-1" then black_bot
    end
  end

  def draw?
    result == "1/2-1/2"
  end

  def complete?
    result.present?
  end
end
