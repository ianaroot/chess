class CreateBots < ActiveRecord::Migration[8.1]
  def change
    create_table :bots do |t|
      t.string :name
      t.text :description
      t.json :config
      t.string :author_name
      t.integer :wins, default: 0
      t.integer :losses, default: 0
      t.integer :draws, default: 0

      t.timestamps
    end
  end
end
