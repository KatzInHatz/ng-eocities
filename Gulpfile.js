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

gulp.task('inject', function(){
  //sources
  var scripts = gulp.src(paths.app_files.js, {read:false});
  var styles  = gulp.src(paths.demo.styles, {read:false});

  //target
  var target  = gulp.src(paths.demo.index);

  return target
  //inject js
  .pipe($.inject(scripts, {
    addRootSlash: true,
    ignorePath: 'src',
    name:'scripts',
    relative: false,
  }))

  //inject css
  .pipe($.inject(styles, {
    addRootSlash: false,
    relative: true,
    name: 'styles'
  }))

  .pipe(gulp.dest(paths.demo.dir));
});

gulp.task('watch', function(){
  gulp.watch(paths.app_files.js, ['lint'], $.livereload.changed);
  gulp.watch(paths.app_files.styles, ['styles'], $.livereload.changed);
  gulp.watch(paths.demo.index, $.livereload.changed);
});

//run server for demo app and watch files
gulp.task('server', ['inject', 'watch'], function(){
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