const plumber = require("gulp-plumber"),
    pug = require("gulp-pug"),
    frontMatter = require("gulp-front-matter"),
    cached = require("gulp-cached"),
    notify = require("gulp-notify");
    data = require("gulp-data");
    path = require('path');
    require('dotenv').config();

module.exports = function () {
    $.gulp.task("pug", () => {
        const indexFile = "./src/pug/index.pug"; // Specify the index file
        const catalogFile = "./src/pug/catalog.pug"; // Specify the index file
        const pugFiles = "./src/pug/*.pug"; // Specify the path to all Pug files

        const fetchPosts = fetch(`${process.env.API_URL}/inventory/cars`, {method: 'GET'})
            .then(response => response.json());
        const compileTemplates = () => {
            return $.gulp
                .src(pugFiles)
                .pipe(
                    plumber({
                        errorHandler: notify.onError("Error: <%= error.message %>"),
                    })
                )
                .pipe(frontMatter({ property: "cars" }))
                .pipe(
                    data((file) => {
                        // Check if the file is the template file
                        if (file.path === path.resolve(indexFile) || file.path === path.resolve(catalogFile)) {
                            return fetchPosts.then(cars => ({ cars }));
                        }

                        // If not, just return the file data
                        return file.data;
                    })
                )
                .pipe(
                    pug({
                        pretty: true,
                    })
                )
                .pipe(plumber.stop())
                .pipe(cached("pug"))
                .pipe($.gulp.dest("./build/"));
        };

        return compileTemplates().on("end", $.browserSync.reload);
    });
};