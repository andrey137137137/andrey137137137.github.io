var gulp = require('gulp'),
    sass = require('gulp-sass'),
    // cssGlobbing = require('gulp-css-globbing'),
    concatCss = require('gulp-concat-css'),
    concat = require('gulp-concat'),
    autoprefixer = require('gulp-autoprefixer'),
    rename = require("gulp-rename"),
    minifyCSS = require('gulp-minify-css'),
    notify = require("gulp-notify"),
    pug = require('gulp-pug'),
    googleCdn = require('gulp-google-cdn'),
    gulpFilter = require('gulp-filter'),
    mainBowerFiles = require('gulp-main-bower-files');

// gulp.task('connect', function () {
//   connect.server({
//     root: "app",
//     // port: 9000,
//     // livereload: true,
//     middleware: function (connect, options) {

//         options.rule = [/\.do/, /\.jsp/, /\.htm/];
// //or        options.rule = /\.do/; 

//         options.server = "127.0.0.1:8081";

//         var proxy = new Reproxy(options);

//         return [proxy];
//     }
//   });
// });

gulp.task('html', function () {
  var YOUR_LOCALS = {};

  return gulp.src('pug/index.pug')
  // return gulp.src('index.html')
    .pipe(pug({
      locals: YOUR_LOCALS,
      pretty: true
    }))
    .pipe(googleCdn(require('./bower.json')))
    .pipe(gulp.dest('app'));
    // .pipe(connect.reload());
});

gulp.task('css_libs', function() {
  var filterJS = gulpFilter('**/*.css', {restore: true});

  return gulp.src('./bower.json')
    .pipe(mainBowerFiles())
    .pipe(filterJS)
    .pipe(gulp.dest('app/css/libs'));
});

gulp.task('css', function () {
  return gulp.src('scss/*.scss')
    // .pipe(cssGlobbing())
    .pipe(sass().on('error', sass.logError))
    .pipe(concatCss("bundle.css"))
    .pipe(autoprefixer({
        browsers: ['last 15 versions'],
        cascade: false
    }))
    // .pipe(minifyCSS())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest('app/css'));
    // .pipe(connect.reload());
});

gulp.task('js_libs', function() {
  var filterJS = gulpFilter('**/*.js', {restore: true});

  return gulp.src('./bower.json')
    .pipe(mainBowerFiles())
    .pipe(filterJS)
    .pipe(gulp.dest('app/js/libs'));
});

gulp.task('js', function () {

  return gulp.src('js/*.js')
    .pipe(concat('script.min.js'))
    .pipe(gulp.dest('app/js'));
    // .pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch('pug/*.pug', ['html']);
  gulp.watch(['scss/*.scss', 'scss/normalize/*.scss'], ['css']);
  gulp.watch('js/*.js', ['js']);
});

// gulp.task('default', ['connect', 'html', 'css', 'js', 'watch']);
gulp.task('default', ['html', 'css_libs', 'css', 'js_libs', 'js', 'watch']);
// gulp.task('default', ['html', 'css_libs', 'css', 'js_libs', 'js']);
