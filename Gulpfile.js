var gulp   = require('gulp');
    $      = require('gulp-load-plugins')();
    server = require('./demoApp/server.js');

var paths = {
  scripts: [
    './src/**/*.js',
    './src/ngEocities.js'
  ],
  source: [
    './src/**/*.js',
    './src/ngEocities.js'
  ],
  dist: './dist/', 
  demo: {
    index: './demoApp/index.html'
  }
};

gulp.task('lint', function(){
  return gulp.src(paths.source)
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.notify({message: 'Linting Done'}))
    .pipe($.livereload());
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

gulp.task('watch', function(){
  gulp.watch(paths.source, ['lint'], $.livereload.changed);
  gulp.watch(paths.demo.index, $.livereload.changed);
});

//run server for demo app and watch files
gulp.task('serve', ['watch'], function(){
  server.run();
});


gulp.task('build', ['lint', 'concat', 'uglify']);
gulp.task('default', ['build', 'watch']);