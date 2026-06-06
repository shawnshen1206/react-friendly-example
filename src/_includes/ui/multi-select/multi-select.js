// 多選 tag 元件：把原生 <select multiple class="multiSelect"> 增強成標籤式多選
//（標籤可移除、下拉複選不關閉、搜尋過濾、placeholder）。
// 原生 <select> 仍是唯一資料來源——所有操作都寫回它的 option.selected 並觸發 change，
// 所以轉 React 時對應 react-select（isMulti），value 陣列＝原生 select 的選取。
//（取代原 main.js 的 select2；只用標準 DOM API，無 jQuery、無第三方）

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("select.multiSelect").forEach(function (select) {
        initMultiSelect(select);
    });
});

function initMultiSelect(select) {
    const placeholder = select.getAttribute("data-placeholder") || "請選擇";

    const container = document.createElement("div");
    container.className = "multi-select";

    const control = document.createElement("div");
    control.className = "multi-select-control";

    const search = document.createElement("input");
    search.type = "text";
    search.className = "multi-select-search";

    const dropdown = document.createElement("div");
    dropdown.className = "multi-select-dropdown";

    // 原生 select 留著當資料來源，隱藏起來；tag UI 疊在它前面
    select.classList.add("multi-select-native");
    select.parentNode.insertBefore(container, select);
    control.appendChild(search);
    container.appendChild(control);
    container.appendChild(dropdown);
    container.appendChild(select);

    // 標籤列：依原生 select 的 selectedOptions 重畫
    function renderTags() {
        control.querySelectorAll(".multi-select-tag").forEach(function (t) {
            t.remove();
        });

        const selected = Array.prototype.slice.call(select.selectedOptions);
        search.setAttribute("placeholder", selected.length ? "" : placeholder);

        selected.forEach(function (opt) {
            const tag = document.createElement("span");
            tag.className = "multi-select-tag";

            const label = document.createElement("span");
            label.textContent = opt.text;

            const remove = document.createElement("button");
            remove.type = "button";
            remove.className = "multi-select-tag-remove";
            remove.setAttribute("aria-label", "移除");
            remove.textContent = "×";
            remove.addEventListener("click", function (e) {
                e.stopPropagation();
                opt.selected = false;
                sync();
            });

            tag.appendChild(label);
            tag.appendChild(remove);
            control.insertBefore(tag, search);
        });
    }

    // 下拉選項：依搜尋字串過濾，已選的打勾
    function renderOptions() {
        const q = search.value.trim().toLowerCase();
        dropdown.innerHTML = "";

        const opts = Array.prototype.slice.call(select.options).filter(function (o) {
            return o.text.toLowerCase().indexOf(q) !== -1;
        });

        if (!opts.length) {
            const empty = document.createElement("div");
            empty.className = "multi-select-empty";
            empty.textContent = "無相符選項";
            dropdown.appendChild(empty);
            return;
        }

        opts.forEach(function (opt) {
            const item = document.createElement("div");
            item.className = "multi-select-option" + (opt.selected ? " selected" : "");
            item.textContent = opt.text;
            item.addEventListener("click", function () {
                opt.selected = !opt.selected;
                search.value = "";
                sync();
                search.focus();
            });
            dropdown.appendChild(item);
        });
    }

    // 寫回原生 select → 觸發 change → 重畫
    function sync() {
        select.dispatchEvent(new Event("change", { bubbles: true }));
        renderTags();
        renderOptions();
    }

    function open() {
        container.classList.add("open");
        renderOptions();
    }

    function close() {
        container.classList.remove("open");
        search.value = "";
        renderOptions();
    }

    control.addEventListener("click", function () {
        open();
        search.focus();
    });

    search.addEventListener("input", function () {
        open();
        renderOptions();
    });

    search.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
            close();
        } else if (e.key === "Enter") {
            e.preventDefault();
            const first = dropdown.querySelector(".multi-select-option:not(.selected)");
            if (first) first.click();
        } else if (e.key === "Backspace" && search.value === "") {
            const selected = Array.prototype.slice.call(select.selectedOptions);
            if (selected.length) {
                selected[selected.length - 1].selected = false;
                sync();
            }
        }
    });

    document.addEventListener("click", function (e) {
        if (!container.contains(e.target)) close();
    });

    renderTags();
}
