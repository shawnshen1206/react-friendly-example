export default function (eleventyConfig) {
    // 靜態資源直接複製到 dist
    eleventyConfig.addPassthroughCopy({ "src/images": "images" });
    eleventyConfig.addPassthroughCopy({ "src/js": "js" });

    // sass 編譯出來的 CSS 變動時，自動重新整理瀏覽器
    eleventyConfig.setServerOptions({
        watch: ["dist/css/**/*.css"],
    });

    return {
        dir: {
            input: "src",
            output: "dist",
            includes: "_includes",
        },
        // 讓 .html 頁面可以使用 {% include %}、{% for %} 等語法
        htmlTemplateEngine: "njk",
    };
}
