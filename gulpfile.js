// Include gulp
const gulp = require('gulp');

// Include plugins
const mocha = require('gulp-mocha');
const del = require('del');

// Clean task
gulp.task('clean', () => {
  return del(['lib', 'docs', 'coverage']);
});

// Test Task
gulp.task('test', () => {
  return gulp.src(['./test/**/*.js']).pipe(mocha());
});

// Default Task
gulp.task('default', ['test']);
