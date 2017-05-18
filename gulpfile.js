'use strict';

const gulp = require('gulp');
const del = require('del');
const path = require('path');
const eslint = require('gulp-eslint');
const uglify = require('gulp-uglify');
const buffer = require('gulp-buffer');
const source = require('vinyl-source-stream');
const browserify = require('browserify');
const browserSync = require('browser-sync').create();
// const image_min = require('gulp-imagemin');

var keepFiles = false;

// Deletes all files in the build directory.
gulp.task('clean', function() {
  if (!keepFiles) {
    del(['build/**/*.*']);
  } else {
    keepFiles = false;
  }
});

// Copies content in ./static directory to ./build directory
gulp.task('static', ['clean'], function() {
  return gulp.src('./client/static/**/*')
    .pipe(gulp.dest('./build'));
});

// Copies Phaser library to ./build directory
gulp.task('phaser', ['static'], function() {
  return gulp.src('./node_modules/phaser/build/phaser.min.js')
    .pipe(gulp.dest('./build/scripts'));
});

// Starts the server and watches for file changes
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

// Bundles js files into game.js
gulp.task('build', ['phaser'], function() {
  return browserify({
    paths: [path.join(__dirname, './src')],
    entries: './client/src/index.js',
    debug: true
  })
  .bundle()
  .pipe(source('game.js'))
  .pipe(buffer())
  .pipe(uglify())
  .pipe(gulp.dest('./build/scripts'))
  .pipe(browserSync.stream());
});

// Check coding style and notify about issues
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
