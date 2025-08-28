// チャンピオン画像の表示/非表示を切り替える関数
function toggleChampionImages() {
  for (let i = 0; i < 10; i++) { // 10人分ループ
    const img = document.getElementById(`players_${i}_champion_img`);
    if (img && img.src) {       // ← src が空文字なら無視
      img.hidden = !img.hidden;
    }
  }
}

// ボタンにイベントを追加
const toggleBtn = document.getElementById("toggle-champion-images");
toggleBtn.addEventListener("click", toggleChampionImages);