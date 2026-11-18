// Level 1 的開始、重置分數與關卡導頁行為。
document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("startBtn");
  const nextBtn = document.getElementById("nextBtn");

  if (startBtn) {
    startBtn.addEventListener("click", (e) => {
      // Prevent the default action so navigation can happen after the press feedback.
      e.preventDefault();

      // Level 1 是新遊戲起點，從 0 分開始並記錄本關刷新時要恢復的起始分數。
      localStorage.setItem("level1ScoreBase", "0");
      localStorage.setItem("totalScore", "0");
      ["level1Score", "level2Score", "level3Score", "level4Score", "level5Score", "level6Score"].forEach((key) => {
        localStorage.removeItem(key);
      });
      console.log("[計分] 新遊戲開始，累計總分：0 分");

      setTimeout(() => {
        window.location.href = "./0_2_1.html";
      }, 200);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", (e) => {
      // 保留按鈕按下狀態的視覺回饋後，再前往 Level 2 開場。
      e.preventDefault();

      setTimeout(() => {
        window.location.href = "./0_3.html";
      }, 200);
    });
  }
});
//0.2.1
document.addEventListener("DOMContentLoaded", () => {
  const timer_intro = document.querySelector(".timer_intro");
  const game_timer = document.querySelector(".Gtimer");

  if (timer_intro && game_timer) {
    timer_intro.addEventListener(
      "animationend",
      () => {
        setTimeout(() => {
          game_timer.classList.add("visible");
          start_game_loop();
        }, 1000);
      },
      { once: true },
    );
  }

  // 每次進入或重新整理 Level 1 都回到本關起始分，丟棄尚未完成的本關分數。
  const saved_level_base = Number(localStorage.getItem("level1ScoreBase"));
  let current_score = Number.isFinite(saved_level_base) ? saved_level_base : 0;
  const score_display = document.getElementById("scoreDisplay");

  function update_score_display() {
    if (score_display) score_display.textContent = `分數：${current_score}`;
  }

  localStorage.setItem("totalScore", current_score);
  update_score_display();

  // 每波設定雞的種類、出現位置與持續時間
  const wave_config = [
    {
      duration: 4000,
      chickens: [{ type: 1, holes: [1, 2, , 3, 4, 6, 7, 8, 9] }],
    },
    {
      duration: 4000,
      chickens: [
        { type: 1, holes: [2, 3] },
        { type: 2, holes: [1, 5, 9] },
      ],
    },
    {
      duration: 4000,
      chickens: [{ type: 3, holes: [1, 3, 5, 7, 9] }],
    },
    {
      duration: 4000,
      chickens: [
        { type: 1, holes: [1, 4, 8] },
        { type: 2, holes: [5] },
        { type: 3, holes: [2, 6] },
      ],
    },
  ];

  // 雞種計分：type 1 金雞 +1、type 2 普通雞 +3、type 3 壞雞 -1。
  const score_by_type = { 1: 1, 2: 3, 3: -1 };
  let current_wave_index = 0;

  // 清空所有洞口的雞
  function clear_all_holes() {
    for (let i = 1; i <= 9; i++) {
      const hole = document.getElementById(`hole_${i}`);
      if (hole) hole.innerHTML = "";
    }
  }

  function shuffle(items) {
    for (let i = items.length - 1; i > 0; i--) {
      const random_index = Math.floor(Math.random() * (i + 1));
      [items[i], items[random_index]] = [items[random_index], items[i]];
    }
    return items;
  }

  // 產生一波雞
  function spawn_wave(wave_data) {
    clear_all_holes();

    const chickens_to_spawn = [];
    wave_data.chickens.forEach(({ type, holes }) => {
      holes.forEach((hole_index) => {
        chickens_to_spawn.push({ type, hole_index });
      });
    });

    shuffle(chickens_to_spawn).forEach(({ type, hole_index }, index) => {
      setTimeout(() => {
        const hole = document.getElementById(`hole_${hole_index}`);
        if (!hole) return;

        const chicken = document.createElement("div");
        chicken.classList.add("chicken", `chicken_type_${type}`);
        chicken.dataset.type = type;
        chicken.dataset.is_clicked = "false";

        chicken.addEventListener("click", () => {
          if (chicken.dataset.is_clicked === "true") return;

          chicken.dataset.is_clicked = "true";
          chicken.classList.add("clicked");
          current_score += score_by_type[type];
          localStorage.setItem("totalScore", current_score);
          localStorage.setItem("level1Score", String(current_score));
          update_score_display();
          console.log(`[Level 1] 本關目前 ${current_score} 分，累計總分 ${current_score} 分`);

          setTimeout(() => {
            chicken.remove();
          }, 1000);
        });

        hole.appendChild(chicken);
      }, index * 250);
    });
  }

  // 啟動 16 秒的四波遊戲流程
  function start_game_loop() {
    if (current_wave_index < wave_config.length) {
      const current_wave = wave_config[current_wave_index];
      spawn_wave(current_wave);

      current_wave_index++;

      // 目前波次結束後自動清理
      setTimeout(start_game_loop, current_wave.duration);
    } else {
      // 本關結算時將累計總分限制在 5 到 20 分，並保存供後續關卡接續。
      clear_all_holes();
      current_score = Math.min(20, Math.max(5, current_score));
      localStorage.setItem("totalScore", current_score);
      localStorage.setItem("level1Score", String(current_score));
      update_score_display();
      console.log(`[Level 1 結算] 本關得分 ${current_score} 分，累計總分 ${current_score} 分`);

      // GIF 全長約 16.17 秒；四波遊戲共 16 秒，等待剩餘時間後跳轉
      setTimeout(() => {
        window.location.href = "./0_2_2.html";
      }, 170);
    }
  }

  // 前導動畫結束並等待 1 秒後，顯示計時器並開始遊戲
});
