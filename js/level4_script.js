// Level 4 的開始按鈕與關卡導頁行為。
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

      setTimeout(() => {
        window.location.href = "0_5_1.html";
      }, 200);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", (e) => {
      // 保留按鈕按下狀態的視覺回饋後，再前往 Level 2 開場。
      e.preventDefault();

      setTimeout(() => {
        window.location.href = "0_6.html";
      }, 200);
    });
  }
});
document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".ans_button");
  const timer_intro = document.querySelector(".timer_intro");
  const game_timer = document.querySelector(".Gtimer");
  // GIF 計時器共 150 格，每格 30 毫秒，第一輪共 4500 毫秒。
  const timer_duration = 150 * 30;
  const transition_delay = 1000;
  let isAnswered = false; // 防止玩家連續狂點

  function lock_answers() {
    buttons.forEach((button) => {
      button.disabled = true;
    });
  }

  function start_timer() {
    if (isAnswered) return;
    const timer_image = game_timer.querySelector("img");

    if (!timer_image?.dataset.src) {
      console.error("遊戲計時器圖片來源不存在。");
      return;
    }

    timer_image.addEventListener(
      "load",
      () => {
        if (isAnswered) return;
        game_timer.classList.add("visible");
        setTimeout(() => {
          if (isAnswered) return;
          game_timer.classList.remove("visible");
          isAnswered = true;
          lock_answers();
          setTimeout(go_to_next_question, transition_delay);
        }, timer_duration);
      },
      { once: true },
    );
    timer_image.addEventListener(
      "error",
      () => console.error("遊戲計時器圖片載入失敗。"),
      { once: true },
    );
    timer_image.src = timer_image.dataset.src;
  }

  function go_to_next_question() {
    const currentPath = window.location.pathname;

    if (currentPath.includes("0_5_1.html")) {
      window.location.href = "0_5_2.html";
    } else if (currentPath.includes("0_5_2.html")) {
      window.location.href = "0_5_3.html";
    } else if (currentPath.includes("0_5_3.html")) {
      window.location.href = "0_5_4.html";
    }
  }

  if (game_timer && timer_intro) {
    timer_intro.addEventListener("animationend", start_timer, { once: true });
  } else if (game_timer) {
    start_timer();
  }

  buttons.forEach((button) => {
    button.addEventListener("click", (event) => {
      if (isAnswered) return;
      isAnswered = true;
      lock_answers();
      game_timer?.classList.remove("visible");

      // 1. 強制加上點擊時的樣式類別（確保點擊圖能順利顯示）
      button.classList.add("is_clicked");

      const resultType = button.getAttribute("data-answer");
      const earnedScore = resultType === "correct" ? 6 : 0;
      const currentTotal = Number(localStorage.getItem("totalScore") ?? "0");
      const newTotal = currentTotal + earnedScore;
      localStorage.setItem("totalScore", String(newTotal));

      console.log(
        `[答題結果] 本題得分: ${earnedScore} 分, 目前累積總分: ${newTotal} 分`,
      );

      setTimeout(go_to_next_question, transition_delay);
    }); // 這裡關閉 click 事件
  }); // 這裡關閉 forEach
}); // 這裡關閉 DOMContentLoaded
