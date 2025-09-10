class FavoritePlayer < ApplicationRecord
  validates :summoner_name, presence: true
  validates :tag, presence: true
end
