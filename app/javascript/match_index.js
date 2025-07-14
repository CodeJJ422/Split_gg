const getRank = () => {
  const getBtn = document.getElementById("get-rank");
  getBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const playerName = document.getElementById("players_0_summoner_name").value;
    const playerTag = document.getElementById("players_0_tag").value;

    const formData = new FormData();
    formData.append("player_name", playerName);
    formData.append("player_tag", playerTag);
    const XHR = new XMLHttpRequest();
    XHR.open("POST", "/matches", true);
    XHR.responseType = "json";

    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute("content");
    XHR.setRequestHeader("X-CSRF-Token", csrfToken);
    
    XHR.send(formData);

    XHR.onload = () => {
      if (XHR.status === 200) {
        const response = XHR.response;
        const soloRank = response.solo_rank;
        console.log(soloRank)
      } else {
        alert("ランクの取得に失敗しました。");
      }
    };
  });
};

window.addEventListener("turbo:load", getRank);