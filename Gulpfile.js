var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var paths = {
  scripts: [
    './src/**/*.js',
    './src/ngEocities.js'
  ],
  source: [
    './src/**/*.js',
    './src/ngEocities.js'
  ],
  dist: './dist/'
};

gulp.task('lint', function(){
  return gulp.src(paths.source)
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.notify({message: 'Linting Done'}));
});

gulp.task('concat', function(){
  return gulp.src(paths.scripts)
    .pipe($.concat('ngEocities.js'))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('minify', function(){
  return gulp.src(paths.scripts)
    .pipe($.concat('ngEocities.min.js'))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('preMin', ['minify'], function(){
  return gulp.src('./dist/ngEocities.min.js')
    .pipe($.ngAnnotate())
    .pipe(gulp.dest(paths.dist))
    .pipe($.notify({message: 'Min done'}));

});

gulp.task('uglify', ['preMin'], function(){
  return gulp.src('./dist/ngEocities.min.js')
    .pipe($.uglify())
    .pipe(gulp.dest(paths.dist))
    .pipe($.notify({message: 'Build Done'}));
});

gulp.task('build', ['lint', 'concat', 'uglify']);
gulp.task('default', ['build', 'watch']);
gulp.task('watch', function(){
  gulp.watch(paths.source, ['build']);
});