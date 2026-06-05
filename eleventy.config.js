export default function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy({ "src/images": "images" });

    // 元件的 JS：跟元件住在一起，這裡登記輸出位置（base.html 也要加一行 script）
    eleventyConfig.addPassthroughCopy({
        "src/_includes/ui/modals/modals.js": "js/modals.js",
        "src/_includes/components/footer/footer.js": "js/footer.js",
        "src/_includes/components/mobile-nav/mobile-nav.js": "js/mobile-nav.js",
        "src/_includes/ui/accordion/accordion.js": "js/accordion.js",
        "src/_includes/ui/pagination-input/pagination-input.js": "js/pagination-input.js",
    });

    eleventyConfig.setServerOptions({
        watch: ["dist/css/**/*.css"],
    });

    return {
        dir: {
            input: "src",
            output: "dist",
            includes: "_includes",
        },
        htmlTemplateEngine: "njk",
    };
}
