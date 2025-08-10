class Champion < ApplicationRecord
  validates :champion_id, presence: true, uniqueness: true #チャンピオンidは重複しないようにする
  validates :name, presence: true
  validates :image_url, presence: true
end
