const match = () => {
  const getRank = document.getElementById("get-rank");
  const createTeam = document.getElementById("create-team");
  const form = document.getElementById("team-form");

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
        // チーム表示ロジックなどをここに追加
      } else {
        console.error("チーム分け失敗:", response.statusText);
      }
    } catch (error) {
      console.error("通信エラー:", error);
    }
  });
};

window.addEventListener("turbo:load", match);