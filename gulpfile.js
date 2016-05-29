const gulp = require('gulp');
const sync = require('browser-sync');
const nodemon = require('gulp-nodemon');
const colors = require('colors');
const deploy = 'public';

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

gulp.task('build', ['less', 'rename'], function() {
  gulp.watch(['views/less/*.less', 'views/less/include/*.less'], ['less']);
  gulp.watch('views/css/*.css', ['rename']);
  return console.log('Build Successful!'.green);
});

gulp.task('deploy', ['build', 'minify', 'img', 'bower', 'watch'], function() {
  gulp.watch('views/css/*.css', ['minify']);
  gulp.watch('views/img/*', ['img']);
  return console.log('Deploy Successful!'.green);
});

gulp.task('open', function () {
  const open = require('gulp-open');
  gulp.src(['./'])
    .pipe(open({
      uri: 'http://localhost:8080/?port=5858',
      app: 'google chrome'
    }));
});

gulp.task('inspector', function() {
  const inspector = require('gulp-node-inspector');
  gulp.src([])
    .pipe(inspector());
    console.log('Inspector Successful!'.green);
});

gulp.task('watch', function () {
  gulp.watch(deploy + '/css/*.min.css').on('change', sync.reload);
  gulp.watch(deploy + '/*.html').on('change', sync.reload);
  gulp.watch(deploy + '/img/*').on('change', sync.reload);
  return console.log('Watch Successful!'.green);
});

gulp.task('sync', ['nodemon', 'build', 'watch'], function () {
    sync.init({
      proxy: 'localhost:2000',
      port: 3000,
      notify: true
    });
});

gulp.task('nodemon', function () {
  var called = false;
  nodemon({
    script: ['./bin/www'],
    watchOnly: ['./views/*.js', './routes/*.js'],
    verbose: true
  }).on('start', function () {
    if (!called) {
      cb();
      called = true;
      console.log("Nodemon Started!".green);
    }
  })
  .on('restart', function () {
    console.log('Nodemon Restarted!'.green);
  });
});
