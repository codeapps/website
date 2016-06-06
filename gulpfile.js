var gulp = require('gulp');
var sync = require('browser-sync');
var colors = require('colors');
var deploy = 'public';
var browser = 'google chrome';

gulp.task('tape', function () {
  var tape = require('gulp-tape');
  var tapColorize = require('tap-colorize');
  return gulp.src('test/*.js')
    .pipe(tape({
      reporter: tapColorize()
    }));
});

gulp.task('pug', function () {
  var pug = require('gulp-pug');
  return gulp.src('views/pug/*.pug')
    .pipe(pug())
    .pipe(gulp.dest(deploy));
});

gulp.task('riot', function () {
  var riot = require('gulp-riot');
  gulp.src('views/tag/*.tag')
      .pipe(riot())
      .pipe(gulp.dest(deploy));
});

gulp.task("babel", function () {
  var babel = require("gulp-babel");
  return gulp.src("app.js")
    .pipe(babel())
    .pipe(gulp.dest(deploy));
});

gulp.task('less', function () {
  var less = require('gulp-less');
  return gulp.src('views/less/*.less')
    .pipe(less())
    .pipe(gulp.dest('views/css'));
});

gulp.task('img', function () {
  var imagemin = require('gulp-imagemin');
  return gulp.src('views/img/*')
    .pipe(imagemin())
    .pipe(gulp.dest(deploy + '/img'));
});

gulp.task('minify', function () {
  var cleancss = require('gulp-clean-css');
  return gulp.src('views/css/*.css')
    .pipe(cleancss())
    .pipe(gulp.dest('views/css'));
});

gulp.task('rename', function () {
  var rename = require('gulp-rename');
  return gulp.src('views/css/*.css')
    .pipe(rename({extname: '.min.css'}))
    .pipe(gulp.dest(deploy + '/css'));
});

gulp.task('bower', function () {
  var bower = require('gulp-bower');
  return bower('bower_modules/')
    .pipe(gulp.dest(deploy));
});

gulp.task('build', ['pug', 'less', 'rename'], function () {
  return console.log('Build Successful!'.green);
});

gulp.task('deploy', ['build', 'minify', 'img', 'bower'], function () {
  return console.log('Deploy Successful!'.green);
});

gulp.task('open', function () {
  var open = require('gulp-open');
  return gulp.src(['./'])
    .pipe(open({
      uri: 'http://localhost:8080/?port=5858',
      app: browser
    }));
});

gulp.task('inspector', ['sync'], function () {
  var inspector = require('gulp-node-inspector');
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
  var nodemon = require('gulp-nodemon');
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
  .on('error', function (err) {
      throw err;
  });
});

gulp.task('karma', function (done) {
  var Server = require('karma').Server;
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('shell', function () {
  var shell = require('gulp-shell');
  return gulp.src('*.js', {read: false})
    .pipe(shell([
      'echo <%= f(file.path) %>',
      'ls -l <%= file.path %>'
    ], {
      templateData: {
        f: function (s) {
          return s.replace(/$/, '.bak');
        }
      }
    }));
});
