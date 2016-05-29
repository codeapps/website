const gulp = require('gulp');
const sync = require('browser-sync');
const nodemon = require('gulp-nodemon');
const colors = require('colors');
const deploy = 'public';

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
    .pipe(rename({extname: '.min.css'}))
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
  return console.log('Build Successful!'.green);
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

gulp.task('sync', ['inspector'], function (cb) {
  sync.init({
    proxy: 'localhost:2000',
    port: 3000,
    notify: true
  });
  var called = false;
  nodemon({
    script: ['./bin/www'],
    watchOnly: ['./views/*.js', './routes/*.js'],
    verbose: false
  }).on('start', function () {

    gulp.watch('views/*.pug', ['pug']);
    gulp.watch('views/pug/*.pug', ['pug']);
    gulp.watch('views/img/*', ['img']);
    gulp.watch('views/less/*.less', ['less']);
    gulp.watch('views/css/*.css', ['minify', 'rename']);

    gulp.watch('routes/*.js').on('change', sync.reload);
    gulp.watch('modules/*.js').on('change', sync.reload);

    gulp.watch(deploy + '/css/*.min.css').on('change', sync.reload);
    gulp.watch(deploy + '/*.html').on('change', sync.reload);
    gulp.watch(deploy + '/img/*').on('change', sync.reload);
    gulp.watch('./').on('change', sync.reload);

    console.log('Sync Activate!'.green);
    sync.reload;

    if (!called) {
      cb();
      called = true;
      console.log("Nodemon Started!".green);
      sync.reload;
    }
  })
  .on('restart', function () {
    console.log('Sync Activate!'.green);
    console.log('Nodemon Restarted!'.green);
  });
  sync.reload;

});
