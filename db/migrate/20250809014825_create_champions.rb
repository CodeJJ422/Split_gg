class CreateChampions < ActiveRecord::Migration[7.1]
  def change
    create_table :champions do |t|
      t.integer :champion_id
      t.string :name
      t.string :image_url

      t.timestamps
    end
  end
end
