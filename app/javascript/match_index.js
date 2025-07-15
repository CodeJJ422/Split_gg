const getRank = () => {
  const getBtn = document.getElementById("get-rank");

  getBtn.addEventListener("click", async (e) => {
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
};

window.addEventListener("turbo:load", getRank);