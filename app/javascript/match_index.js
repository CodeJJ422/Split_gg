const getRank = () => {
  const getBtn = document.getElementById("get-rank");
  getBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const playerName = document.getElementById("players_0_summoner_name").value;
    const playerTag = document.getElementById("players_0_tag").value;
  });
};

window.addEventListener("turbo:load", getRank);