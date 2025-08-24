const localStorageHandler = () => {

  // 双方向制御文字を削除する関数
  function removeBidiControls(str) {
    return str.replace(/[\u202A-\u202E\u2066-\u2069]/g, '');
  }

  function extractTagAndSet(nameStr, tagInput) {
    // nameStr は既にクリーニング済みの値が渡される想定なので
    // const cleanedStr = removeBidiControls(nameStr); は削除

    const regex = / #(.+?)がロビーに/;
    const match = nameStr.match(regex);

    if (match && tagInput) {
      tagInput.value = match[1];
    }
    
  }
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
        // 入力値をクリーン化してから保存・表示
        nameInput.value = removeBidiControls(nameInput.value);
        extractTagAndSet(nameInput.value, tagInput);

        //サモナー名を最適化
        const index = nameInput.value.indexOf(' #');
        if (index !== -1){
          nameInput.value = nameInput.value.substring(0, index);
        }
        localStorage.setItem(nameKey, nameInput.value);

        //extractTagAndSetでタグの値を変えるので保存
        localStorage.setItem(tagKey, tagInput.value);
      });

      tagInput?.addEventListener("input", () => {
        localStorage.setItem(tagKey, tagInput.value);
      });
  }

};

window.addEventListener("turbo:load", localStorageHandler);