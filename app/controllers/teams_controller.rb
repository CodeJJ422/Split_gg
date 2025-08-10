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

    unique_teams = Set.new
    all_team_combinations = []

    (0...10).to_a.combination(5).each do |team_a_indexes|
      team_b_indexes = (0...10).to_a - team_a_indexes

      # 同じ組み合わせを入れ替えても1つとみなすために、小さい順に並べて保存
      sorted = [team_a_indexes.sort, team_b_indexes.sort].sort

      # 重複チェック
      next unless unique_teams.add?(sorted)

      team_a = team_a_indexes.map { |i| scored_players[i] }
      team_b = team_b_indexes.map { |i| scored_players[i] }

      sum_a = team_a.sum { |p| p[:score] }
      sum_b = team_b.sum { |p| p[:score] }
      diff = (sum_a - sum_b).abs

      all_team_combinations << { team_a: team_a, team_b: team_b, diff: diff }
    end

    # diffの昇順でソート
    sorted_combinations = all_team_combinations.sort_by { |tc| tc[:diff] }

    top_teams = []
    sorted_combinations.each do |candidate|
      # 既に選ばれたチームと比較して、team_aのメンバーが2人以上違うかチェック
      is_different_enough = top_teams.all? do |chosen|
        diff_count = (candidate[:team_a].map { |p| p["summoner_name"] } - chosen[:team_a].map { |p| p["summoner_name"] }).size
        diff_count >= 2
      end

      top_teams << candidate if is_different_enough
      break if top_teams.size >= 3
    end

    best_team_1, best_team_2, best_team_3 = top_teams

    render json: {
      best_team1: best_team_1,
      best_team2: best_team_2,
      best_team3: best_team_3
    }

  end

end
