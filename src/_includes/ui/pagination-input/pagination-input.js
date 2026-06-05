// pagination-input（輸入版分頁）：上一頁 / 下一頁、手動輸入頁碼
// （原 main.js 的 jQuery 寫法移植成標準 DOM API）

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".pagination-input").forEach(function (pager) {
        const total = Number(pager.dataset.total) || 1;
        const inputPage = pager.querySelector(".pager-input");
        const totalPage = pager.querySelector(".total");
        const prevBtn = pager.querySelector(".prev");
        const nextBtn = pager.querySelector(".next");
        const prevImg = prevBtn.querySelector("img");
        const nextImg = nextBtn.querySelector("img");

        // 自動填入總對話數
        totalPage.textContent = total;

        // 更新頁面狀態
        function updatePage(page) {
            page = parseInt(page, 10);
            if (isNaN(page) || page < 1) page = 1;
            if (page > total) page = total;

            inputPage.value = page;

            // 左箭頭
            if (page === 1) {
                prevBtn.disabled = true;
                prevImg.src = "./images/icon_arrow_left_gray.png";
            } else {
                prevBtn.disabled = false;
                prevImg.src = "./images/icon_arrow_left_blue.png";
            }

            // 右箭頭
            if (page === total) {
                nextBtn.disabled = true;
                nextImg.src = "./images/icon_arrow_right_gray.png";
            } else {
                nextBtn.disabled = false;
                nextImg.src = "./images/icon_arrow_right_blue.png";
            }
        }

        // 初始設定
        updatePage(Number(inputPage.value));

        // 上一頁 / 下一頁
        prevBtn.addEventListener("click", function () {
            updatePage(Number(inputPage.value) - 1);
        });
        nextBtn.addEventListener("click", function () {
            updatePage(Number(inputPage.value) + 1);
        });

        // 手動輸入僅允許數字
        inputPage.addEventListener("input", function () {
            inputPage.value = inputPage.value.replace(/[^\d]/g, "");
        });

        // blur / Enter 時確認頁碼
        function handleInputUpdate() {
            let val = inputPage.value.trim();
            if (val === "" || isNaN(val)) {
                val = 1;
                inputPage.value = val;
            }
            updatePage(val);
        }

        inputPage.addEventListener("blur", handleInputUpdate);
        inputPage.addEventListener("keydown", function (e) {
            if (e.key === "Enter") handleInputUpdate();
        });
    });
});
