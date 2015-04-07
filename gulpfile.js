/* global -$ */
'use strict';

var fs = require('fs');

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var del = require('del');

var browserSync = require('browser-sync');
var reload = browserSync.reload;

gulp.task('jshint', function() {
  return gulp.src(['app/scripts/**/*.js', '!app/scripts/libs/**/*.js'])
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});

gulp.task('images', function() {
  return gulp.src('app/assets/images/**/*')
  .pipe($.cache($.imagemin({
    progressive: true,
    interlaced: true
  })))
  .pipe(gulp.dest('dist/assets/images'))
  .pipe($.size({title: 'images'}));
});

gulp.task('styles', function() {
  return gulp.src('app/**/*.scss')
    .pipe($.sass({
      precision: 10,
      onError: console.error.bind(console, 'Sass error:')
    }))
    .pipe($.autoprefixer(['last 2 versions', 'IE 9', 'IE 8']))
    .pipe(gulp.dest('.tmp'))
    .pipe($.if('*.css', reload({stream: true})))
    .pipe($.if('*.css', $.csso()))
    .pipe(gulp.dest('dist'))
    .pipe($.size({title: 'styles'}));
});

gulp.task('scripts', ['jshint'], function() {
  var sources = [
    'node_modules/shoestring/dist/shoestring.js',
    'app/scripts/**/*.js'
  ];

  return gulp.src(sources)
    .pipe($.concat('bundle.js'))
    .pipe(gulp.dest('.tmp/scripts'))
    .pipe($.uglify())
    .pipe(gulp.dest('dist/scripts'))
    .pipe($.size({title: 'scripts'}));
});

gulp.task('templates', function() {
  var nunjucks = require('nunjucks');
  var map = require('vinyl-map');

  var data = JSON.parse(fs.readFileSync('data.json', 'utf8'));

  // pulls over the bucket and slug data for the preview page
  var packageData = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  data.SITE = packageData.config;

  // disable watching or it'll hang forever
  nunjucks.configure('app', {watch: false});

  var nunjuckified = map(function(code, filename) {
    return nunjucks.renderString(code.toString(), data);
  });

  return gulp.src(['app/**/{*,!_*}.html', '!app/**/_*.html'])
    .pipe(nunjuckified)
    .pipe(gulp.dest('.tmp'))
    .pipe($.minifyHtml())
    .pipe(gulp.dest('dist'))
    .pipe($.size({title: 'templates'}));
});

gulp.task('assets', function() {
  return gulp.src(['app/assets/**/*', '!app/assets/images/'])
  .pipe(gulp.dest('dist/assets'))
  .pipe($.size({title: 'assets'}));
});

gulp.task('clean', function() {
  del(['.tmp', 'dist/*', '!dist/.git'], {dot: true});
});

gulp.task('serve', ['styles', 'scripts', 'templates'], function() {
  browserSync({
    notify: false,
    logConnections: true,
    logPrefix: 'NEWSAPPS',
    open: false,
    server: {
      baseDir: ['.tmp', 'app'],
      routes: {
        '/bower_components': 'bower_components',
        '/node_modules': 'node_modules'
      }
    }
  });

  gulp.watch(['app/**/*.html'], ['templates', reload]);
  gulp.watch(['data.json'], ['templates', reload]);
  gulp.watch(['app/styles/**/*.scss'], ['styles']);
  gulp.watch(['app/scripts/**/*.js'], ['scripts', reload]);
  gulp.watch(['app/images/**/*'], reload);
  gulp.watch(['app/fonts/**/*'], reload);
});

gulp.task('serve:build', ['default'], function() {
  browserSync({
    notify: false,
    logConnections: true,
    logPrefix: 'NEWSAPPS',
    open: true,
    server: ['dist']
  });
});

gulp.task('default', ['clean'], function(cb) {
  runSequence(['styles', 'scripts', 'templates', 'images', 'assets'], cb);
});

gulp.task('build', ['default']);
