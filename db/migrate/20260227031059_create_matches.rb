class CreateMatches < ActiveRecord::Migration[8.1]
  def change
    create_table :matches do |t|
      t.references :white_bot, null: false, foreign_key: { to_table: :bots }
      t.references :black_bot, null: false, foreign_key: { to_table: :bots }
      t.string :result
      t.string :termination
      t.integer :move_count

      t.timestamps
    end
  end
end
