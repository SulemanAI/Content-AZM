let projectFolder = require("path").basename(__dirname);
let sourceFolder = "#src";

let fs = require("fs");

let path = {
    build: {
        html: projectFolder + "/",
        css: projectFolder + "/css/",
        js: projectFolder + "/js/",
        img: projectFolder + "/img/",
        fonts: projectFolder + "/fonts/",
        icons: projectFolder + "/icons/"
    },
    src : {
        html: [sourceFolder + "/*.html", "!" + sourceFolder + "/_*.html"],
        css: sourceFolder + "/scss/style.scss",
        js: sourceFolder + "/js/script.js",
        img: sourceFolder + "/img/**/*.{jpg,gif,ico,webp}",
        fonts: sourceFolder + "/fonts/*.ttf",
        icons: sourceFolder + "/icons/*.{png,svg}",
        scrollreveal: sourceFolder + "/js/scrollreveal.min.js"
    },
    watch : {
        html: sourceFolder + "/**/*.html",
        css: sourceFolder + "/scss/**/*.scss",
        js: sourceFolder + "/js/**/*.js",
        img: sourceFolder + "/img/**/*.{jpg,gif,ico,webp}",
        icons: sourceFolder + "/icons/**/*.{png,svg}"
    },
    clean: "./" + projectFolder + "/"
};

let {src, dest} = require("gulp"),
    gulp = require("gulp"),
    browsersync = require("browser-sync").create(),
    fileinclude = require("gulp-file-include"),
    del = require("del"),
    scss = require("gulp-sass")(require("sass")),
    autoprefixer = require("gulp-autoprefixer"),
    groupmedia = require("gulp-group-css-media-queries"),
    cleancss = require("gulp-clean-css"),
    rename = require("gulp-rename"),
    uglify = require("gulp-uglify-es").default,
    imagemin = require("gulp-image"),
    webp = require("gulp-webp"),
    webpHTML = require("gulp-webp-html"),
    webpCSS = require("gulp-webp-css"),
    svgSprite = require("gulp-svg-sprite"),
    ttf2woff = require("gulp-ttf2woff"),
    ttf2woff2 = require("gulp-ttf2woff2"),
    fonter = require("gulp-fonter");

function browserSync(params) {
    browsersync.init({
        server: {
            baseDir: "./" + projectFolder + "/",
        },
        port: 3000,
        notify: false,
    });
}

function html() {
    return src(path.src.html)
        .pipe(fileinclude())
        .pipe(webpHTML())
        .pipe(dest(path.build.html))
        .pipe(browsersync.stream());
}

function css() {
    return src(path.src.css)
        .pipe(
            scss({
                outputStyle: "expanded",
            })
        )
        .pipe(
            groupmedia()
        )
        .pipe(
            autoprefixer({
                grid: true,
                overrideBrowserslist: ["last 5 versions"],
                cascade: true,
            })
        )
        .pipe(webpCSS())
        .pipe(dest(path.build.css))
        .pipe(cleancss())
        .pipe(
            rename({
                extname: ".min.css",
            })
        )
        .pipe(dest(path.build.css))
        .pipe(browsersync.stream());
}

function js() {
    return src(path.src.js)
        .pipe(fileinclude())
        .pipe(dest(path.build.js))
        .pipe(
            uglify(),
        )
        .pipe(
            rename({
                extname: ".min.js",
            })
        )
        .pipe(dest(path.build.js))
        .pipe(browsersync.stream());
}

function scrollReveal() {
    return src(path.src.scrollreveal)
        .pipe(dest(path.build.js));
}

function images() {
    return src(path.src.img)
        .pipe(
            webp({
                quality: 70,
            })
        )
        .pipe(dest(path.build.img))
        .pipe(src(path.src.img))
        .pipe(imagemin({
            jpegRecompress: ['--strip', '--quality', 'medium', '--min', 40, '--max', 80],
            mozjpeg: ['-optimize', '-progressive'],
            gifsicle: ['--optimize'],
        }))
        .pipe(dest(path.build.img))
        .pipe(browsersync.stream());
}

function icons() {
    return src(path.src.icons)
        .pipe (
            webp({
                quality: 70,
            })
        )
        .pipe(src(path.src.icons))
        .pipe(imagemin({
            optipng: ['-i 1', '-strip all', '-fix', '-o7', '-force'],
            pngquant: ['--speed=1', '--force', 256],
            zopflipng: ['-y', '--lossy_8bit', '--lossy_transparent'],
            svgo: ['--enable', 'cleanupIDs', '--disable', 'convertColors'],
        }))
        .pipe(dest(path.build.icons))
        .pipe(browsersync.stream());
}

function fonts(params) {
    src(path.src.fonts)
        .pipe(ttf2woff())
        .pipe(dest(path.build.fonts));
    return src(path.src.fonts)
        .pipe(ttf2woff2())
        .pipe(dest(path.build.fonts));
}

gulp.task("otf2ttf", function() {
    return src([sourceFolder + "/fonts/*.otf"])
        .pipe(fonter({
            formats: ["ttf"],
        }))
        .pipe(dest(sourceFolder + "/fonts/"));
});

gulp.task("svgSprite", function() {
    return gulp.src([sourceFolder + "/icons/*.svg"])
        .pipe(svgSprite({
            mode: {
                stack: {
                    sprite: "/#src/icons/icons.svg",
                    example: true,
                }
            },
        }))
        .pipe(dest(path.build.img));
});

function fontsStyle(params) {
    let fileContent = fs.readFileSync(sourceFolder + '/scss/fonts.scss');
    if (fileContent == '') {
        fs.writeFile(sourceFolder + '/scss/fonts.scss', '', cb);
        return fs.readdir(path.build.fonts, function (err, items) {
            if (items) {
                let cFontname;
                for (let i = 0; i < items.length; i++) {
                    let fontname = items[i].split('.');
                    fontname = fontname[0];
                    if (cFontname != fontname) {
                        fs.appendFile(sourceFolder + '/scss/fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
    }
    cFontname = fontname;
        }
            }
                });
                    }
}
function cb() {}

function watchFiles(params) {
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.img], images);
    gulp.watch([path.watch.icons], icons);
}

function clean(params) {
    return del(path.clean);
}

let build = gulp.series(clean, gulp.parallel(js, css, html, images, fonts, icons, scrollReveal));
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.scrollreveal = scrollReveal;
exports.icons = icons;
exports.fontsStyle = fontsStyle;
exports.fonts = fonts;
exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;