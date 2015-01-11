var gulp = require('gulp');
var zip = require('gulp-zip');
//var unzip = require('gulp-unzip');

gulp.task('build:nw', function() {
  gulp.src('*')
  .pipe(zip('haven.nw'))
  .pipe(gulp.dest('dist'));
});

gulp.task('build:mac', function() {

});
//gulp.task('build:win32');

