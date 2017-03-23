var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('js', function() {
    return gulp.src('./src/jquery.hortree.js')
        .pipe(sourcemaps.init())
        .pipe(uglify({mangle: true}))
        .pipe(sourcemaps.write())
        .pipe(rename('jquery.hortree.min.js'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('css', function () {
    return gulp.src('./src/jquery.hortree.css')
        .pipe(gulp.dest('./dist'));
});

gulp.task('build', ['js', 'css']);