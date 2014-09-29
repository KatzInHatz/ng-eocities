var gulp = require('gulp');

var paths = {
  scripts: [],
  source: [],
  dist: './dist/'
};

gulp.task('lint', function(){});

gulp.task('concat', function(){});

gulp.task('minify', function(){});

gulp.task('build', ['lint', 'concat', 'uglify']);

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