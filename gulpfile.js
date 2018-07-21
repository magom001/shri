const gulp = require("gulp");
const sass = require("gulp-sass");
const sourcemaps = require("gulp-sourcemaps");
const autoprefixer = require("gulp-autoprefixer");
const babel = require("gulp-babel");

const inputJS = "./src/js/app.js";
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

gulp.task("babel", () =>
  gulp
    .src(inputJS)
    .pipe(
      babel({
        presets: ["@babel/env"]
      })
    )
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

gulp.task("watch", function() {
  gulp.watch(inputSCSS, ["sass"]);
  gulp.watch(inputJS, ["babel"]);
});

gulp.task("default", ["sass", "babel", "watch"]);
