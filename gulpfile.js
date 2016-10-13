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

paths.build = './app/assets';
paths.css = './assets-src/css';
paths.js = './assets-src/js';
paths.fonts = './assets-src/fonts';
paths.images = './assets-src/images';
paths.videos = './assets-src/videos';

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
        .pipe(gulp.dest(paths.build));
});

gulp.task('js', function() {

    return gulp.src([
            paths.js + '/!(app)*.js',
            paths.js + '/app.js'
    ])
    .pipe(concat('app.js'))
    .pipe(gulp.dest(paths.build));
});

gulp.task('fonts', function() {

    return gulp.src(paths.fonts + '/**/*')
        .pipe(gulp.dest(paths.build + '/fonts'));
});

gulp.task('images', function() {

    return gulp.src(paths.images + '/**/*')
        .pipe(gulp.dest(paths.build + '/images'));
});

gulp.task('videos', function() {

    return gulp.src(paths.videos + '/**/*')
        .pipe(gulp.dest(paths.build + '/videos'));
});

gulp.task('assets', ['css', 'js', 'images', 'fonts', 'videos'], function() {

    return;
});

gulp.task('build', ['assets'], function() {

    var electronInstaller = require('electron-winstaller');

    resultPromise = electronInstaller.createWindowsInstaller({
        appDirectory: '/tmp/build/my-app-64',
        outputDirectory: '/tmp/build/installer64',
        authors: 'Titan',
        exe: 'Video Tools.exe'
    });

    resultPromise.then(function() {
        console.log("It worked!")
    }, function(e) {
        console.log('No dice:', e.message);
    });
});

// Run everything but watch it after too
gulp.task('default', ['assets'], function() {

    gulp.watch([paths.css + '/**/*'], ['css']);
    gulp.watch([paths.js + '/**/*'], ['js']);
});
