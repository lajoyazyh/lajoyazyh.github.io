(() => {
  const counterNames = ["site_uv", "site_pv", "today_uv"];

  const syncChineseCounters = () => {
    counterNames.forEach((name) => {
      const source = document.getElementById(`busuanzi_${name}`);
      const target = document.getElementById(`busuanzi_${name}_zh`);
      const value = source?.textContent.trim();

      if (source && /域名|禁用/.test(value)) {
        source.textContent = "--";
        target.textContent = "--";
      } else if (source && target && value && value !== "--") {
        target.textContent = value;
      }
    });
  };

  window.addEventListener("DOMContentLoaded", () => {
    counterNames.forEach((name) => {
      const source = document.getElementById(`busuanzi_${name}`);
      if (source) {
        new MutationObserver(syncChineseCounters).observe(source, {
          childList: true,
          characterData: true,
          subtree: true,
        });
      }
    });

    syncChineseCounters();
  });
})();
