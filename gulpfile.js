//concat     - склеиваем js файлы в один
//ngAnnotate - проставляем ag зависимости
//uglify     - минификация в одну строку

var gulp        = require('gulp'),
    concat      = require('gulp-concat'),
    ngAnnotate  = require('gulp-ng-annotate'),
    uglify      = require('gulp-uglify');

gulp.task('build-js', function() {
    return gulp.src(['./app/**/*.js', '!./app/min_js/*.js'])
        .pipe(concat('tim_js.js'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(gulp.dest('./app/min_js'));
});

