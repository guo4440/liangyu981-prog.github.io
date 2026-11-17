// Level 5 的開始按鈕、計分判定與分數回饋行為。
document.addEventListener("DOMContentLoaded", () => {
  const start_button = document.getElementById("startBtn");
  const next_button = document.getElementById("nextBtn");

  if (start_button) {
    start_button.addEventListener("click", (event) => {
      event.preventDefault();
      localStorage.setItem("level1ScoreBase", "0");
      localStorage.setItem("totalScore", "0");
      setTimeout(() => {
        window.location.href = "0_7_1.html";
      }, 200);
    });
  }

  if (next_button) {
    next_button.addEventListener("click", (event) => {
      event.preventDefault();
      setTimeout(() => {
        window.location.href = "0_8.html";
      }, 200);
    });
  }

  feedback_images_by_id.forEach((image) => {
    image?.classList.remove("is_active");
  });
  active_feedback.forEach((id) => {
    feedback_images_by_id.get(id)?.classList.add("is_active");
  });
  document.body.classList.add("feedback_visible");
  feedback_container.classList.add("is_visible");
  feedback_container.setAttribute("aria-hidden", "false");

  setTimeout(() => {
    feedback_container.classList.remove("is_visible");
    feedback_container.setAttribute("aria-hidden", "true");
    document.body.classList.remove("feedback_visible");
    pointer.classList.remove("is_stopped");
    stop_button.disabled = false;
    is_stopped = false;
  }, 2000);
  setTimeout(() => {
    window.location.href = "0_7_2.html";
  }, 2000);
});

document.addEventListener("DOMContentLoaded", () => {
  const dragItems = document.querySelectorAll(".drag_item");
  const dropZones = document.querySelectorAll(".drop_zone");

  let draggedData = null;

  // 1. 開始拖曳時記錄是哪一個食材
  dragItems.forEach((item) => {
    item.addEventListener("dragstart", (e) => {
      draggedData = item.getAttribute("data-item");
      e.dataTransfer.setData("text/plain", draggedData);
    });
  });

  // 2. 允許放置區接收拖曳物
  dropZones.forEach((zone) => {
    zone.addEventListener("dragover", (e) => {
      e.preventDefault(); // 必須阻擋預設行為才能 drop
    });

    // 3. 放開滑鼠瞬間判定
    zone.addEventListener("drop", (e) => {
      e.preventDefault();
      const targetType = zone.getAttribute("data-target");

      // 判斷：是否對應正確的虛線區？
      if (draggedData === targetType) {
        // --- 答對了！ ---
        console.log("放對位置！");

        // A. 隱藏該區的虛線圖
        const dashImg = zone.querySelector(".dash_img");
        if (dashImg) dashImg.style.display = "none";

        // B. 在該放置區生成對應的「放大版大圖」
        const largeImg = document.createElement("img");
        // 依據類型對應你的大圖檔名
        largeImg.src = `./img/${draggedData}_large.png`;
        largeImg.className = "placed_large_img";
        zone.appendChild(largeImg);

        // C. 將右側對應的選單項目加上「已完成/打勾」狀態
        const sourceItem = document.querySelector(
          `[data-item="${draggedData}"]`,
        );
        if (sourceItem) {
          sourceItem.classList.add("completed");
          sourceItem.setAttribute("draggable", "false"); // 鎖定不能再拖
        }

        // 清空放置區，防止重複放置
        zone.removeAttribute("data-target");
      } else {
        // --- 答錯了！ ---
        console.log("放錯位置！");

        // 將該錯誤選項進行 disable 鎖定
        const sourceItem = document.querySelector(
          `[data-item="${draggedData}"]`,
        );
        if (sourceItem) {
          sourceItem.classList.add("disabled");
          sourceItem.setAttribute("draggable", "false");
        }
      }
    });
  });
});
