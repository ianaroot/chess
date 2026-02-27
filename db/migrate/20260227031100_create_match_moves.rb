class CreateMatchMoves < ActiveRecord::Migration[8.1]
  def change
    create_table :match_moves do |t|
      t.references :match, null: false, foreign_key: true
      t.integer :move_number
      t.string :side
      t.string :from_square
      t.string :to_square
      t.string :notation
      t.json :scores

      t.timestamps
    end
  end
end
