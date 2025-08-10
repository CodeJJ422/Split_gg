require 'httparty'

class ChampionLoader
  VERSIONS_URL = 'https://ddragon.leagueoflegends.com/api/versions.json'

  # 最新バージョンを取得するメソッド
  def self.latest_version
    response = HTTParty.get(VERSIONS_URL)
    response.parsed_response.first
  end

  def self.load_all
    version = latest_version
    api_url = "https://ddragon.leagueoflegends.com/cdn/#{version}/data/ja_JP/champion.json"
    binding.pry
    response = HTTParty.get(api_url)
    data = response.parsed_response
    champions = data['data']

    champions.each do |_, champ_data|
      new_image_url = "https://ddragon.leagueoflegends.com/cdn/#{version}/img/champion/#{champ_data['image']['full']}"

      champ = Champion.find_or_initialize_by(champion_id: champ_data['key'].to_i)
      champ.name = champ_data['name']
      champ.image_url = new_image_url
      champ.save!
    end
  end
end