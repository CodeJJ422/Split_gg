const getRankHandler = () => {
  const getRank = document.getElementById("get-rank");
  if (!getRank) return;

  getRank.addEventListener("click", async (e) => {

    for (let i = 0; i < 10; i++) {
      const nameInput = document.getElementById(`players_${i}_summoner_name`);
      const tagInput = document.getElementById(`players_${i}_tag`);
      const rankSelect = document.getElementById(`players_${i}_rank`);
      if (!nameInput || !tagInput || !rankSelect) continue;

      const playerRow = nameInput.closest(".player-row");

      // 既存のエラーメッセージがあれば削除
      const oldError = playerRow.nextElementSibling;
      if (oldError && oldError.classList.contains("error-message")) {
        oldError.remove();
      }

      const playerName = nameInput.value;
      const playerTag = tagInput.value;

      // 未入力ならエラー表示してスキップ
      if (!playerName || !playerTag) {
        if (playerRow) {
          const errorEl = document.createElement("div");
          errorEl.className = "error-message";
          errorEl.textContent = "サモナー名とタグを入力してください。";
          playerRow.insertAdjacentElement("afterend", errorEl);
        }
        continue;
      }

      const formData = new FormData();
      formData.append("player_name", playerName);
      formData.append("player_tag", playerTag);

      const csrfToken = document.querySelector('meta[name="csrf-token"]').content;

      try {
        const response = await fetch("/matches", {
          method: "POST",
          headers: { "X-CSRF-Token": csrfToken },
          body: formData
        });

        if (response.ok) {
          const data = await response.json();
          const soloRank = data.solo_rank;
          rankSelect.value = soloRank && soloRank.toLowerCase() !== "unranked"
            ? soloRank.toUpperCase()
            : "unranked";
        } else {
          // サーバー側エラー時の表示
          if (playerRow) {
            const errorEl = document.createElement("div");
            errorEl.className = "error-message";
            errorEl.textContent = "正しいプレイヤー情報を入力してください。";
            playerRow.insertAdjacentElement("afterend", errorEl);
          }
        }
      } catch (error) {
        console.error("通信エラー", error);
        if (playerRow) {
          const errorEl = document.createElement("div");
          errorEl.className = "error-message";
          errorEl.textContent = "通信エラーが発生しました。";
          playerRow.insertAdjacentElement("afterend", errorEl);
        }
      }
    }
  });
};
window.addEventListener("turbo:load", getRankHandler);

