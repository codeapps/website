var gulp = require('gulp');
var less = require('gulp-less');
var pug = require('gulp-pug');
var bower = require('gulp-bower');
var imagemin = require('gulp-imagemin');
var cleancss = require('gulp-clean-css');
var rename = require('gulp-rename');
var nodemon = require('gulp-nodemon');
var sync = require('browser-sync').create();
var colors = require('colors');
var deploy = "public";
var reload = sync.reload;

gulp.task('pug', function () {
  return gulp.src('views/*.pug')
    .pipe(pug())
    .pipe(gulp.dest(deploy))
});

gulp.task('less', function () {
  return gulp.src('views/less/*.less')
    .pipe(less())
    .pipe(gulp.dest(deploy + '/css'))
});

gulp.task('minify', function() {
  return gulp.src('views/css/*.css')
    .pipe(cleancss())
    .pipe(gulp.dest(deploy + '/css'))
});

gulp.task('rename', function () {
  return gulp.src(deploy + '/css/*.css')
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

gulp.task('nodemon', function(cb) {
  var started = false;
  nodemon({
    script: './bin/www',
    tasks: ['sync']
  }).on('start', function () {
      if (!started) {
  		started = true;
      cb();
      }
  }).on('error', function(err) {
      throw err;
    });
});

gulp.task('build', ['less', 'pug', 'minify', 'rename', 'bower', 'img'], function() {
  return console.log("Build Successful!".green);
});

gulp.task('sync', function() {
  sync.init({
    proxy: 'http://localhost:3000',
    port: 4000,
    online: false
  })
  gulp.watch('views/*.pug', 'pug');
  gulp.watch('views/img/*', 'img');
  gulp.watch('views/less/*.less', 'less');
  gulp.watch('views/css/*.css', ['minify', 'rename']);
  gulp.watch(deploy + '/css/*.css').on('change', reload);
  gulp.watch(deploy + '/*.html').on('change', reload);
  gulp.watch(deploy + '/img/*').on('change', reload);
  console.log("Sync Successful!".green);
});

gulp.task('start', ['build', 'nodemon']);
