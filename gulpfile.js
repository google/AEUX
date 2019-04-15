var gulp          = require('gulp'),
    babel         = require('gulp-babel');
    del           = require('del'),
    uglify        = require('gulp-uglify'),
    csso          = require('gulp-csso'),
    jsxbin        = require('jsxbin'),
    runSequence   = require('run-sequence'),
    yuicompressor = require('gulp-yuicompressor'),
    zxpSignCmd    = require('zxp-sign-cmd'),
    include       = require('gulp-include'),
    replace       = require('gulp-replace'),
    rename         = require('gulp-rename'),
    // folder vars
    destinationFolder   = 'Install/',
    sourceFolder        = 'src/AE',
    panelName           = 'AEUX';


gulp.task('clean', function () {
  return del([
    destinationFolder + 'AEUX.zxp',
    destinationFolder + 'AEUX'
  ]);
});

gulp.task('copy', ['clean'], function () {
  return gulp.src(sourceFolder + '/**/*')
    .pipe(gulp.dest(destinationFolder + panelName));
});

gulp.task('compress-js', function () {
    return gulp.src(destinationFolder + panelName + '/js/*.js')
    // return gulp.src(destinationFolder + panelName + '/**/*.js')
    .pipe(babel({presets: ['@babel/plugin-transform-arrow-functions']}))
    .pipe(uglify())
    .pipe(gulp.dest(destinationFolder + panelName));
});

gulp.task('compress-css', function () {
    return gulp.src(destinationFolder + panelName + '/**/*.css')
    .pipe(csso())
    .pipe(gulp.dest(destinationFolder + panelName));
});

gulp.task('compress-files', function (callback) {
    runSequence("copy", ["compress-css", "compress-js", "compress-jsx"], callback);
})

gulp.task('compress-jsx', function () {
    var fileIn = destinationFolder + panelName + '/jsx/script.jsx';
    return gulp.src(fileIn)
        .pipe(replace(/^\s*(#include|\/\/\s*@include)/gm, '//= include'))
        .pipe(include())
        .pipe(yuicompressor({
          'type'          : 'js',
          'preserve-semi' : true
        }))
        .pipe(gulp.dest(destinationFolder + panelName + '/jsx/'))
});

gulp.task('jsxbin', ['compress-jsx'], function () {
    var jsxFolder = destinationFolder + panelName + '/jsx/';
    var fileIn = jsxFolder + 'script.jsx';
    var fileOut = jsxFolder + 'script.jsxbin';
    return jsxbin(fileIn)
      .then(function () {
        del(fileIn);
      })
      .then(function () {
          return gulp.src(fileOut)
              .pipe(rename({
                  'extname' : '.jsx'
              }))
              .pipe(gulp.dest(jsxFolder));
      })
      .then(function () {
          del(fileOut)
          del(jsxFolder + 'libs')
      })
});

gulp.task('build', ['compress-files'], function (callback) {
	zxpSignCmd.sign({
		'input'     : destinationFolder + panelName,
		'output'    : destinationFolder + panelName + '.zxp',
        'cert'      : './cert.p12',
        'password'  : 'aeux',
		    'timestamp' : 'http://timestamp.digicert.com'
	}, function (error, result) {
		console.log(result)
	});
});

gulp.task('copy-to-repo', [], function () {
    return gulp.src(destinationFolder + '/**/*.zxp')
        .pipe(gulp.dest('../Public Repo/sketch2ae'));
}, function (error, result) {
    console.log(error, result)
});

gulp.task('clean-intermediates', ['build'], function () {
  return del(
        destinationFolder + panelName
  );
});

gulp.task('default', ['build']);
