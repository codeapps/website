const gulp = require('gulp');
const less = require('gulp-less');
const pug = require('gulp-pug');
const bower = require('gulp-bower');
const imagemin = require('gulp-imagemin');
const cleancss = require('gulp-clean-css');
const rename = require('gulp-rename');
const nodemon = require('gulp-nodemon');
const sync = require('browser-sync');
const colors = require('colors');
const deploy = "public";

gulp.task('pug', function () {
  return gulp.src('views/*.pug')
    .pipe(pug())
    .pipe(gulp.dest(deploy))
});

gulp.task('less', function () {
  return gulp.src('views/less/*.less')
    .pipe(less())
    .pipe(gulp.dest('views/css'))
});

gulp.task('minify', function() {
  return gulp.src('views/css/*.css')
    .pipe(cleancss())
    .pipe(gulp.dest('views/css'))
});

gulp.task('rename', function () {
  return gulp.src('views/css/*.css')
    .pipe(rename({extname: ".min.css"}))
    .pipe(gulp.dest(deploy + '/css'))
});

gulp.task('img', function () {
  return gulp.src('views/img/*')
    .pipe(imagemin())
    .pipe(gulp.dest(deploy + '/img'))
});

gulp.task('bower', function() {
  return bower('bower_modules/')
    .pipe(gulp.dest(deploy))
});

gulp.task('build', ['pug', 'less', 'minify', 'rename', 'bower', 'img'], function() {
  return console.log("Build Successful!".green);
});

var BROWSER_SYNC_RELOAD_DELAY = 200;
gulp.task('nodemon', function (cb) {
  var called = false;
  return nodemon({
    script: './bin/www',
    watch: ['./bin/www']
  }).on('start', function () {
    if (!called) {
      cb();
      called = true;
    }
  });
});

gulp.task('sync', ['nodemon'], function() {
  sync.init({
    proxy: "localhost:3000",
    port: 4000,
    ui: false,
    online: false
  });
  gulp.watch('views/*.pug', ['pug']);
  gulp.watch('views/pug/*.pug', ['pug']);
  gulp.watch('views/img/*', ['img']);
  gulp.watch('views/less/*.less', ['less']);
  gulp.watch('views/css/*.css', ['minify', 'rename']);
  gulp.watch(deploy + '/css/*.min.css').on('change', sync.reload);
  gulp.watch(deploy + '/*.html').on('change', sync.reload);
  gulp.watch(deploy + '/img/*').on('change', sync.reload);
  console.log("Sync Successful!".green);
});

gulp.task('start', ['build', 'sync'], function() {
  sync.reload;
  return console.log("Start Successful!".green);
});
