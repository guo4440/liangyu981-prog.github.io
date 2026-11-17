// Level 5 的開始按鈕、計分判定與分數回饋行為。
document.addEventListener("DOMContentLoaded", () => {
  const start_button = document.getElementById("startBtn");
  const next_button = document.getElementById("nextBtn");
  const stop_button = document.getElementById("stopBtn");

  if (start_button) {
    start_button.addEventListener("click", (event) => {
      event.preventDefault();
      localStorage.setItem("level1ScoreBase", "0");
      localStorage.setItem("totalScore", "0");
      setTimeout(() => {
        window.location.href = "0_6_1.html";
      }, 200);
    });
  }

  if (next_button) {
    next_button.addEventListener("click", (event) => {
      event.preventDefault();
      setTimeout(() => {
        window.location.href = "0_7.html";
      }, 200);
    });
  }

  if (!stop_button) return;

  const pointer = document.getElementById("scorePointer");
  const zones = Array.from(document.querySelectorAll(".score_zone"));
  const feedback_container = document.getElementById("feedbackContainer");
  const feedback_images = {
    5: ["feedbackGif5", "feedbackGif5Top", "feedbackGif5Bottom"],
    10: ["feedbackGif10", "feedbackGif10Top", "feedbackGif10Bottom"],
    15: ["feedbackGif15", "feedbackGif15Top", "feedbackGif15Bottom"],
  };
  const feedback_images_by_id = new Map(
    Object.values(feedback_images)
      .flat()
      .map((id) => [id, document.getElementById(id)]),
  );
  let is_stopped = false;

  stop_button.addEventListener("click", (event) => {
    event.preventDefault();
    if (is_stopped || !pointer || !feedback_container) return;
    is_stopped = true;
    stop_button.disabled = true;
    pointer.classList.add("is_stopped");

    const pointer_rect = pointer.getBoundingClientRect();
    const pointer_tip_y = pointer_rect.top + pointer_rect.height / 2;
    const hit_zone = zones.find((zone, index) => {
      const zone_rect = zone.getBoundingClientRect();
      const is_last_zone = index === zones.length - 1;
      return (
        pointer_tip_y >= zone_rect.top &&
        (pointer_tip_y < zone_rect.bottom ||
          (is_last_zone && pointer_tip_y <= zone_rect.bottom))
      );
    });

    if (!hit_zone) {
      stop_button.disabled = false;
      pointer.classList.remove("is_stopped");
      is_stopped = false;
      console.error("指針未落在任何分數區域，請檢查計分條高度設定。");
      return;
    }

    const earned_score = Number(hit_zone.dataset.score);
    const active_feedback = feedback_images[earned_score];
    if (!active_feedback) {
      stop_button.disabled = false;
      pointer.classList.remove("is_stopped");
      is_stopped = false;
      console.error(`找不到 ${earned_score} 分的回饋設定。`);
      return;
    }

    const saved_total = Number(localStorage.getItem("totalScore") ?? "0");
    const current_total = Number.isFinite(saved_total) ? saved_total : 0;
    localStorage.setItem("totalScore", String(current_total + earned_score));

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
      window.location.href = "0_6_2.html";
    }, 2000);
  });
});
