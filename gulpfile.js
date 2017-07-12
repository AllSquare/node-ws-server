var gulp	= require("gulp");
var typescript	= require("gulp-typescript");
var rename	= require("gulp-rename");
var changed     = require("gulp-changed");

var tsconfigPath= __dirname + "/tsconfig.json";
var tsconfig    = require(tsconfigPath);
var src         = ['./types/*.d.ts', './src/**/*.ts'];
var dest        = tsconfig.compilerOptions.outDir;

gulp.task("build", function () {
  var tsProject = typescript.createProject(tsconfigPath, {
    typescript: require('typescript')
  });

  return gulp.src(src)
    .pipe(changed(dest, {extension: ".js"}))
    .pipe(tsProject())
    .pipe(rename(function (path) {
      path.extname = ".js";
    }))
    .pipe(gulp.dest(dest));
});
