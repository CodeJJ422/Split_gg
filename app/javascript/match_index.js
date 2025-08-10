const match = () => {
  const getRank = document.getElementById("get-rank");
  const createTeam = document.getElementById("create-team");
  const form = document.getElementById("team-form");
  const loadTeam1 = document.getElementById("load-team1");
  const loadTeam2 = document.getElementById("load-team2");
  const loadTeam3 = document.getElementById("load-team3");

  // 🔽 ここから localStorage の自動入力・保存処理を追加 🔽
  for (let i = 0; i < 10; i++) {
    const nameId = `players_${i}_summoner_name`;
    const tagId = `players_${i}_tag`;
    const nameKey = `player_${i}_summoner_name`;
    const tagKey = `player_${i}_tag`;

    const nameInput = document.getElementById(nameId);
    const tagInput = document.getElementById(tagId);

    // 入力欄に保存された値を復元
    if (nameInput && localStorage.getItem(nameKey)) {
      nameInput.value = localStorage.getItem(nameKey);
    }
    if (tagInput && localStorage.getItem(tagKey)) {
      tagInput.value = localStorage.getItem(tagKey);
    }

    // 入力イベントで保存
    nameInput?.addEventListener("input", () => {
      localStorage.setItem(nameKey, nameInput.value);
    });

    tagInput?.addEventListener("input", () => {
      localStorage.setItem(tagKey, tagInput.value);
    });
  }
  // 🔼 ここまで localStorage 処理 🔼

  getRank.addEventListener("click", async (e) => {
    e.preventDefault();

    for (let i = 0; i < 10; i++) {
      const nameInput = document.getElementById(`players_${i}_summoner_name`);
      const tagInput = document.getElementById(`players_${i}_tag`);
      const rankSelect = document.getElementById(`players_${i}_rank`);

      if (!nameInput || !tagInput || !rankSelect) continue;

      const playerName = nameInput.value;
      const playerTag = tagInput.value;

      if (!playerName || !playerTag) continue;

      const formData = new FormData();
      formData.append("player_name", playerName);
      formData.append("player_tag", playerTag);

      const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute("content");

      try {
        const response = await fetch("/matches", {
          method: "POST",
          headers: {
            "X-CSRF-Token": csrfToken
          },
          body: formData
        });

        if (response.ok) {
          const data = await response.json();
          const soloRank = data.solo_rank;

          if (soloRank && soloRank.toLowerCase() !== "unranked") {
            // ランク情報があり、「unranked」ではない場合
            rankSelect.value = soloRank.toUpperCase();
          } else {
             // ランク情報がない or "unranked" の場合
            rankSelect.value = "unranked";
          }
        } else {
          console.warn(`プレイヤー${i + 1} のランク取得に失敗`);
        }
      } catch (error) {
        console.error("通信エラー", error);
      }
    }
  });

  let bestTeam1 = null;
  let bestTeam2 = null;
  let bestTeam3 = null;

  createTeam.addEventListener("click", async (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const csrfToken = document.querySelector('meta[name="csrf-token"]').content;

    try {
      const response = await fetch("/teams", {
        method: "POST",
        headers: {
          "X-CSRF-Token": csrfToken
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        console.log("チーム分け成功:", data);

        bestTeam1 = data.best_team1;
        bestTeam2 = data.best_team2;
        bestTeam3 = data.best_team3;

        // 初期表示はbest_team1でOK
        updateTeamInputs(bestTeam1.team_a, bestTeam1.team_b);

      } else {
        console.error("チーム分け失敗:", response.statusText);
      }
    } catch (error) {
      console.error("通信エラー:", error);
    }
  });

  const updateTeamInputs = (teamA, teamB) => {
    // チームA
    teamA.forEach((player, i) => {
      const nameInput = document.getElementById(`players_${i}_summoner_name`);
      const tagInput = document.getElementById(`players_${i}_tag`);
      const rankSelect = document.getElementById(`players_${i}_rank`);

      if (nameInput) nameInput.value = player.summoner_name || "";
      if (tagInput) tagInput.value = player.tag || "";
      if (rankSelect) rankSelect.value = player.rank;

      localStorage.setItem(`player_${i}_summoner_name`, player.summoner_name || "");
      localStorage.setItem(`player_${i}_tag`, player.tag || "");
    });

    // チームB
    teamB.forEach((player, i) => {
      const j = i + 5;
      const nameInput = document.getElementById(`players_${j}_summoner_name`);
      const tagInput = document.getElementById(`players_${j}_tag`);
      const rankSelect = document.getElementById(`players_${j}_rank`);

      if (nameInput) nameInput.value = player.summoner_name || "";
      if (tagInput) tagInput.value = player.tag || "";
      if (rankSelect) rankSelect.value = player.rank;

      localStorage.setItem(`player_${j}_summoner_name`, player.summoner_name || "");
      localStorage.setItem(`player_${j}_tag`, player.tag || "");
    });
  };

  // ボタンイベント登録
  loadTeam1.addEventListener("click", () => {
    if (bestTeam1) updateTeamInputs(bestTeam1.team_a, bestTeam1.team_b);
  });
  loadTeam2.addEventListener("click", () => {
    if (bestTeam2) updateTeamInputs(bestTeam2.team_a, bestTeam2.team_b);
  });
  loadTeam3.addEventListener("click", () => {
    if (bestTeam3) updateTeamInputs(bestTeam3.team_a, bestTeam3.team_b);
  });
};

window.addEventListener("turbo:load", match);