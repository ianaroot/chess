puts "Seeding bots..."

Bot.find_or_create_by!(name: "The Materializer") do |bot|
  bot.description = "Cares about nothing more than capturing pieces. High material weight, trade happy."
  bot.author_name = "IANchess"
  bot.config = Bot.default_config.deep_merge(
    "weights" => { "material" => 100, "centerControl" => 10, "kingSafety" => 30 },
    "quirks" => { "tradeHappy" => true },
    "randomness" => 10
  )
end

Bot.find_or_create_by!(name: "Castle Knight") do |bot|
  bot.description = "Gets castled ASAP, then charges with knights. Loves the center."
  bot.author_name = "IANchess"
  bot.config = Bot.default_config.deep_merge(
    "weights" => { "kingSafety" => 90, "centerControl" => 70 },
    "quirks" => { "castleASAP" => true, "lovesKnights" => true, "centerMagnet" => true },
    "randomness" => 12
  )
end

Bot.find_or_create_by!(name: "Chaos Agent") do |bot|
  bot.description = "Maximum randomness. You never know what it'll do next."
  bot.author_name = "IANchess"
  bot.config = Bot.default_config.deep_merge(
    "quirks" => { "chaotic" => true },
    "randomness" => 90
  )
end

Bot.find_or_create_by!(name: "The Wall") do |bot|
  bot.description = "Conservative defender. Avoids trades, prioritizes king safety and pawn structure."
  bot.author_name = "IANchess"
  bot.config = Bot.default_config.deep_merge(
    "weights" => { "kingSafety" => 90, "pawnStructure" => 70, "material" => 40 },
    "quirks" => { "tradeAverse" => true, "edgePhobic" => true },
    "triggers" => [
      {
        "id" => "t1", "name" => "Retreat when threatened", "enabled" => true,
        "condition" => { "type" => "piece_threatened", "params" => { "piece_types" => ["Queen", "Rook"] } },
        "action" => { "type" => "retreat", "params" => {} }
      }
    ],
    "randomness" => 8
  )
end

puts "Seeded #{Bot.count} bots."
