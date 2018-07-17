const gulp = require("gulp");
const sass = require("gulp-sass");
const sourcemaps = require("gulp-sourcemaps");
const autoprefixer = require("gulp-autoprefixer");

const input = "./src/scss/**/*.scss";
const output = "./build/css";

const sassOptions = {
  errLogToConsole: true,
  outputStyle: "expanded"
};

const autoprefixerOptions = {
  browsers: ["last 2 versions", "> 5%", "Firefox ESR"]
};

gulp.task("sass", function() {
  return gulp
    .src(input)
    .pipe(sourcemaps.init())
    .pipe(sass(sassOptions).on("error", sass.logError))
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(output));
});

gulp.task("watch", function() {
  return gulp.watch(input, ["sass"]).on("change", function(event) {
    console.log(
      "File " + event.path + " was " + event.type + ", running tasks..."
    );
  });
});

gulp.task("default", ["sass", "watch" /*, possible other tasks... */]);
