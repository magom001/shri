const gulp = require("gulp");
const sass = require("gulp-sass");
const sourcemaps = require("gulp-sourcemaps");
const autoprefixer = require("gulp-autoprefixer");
const babel = require("gulp-babel");
const webpack = require("webpack-stream");
const svgSymbols = require("gulp-svg-symbols");

const webpackConfig = require("./webpack.config.js");

const inputJS = "./src/js/app.js";
const watchJS = "./src/js/*.js";
const inputSCSS = "./src/scss/**/*.scss";
const outputCSS = "./build/css";
const outputJS = "./build/js";

const sassOptions = {
  errLogToConsole: true,
  outputStyle: "expanded"
};

const autoprefixerOptions = {
  browsers: ["last 2 versions", "> 5%", "Firefox ESR"]
};

gulp.task("js", () =>
  gulp

    .src(inputJS)
    .pipe(webpack(webpackConfig))

    .pipe(gulp.dest(outputJS))
);

gulp.task("sass", function() {
  return gulp
    .src(inputSCSS)
    .pipe(sourcemaps.init())
    .pipe(sass(sassOptions).on("error", sass.logError))
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(outputCSS));
});

gulp.task(`sprites`, function() {
  return gulp
    .src(`./build/assets/images/*.svg`)
    .pipe(
      svgSymbols({
        templates: ["default-svg", "default-css", "default-demo"]
      })
    )
    .pipe(gulp.dest(`./build/assets/icons`));
});

gulp.task("watch", function() {
  gulp.watch(inputSCSS, ["sass"]);
  gulp.watch(watchJS, ["js"]);
});

gulp.task("default", ["sass", "js", "watch"]);
