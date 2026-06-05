# 切版規範（規格書）

本文件是這個專案的**規範**：定義檔案結構、命名、語法白名單、各層級的規則，以及與 React 的對應關係。
適用對象：產生或修改本專案程式碼的人與 AI，以及將本專案轉換成 React 的人與 AI。
兩個範例頁（`src/4-2_qaHistory_detail.html`、`src/1-1-4_columnSelect_excel.html`）是本規範的標準實作，規則與範例衝突時以本文件為準。
執行方式見 [README.md](README.md)。

---

## 1. 檔案結構

```
react-friendly-example/
├── src/
│   ├── _includes/
│   │   ├── layouts/                   ← 整頁模板（只放模板，不放元件）
│   │   │   ├── base.html              ←   空白外框：<head> + 全頁框架
│   │   │   ├── page-shell.html        ←   一般頁外殼：nav + main 容器 + footer
│   │   │   └── _layout.scss           ←   骨架樣式（.app-layout、.wrap、.stack）
│   │   ├── components/                ← 大元件：會用到其他元件的組合區塊
│   │   │   └── <元件名>/              ←   一個元件 = 一個資料夾
│   │   │       ├── <元件名>.html      ←     元件 HTML（唯一正本）
│   │   │       ├── <子元件>.html      ←     子元件放同資料夾
│   │   │       └── _<元件名>.scss     ←     元件樣式
│   │   └── ui/                        ← 小元件：不依賴其他元件的積木
│   ├── scss/                          ← 只放非 UI 的基礎建設
│   │   ├── _tokens.scss               ←   所有顏色/間距/字級/圓角/陰影變數
│   │   ├── _base.scss                 ←   reset、HTML 標籤預設樣式
│   │   ├── _utilities.scss            ←   工具 class（.mt-4 等）
│   │   └── main.scss                  ←   只放 @use 組裝清單，不寫樣式
│   ├── js/main.js                     ← 全站唯一的 JS（data-toggle 引擎，不可增寫邏輯）
│   ├── images/
│   └── <頁面>.html                    ← 頁面 = 選 layout + 元件組合
└── dist/                              ← build 輸出（不可手動編輯）
```

### 1-1. 放置規則（三個桶，單一判斷軸）

| 桶 | 判斷句 | 例 |
|---|---|---|
| `layouts/` | 是整頁的**模板**嗎？（無實體） | base、page-shell |
| `components/` | 它的 html/scss **會用到其他元件**嗎？（大） | app-header、sources-table |
| `ui/` | **不依賴任何其他元件**的最小單位？（小） | button、modal、tag-select |

判斷方式：打開該元件的 html/scss，**有**引用其他元件的 class 或 include → `components/`；**沒有** → `ui/`。

### 1-2. 樣式放置規則

- 有 UI 身分的樣式（對應到一個可指認的元件）→ 住元件資料夾，與 html 同住
- `scss/` 只放：tokens（變數）、base（標籤預設）、utilities（跨元件工具 class）
- 元件可以只有 html（如 qa-detail-info）或只有 scss（如 button）；有 scss 就必須在 `main.scss` 對應分組加一行 `@use`

### 1-3. 其他結構規則

- 同一個元件絕不複製貼上；要用就 include，修改只改它資料夾裡的那一份
- 誰的按鈕開的彈窗，彈窗就 include 在誰裡面（例：app-footer 內含 disclaimer-modal）
- 元件根節點必須掛 `.元件名` class，即使該元件沒有自己的樣式

---

## 2. 模板語法白名單

全專案**只允許**以下 4 個模板語法，其他（macro、filter、shortcode、自訂 data 檔等）一律禁止：

| 語法 | 用途 | React 對應 |
|---|---|---|
| front matter（檔首兩條 `---` 之間的 YAML） | 頁面設定（layout、title、permalink）與頁面資料 | props / API 資料 |
| `{% include "桶/元件/檔.html" %}` | 引入元件 | `<Component />` |
| `{% set 名 = 值 %}` | include 前傳參數 | props |
| `{% for x in 清單 %}…{% endfor %}`（搭配 `{% if %}`） | 渲染重複結構 | `.map()` |

例外：`layouts/` 內的 `{{ content | safe }}` 是固定管線（頁面內容的注入點），不需修改。

`{% set %}` 的變數在 include 後**不會消失**（整頁共用）：同頁第二次使用同元件必須重新 set 全部參數；不同元件的參數名不可相同。

---

## 3. 頁面規則

頁面檔（`src/*.html`）只做三件事：front matter、include 元件、一次性版面。

### 3-1. front matter 必填欄位

```yaml
---
layout: layouts/page-shell.html        # 或 layouts/base.html
title: GufoFAQ::頁面標題
permalink: 檔名.html                   # 輸出到 dist/ 的檔名
# （頁面資料寫在這之後）
---
```

| layout | 自動提供 | 適用 |
|---|---|---|
| `layouts/page-shell.html` | `<head>` + nav + main 容器（.wrap.stack）+ footer | 一般頁面 |
| `layouts/base.html` | 只有 `<head>` + 空白外框 | 特殊版型（如登入頁） |

### 3-2. 內容區規則

- 區塊順序 = include 的行序；調整版面 = 調整行序
- 重複資料（表格列、卡片）寫在 front matter，元件用 `{% for %}` 渲染；範例資料放 2~3 筆即可
- 一次性版面（不重複出現的排列）直接寫在頁面，用標記包住：

```html
{# ===== Section: 區塊名 ===== #}
...
{# ===== /Section ===== #}
```

### 3-3. 什麼該切成元件

1. 出現在 2 頁以上 → 切
2. 同一頁內重複出現 → 切（轉換後是 `.map()`）
3. 會開／關、顯示／隱藏 → 切（轉換後綁 state）
4. 一次性版面 → 不切，用 Section 標記

---

## 4. HTML 規則

- 重複結構的迴圈處標記 `{# @repeat: 說明 #}`（轉換時 = `.map()` 的位置）
- 元件狀態一律用 `is-` 前綴 class：`is-open`、`is-done`、`is-error`、`is-active`、`is-disabled`（轉換後 = React state）
- 每頁恰好一個 `<h1>`（頁面主標題）；logo 不用 h1
- 無障礙：互動觸發鈕宣告 `aria-expanded`；彈窗用 `role="dialog" aria-modal="true" aria-labelledby`；麵包屑目前頁用 `aria-current="page"`

### 禁止

- ❌ 行內 style（`style="..."`）→ 用 utilities class，缺的去 `_utilities.scss` 加
- ❌ 元件根節點自帶外距（如根節點掛 `mt-6`）→ 區塊間距由頁面的 `.stack` 容器控制
- ❌ 行內事件（`onclick="..."`）→ 用 `data-toggle` / `data-action`
- ❌ jQuery 與任何 jQuery 套件（下拉選單用 CSS hover；複雜互動元件交付靜態外觀，見 §6）
- ❌ 同一元件在兩處的 markup 不一致

---

## 5. CSS / SCSS 規則

### 5-1. tokens

- 顏色、字級、圓角、陰影**一律**用 `_tokens.scss` 變數；禁止裸色碼（含 `#fff`，用 `var(--color-surface)` / `var(--color-text-inverse)`）
- 版面層級間距（區塊 margin、gap、容器 padding）必須用 `--space-*`；元件內部貼合視覺稿的精細 padding 允許 rem 直寫
- 新數值先加進 `_tokens.scss` 再使用
- tokens 命名對齊 Tailwind 慣例（`--space-4` = `p-4` = 1rem）

### 5-2. 命名（BEM-lite）

```
.元件名            元件根節點        .source-row
.元件名__子元素    內部元素          .source-row__toggle
.元件名--變體      外觀變體          .button--green   （= variant prop）
.is-狀態           狀態              .is-open         （= state）
```

### 5-3. 選擇器

- 深度上限 2 層：最多「狀態 + 一層子元素」（`.source-row.is-open .source-row__detail` ✅；`.app-main .block table tr td span` ❌）
- A 元件的 scss 禁止出現 B 元件的 class；組合樣式用多 class（`class="sources-table__body data-table__scroll"`）
- 元件造成的全域效果寫在該元件的 scss（例：`body:has(.modal.is-open){overflow:hidden}` 在 `_modal.scss`）
- 例外：`.rich-text` 內允許標籤選擇器（h3、p、ul），因為內容由 markdown renderer 動態輸出

### 5-4. 禁用

`!important`、ID 選擇器、依頁面覆寫元件（`.page-xxx .button {...}`）

---

## 6. JS 規則

設計階段不寫 JS。所有開／關互動用屬性宣告，由 `js/main.js`（不可修改）統一處理：

| 屬性 | 行為 | 用於 |
|---|---|---|
| `data-toggle="#某id"` | 切換目標的 `is-open`；同目標的所有觸發鈕同步 `aria-expanded` | 彈窗、手機選單（頁面唯一目標） |
| `data-toggle="closest:.某class"` | 往上找最近目標、切換 `is-open` | 手風琴列、子選單（重複元件） |
| `data-action="print"` | 列印本頁 | 列印按鈕 |

開／關的外觀差異全部寫在 CSS 的 `.is-open` 規則。

**複雜互動**（多選下拉、日期選擇、表單驗證、載入中、Esc 關閉、focus trap…）不在切版範圍：
只交付各狀態的**靜態外觀**（例：`ui/tag-select` 是 select2 類多選框的外觀 mockup；disabled 直接寫 `disabled` 屬性），行為由 React 實作。

---

## 7. 元件使用一覽

### 需要參數的元件

| 元件 | 參數 |
|---|---|
| `ui/breadcrumb` | include 前 `{% set breadcrumbItems = [{ label, href }] %}`；最後一項不給 `href` = 目前頁 |
| `ui/detail-pager` | include 前 set `pagerCurrent`、`pagerTotal`、`pagerItemName`（選填，如 `"對話"`） |
| `components/step-nav` | front matter `steps:`（`label`、`done`）；include 前 set `stepPrevHref`、`stepNextHref` |
| `components/column-mapping` | front matter `fields:`（`label`、`placeholder`、`selected` 陣列、`preview`、`error` 選填） |
| `components/sources-table` | front matter `sources:`（`no`、`file`、`dataset`、`title`、`time`、`content`、`note1`、`note2`、`reference`） |
| `components/qa-detail-info` | front matter `conversation:`（`chatroomId`、`id`、`time`、`intent`、`userMessage`、`satisfaction`、`feedback`） |

### 自動引入

`app-header`、`app-footer`（內含 disclaimer-modal）由 `page-shell` 提供，頁面不需 include。

### 純樣式元件（直接寫 class）

`button`、`block`、`modal`、`data-table`、`form-table`、`form-field`、`tag-select`、`text-input`、`link-file`、`page-title-bar`、`rich-text`。
結構以兩個範例頁為準；狀態用 `is-*`（如 `text-input is-error`）。

---

## 8. React 轉換對照

| 本專案 | React |
|---|---|
| `layouts/page-shell.html` | route layout（Next.js `layout.tsx`、React Router `<Outlet />` 外層） |
| `components/xxx/` | `src/components/Xxx/`（`Xxx.tsx` + 同名 scss） |
| `ui/xxx/` | `src/ui/Xxx/` |
| 元件的 `_xxx.scss` | **原樣複製**到元件旁 `import './xxx.scss'`，不改寫 |
| `{% include %}` | `<Xxx />` |
| `{% set xxx %}` | props |
| front matter 資料 + `{% for %}` | `data.map(item => <Row item={item} />)` |
| `is-*` class | `useState` 布林（`className={isOpen ? "x is-open" : "x"}`） |
| `data-toggle` 按鈕 | `onClick={() => setOpen(!open)}` |
| `.button--green` 變體 | `variant="green"` prop |
| `{# @repeat #}` 標記 | `.map()` 的位置 |
| `{# Section #}` 標記 | 頁面內的一次性 JSX 區塊（不抽元件） |
| `_tokens.scss`、`_base.scss` 等全域樣式 | 進入點引入一次，元件照用 `var(--...)` |
| `.rich-text` | markdown renderer 容器 class，樣式原樣沿用 |
| `ui/tag-select` 靜態外觀 | react-select 等多選套件（套用此外觀） |

HTML → JSX 為機械式替換：`class`→`className`、標籤自閉合、`{# #}`→`{/* */}`。
CSS 不需任何翻譯：交付的樣式即正式環境的最終樣式。

---

## 9. 交付前檢查清單

- [ ] `npm run build` 成功；`dist/` 每一頁雙擊可開、外觀正確
- [ ] 全域搜尋 `style="` = 0 筆；無 jQuery 或任何 jQuery 套件
- [ ] 重複區塊都是 include；重複列／卡片用 `{% for %}` + front matter 資料（示意 2~3 筆）
- [ ] 新顏色／間距都定義在 `_tokens.scss`；無裸色碼
- [ ] 每個新元件一個資料夾（有結構就有 html、有樣式就有 scss）；有 scss 就在 `main.scss` 加 `@use`
- [ ] 放對桶：整頁模板 → `layouts/`；會用到其他元件 → `components/`；零依賴積木 → `ui/`
- [ ] 元件根節點掛 `.元件名`、不自帶外距
- [ ] 開關互動只用 `data-toggle`；狀態 class 只用 `is-*`
- [ ] 只用了 §2 白名單內的模板語法

---

## 10. Dos & Don'ts

```html
<!-- ❌ 每頁貼一份 header -->
<header class="header">...170 行...</header>

<!-- ✅ page-shell 自動提供；其他元件用 include -->
{% include "components/sources-table/sources-table.html" %}
```

```html
<!-- ❌ 表格列複製 16 次 -->
<tr>...</tr><tr class="detail-row">...</tr>
<!-- ……× 16 -->

<!-- ✅ 資料 + 迴圈，示意 3 筆 -->
{# @repeat: 參考來源列 #}
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
<!-- ❌ jQuery 切換 --> $(".accordion-btn").on("click", function () { $(this).toggleClass("open"); });
<!-- ✅ 宣告式 --> <button data-toggle="closest:.source-row">展開</button>
```
