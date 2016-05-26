const gulp = require('gulp');
const less = require('gulp-less');
const pug = require('gulp-pug');
const bower = require('gulp-bower');
const autoprefixer = require('autoprefixer');
const imagemin = require('gulp-imagemin');
const postcss = require('gulp-postcss');
const cleancss = require('gulp-clean-css');
const renamecss = require('gulp-rename');
const sync = require('browser-sync');
const colors = require('colors');
const source = "src";
const deploy = "dist";

gulp.task('less', function () {
  return gulp.src(source + '/views/less/*.less')
    .pipe(less())
    .pipe(gulp.dest(source + '/views/css'))
});

gulp.task('prefix', function () {
  return gulp.src(source + '/views/css/*.css')
    .pipe(postcss([ autoprefixer({ browsers: ['last 2 versions'] })] ))
    .pipe(gulp.dest(source + '/views/css'))
});

gulp.task('minify', function() {
  return gulp.src(source + '/views/css/*.css')
    .pipe(cleancss())
    .pipe(gulp.dest(source + '/views/css'));
});

gulp.task('renamecss', function () {
  return gulp.src(source + '/views/css/*.css')
    .pipe(renamecss({extname: ".min.css"}))
    .pipe(gulp.dest(deploy + '/css'))
});

gulp.task('img', function () {
    gulp.src(source + '/views/img/*')
        .pipe(imagemin())
        .pipe(gulp.dest(deploy + '/img'))
});

gulp.task('pug', function () {
  return gulp.src(source + '/views/pug/*.pug')
    .pipe(pug())
    .pipe(gulp.dest(deploy))
});

gulp.task('bower', function() {
  return bower('bower_modules/')
    .pipe(gulp.dest(deploy))
});

gulp.task('sync', ['img', 'bower', 'less', 'prefix', 'minify', 'renamecss', 'pug'], function() {
  sync({
    server: {
      baseDir: deploy
    }
  });
  gulp.watch(source + '/views/img/*', ['img']);
  gulp.watch(source + '/views/less/*.less', ['less']);
  gulp.watch(source + '/views/css/*.css', ['prefix', 'minify', 'renamecss']);
  gulp.watch(source + '/views/pug/*', ['pug']);
  gulp.watch(source + '/views/pug/include/*', ['pug']);

  gulp.watch(deploy + '/css/*.css').on('change', sync.reload);
  gulp.watch(deploy + '/*.html').on('change', sync.reload);
  gulp.watch(deploy + '/img/*').on('change', sync.reload);

  return console.log("Sync Successful!".green);
});

gulp.task('build', ['img', 'bower', 'less', 'prefix', 'minify', 'renamecss', 'pug'], function() {
  return console.log("Build Successful!".green);
});
