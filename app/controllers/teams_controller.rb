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
      # 数値を格納したscoreのキーを追加する
    scored_players = players.map do |p|
      p[:score] = rank_scores[p["rank"] || "unranked"] || 10
      p
    end
    # 最小スコア差を探す
    min_diff = Float::INFINITY
    best_team_a = []

    # 0〜9のインデックス配列からすべての5人組み合わせを試す
    (0...10).to_a.combination(5).each do |team_a_indexes|
      team_a = team_a_indexes.map { |i| scored_players[i] }
      team_b = (0...10).reject { |i| team_a_indexes.include?(i) }.map { |i| scored_players[i] }

      sum_a = team_a.sum { |p| p[:score] }
      sum_b = team_b.sum { |p| p[:score] }
      diff = (sum_a - sum_b).abs

      if diff < min_diff
        min_diff = diff
        best_team_a = team_a
      end
    end

    best_team_b = scored_players - best_team_a

    # JSONとして返す
    render json: {
      team_a: best_team_a,
      team_b: best_team_b
    }
  end
  
end
