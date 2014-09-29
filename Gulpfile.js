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

gulp.task('lint', function(){});

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

gulp.task('build', ['concat', 'uglify']);

gulp.task('watch', function(){
  gulp.watch(paths.source, ['build']);
});

gulp.task('default', ['build', 'watch']);
//install gulp-load-plugins
//make default task
  //call concat task
    //select source files
    //.pipe($.concat("filename.js" //name of file with concat resources))
    //.pipe(gulp.dest(<destination folder>))


  //gulp-inject -- this is so dope