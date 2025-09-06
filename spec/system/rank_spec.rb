require 'rails_helper'

RSpec.describe "ランク取得", type: :system do
  before do
    @player = FactoryBot.build(:player)
  end

  context 'ユーザー新規登録ができるとき' do 
    it '正しい情報を入力すればランク選択欄からランクが自動で選択される' do
    # トップページに移動する
      visit root_path
    # ユーザー名を入力する
      fill_in 'players_0_summoner_name', with: @player.name
    # タグを入力する
      fill_in 'players_0_tag', with: @player.tag
    # ランク取得ボタンを押すとランクのvalueが""以外になっている
      find("#get-rank").click
      sleep 1
      
    end
  end
  context 'ユーザー新規登録ができないとき' do
    it '誤った情報ではランク取得はされず、エラーメッセージが出る' do
      
    end
  end
end
