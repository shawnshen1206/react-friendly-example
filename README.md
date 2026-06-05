# GufoFAQ 切版範本（React-friendly）

設計師切版的標準範本。照這個結構切版，工程師能把 HTML/CSS **幾乎原樣**搬進 React 專案——不重切、不來回確認。

## 為什麼

整頁式切版（HTML + jQuery + 一支大 SCSS）轉 React 時，最花時間的不是改語法，而是：重複區塊要逐頁比對、jQuery 套件整段重寫、巨型 CSS 無法拆分。

這個範本把「元件切分」提前到切版階段做完：

- **一個元件一個資料夾**（HTML 與 SCSS 同住），頁面只是元件的組合
- **樣式數值集中在 tokens**，互動只有一種宣告式寫法（`data-toggle`），零 jQuery
- 轉換時 HTML→JSX 是機械式替換，**CSS 原樣沿用**

## 怎麼執行

需要 [Node.js](https://nodejs.org/) 18 以上。第一次：

```bash
npm install
```

日常：

```bash
npm run dev      # 即時預覽 http://localhost:8080（含 SCSS 編譯、存檔自動重整）
npm run build    # 輸出純靜態 HTML 到 dist/（交付物，雙擊即開）
```

## 結構

```
src/_includes/
├── layouts/       整頁模板（page-shell = 一般頁外殼，選它 nav/footer 自動出現）
├── components/    大元件：會用到其他元件的組合區塊
└── ui/            小元件：不依賴其他元件的積木
```

範例頁（原版對照在上層資料夾的同名檔案）：

- `src/4-2_qaHistory_detail.html` — 表格、手風琴、彈窗
- `src/1-1-4_columnSelect_excel.html` — 步驟條、表單、錯誤狀態

## 規則

完整規範在 [GUIDELINE.md](GUIDELINE.md)（詳細版，AI 轉換時也以它為準）。
交付前跑一次 GUIDELINE 末尾的檢查清單。
