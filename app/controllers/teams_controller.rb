class TeamsController < ApplicationController

  def create
    players = params[:players].values # プレイヤー10人分の配列（0〜9）

      # ランクの強さにスコアを割り当てる（調整可能）
    rank_scores = {
      # Iron
      "IRONIV"        => 10,  "IRONIII"       => 20,
      "IRONII"        => 30,  "IRONI"         => 40,
      # Bronze
      "BRONZEIV"      => 60,  "BRONZEIII"     => 80,
      "BRONZEII"      => 100, "BRONZEI"       => 120,
      # Silver
      "SILVERIV"      => 140, "SILVERIII"     => 160,
      "SILVERII"      => 180, "SILVERI"       => 200,
      # Gold
      "GOLDIV"        => 230, "GOLDIII"       => 260,
      "GOLDII"        => 290, "GOLDI"         => 320,
      # Platinum
      "PLATINUMIV"    => 360, "PLATINUMIII"   => 400,
      "PLATINUMII"    => 440, "PLATINUMI"     => 480,
      # Emerald
      "EMERALDIV"     => 520, "EMERALDIII"    => 560,
      "EMERALDII"     => 600, "EMERALDI"      => 640,
      # Diamond
      "DIAMONDIV"     => 700, "DIAMONDIII"    => 760,
      "DIAMONDII"     => 820, "DIAMONDI"      => 880,
      # Apex Tiers
      "MASTERI"       => 980,
      "GRANDMASTERI"  => 1100,
      "CHALLENGERI"   => 1300,
      "unranked"      => 10      # 任意調整可
    }

    scored_players = players.map do |p|
      p[:score] = rank_scores[p["rank"] || "unranked"] || 10
      p
    end
  end
  
end
