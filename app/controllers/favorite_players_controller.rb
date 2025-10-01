class FavoritePlayersController < ApplicationController
  before_action :authenticate_user!  # deviseでログイン必須

  def index
    @favorite_players = current_user.favorite_players
  end

  def new
    @favorite_player = current_user.favorite_players.new
  end

  def create
    @favorite_player = current_user.favorite_players.new(favorite_player_params)
    if @favorite_player.save
      redirect_to favorite_players_path, notice: "お気に入りプレイヤーを追加しました"
    else
      render :new
    end
  end

  def destroy
    @favorite_player = current_user.favorite_players.find(params[:id])
    @favorite_player.destroy
    redirect_to favorite_players_path, notice: "お気に入りプレイヤーを削除しました"
  end

  private

  def favorite_player_params
    params.require(:favorite_player).permit(:summoner_name, :tag)
  end
end
