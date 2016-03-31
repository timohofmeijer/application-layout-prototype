var gulp = require('gulp');
var clean = require('gulp-clean');
var browserSync = require('browser-sync').create();
var postcss = require('gulp-postcss');
var inlineImport = require("postcss-import")
var nested = require('postcss-nested');
var autoprefixer = require('autoprefixer');
var variables = require('postcss-custom-properties');
var gray = require('postcss-color-gray');

// Postprocess css
gulp.task('postcss', ['clean-css'], function() {
  var processors = [
    autoprefixer({browsers: ['last 1 version']}),
    inlineImport(),
    gray(),
    nested(),
    variables()
  ];
  return gulp.src('./src/css/*.css')
    .pipe(postcss(processors))
    .pipe(gulp.dest('./build/css'))
    .pipe(browserSync.stream());
});

// Copy source html to the build directory
gulp.task('copy-index', ['clean-html'], function() {
    gulp.src('./src/index.html')
      .pipe(gulp.dest('./build'));
});

// Remove obsolete css build files
gulp.task('clean-css', function () {
  return gulp.src('./build/css/*.css')
    .pipe(clean());
});

// Remove obsolete html build files
gulp.task('clean-html', function () {
  return gulp.src('./build/*.html')
    .pipe(clean());
});

// Start watching and serve `build` directory
gulp.task('serve', ['copy-index', 'postcss'], function() {

  browserSync.init({
    server: "./build"
  });

  gulp.watch("./src/css/*.css", ['postcss']);
  gulp.watch("./src/*.html", ['copy-index']);
  gulp.watch("./build/*.html").on('change', browserSync.reload);
});
