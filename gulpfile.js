var
    gulp = require('gulp'),
    sequence = require('gulp-sequence'),
    gutil = require('gulp-util'),
    watchify = require('watchify'),
    rename = require('gulp-rename'),
    stylus = require('gulp-stylus'),
    plumber = require('gulp-plumber'),
    concat = require('gulp-concat'),
    rupture = require('rupture'),
    paths = {};

paths.css = './assets/css';
paths.js = './assets/js';

gulp.task('css', function() {

    return gulp.src([paths.css + '/index.styl'])
        .pipe(plumber())
        .pipe(stylus({
            'include css': true,
            paths: ['node_modules'],
            use: [rupture()]
        }))
        .pipe(plumber.stop())
        .pipe(rename('app.css'))
        .pipe(gulp.dest(paths.css));
});

gulp.task('js', function() {

    return gulp.src([
            paths.js + '/!(app)*.js',
            paths.js + '/app.js'
    ])
    .pipe(concat('all.js'))
    .pipe(gulp.dest('.'));
});
// Run everything but watch it after too
gulp.task('default', ['css', 'js'], function() {

    gulp.watch([paths.css + '/**/*'], ['css']);
    gulp.watch([paths.js + '/**/*'], ['js']);
});
