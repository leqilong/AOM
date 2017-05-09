var gulp = require('gulp'),
  path = require('path'),
  eslint = require('gulp-eslint'),
  uglify = require('gulp-uglify'),
  source = require('vinyl-source-stream'),
  buffer = require('gulp-buffer'),
  browserify = require('browserify'),
  browserSync = require('browser-sync').create(),
  del = require('del');
  //     image_min = require('gulp-imagemin');

var keepFiles = false;

gulp.task('clean', function() {
  if (!keepFiles) {
    del(['build/**/*.*']);
  } else {
    keepFiles = false;
  }
});

gulp.task('static', ['clean'], function() {
  return gulp.src('./static/**/*')
    .pipe(gulp.dest('./build'));
});

gulp.task('phaser', ['static'], function() {
  return gulp.src('./node_modules/phaser/build/phaser.min.js')
    .pipe(gulp.dest('./build/scripts'));
});

gulp.task('serve', ['build'], function() {
  browserSync.init({
    server: {
      baseDir: './build'
    }
  });
  gulp.watch('./src/**/*.js', ['build']).on('change', function() {
    keepFiles = true;
  });
});

gulp.task('build', ['phaser'], function() {
  return browserify({
    paths: [path.join(__dirname, './src')],
    entries: './src/index.js',
    debug: true
  })
  .bundle()
  .pipe(source('game.js'))
  .pipe(buffer())
  .pipe(uglify())
  .pipe(gulp.dest('./build/scripts'))
  .pipe(browserSync.stream());
});

gulp.task('style', function() {
  return gulp.src([
    '**/*.js',
    '!node_modules{},/**}',
    '!build{},/**}'
  ])
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failOnError());
});

gulp.task('default', ['clean', 'static', 'phaser', 'serve', 'build', 'style']);
