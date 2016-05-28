const gulp = require('gulp');
const sync = require('browser-sync');
const nodemon = require('gulp-nodemon');
const colors = require('colors');
const deploy = "public";

gulp.task('pug', function () {
  const pug = require('gulp-pug');
  return gulp.src('views/*.pug')
    .pipe(pug())
    .pipe(gulp.dest(deploy))
});

gulp.task('less', function () {
  const less = require('gulp-less');
  return gulp.src('views/less/*.less')
    .pipe(less())
    .pipe(gulp.dest('views/css'))
});

gulp.task('minify', function() {
  const cleancss = require('gulp-clean-css');
  return gulp.src('views/css/*.css')
    .pipe(cleancss())
    .pipe(gulp.dest('views/css'))
});

gulp.task('rename', function () {
  const rename = require('gulp-rename');
  return gulp.src('views/css/*.css')
    .pipe(rename({extname: ".min.css"}))
    .pipe(gulp.dest(deploy + '/css'))
});

gulp.task('img', function () {
  const imagemin = require('gulp-imagemin');
  return gulp.src('views/img/*')
    .pipe(imagemin())
    .pipe(gulp.dest(deploy + '/img'))
});

gulp.task('bower', function() {
  const bower = require('gulp-bower');
  return bower('bower_modules/')
    .pipe(gulp.dest(deploy))
});

gulp.task('build', ['pug', 'less', 'minify', 'rename', 'bower', 'img'], function() {
  return console.log("Build Successful!".green);
});

gulp.task('nodemon', function (cb) {
  var called = false;
  return nodemon({
    script: ['--debug ./bin/www'],
    verbose: false
  }).on('start', function () {
    if (!called) {
      cb();
      called = true;
      console.log("Nodemon Successful!".green);
    }
  });
});

gulp.task('sync', ['nodemon'], function() {
  sync.create('Sync').init({
    proxy: "localhost:2000",
    port: 3000,
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

gulp.task('debug', ['sync'], function() {
  const inspector = require('gulp-node-inspector');
  gulp.src([])
    .pipe(inspector({
      debugPort: 5858,
      webHost: 'localhost',
      webPort: 8080,
      saveLiveEdit: true,
      preload: false,
      inject: true,
      sslKey: '',
      sslCert: ''
    }));
    sync.create('Inspector').init({
      proxy: "http://localhost:8080/?port=5858",
      port: 8080
    });
    console.log("Inspector Successful!".green);
});
