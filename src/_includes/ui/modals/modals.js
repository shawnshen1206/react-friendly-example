// modals 跳窗：開啟 / 關閉（含進出場動畫與背景捲動鎖定）
// （原 main.js 的寫法移植，dialog.showModal() / close() 是標準 DOM API）
// lockBodyScroll / unlockBodyScroll 也提供給其他元件使用（如 mobile-nav）

function lockBodyScroll() {
    const hasScrollbar = window.innerWidth > document.documentElement.clientWidth;

    if (hasScrollbar) {
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.overflow = "hidden";
        document.body.style.paddingRight = scrollbarWidth + "px";
    } else {
        document.body.style.overflow = "hidden";
    }
}

function unlockBodyScroll() {
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
}

function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;

    modal.classList.remove("hide");
    modal.classList.add("show");

    modal.showModal();
    lockBodyScroll();
}

function closeModal(modal) {
    if (!modal) return;

    modal.classList.remove("show");
    modal.classList.add("hide");
    unlockBodyScroll();

    // 等待動畫結束再關閉（時間和 CSS 動畫一致）
    setTimeout(function () {
        modal.close();
        modal.classList.remove("hide");
    }, 300);
}

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".modals").forEach(function (modal) {
        modal.addEventListener("click", function (e) {
            if (e.target.closest(".btn-close-modals")) {
                closeModal(modal);
            }
        });
    });
});
