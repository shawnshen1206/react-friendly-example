/* =================================================================
   main.js —— 全站唯一的 JS 檔
   -----------------------------------------------------------------
   規則：設計師不寫新的 JS。所有「開／關」互動都用 HTML 屬性宣告：

   1. data-toggle="#某個id"
      點擊後切換目標元素的 is-open class。
      用於：手機選單、modal 彈窗。
      範例：<button data-toggle="#disclaimer-modal">免責聲明</button>

   2. data-toggle="closest:.某個class"
      點擊後往上找最近的目標元素，切換它的 is-open class。
      用於：元件會重複出現、不能用 id 的情況（手風琴列、子選單）。
      範例：<button data-toggle="closest:.source-row">展開</button>

   3. data-action="print"
      點擊後列印本頁。

   「開」與「關」長什麼樣子由 CSS 的 .is-open 決定，JS 不碰樣式。
   轉換對應：is-open = React 的 useState 布林值；
   每一個 data-toggle 按鈕 = 一個 onClick={() => setOpen(!open)}。

   無障礙：aria-expanded 只會同步到「有宣告該屬性」的觸發元素上
   （裝飾性的 backdrop 不會被加上 aria 屬性）；id 型目標的所有
   觸發鈕會一起同步（例如用 X 關閉 modal 時，footer 的按鈕也更新）。

   其他更複雜的互動（表單驗證、資料載入、換頁、Esc 關閉、focus
   trap……）不在切版範圍，由工程師在 React 實作；設計師只需提供
   各狀態的靜態外觀。
   ================================================================= */

document.addEventListener("click", function (event) {
    // ---------- data-toggle：切換 is-open ----------
    const trigger = event.target.closest("[data-toggle]");
    if (trigger) {
        const selector = trigger.dataset.toggle;
        const isClosest = selector.startsWith("closest:");

        const target = isClosest
            ? trigger.closest(selector.slice("closest:".length))
            : document.querySelector(selector);
        if (!target) return;

        const isOpen = target.classList.toggle("is-open");

        if (isClosest) {
            // 重複型元件（手風琴列）：只同步被點的那顆按鈕
            syncAriaExpanded(trigger, isOpen);
        } else {
            // 唯一目標（modal、手機選單）：同步所有指向同一目標的按鈕
            document.querySelectorAll('[data-toggle="' + selector + '"]').forEach(function (t) {
                syncAriaExpanded(t, isOpen);
            });
        }
        return;
    }

    // ---------- data-action：一次性動作 ----------
    const action = event.target.closest("[data-action]");
    if (action && action.dataset.action === "print") {
        window.print();
    }
});

// 只更新有宣告 aria-expanded 的元素（裝飾性元素如 backdrop 不加 aria）
function syncAriaExpanded(el, isOpen) {
    if (el.hasAttribute("aria-expanded")) {
        el.setAttribute("aria-expanded", String(isOpen));
    }
}
