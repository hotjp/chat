/*
参考代码网址：
http://www.ido321.com/1622.html           
http://colobu.com/2014/11/17/gulp-plugins-introduction/#gulp-rename            
https://github.com/nimojs/gulp-book  
 */
// 获取 gulp
var gulp = require('gulp'),
  // js 压缩插件 （用于压缩 JS）
  uglify = require('gulp-uglify'),
  // 压缩css插件(cssnano将取代gulp-minify-css)
  minifyCSS = require('gulp-minify-css'),
  cssnano = require('gulp-cssnano'),
  // 获取 gulp-imagemin 模块
  imagemin = require('gulp-imagemin'),
  // 重命名 插件
  rename = require('gulp-rename'),
  // 压缩html插件
  htmlmin = require('gulp-htmlmin'),
  // 合并文件
  concat = require("gulp-concat"),
  // html 文件对合并文件后的替换处理插件
  htmlReplace = require("gulp-html-replace"),
  // 复制文件（文件拷贝）
  copy = require('copy');

// 版本号
var APP_VERSION = 'v.1.0';


/*************************************************************
 *                         编译      
 ************************************************************/

// js 压缩合并任务
gulp.task('ugconjs', function () {
  // 1. 找到文件
  gulp.src(['js/concat_base.js', 'js/uglify_utils.js'])
    // 2. 压缩文件
    .pipe(uglify())
    // 3. 合并成一个文件
    .pipe(concat('main.js'))
    // 4. 改名
    .pipe(rename(function (path) {
      path.basename += "_" + APP_VERSION;
    }))
    // 5. 另存压缩后的文件
    .pipe(gulp.dest('dist/js'))
});

// 组合任务： 先替换html再压缩
gulp.task('htmlcomp', function () {
  var options = {
    collapseWhitespace: true, //压缩HTML
    //省略布尔属性的值 <input checked="true"/> ==> <input />
    collapseBooleanAttributes: false,
    //删除所有空格作属性值 <input id="" /> ==> <input />
    removeEmptyAttributes: true,
    //删除<script>的type="text/javascript"
    removeScriptTypeAttributes: true,
    //删除<style>和<link>的type="text/css"
    removeStyleLinkTypeAttributes: true,
    minifyJS: true, //压缩页面JS
    minifyCSS: true //压缩页面CSS
  };
  gulp.src('canvas_test.html')
    .pipe(htmlReplace({ 'js': 'js/all_' + APP_VERSION + '.js' }))
    .pipe(htmlmin(options))
    .pipe(gulp.dest('dist/'));
});

// 默认任务
gulp.task('default', ['clean'], function () {
  gulp.start('ugconjs', 'htmlcomp', 'copy', 'css', 'images');
});

/*************************************************************
 *               本地js  html css本地压缩      
 ************************************************************/
// 字符串拷贝进 js/str.js 中, 然后运行 `gulp str-js`
gulp.task('str-js', function () {
  gulp.src('js/str.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));
});
// 字符串拷贝进 css/str.css 中, 然后运行 `gulp str-css`
gulp.task('str-css', function () {
  gulp.src('css/str.css')
    .pipe(cssnano())
    .pipe(gulp.dest('dist/css'));
});
// 字符串拷贝进 str.html 中, 然后运行 `gulp str-html`
gulp.task('str-html', function () {
  var options = {
    collapseWhitespace: true, //压缩HTML
    //省略布尔属性的值 <input checked="true"/> ==> <input />
    collapseBooleanAttributes: false,
    //删除所有空格作属性值 <input id="" /> ==> <input />
    removeEmptyAttributes: true,
    //删除<script>的type="text/javascript"
    removeScriptTypeAttributes: true,
    //删除<style>和<link>的type="text/css"
    removeStyleLinkTypeAttributes: true,
    minifyJS: true, //压缩页面JS
    minifyCSS: true //压缩页面CSS
  };
  gulp.src('str.html')
    .pipe(htmlmin(options))
    .pipe(gulp.dest('dist'));
});