# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_02_27_031100) do
  create_table "bots", force: :cascade do |t|
    t.string "author_name"
    t.json "config"
    t.datetime "created_at", null: false
    t.text "description"
    t.integer "draws", default: 0
    t.integer "losses", default: 0
    t.string "name"
    t.datetime "updated_at", null: false
    t.integer "wins", default: 0
  end

  create_table "match_moves", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "from_square"
    t.integer "match_id", null: false
    t.integer "move_number"
    t.string "notation"
    t.json "scores"
    t.string "side"
    t.string "to_square"
    t.datetime "updated_at", null: false
    t.index ["match_id"], name: "index_match_moves_on_match_id"
  end

  create_table "matches", force: :cascade do |t|
    t.integer "black_bot_id", null: false
    t.datetime "created_at", null: false
    t.integer "move_count"
    t.string "result"
    t.string "termination"
    t.datetime "updated_at", null: false
    t.integer "white_bot_id", null: false
    t.index ["black_bot_id"], name: "index_matches_on_black_bot_id"
    t.index ["white_bot_id"], name: "index_matches_on_white_bot_id"
  end

  add_foreign_key "match_moves", "matches"
  add_foreign_key "matches", "bots", column: "black_bot_id"
  add_foreign_key "matches", "bots", column: "white_bot_id"
end
