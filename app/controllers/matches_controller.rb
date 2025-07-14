require 'httparty'

class MatchesController < ApplicationController
  before_action :set_key, only: :create

  def index
  end
  
  def create
    get_puuid
    get_rank
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
      puts "エラー: #{response.code}"
    end
  end

  def get_rank
    rank_url = "https://jp1.api.riotgames.com/lol/league/v4/entries/by-puuid/#{@puuid}"
    rank_response = HTTParty.get(rank_url, headers: { "X-Riot-Token" => @api_key })

    if rank_response.code == 200
      leagues = JSON.parse(rank_response.body)
      ranked = leagues.find { |league| league["queueType"] == "RANKED_SOLO_5x5" }
      solo_rank = "#{ranked['tier']}#{ranked['rank']}"
      render json: { solo_rank: solo_rank } #JavaScriptに返す
    else
      puts "ランク情報取得失敗: #{rank_response.body}"
    end
  end

end
