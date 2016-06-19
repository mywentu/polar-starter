// Requiring Gulp
var gulp = require('gulp');

// Requires the gulp-sass plugin
var sass = require('gulp-sass');

// Requires the gulp-file-include plugin
var fileinclude = require('gulp-file-include');

// Requiring autoprefixer
var autoprefixer = require('gulp-autoprefixer');

// Requiring sourcemaps
var sourcemaps = require('gulp-sourcemaps');

// Requiring browser-sync
var browserSync = require('browser-sync');

// Requiring gulp-shell
var shell = require('gulp-shell');

// Require kss-node
var kssNode = 'node ' + __dirname + '/node_modules/kss/bin/kss-node ';

// Start KSS (style guide) task
gulp.task('kss', shell.task(
  [kssNode + '--config source/kss-config.json']));
  // [kssNode + '--xdemo']));

// Start file include task
gulp.task('templates', function() {
  gulp.src(['./source/templates/**'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: './source/patterns'
    }))
    .pipe(gulp.dest('./build'));
});

// Start browserSync server
gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: 'build'
    }
  })
})

// Start stylesheets task
gulp.task('stylesheets', function() {
  gulp.src('source/assets/stylesheets/**/*.scss') // Get all *.scss files
    .pipe(sourcemaps.init()) // Initialize sourcemap plugin
    .pipe(sass()) // Compiling sass
    .pipe(autoprefixer()) // Adding browser prefixes
    .pipe(sourcemaps.write()) // Writing sourcemaps
    .pipe(gulp.dest('build/assets/stylesheets'))
    .pipe(browserSync.reload({
      stream: true
    }));
})

// Start scripts task
gulp.task('scripts', function() {
  gulp.src('source/assets/scripts/*.js')
    .pipe(gulp.dest('build/assets/scripts'));
});

// Start watch groups of tasks
gulp.task('watch', ['browserSync', 'templates', 'stylesheets', 'scripts', 'kss'], function() {
  gulp.watch('source/assets/stylesheets/**/*.scss', ['stylesheets']); // Watch for SCSS changes
  gulp.watch('source/assets/scripts/**/*.js', ['scripts']); // Watch for JS changes
  gulp.watch('source/**/*.html', ['templates']); // Watch for template changes
  gulp.watch('source/**', ['kss']); // Watch for style guide changes
  gulp.watch('build/**.html', browserSync.reload);
});

// Start build task
gulp.task('build', ['templates', 'stylesheets', 'scripts', 'kss'], function() {})