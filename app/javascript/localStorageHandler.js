export function setupLocalStorage() {
  for (let i = 0; i < 10; i++) {
    const nameId = `players_${i}_summoner_name`;
    const tagId = `players_${i}_tag`;
    const nameKey = `player_${i}_summoner_name`;
    const tagKey = `player_${i}_tag`;

    const nameInput = document.getElementById(nameId);
    const tagInput = document.getElementById(tagId);

    if (nameInput && localStorage.getItem(nameKey)) {
      nameInput.value = localStorage.getItem(nameKey);
    }
    if (tagInput && localStorage.getItem(tagKey)) {
      tagInput.value = localStorage.getItem(tagKey);
    }

    nameInput?.addEventListener("input", () => {
      localStorage.setItem(nameKey, nameInput.value);
    });

    tagInput?.addEventListener("input", () => {
      localStorage.setItem(tagKey, tagInput.value);
    });
  }
}