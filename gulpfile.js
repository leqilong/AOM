var gulp = require('gulp'),
  path = require('path'),
  eslint = require('gulp-eslint'),
  uglify = require('gulp-uglify'),
  source = require('vinyl-source-stream'),
  buffer = require('gulp-buffer'),
  browserify = require('browserify'),
  browserSync = require('browser-sync');
//     image_min = require('gulp-imagemin'),
//     livereload = require('gulp-livereload'),
//     del = require('del');

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
  return browserify({
    paths: [path.join(__dirname, './src')],
    entries: './src/index.js',
    debug: true
  })
  .bundle()
  .pipe(source('game.js'))
  .pipe(buffer())
  .pipe(uglify())
  .pipe(gulp.dest('./build/scripts'));
});

gulp.task('default', ['phaser', 'serve', 'static', 'build', 'style']);
