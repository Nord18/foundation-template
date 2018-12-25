var gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'),
    cleanCSS = require('gulp-clean-css')
    rename = require("gulp-rename"),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    plumber = require('gulp-plumber'),
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload,
    panini = require('panini');

var path = {

    build: {
        js: 'js/',
        css: 'css/',
        html: './'
    },

    src: {
        js: 'src/js/app.js',
        scss: 'src/scss/app.scss',
        html: 'src/html/pages/**/*.html',
        img: 'images/*'
    },

    watch: {
        js: 'src/js/*.js',
        scss: 'src/scss/*.scss',
        html: 'src/html/pages/**/*.html',
        img: 'images/*'
    },
};

var sassPaths = [
    'node_modules/foundation-sites/scss',
    'node_modules/motion-ui/src'
];

gulp.task('js:build', function () {
     gulp.src(path.src.js)
        .pipe(rigger())
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(rename('app.min.js'))
        .pipe(gulp.dest(path.build.js))
        .pipe(browserSync.stream());
});

gulp.task('scss:build', function () {
     gulp.src(path.src.scss)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass({
        	includePaths: sassPaths
        }))
        .pipe(prefixer({
        	browsers: ['last 2 versions', 'ie >= 9', 'android >= 4.4', 'ios >= 7']
        }))
        .pipe(cleanCSS())
        .pipe(rename('app.min.css'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css))
        .pipe(browserSync.stream());
});

gulp.task('html:build', function () {
    gulp.src(path.src.html)
    .pipe(browserSync.stream())
    .pipe(panini({
        root: 'src/html/pages/',
        layouts: 'src/html/layouts/',
        partials: 'src/html/partials/',
        helpers: 'src/html/helpers/',
        data: 'src/html/data/'
    }))
    .pipe(gulp.dest(path.build.html));
});

gulp.task('img:watch', function () {
    gulp.src(path.src.img)
    .pipe(imagemin())
    .pipe(browserSync.stream());
});

gulp.task('build', [
    'js:build',
    'scss:build',
    'html:build',
    'img:watch'
]);

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    gulp.watch(path.src.scss);
    gulp.watch(path.src.js);
    gulp.watch(path.src.html);
    gulp.watch(path.src.img);
});

gulp.task('watch', function(){
    watch([path.watch.scss], function(event, cb) {
        gulp.start('scss:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('img:watch');
    });
});

gulp.task('default', ['build', 'watch', 'browser-sync']);