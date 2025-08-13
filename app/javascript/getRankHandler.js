export function setupGetRankButton() {
  const getRank = document.getElementById("get-rank");
  if (!getRank) return;

  getRank.addEventListener("click", async (e) => {
    e.preventDefault();

    for (let i = 0; i < 10; i++) {
      const nameInput = document.getElementById(`players_${i}_summoner_name`);
      const tagInput = document.getElementById(`players_${i}_tag`);
      const rankSelect = document.getElementById(`players_${i}_rank`);
      if (!nameInput || !tagInput || !rankSelect) continue;

      const playerName = nameInput.value;
      const playerTag = tagInput.value;

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
          console.warn(`正しいプレイヤー情報を入力してください。`);
        }
      } catch (error) {
        console.error("通信エラー", error);
      }
    }
  });
}
