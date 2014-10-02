var gulp   = require('gulp');
    $      = require('gulp-load-plugins')();
    server = require('./demoApp/server.js');
    // open   = require('gulp-open ');
var stylus = require('gulp-stylus');
var paths  = require('./build.config.js');


gulp.task('styles', function() {
  gulp.src(paths.app_files.styles)
    .pipe(stylus())
    .pipe($.concat('ng-eocities.css'))
    .pipe(gulp.dest(paths.demo.dir));
});

gulp.task('lint', function(){
  return gulp.src(paths.app_files.js)
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.notify({message: 'Linting Done'}))
    .pipe($.livereload());
});

gulp.task('concat', function(){
  return gulp.src(paths.app_files.js)
    .pipe($.concat('ngEocities.js'))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('minify', function(){
  return gulp.src(paths.app_files.js)
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
  gulp.watch(paths.styles, ['styles'], $.livereload.changed);
  gulp.watch(paths.demo.index, $.livereload.changed);
});

//run server for demo app and watch files
gulp.task('server', ['watch'], function(){
  server.run();
});

gulp.task('serve', ['server'], function(){
  var options = {
    url: 'http://localhost:9000',
  };
  gulp.src('./demoApp/index.html')
    .pipe($.open('', options));
});


gulp.task('build', ['lint', 'concat', 'uglify']);
gulp.task('default', ['build', 'watch']);