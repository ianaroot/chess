class ArenaController < ApplicationController
  def index
    @bots = Bot.order(wins: :desc)
    @recent_matches = Match.includes(:white_bot, :black_bot).order(created_at: :desc).limit(10)
  end
end
