const browserify = require("browserify"),
source = require("vinyl-source-stream"),
buffer = require("vinyl-buffer"),
gulp = require("gulp"),
uglify = require("gulp-uglify"),
gutil = require('gulp-util'),
babelify = require('babelify');

gulp.task("minificar", function(){
var b = browserify({
    entries: "./js/algoritmos.js",
    transform: [ ["babelify", { presets: ["env","es2015"]}] ]
});

return b.bundle()
    .pipe(source("algoritmos.min.js"))
    .pipe(buffer())
    .pipe(uglify())
    .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
    .pipe(gulp.dest("./js/"));
});

//npm install browserify vinyl-source-stream vinyl-buffer gulp gulp-uglify gulp-util babelify babel-core babel-preset-es2015 babel-preset-env