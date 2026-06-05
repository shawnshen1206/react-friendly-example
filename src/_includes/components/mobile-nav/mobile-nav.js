// 手機選單：開關、子選單展開、開啟時鎖定背景捲動
// （原 main.js 的 jQuery 寫法移植成標準 DOM API；
//   lockBodyScroll / unlockBodyScroll 來自 ui/modals/modals.js）

document.addEventListener("DOMContentLoaded", function () {
    const navToggle = document.querySelector(".nav-toggle");
    const menuWrap = document.querySelector(".mobile-menu-wrap");
    const overlay = document.querySelector(".mobile-nav .overlay");

    if (!navToggle || !menuWrap) return;

    // 漢堡按鈕：開關選單
    navToggle.addEventListener("click", function () {
        navToggle.classList.toggle("active");

        if (navToggle.classList.contains("active")) {
            menuWrap.classList.add("open");
            overlay.classList.add("active");
            lockBodyScroll();
        } else {
            menuWrap.classList.remove("open");
            overlay.classList.remove("active");
            unlockBodyScroll();
        }
    });

    // 子選單展開
    document.querySelectorAll(".mobile-menu .dropdown").forEach(function (dropdown) {
        dropdown.addEventListener("click", function (e) {
            e.preventDefault();
            const submenu = dropdown.nextElementSibling;
            if (submenu) {
                submenu.classList.toggle("open");
            }
        });
    });
});
