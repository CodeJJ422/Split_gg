class TeamsController < ApplicationController

  def create
    players = params[:players].values # プレイヤー10人分の配列（0〜9）
  end
  
end
