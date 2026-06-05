// 讓輸出檔名保持「4-2_qaHistory_detail.html」這種扁平格式，
// 而不是 Eleventy 預設的「4-2_qaHistory_detail/index.html」
export default {
    permalink: (data) => `${data.page.filePathStem}.html`,
};
