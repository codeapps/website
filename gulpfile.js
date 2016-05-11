var gulp = require('gulp');
var less = require('gulp-less');
var pug = require('gulp-pug');
var bower = require('gulp-bower');
var sync = require('browser-sync');
var source = "src";
var deploy = "dist";

gulp.task('less', function () {
  return gulp.src(source + '/less/style.less')
    .pipe(less())
    .pipe(gulp.dest(deploy + '/css'))
});

gulp.task('pug', function () {
  return gulp.src(source + '/*.pug')
    .pipe(pug())
    .pipe(gulp.dest(deploy))
});

gulp.task('bower', function() {
  return bower(source + '/bower_components')
    .pipe(gulp.dest(deploy))
});

gulp.task('sync', ['less', 'pug', 'bower'], function() {
  sync({
    server: {
      baseDir: deploy
    }
  });
  gulp.watch(source + '/less/*.less', ['less']);
  gulp.watch(source + '/*.pug', ['pug']);
  gulp.watch(source + '/pug/*.pug', ['pug']);
  gulp.watch(deploy + '/css/*.css').on('change', sync.reload);
  gulp.watch(deploy + '/*.html').on('change', sync.reload);
});
