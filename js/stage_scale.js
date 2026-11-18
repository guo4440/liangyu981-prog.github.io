// 將固定 1920×1080 舞台依視窗尺寸等比例縮放並置中。
document.addEventListener("DOMContentLoaded", () => {
  const stage = document.querySelector(".game_stage");
  if (stage) {
    const resizeStage = () => {
      const scale = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
      stage.style.setProperty("--stage-scale", String(scale));
    };

    resizeStage();
    window.addEventListener("resize", resizeStage);
  }

  // 預載目前頁面中 Hover / Active 狀態使用的 CSS 背景圖，避免第一次互動才發出圖片請求。
  const preloadedImages = new Map();
  const preloadInteractiveImages = (rules, stylesheetUrl) => {
    for (const rule of rules) {
      if (rule.cssRules) {
        preloadInteractiveImages(rule.cssRules, stylesheetUrl);
        continue;
      }
      if (!rule.selectorText || !rule.style) continue;

      const backgroundImage = rule.style.getPropertyValue("background-image");
      if (!backgroundImage || backgroundImage === "none") continue;

      const selectors = rule.selectorText.split(",");
      const isInteractiveSelector = (selector) =>
        /:(hover|active)\b|\.(?:is_clicked|clicked)\b/.test(selector);
      if (!selectors.some(isInteractiveSelector)) continue;

      const hasMatchingElement = selectors.some((selector) => {
        if (!isInteractiveSelector(selector)) return false;
        const baseSelector = selector
          .replace(/:(hover|active)\b|\.(?:is_clicked|clicked)\b/g, "")
          .trim();
        try {
          return (
            document.querySelector(baseSelector) !== null ||
            /\.clicked\b/.test(selector)
          );
        } catch {
          return false;
        }
      });
      if (!hasMatchingElement) continue;

      for (const match of backgroundImage.matchAll(/url\(["']?([^"')]+)["']?\)/g)) {
        const imageUrl = new URL(match[1], stylesheetUrl || document.baseURI).href;
        if (preloadedImages.has(imageUrl)) continue;
        const image = new Image();
        image.decoding = "async";
        image.src = imageUrl;
        if (typeof image.decode === "function") {
          image.decode().catch(() => {});
        }
        preloadedImages.set(imageUrl, image);
      }
    }
  };

  for (const stylesheet of document.styleSheets) {
    try {
      preloadInteractiveImages(stylesheet.cssRules, stylesheet.href);
    } catch {
      // 跨來源樣式表無法讀取 CSSOM；本專案的本機樣式表可正常預載。
    }
  }
});
