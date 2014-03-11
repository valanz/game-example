var gulp = require('gulp')
  , gutil = require('gulp-util')
  , concat = require('gulp-concat')
  , rename = require('gulp-rename')
  , minifycss = require('gulp-minify-css')
  , minifyhtml = require('gulp-minify-html')
  , processhtml = require('gulp-processhtml')
  , jshint = require('gulp-jshint')
  , uglify = require('gulp-uglify')
  , connect = require('gulp-connect')
  , download = require('gulp-download')
  , paths;

paths = {
  assets: 'src/assets/**/*',
  css:    'src/css/*.css', 
  js:     ['src/js/**/*.js', '!src/js/lib/*.js'],
  dist:   './dist/'
};


gulp.task('download', function () {
  // for the moment grab phaser from GitHub
  // as it seems the official version is not
  // in the Bower registry ... this should be
  // handled by Bower later on.
  download(['https://raw.github.com/photonstorm/phaser/master/build/phaser.js'])
    .pipe(gulp.dest('src/js/lib/'));
});

gulp.task('copy', function () {
  gulp.src(paths.assets).pipe(gulp.dest(paths.dist + 'assets'));
});

gulp.task('uglify', ['jshint'], function () {
  gulp.src(paths.js)
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest(paths.dist))
    .pipe(uglify({outSourceMaps: false}))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('minifycss', function () {
 gulp.src(paths.css)
    .pipe(minifycss({
      keepSpecialComments: false,
      removeEmpty: true
    }))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('processhtml', function() {
  gulp.src('src/index.html')
    .pipe(processhtml('index.html'))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('minifyhtml', function() {
  gulp.src('dist/index.html')
    .pipe(minifyhtml())
    .pipe(gulp.dest(paths.dist));
});

gulp.task('jshint', function() {
  gulp.src(paths.js)
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'));
});

gulp.task('connect', connect.server({
  root: [__dirname + '/src'],
  port: 9000,
  livereload: true,
  open: {
    browser: 'chrome' // if not working on OSX try: 'Google Chrome'
  }
}));

gulp.task('watch', function () {
  gulp.watch(paths.js, ['jshint']);
  gulp.watch(['./src/index.html', paths.css, paths.js], connect.reload);
});

gulp.task('default', ['connect', 'watch']);
gulp.task('build', ['copy', 'uglify', 'minifycss', 'processhtml', 'minifyhtml']);

