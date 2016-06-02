const gulp = require('gulp');
const sync = require('browser-sync');

const colors = require('colors');
const deploy = 'public';
const browser = 'google chrome';

gulp.task('pug', function () {
  const pug = require('gulp-pug');
  return gulp.src('views/pug/*.pug')
    .pipe(pug())
    .pipe(gulp.dest(deploy))
});

gulp.task("default", function () {
  const babel = require("gulp-babel");
  return gulp.src("app.js")
    .pipe(babel())
    .pipe(gulp.dest(deploy));
});

gulp.task('less', function () {
  const less = require('gulp-less');
  return gulp.src('views/less/*.less')
    .pipe(less())
    .pipe(gulp.dest('views/css'))
});

gulp.task('img', function () {
  const imagemin = require('gulp-imagemin');
  return gulp.src('views/img/*')
    .pipe(imagemin())
    .pipe(gulp.dest(deploy + '/img'))
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
    .pipe(rename({extname: '.min.css'}))
    .pipe(gulp.dest(deploy + '/css'))
});

gulp.task('bower', function() {
  const bower = require('gulp-bower');
  return bower('bower_modules/')
    .pipe(gulp.dest(deploy))
});

gulp.task('build', ['pug', 'less', 'rename'], function() {
  return console.log('Build Successful!'.green);
});

gulp.task('deploy', ['build', 'minify', 'img', 'bower'], function() {
  return console.log('Deploy Successful!'.green);
});

gulp.task('open', function () {
  const open = require('gulp-open');
  return gulp.src(['./'])
    .pipe(open({
      uri: 'http://localhost:8080/?port=5858',
      app: browser
    }));
});

gulp.task('inspector', ['sync'], function() {
  const inspector = require('gulp-node-inspector');
  gulp.src([])
    .pipe(inspector({
    saveLiveEdit: true,
    preload: true,
    inject: true
    }));
    console.log('Inspector Successful!'.green);
});

gulp.task('sync', ['build', 'nodemon', 'watch'], function () {
    sync.init({
      proxy: 'localhost:2000',
      port: 3000,
      ui: false,
      online: false,
      browser: browser
    });
});

gulp.task('watch', function () {
  gulp.watch('views/pug/*.pug', ['pug']);
  gulp.watch('views/less/*.less', ['less']);
  gulp.watch('views/css/*.css', ['rename']);
  gulp.watch(deploy + '/css/*.min.css').on('change', sync.reload);
  gulp.watch(deploy + '/*.html').on('change', sync.reload);
  gulp.watch(deploy + '/img/*').on('change', sync.reload);
  return console.log('Watch Successful!'.green);
});

gulp.task('nodemon', function (cb) {
  const nodemon = require('gulp-nodemon');
  var run = false;
  nodemon({
    script: './bin/www',
    ignore: ['./bower_modules', './public'],
    watch: [
      'app.js',
      'controllers/*.js',
      'models/*.js',
      'gulpfile.js'
    ],
    debug: true,
    verbose: true
  }).on('start', function () {
    if (!run) {
      cb();
      run = true;
      console.log("Nodemon Started!".green);
    }
  })
  .on('error', function(err) {
      throw err;
  });
});
