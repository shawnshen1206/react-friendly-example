export default function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy({ "src/images": "images" });

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
