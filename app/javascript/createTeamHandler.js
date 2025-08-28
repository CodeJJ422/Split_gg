const createTeamHandler = () => {

  let bestTeam1 = null;
  let bestTeam2 = null;
  let bestTeam3 = null;

  function updateTeamInputs(teamA, teamB) {
    teamA.forEach((player, i) => {
      const nameInput = document.getElementById(`players_${i}_summoner_name`);
      const tagInput = document.getElementById(`players_${i}_tag`);
      const rankSelect = document.getElementById(`players_${i}_rank`);
      const champion_image = document.getElementById(`players_${i}_champion_img`);
      if (nameInput) nameInput.value = player.summoner_name || "";
      if (tagInput) tagInput.value = player.tag || "";
      if (rankSelect) rankSelect.value = player.rank || "";
      if (champion_image) champion_image.src = player.champion_img || "";
      localStorage.setItem(`player_${i}_summoner_name`, player.summoner_name || "");
      localStorage.setItem(`player_${i}_tag`, player.tag || "");
    });

    teamB.forEach((player, i) => {
      const j = i + 5;
      const nameInput = document.getElementById(`players_${j}_summoner_name`);
      const tagInput = document.getElementById(`players_${j}_tag`);
      const rankSelect = document.getElementById(`players_${j}_rank`);
      const champion_image = document.getElementById(`players_${j}_champion_img`);
      if (nameInput) nameInput.value = player.summoner_name || "";
      if (tagInput) tagInput.value = player.tag || "";
      if (rankSelect) rankSelect.value = player.rank || "";
      if (champion_image) champion_image.src = player.champion_img || "";
      localStorage.setItem(`player_${j}_summoner_name`, player.summoner_name || "");
      localStorage.setItem(`player_${j}_tag`, player.tag || "");
    });
  }

    const createTeam = document.getElementById("create-team");
    const form = document.getElementById("team-form");
    if (!createTeam || !form) return;

    createTeam.addEventListener("click", async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      for (let i = 0; i < 10; i++) {
        const champion_image = document.getElementById(`players_${i}_champion_img`);
        const champion_image_url = champion_image ? champion_image.src : "";
        formData.append(`players[${i}][champion_img]`,champion_image_url);
      }
      const csrfToken = document.querySelector('meta[name="csrf-token"]').content;

      try {
        const response = await fetch("/teams", {
          method: "POST",
          headers: { "X-CSRF-Token": csrfToken },
          body: formData
        });

        if (response.ok) {
          const data = await response.json();
          bestTeam1 = data.best_team1;
          bestTeam2 = data.best_team2;
          bestTeam3 = data.best_team3;
          updateTeamInputs(bestTeam1.team_a, bestTeam1.team_b);
        } else {
          console.error("チーム分け失敗:", response.statusText);
        }
      } catch (error) {
        console.error("通信エラー:", error);
      }
    });

    document.getElementById("load-team1")?.addEventListener("click", () => {
      if (bestTeam1) updateTeamInputs(bestTeam1.team_a, bestTeam1.team_b);
    });
    document.getElementById("load-team2")?.addEventListener("click", () => {
      if (bestTeam2) updateTeamInputs(bestTeam2.team_a, bestTeam2.team_b);
    });
    document.getElementById("load-team3")?.addEventListener("click", () => {
      if (bestTeam3) updateTeamInputs(bestTeam3.team_a, bestTeam3.team_b);
    });
};

window.addEventListener("turbo:load", createTeamHandler);