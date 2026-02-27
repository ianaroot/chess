class MatchesController < ApplicationController
  skip_before_action :verify_authenticity_token, only: :update

  def show
    @match = Match.find(params[:id])
    @moves = @match.match_moves.order(:move_number, :side)
  end

  def create
    white_bot = Bot.find(params[:white_bot_id])
    black_bot = Bot.find(params[:black_bot_id])

    @match = Match.create!(
      white_bot: white_bot,
      black_bot: black_bot
    )

    redirect_to @match
  end

  def update
    @match = Match.find(params[:id])

    Match.transaction do
      match_params = params.require(:match).permit(:result, :termination, :move_count)
      @match.update!(match_params)

      # Update bot records
      if @match.result == "1-0"
        @match.white_bot.increment!(:wins)
        @match.black_bot.increment!(:losses)
      elsif @match.result == "0-1"
        @match.black_bot.increment!(:wins)
        @match.white_bot.increment!(:losses)
      elsif @match.result == "1/2-1/2"
        @match.white_bot.increment!(:draws)
        @match.black_bot.increment!(:draws)
      end

      # Save individual moves
      if params[:moves].present?
        params[:moves].each do |move_data|
          @match.match_moves.create!(
            move_number: move_data[:move_number],
            side: move_data[:side],
            from_square: move_data[:from_square],
            to_square: move_data[:to_square],
            notation: move_data[:notation]
          )
        end
      end
    end

    render json: { status: "ok" }
  end
end
