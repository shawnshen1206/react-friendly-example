# GufoFAQ 切版規範：React-friendly 寫法

> 給設計師團隊：照這份規範交付，工程師就能把你們的切版「機械式」轉成 React，
> 不需要來回確認、不需要重切。
> 對照範例：本資料夾的 `4-2_qaHistory_detail.html` 與 `1-1-4_columnSelect_excel.html`
>（原版在上層資料夾的同名檔案）。

---

## 1. 為什麼要改？

我們的正式系統是 React 開發。過去的切版（整頁 HTML + jQuery + 一支大 SCSS）轉換時最花時間的是：

| 過去的做法 | 轉 React 時的痛點 |
|---|---|
| header/nav 每一頁複製貼上 | 工程師要逐頁比對哪些區塊是同一個東西、有沒有微妙差異 |
| 同一頁裡重複的列複製 16 次 | 原版 4-2 頁有 **68% 的行數**是同一段 markup 貼 16 次 |
| jQuery 套件（superfish/select2/flatpickr） | React 不能用，整段互動要重寫 |
| 一支 66KB 的 component.scss | 無法判斷哪段 CSS 屬於哪個元件、能不能刪 |
| 行內 `style="margin-top: 16px"` | 散落各處，轉換時最容易漏掉 |

新規範的核心只有一句話：**用「元件」思考——每個元件一個資料夾，頁面是元件的組合。**

---

## 2. 快速開始

只需要做一次的環境準備：

1. 安裝 [Node.js](https://nodejs.org/)（LTS 版本，18 以上）
2. 在本資料夾開終端機，執行 `npm install`

日常工作流程：

```bash
npm run dev      # 啟動預覽（瀏覽器開 http://localhost:8080），存檔自動重新整理
npm run build    # 交付前執行：輸出純靜態 HTML 到 dist/，雙擊就能開
```

`npm run dev` 同時包含 SCSS 編譯，**取代原本的 SCSS 編譯流程**。
交付物 = 整個專案資料夾（驗收時看 `dist/`）。

---

## 3. 檔案結構

```
react-friendly-example/
├── src/
│   ├── _includes/
│   │   ├── layouts/                   ← ★ 整頁模板（沒有實體，只放模板）
│   │   │   ├── base.html              ←   空白外框：<head> + 全頁框架
│   │   │   ├── page-shell.html        ←   一般頁外殼：選它 = nav/footer 自動出現
│   │   │   └── _layout.scss           ←   骨架樣式（.app-layout、.wrap、.stack）
│   │   ├── components/                ← ★ 大元件：會用到其他元件的組合區塊
│   │   │   ├── app-header/            ←   一個元件 = 一個資料夾
│   │   │   │   ├── app-header.html    ←     元件的 HTML（唯一正本）
│   │   │   │   ├── main-nav.html      ←     子元件可放同資料夾（桌機選單）
│   │   │   │   ├── mobile-nav.html    ←     子元件（手機選單）
│   │   │   │   └── _app-header.scss   ←     元件的樣式（子元件可有自己的 scss）
│   │   │   ├── app-footer/            ←   內含 disclaimer-modal（誰的彈窗跟誰住）
│   │   │   ├── disclaimer-modal/
│   │   │   ├── qa-detail-info/
│   │   │   └── sources-table/
│   │   └── ui/                        ← ★ 小元件：不依賴其他元件的積木
│   │       ├── button/  modal/  data-table/  form-table/
│   │       └── breadcrumb/  detail-pager/  block/  page-title-bar/  rich-text/  link-file/
│   ├── scss/                          ← 只放「非 UI 的基礎建設」
│   │   ├── _tokens.scss               ← ★ 所有顏色/間距/字級變數
│   │   ├── _base.scss                 ← reset、HTML 標籤預設樣式
│   │   ├── _utilities.scss            ← 工具 class（.mt-4 等，取代行內 style）
│   │   └── main.scss                  ← 只負責 @use 組裝，不寫樣式
│   ├── js/main.js                     ← 全站唯一的 JS，設計師不需要改
│   ├── images/
│   └── 4-2_qaHistory_detail.html      ← 頁面 = 元件的組合
└── dist/                              ← build 輸出（不要手動編輯）
```

**樣式放哪裡的判斷標準**：有「UI 身分」的樣式（你能在設計稿上指著它說「這是一個 XX」）
住在元件資料夾，跟 html 同住；`scss/` 只放非 UI 的基礎建設——
變數（tokens）、HTML 標籤預設（base）、跨元件的工具積木（utilities）。

**這個結構就是 React 專案的形狀**：
- `layouts/page-shell.html` → React 的 route layout（Next.js `layout.tsx`）
- `components/sources-table/` → React 的 `src/components/SourcesTable/`
- `ui/button/` → React 的 `src/ui/Button/`

**東西該放哪裡？三個桶，各用一句話判斷：**

| 桶 | 判斷句 | 例子 |
|---|---|---|
| `layouts/` | 「它是整頁的**模板**嗎？」（沒有實體，只有模板） | base、page-shell |
| `components/` | 「它**會用到其他元件**嗎？」（大：組合區塊） | header、footer、參考來源表格、對話資訊區 |
| `ui/` | 「它是**不依賴任何元件**的最小單位嗎？」（小：積木） | button、modal、表格基底、麵包屑 |

分不出來的時候看一件事就好：**打開它的 html/scss，裡面有沒有用到別的元件**——
有 → `components/`；沒有 → `ui/`。

---

## 4. 核心觀念：什麼該切成元件？

四條判斷規則：

1. **出現在 2 頁以上** → 切。（header、footer、breadcrumb、modal）
2. **同一頁內重複出現** → 切。（表格列、卡片、選單項目——在 React 會變成迴圈）
3. **會開／關、顯示／隱藏的區塊** → 切。（modal、手風琴、下拉選單——在 React 會綁定狀態）
4. **一次性的版面排列** → 不切。直接寫在頁面檔，用註解標記區塊名稱即可：
   ```html
   {# ===== Section: PageTitleBar（一次性版面，不抽元件） ===== #}
   ```

範例頁 4-2 的切分結果：

| 層級 | 放哪裡 | 內容 | 對應 React |
|---|---|---|---|
| 整頁模板 | `layouts/` | base.html、page-shell.html、\_layout.scss（.app-layout、.wrap、.stack） | `<AppLayout>`、route layout（`layout.tsx`） |
| 大元件 | `components/` | app-header（內含 main-nav、mobile-nav 子元件）、app-footer（內含 disclaimer-modal）、qa-detail-info、sources-table（含 source-accordion-row） | `<AppHeader />`、`<SourcesTable sources>` 等 |
| 小元件 | `ui/` | button、modal、data-table、detail-pager、form-table、breadcrumb、block、page-title-bar、rich-text、link-file | `<Button variant>` 等 |

---

## 5. HTML 規則

### 5-0. Eleventy 你只需要會 4 個語法

整套規範用到的模板語法就只有下面 4 個，**其他語法一律不用、也不准用**
（macro、filter、shortcode、自訂 data 檔等進階功能都禁止——
讓任何人打開任何檔案都能看懂）：

| 語法 | 意思 | 對應 React |
|---|---|---|
| 檔案開頭兩條 `---` 之間（front matter） | 這一頁的設定與資料：選 layout、標題、輸出檔名、頁面資料 | props / API 資料 |
| `{% include "資料夾/元件.html" %}` | 把元件放進來 | `<Component />` |
| `{% set 名字 = 值 %}` | 在 include 前傳參數給元件 | props |
| `{% for 項目 in 清單 %}…{% endfor %}` | 清單裡每一筆都渲染一次（搭配 `{% if %}` 做條件顯示） | `.map()` |

唯一的例外是 `layouts/` 裡的固定寫法（`{{ content | safe }}`），
那是模板的水電管線，已經寫好、有註解，不需要動也不需要懂。

### 5-1. 頁面 = 選一個 layout + 中間內容的組合

每個 `.html` 頁面開頭是 front matter（兩條 `---` 之間），第一件事是**選 layout**：

| layout | 自動提供 | 用在 |
|---|---|---|
| `layouts/page-shell.html` | `<head>` + nav + main 容器 + footer | 一般頁面（絕大多數） |
| `layouts/base.html` | 只有 `<head>` + 空白外框 | 特殊版型（如登入頁） |

選了 page-shell，頁面只需要寫「中間的內容」：

```html
---
layout: layouts/page-shell.html
title: GufoFAQ::對話詳細內容
---
{% include "ui/breadcrumb/breadcrumb.html" %}

<div class="page-title-bar">...</div>

{% include "components/qa-detail-info/qa-detail-info.html" %}
```

**同一個元件絕對不要複製貼上**——要用就 include。改元件只改它資料夾裡的那一份。

**中間內容的區塊順序由頁面檔決定**：排列就是 include 的行序。
順序不同 → 調整行序；新區塊 → 加一行 include 或寫 Section；
整頁版型都不同（如登入頁）→ 改用 `layouts/base.html` 自己排。

### 5-2. 元件參數（= React 的 props）

元件裡會變動的文字／資料，用 `{% set %}` 在 include 前傳入：

```html
{% set breadcrumbItems = [
    { label: "首頁", href: "#" },
    { label: "檢視對話詳細內容" }
] %}
{% include "ui/breadcrumb/breadcrumb.html" %}
```

工程師看到 `{% set %}` 就知道：這些是 `<Breadcrumb items={...} />` 的 props。

> ⚠️ **注意**：`{% set %}` 的變數在 include 之後**不會消失**（整頁共用）。
> 同一頁第二次使用同一個元件時，必須**重新 set 全部 props**，否則會吃到上一次的值；
> 不同元件的 props 也要避免取同樣的名字。
> （進階：Nunjucks 的 `{% macro %}` 是真正函式式的 props，等團隊熟練後可以升級。）

### 5-3. 重複資料用迴圈（= React 的 .map()）

清單、表格列這種重複結構：資料寫在頁面 front matter，元件只寫一次，用 `{% for %}` 渲染。
**示意 2~3 筆即可**，不要貼 16 筆：

```html
{# @repeat: 參考來源列 #}
{% for source in sources %}
{% include "components/sources-table/source-accordion-row.html" %}
{% endfor %}
```

### 5-4. 狀態用 `is-*` class 表達

元件的「狀態」一律用 `is-` 開頭的 class：`is-open`、`is-active`、`is-disabled`、`is-error`。
工程師看到 `is-*` 就知道：這會變成一個 React state。

開／關的樣式寫在 CSS：

```css
.source-row__detail { display: none; }
.source-row.is-open .source-row__detail { display: table-row; }
```

### 5-5. 互動用 `data-toggle` 宣告，不寫 JS

見第 7 節。

### 5-6. 禁止事項

- ❌ 行內 style：`style="margin-top: 16px"` → ✅ 用工具 class `class="mt-4"`（沒有的去 `_utilities.scss` 加）
- ❌ 元件**根節點**自帶外距（`<section class="block mt-6">`）→ ✅ 區塊間距由頁面的 `.stack` 容器統一控制。「跟上面隔多遠」是頁面的責任，不是元件的責任——元件自帶外距，換一頁用間距就錯
- ❌ A 元件的按鈕指向「要頁面自己記得 include 的 B 元件」→ ✅ 誰的按鈕開的彈窗，彈窗就 include 在誰裡面（例：app-footer 內含 disclaimer-modal，頁面只 include footer 就好）
- ❌ 行內事件：`onclick="..."` → ✅ 用 `data-toggle` / `data-action`
- ❌ jQuery 與任何 jQuery 套件（superfish、select2 一律不用；下拉選單用 CSS hover，見 app-header）
- ❌ 同一個元件在兩處 markup 不一致

---

## 6. CSS / SCSS 規則

### 6-1. 數值一律用 tokens

**顏色、字級、圓角、陰影一律用 `_tokens.scss` 的變數**，元件裡禁止出現裸色碼
（連 `#fff` 也是——用 `var(--color-surface)` / `var(--color-text-inverse)`）：

```scss
/* ❌ */  padding: 16px; color: #168ed1; background-color: #fff;
/* ✅ */  padding: var(--space-4); color: var(--color-primary); background-color: var(--color-surface);
```

**間距的規則**：版面層級的間距（區塊 margin、gap、容器 padding）必須用 `--space-*`；
元件**內部**為了貼合視覺稿的精細 padding（如 `0.5625rem`）允許用 rem 直寫。

需要新數值？先去 `_tokens.scss` 加變數。
（工程師備註：轉換時 `_tokens.scss` 整份直接帶進 React 專案，元件 CSS 原樣沿用。tokens 命名已對齊 Tailwind 慣例（`--space-4` = `p-4`），未來若導入 Tailwind 可直接對應，但不是必要條件。）

### 6-2. 一個元件一支 SCSS

元件樣式寫在自己資料夾的 `_元件名.scss`，並在 `scss/main.scss` 加一行 `@use`。
**A 元件的 scss 裡禁止出現 B 元件的 class**（例如在 `_sources-table.scss` 裡改 `.button` 的樣子）。

### 6-3. 命名：BEM-lite

```
.元件名              → 元件根節點     .source-row
.元件名__子元素      → 內部元素       .source-row__toggle
.元件名--變體        → 外觀變體       .button--green（= React 的 variant prop）
.is-狀態             → 狀態           .is-open（= React 的 state）
```

### 6-4. 選擇器深度上限：2 層

每條規則最多「狀態 + 一層子元素」：

```scss
/* ✅ 允許 */  .source-row.is-open .source-row__detail { ... }
/* ❌ 禁止 */  .app-main .block table tr td span { ... }
```

原因：深層選擇器會讓樣式依附「頁面情境」，元件搬進 React 後只要換個位置就壞；扁平規則保證每個元件的 CSS 只依賴元件自己，整支檔案可以原樣搬走。

例外：`.rich-text` 內允許用標籤選擇器（h3、p、ul），因為那是動態渲染的長文內容。

### 6-5. 禁用清單

`!important`、ID 選擇器、依頁面覆寫元件（`.page-xxx .button {...}`）。

---

## 7. JS 規則：設計師不寫 JS

所有「開／關」互動用 HTML 屬性宣告，`js/main.js` 已經寫好，不需要動：

| 寫法 | 行為 | 用在 |
|---|---|---|
| `data-toggle="#某id"` | 切換目標的 `is-open` | modal、手機選單（頁面唯一的元素） |
| `data-toggle="closest:.某class"` | 往上找最近目標、切換 `is-open` | 手風琴列、子選單（會重複的元件） |
| `data-action="print"` | 列印本頁 | 列印按鈕 |

```html
<button data-toggle="#disclaimer-modal">免責聲明</button>
<button data-toggle="closest:.source-row">展開</button>
```

更複雜的互動（表單驗證、載入中、換頁）**不在切版範圍**：
提供各狀態的「靜態外觀」即可（例如 disabled 的按鈕直接寫 `disabled` 屬性），行為由工程師實作。

---

## 8. Dos & Don'ts 速查

```html
<!-- ❌ 每頁貼一份 header -->
<header class="header">...170 行...</header>

<!-- ✅ include -->
{% include "components/app-header/app-header.html" %}
```

```html
<!-- ❌ 表格列複製 16 次 -->
<tr>...</tr><tr class="detail-row">...</tr>
<tr>...</tr><tr class="detail-row">...</tr>
<!-- ……× 16 -->

<!-- ✅ 資料 + 迴圈，示意 3 筆 -->
{% for source in sources %}
{% include "components/sources-table/source-accordion-row.html" %}
{% endfor %}
```

```html
<!-- ❌ --> <div class="block" style="margin-top: 16px;">
<!-- ✅ --> <div class="block mt-4">
```

```scss
/* ❌ */ .sources-block .table-container table tbody tr td a { color: #168ed1; }
/* ✅ */ .link-file { color: var(--color-primary); }
```

```html
<!-- ❌ jQuery 切換 --> $(".accordion-btn").on("click", function () { $(this).toggleClass("open"); ... });
<!-- ✅ 宣告式 --> <button data-toggle="closest:.source-row">展開</button>
```

---

## 9. 交付前檢查清單

- [ ] `npm run build` 成功，`dist/` 裡每一頁雙擊可開、外觀正確
- [ ] 沒有任何 `style="..."` 行內樣式（編輯器全域搜尋 `style="`）
- [ ] 沒有引用 jQuery 或任何 jQuery 套件
- [ ] 重複區塊都是 include，沒有複製貼上的元件
- [ ] 重複的列／卡片用 `{% for %}` + front matter 資料，示意 2~3 筆
- [ ] 新增的顏色／間距都定義在 `_tokens.scss`
- [ ] 每個新元件一個資料夾：有結構就有 html、有樣式就有 scss（兩者至少一個）；有 scss 就在 `main.scss` 加 `@use`
- [ ] 放對位置：整頁模板 → `layouts/`；會用到其他元件的大元件 → `components/`；不依賴任何元件的積木 → `ui/`
- [ ] 開關類互動只用 `data-toggle`，狀態 class 只用 `is-*`

---

## 10. 給工程師：轉換對照表

| 切版概念 | React 對應 |
|---|---|
| `layouts/page-shell.html` | route layout（Next.js 的 `layout.tsx`、React Router 的 `<Outlet />` 外層） |
| `components/xxx/` 資料夾 | `src/components/Xxx/`（`Xxx.tsx` + 同名 scss） |
| `ui/xxx/` 資料夾 | `src/ui/Xxx/` |
| 元件的 `_xxx.scss` | **原樣複製**到元件旁，`import './xxx.scss'`，不需改寫 |
| `{% include %}` | `<Xxx />` |
| `{% set xxx = ... %}` | props |
| front matter 資料 + `{% for %}` | `data.map(item => <Row item={item} />)` |
| `is-open` 等 `is-*` class | `useState` 布林值（`className={isOpen ? "source-row is-open" : "source-row"}`） |
| `data-toggle` 按鈕 | `onClick={() => setOpen(!open)}` |
| `.button--green` 變體 class | `variant="green"` prop |
| `_tokens.scss` / `_base.scss` 等全域樣式 | 全域引入一次（如 `index.css`），元件照常使用 `var(--...)` |
| `.rich-text` | markdown renderer 容器 class，樣式原樣沿用 |

HTML → JSX 是機械式替換（`class`→`className`、自閉合標籤、`{# #}`→`{/* */}`），
CSS 不需要任何翻譯——設計師交付的樣式就是正式環境的最終樣式。
