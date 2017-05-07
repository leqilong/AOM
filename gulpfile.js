var gulp = require('gulp'),
    gutil = require('gulp-util'),
    browserSync = require('browser-sync'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    buffer = require('gulp-buffer'),
    jscs = require('gulp-jscs'),
    jshint = require('gulp-jshint');
//     uglify = require('gulp-uglify'),
//     image_min = require('gulp-imagemin'),
//     livereload = require('gulp-livereload'),
//     del = require('del');

gulp.task('default', function(){
  return gutil.log('Gulp is running!');
});

gulp.task('style', function() {
  return gulp.src([
    '**/*.js',
    '!node_modules{},/**}',
    '!build{},/**}'
  ])
  .pipe(jscs())
  .pipe(jshint())
  .pipe(jshint.reporter());
});

gulp.task('phaser', function(){
  gulp.src('./node_modules/phaser/build/phaser.min.js')
    .pipe(gulp.dest('./build/scripts'));
});

gulp.task('serve', function(){
  browserSync.init({
    server: {
      baseDir: './build'
    }
  });
  gulp.watch('./src/**/*.js').on('change', browserSync.reload);
});

gulp.task('static', function(){
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
