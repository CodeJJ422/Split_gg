class CreateFavoritePlayers < ActiveRecord::Migration[7.1]
  def change
    create_table :favorite_players do |t|
      t.string :summoner_name
      t.string :tag

      t.timestamps
    end
  end
end
