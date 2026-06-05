// 表格 accordion：點擊展開鈕，展開該列的詳細內容（一次只開一列）
// （原 main.js 的 jQuery 寫法移植成標準 DOM API；slideToggle 改為 class 切換）

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".accordion-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
            const srText = btn.querySelector(".sr-only");
            const detailContent = btn.closest("tr").nextElementSibling.querySelector(".accordion-content");

            // 若該列已開啟 -> 關閉
            if (btn.classList.contains("open")) {
                btn.classList.remove("open");
                detailContent.classList.remove("open");

                btn.title = "展開表格";
                if (srText) srText.textContent = "展開表格";
            } else {
                // 先關閉其他已開啟的列
                document.querySelectorAll(".accordion-btn.open").forEach(function (openBtn) {
                    openBtn.classList.remove("open");
                    openBtn.title = "展開表格";
                    const sr = openBtn.querySelector(".sr-only");
                    if (sr) sr.textContent = "展開表格";
                });
                document.querySelectorAll(".accordion-content.open").forEach(function (content) {
                    content.classList.remove("open");
                });

                // 再展開目前點擊的這一列
                btn.classList.add("open");
                detailContent.classList.add("open");

                btn.title = "收合表格";
                if (srText) srText.textContent = "收合表格";
            }
        });
    });
});
