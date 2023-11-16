const { src, dest, watch, parallel} = require("gulp");

//css
const sass = require("gulp-sass")(require('sass'));
const plumber = require("gulp-plumber");
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');

//javascript
const terser = require('gulp-terser-js');

//img
const avif = require('gulp-avif');
const imagemin = require('gulp-imagemin');
const webp = require("gulp-webp");
const cache = require("gulp-cache");


function javascript( done ){
    src('src/js/**/*.js')
    .pipe(dest('build/js'))
    done();
}


function Vavif( done ){

    const opciones = {
        quality: 50
    };

    src('src/img/**/*.{jpg,png}')
    .pipe( avif(opciones))
    .pipe(dest('build/img'))

    done();
}


function imagenes(done){

    const opciones = {
        optimizationLevel: 3
    }

    src('src/img/**/*.{jpg,png}')
    .pipe(cache( imagemin (opciones) ) )
    .pipe(dest('build/img'))
    done();
}

function Vwebp(done){

    const opciones = {
        quality: 50
    };

    src('src/img/**/*.{jpg,png}')
    .pipe( webp(opciones))
    .pipe(dest('build/img'))

    done();
}

function css ( done ){

    src('src/scss/**/*.scss') // identificar el archivo SASS
   // .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(sass())           //Compilarlo
    //.pipe( postcss([autoprefixer(), cssnano()]))
   // .pipe(sourcemaps.write('.'))
    .pipe( dest("build/css")) // Almacenarla en el disco duro
    done();
}

function dev(done){
    watch('src/js/**/*.js', javascript)
    watch("src/scss/**/*.scss", css)
    done();
}


exports.css = css;
exports.js = javascript;
exports.Vavif = Vavif;
exports.imagenes = imagenes;
exports.Vwebp = Vwebp
exports.dev = parallel(javascript, Vavif, imagenes, Vwebp, dev);
