class AddUserToBots < ActiveRecord::Migration[8.1]
  def change
    add_reference :bots, :user, foreign_key: true
  end
end
