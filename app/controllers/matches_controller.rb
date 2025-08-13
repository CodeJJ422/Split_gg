require 'httparty'

class MatchesController < ApplicationController
  before_action :set_key, only: :create

  def index
  end
  
  def create
    solo_rank = nil  # 先に宣言しておく
    champion_image = nil
    begin
      get_puuid

      threads = []
      threads << Thread.new { solo_rank = get_rank }  # データ返すだけ
      threads << Thread.new { champion_image = get_favorite_champion }
      threads.each(&:join)

      render json: {
        solo_rank: solo_rank,
        champion_image: champion_image
      }
    rescue => e
      render json: { error: e.message }, status: :bad_request
    end
  end

  private
  def set_key
    @api_key = ENV['RIOT_API_KEY']
  end

  def get_puuid
    encoded_player_name = URI.encode_www_form_component(params[:player_name]).gsub("+", "%20")
    encoded_player_tag = URI.encode_www_form_component(params[:player_tag])
    account_url = "https://asia.api.riotgames.com/riot/account/v1/accounts/by-riot-id/#{encoded_player_name}/#{encoded_player_tag}"
    response = HTTParty.get(account_url, headers: { "X-Riot-Token" => @api_key })
    if response.code == 200
      data = JSON.parse(response.body)
      @puuid = data["puuid"]
    else
      raise "Puuid取得に失敗"
    end
  end

  def get_rank
    rank_url = "https://jp1.api.riotgames.com/lol/league/v4/entries/by-puuid/#{@puuid}"
    rank_response = HTTParty.get(rank_url, headers: { "X-Riot-Token" => @api_key })

    return "ランク取得エラー" unless rank_response.code == 200

    leagues = JSON.parse(rank_response.body)
    return "unranked" if leagues.empty?

    ranked = leagues.find { |league| league["queueType"] == "RANKED_SOLO_5x5" }
    "#{ranked['tier']}#{ranked['rank']}"
  end

  def get_favorite_champion
    mastery_url = "https://jp1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/#{@puuid}/top?count=1"
    mastery_response = HTTParty.get(mastery_url, headers: { "X-Riot-Token" => @api_key })

    return "マスタリー取得エラー" unless mastery_response.code == 200
    mastery = JSON.parse(mastery_response.body)

    # 取得したデータが空でなければ処理
    if mastery.any?
      champion_id = mastery[0]['championId']
      champion = Champion.find_by(champion_id: champion_id)
      
      if champion
        return champion.image_url
      else
        puts "Champion ID #{champion_id} はDBに存在しません"
        return nil
      end
    else
      puts "マスタリー情報がありません"
      return nil
    end
  end

end
