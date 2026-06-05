// footer 的「免責聲明」按鈕：開啟免責聲明跳窗
// （openModal 定義在 ui/modals/modals.js）

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".footer .link-modal").forEach(function (btn) {
        btn.addEventListener("click", function () {
            openModal("disclaimerModal");
        });
    });
});
