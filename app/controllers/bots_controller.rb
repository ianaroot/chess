class BotsController < ApplicationController
  before_action :set_bot, only: %i[ show edit update destroy ]

  def index
    @bots = Bot.order(updated_at: :desc)
  end

  def show
  end

  def new
    @bot = Bot.new
    @bot.config = Bot.default_config
  end

  def create
    @bot = Bot.new(bot_params)
    @bot.config = parse_config_from_params(Bot.default_config)

    if @bot.save
      redirect_to @bot, notice: "Bot created!"
    else
      render :new, status: :unprocessable_entity
    end
  end

  def edit
  end

  def update
    @bot.config = parse_config_from_params(@bot.config)

    if @bot.update(bot_params.except(:config))
      redirect_to @bot, notice: "Bot updated!"
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @bot.destroy
    redirect_to bots_url, notice: "Bot deleted."
  end

  private

  def set_bot
    @bot = Bot.find(params[:id])
  end

  def bot_params
    params.require(:bot).permit(:name, :description, :author_name, :config)
  end

  def parse_config_from_params(base_config)
    config = base_config.deep_dup

    if params.dig(:bot, :weights)
      config["weights"] = {
        "material" => params[:bot][:weights][:material].to_i,
        "centerControl" => params[:bot][:weights][:centerControl].to_i,
        "kingSafety" => params[:bot][:weights][:kingSafety].to_i,
        "pieceActivity" => params[:bot][:weights][:pieceActivity].to_i,
        "pawnStructure" => params[:bot][:weights][:pawnStructure].to_i
      }
    end

    if params.dig(:bot, :piece_values)
      config["pieceValues"] = {
        "Pawn" => params[:bot][:piece_values][:Pawn].to_i,
        "Night" => params[:bot][:piece_values][:Night].to_i,
        "Bishop" => params[:bot][:piece_values][:Bishop].to_i,
        "Rook" => params[:bot][:piece_values][:Rook].to_i,
        "Queen" => params[:bot][:piece_values][:Queen].to_i
      }
    end

    if params.dig(:bot, :quirks)
      quirks = {}
      Bot.default_config["quirks"].each_key do |key|
        quirks[key] = params[:bot][:quirks][key] == "1"
      end
      config["quirks"] = quirks
    end

    if params.dig(:bot, :randomness)
      config["randomness"] = params[:bot][:randomness].to_i
    end

    if params.dig(:bot, :triggers_json).present?
      config["triggers"] = JSON.parse(params[:bot][:triggers_json])
    end

    config
  end
end
