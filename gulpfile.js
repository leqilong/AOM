var gulp = require('gulp'),
  eslint = require('gulp-eslint'),
  browserSync = require('browser-sync'),
  browserify = require('browserify'),
  source = require('vinyl-source-stream'),
  buffer = require('gulp-buffer');
//     uglify = require('gulp-uglify'),
//     image_min = require('gulp-imagemin'),
//     livereload = require('gulp-livereload'),
//     del = require('del');

gulp.task("style", function() {
  return gulp.src([
    '**/*.js',
    '!node_modules{},/**}',
    '!build{},/**}'
  ])
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failOnError());
});

gulp.task('phaser', function() {
  gulp.src('./node_modules/phaser/build/phaser.min.js')
    .pipe(gulp.dest('./build/scripts'));
});

gulp.task('serve', function() {
  browserSync.init({
    server: {
      baseDir: './build'
    }
  });
  gulp.watch('./src/**/*.js').on('change', browserSync.reload);
});

gulp.task('static', function() {
  return gulp.src('./static/**/*')
    .pipe(gulp.dest('./build'));
});

gulp.task('build', function() {
  browserify({
    entries: './src/index.js',
    debug: true
  })
  .bundle()
  .pipe(source('game.js'))
  .pipe(gulp.dest('./build/scripts'));
});

gulp.task('default', ['phaser', 'serve','static', 'build', 'style']);
