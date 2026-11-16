// Level 3 的關卡導頁、計分判定與分數回饋行為。
document.addEventListener("DOMContentLoaded", () => {
  const next_button = document.getElementById("nextBtn");
  const start_button = document.getElementById("startBtn");
  const stop_button = document.getElementById("stopBtn");

  if (next_button) {
    next_button.addEventListener("click", (event) => {
      event.preventDefault();
      setTimeout(() => {
        window.location.href = "0_5.html";
      }, 200);
    });
  }

  if (start_button) {
    start_button.addEventListener("click", (event) => {
      event.preventDefault();
      setTimeout(() => {
        window.location.href = "0_4_1.html";
      }, 200);
    });
  }

  if (!stop_button) return;

  const pointer = document.getElementById("scorePointer");
  const zones = Array.from(document.querySelectorAll(".score_zone"));
  const feedback_container = document.getElementById("feedbackContainer");
  const feedback_images = {
    0: ["feedbackGif0", "feedbackGif0Top"],
    5: ["feedbackGif5", "feedbackGif5Top", "feedbackGif5Bottom"],
    10: ["feedbackGif10", "feedbackGif10Top"],
    15: ["feedbackGif15", "feedbackGif15Top", "feedbackGif15Bottom"],
  };
  const feedback_images_by_id = Object.fromEntries(
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
    // 取得指標尖端的垂直中心位置（或最前端位置）
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
      console.error("指針尖端未落在任何分數區域，請檢查長條寬度設定。");
      return;
    }

    const earned_score = Number(hit_zone.dataset.score);
    const saved_total = Number(localStorage.getItem("totalScore") ?? "0");
    const current_total = Number.isFinite(saved_total) ? saved_total : 0;
    const new_score = current_total + earned_score;
    localStorage.setItem("totalScore", String(new_score));

    Object.values(feedback_images_by_id).forEach((image) => {
      image?.classList.remove("is_active");
    });
    feedback_images[earned_score]?.forEach((id) => {
      feedback_images_by_id[id]?.classList.add("is_active");
    });
    document.body.classList.add("feedback_visible");
    feedback_container.classList.add("is_visible");
    feedback_container.setAttribute("aria-hidden", "false");

    setTimeout(() => {
      feedback_container.classList.remove("is_visible");
      feedback_container.setAttribute("aria-hidden", "true");
      document.body.classList.remove("feedback_visible");
    }, 2000);
    setTimeout(() => {
      window.location.href = "0_4_2.html";
    }, 2000);
  });
  //過場動畫//
});
