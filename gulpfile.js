const gulp = require('gulp');
const less = require('gulp-less');
const pug = require('gulp-pug');
const bower = require('gulp-bower');
const imagemin = require('gulp-imagemin');
const postcss = require('gulp-postcss');
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
    gulp.src('views/img/*')
        .pipe(imagemin())
        .pipe(gulp.dest(deploy + '/img'))
});

gulp.task('bower', function() {
  return bower('bower_modules/')
    .pipe(gulp.dest(deploy))
});

gulp.task('nodemon', function(cb) {
  return nodemon({
      script: './bin/www'
      // script: './bin/www/app.js'
    })
    .on('start', function () {
      cb();
    })
    .on('error', function(err) {
     throw err;
   });
});

gulp.task('build', ['pug', 'img', 'bower', 'less', 'minify', 'rename'], function() {
  return console.log("Build Successful!".green);
});

gulp.task('sync', ['nodemon'], function() {
  sync({
    server: {
      baseDir: deploy
    }
  });
  gulp.watch('views/*.pug', ['pug']);
  gulp.watch('views/img/*', ['img']);
  gulp.watch('views/less/*.less', ['less']);
  gulp.watch('views/css/*.css', ['minify', 'rename']);
  gulp.watch(deploy + '/css/*.css').on('change', sync.reload);
  gulp.watch(deploy + '/*.html').on('change', sync.reload);
  gulp.watch(deploy + '/img/*').on('change', sync.reload);
  return console.log("Sync Successful!".green);
});
