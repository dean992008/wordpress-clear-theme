const fs = require('fs');
const gulp = require('gulp');
const sass = require('gulp-sass');
const csso = require('gulp-csso');
const autoprefixer = require('gulp-autoprefixer');
const stripDebug = require('gulp-strip-debug');
const uglify = require('gulp-uglify');
const flatten = require('gulp-flatten');
const importer = require('gulp-fontello-import');
const mainBowerFiles = require('gulp-main-bower-files');
const fontmin = require('gulp-fontmin');
const concat = require('gulp-concat');
const ts = require('gulp-typescript');
const strip = require('gulp-strip-comments');
const tinypng = require('gulp-tinypng-compress');
const browserSync = require('browser-sync');
const sourcemaps = require('gulp-sourcemaps');
const wpmanifest = require("gulp-wpmanifest");
const wpPot = require('gulp-wp-pot');
const webpackStream = require('webpack-stream');
const webpack2 = require('webpack');
const argv = require('yargs').argv;
const changeCase = require('change-case');

gulp.task('development:sass', () => {
	gulp.src('./bem/entry.sass')
		.pipe(sass().on('error', sass.logError))
		.pipe(concat('style.css'))
		.pipe(autoprefixer())
		.pipe(wpmanifest({
			name: 'Название темы',
			description: 'Описание темы',
			version: 1.0,
			uri: "...",
			tags: "...",
			author: {
				name: "Имя автора"
			},
			authorUri: "...",
			license: "GNU General Public License v2 or later",
			licenseUri: "http://www.gnu.org/licenses/gpl-2.0.html"
		}))
		.pipe(gulp.dest('./'))
		.pipe(browserSync.stream());
});
gulp.task('development:js', () => {
	gulp.src(['./bem/entry.ts'])
		.pipe(webpackStream(require('./webpack.config'), webpack2))
		.pipe(gulp.dest('./js'));
});
gulp.task('development:image', () => {
	gulp.src(['./bem/**/*.jpg', './bem/**/*.png', './bem/**/*.ico', './bem/**/*.svg', './bem/**/*.gif'])
		.pipe(flatten())
		.pipe(gulp.dest('./img'));
});
gulp.task('development', ['development:sass', 'development:js']);

gulp.task('production:sass', function () {
	gulp.src('./bem/entry.sass')
		.pipe(sass().on('error', sass.logError))
		.pipe(concat('style.css'))
		.pipe(autoprefixer())
		.pipe(csso())
		.pipe(wpmanifest({
			name: 'Название темы',
			description: 'Описание темы',
			version: 1.0,
			uri: "...",
			tags: "...",
			author: {
				name: "Имя автора"
			},
			authorUri: "...",
			license: "GNU General Public License v2 or later",
			licenseUri: "http://www.gnu.org/licenses/gpl-2.0.html"
		}))
		.pipe(gulp.dest('./'));
});
gulp.task('production:js', function () {
	gulp.src(['./bem/entry.ts'])
		.pipe(webpackStream(require('./webpack.config'), webpack2))
		.pipe(stripDebug())
		.pipe(strip())
		.pipe(uglify())
		.pipe(gulp.dest('./js'));
});
gulp.task('production:image', function () {
	gulp.src(['./bem/**/*.jpg', './bem/**/*.png'])
		.pipe(flatten())
		.pipe(tinypng({
			key: 'bRxEP4uNA698Cm1QupLXYwYOQiTpxUg6',
			log: true
		}))
		.pipe(gulp.dest('./img'));
	gulp.src(['./bem/**/*.svg', './bem/**/*.ico'])
		.pipe(flatten())
		.pipe(gulp.dest('./img'));
});
gulp.task('production', ['production:sass', 'production:js']);

gulp.task('watch', function () {
	gulp.watch(['./bem/**/*.sass', './bem/**/*.js', './bem/**/*.jpg', './bem/**/*.png', './bem/**/*.ts'], ['development']);
});

gulp.task('fontgen', function () {
	gulp.src('./font-dev/*.{ttf,otf}')
		.pipe(fontmin({
			fontPath: "../font/"
		}))
		.pipe(gulp.dest('./font'));
});

gulp.task('fontgen-css', function () {
	gulp.src('./font/*.css')
		.pipe(concat('fonts.css'))
		.pipe(gulp.dest('./css/'));
});

gulp.task('bower', function () {
	gulp.src([
		'./bower_components/slick-carousel/slick/slick.min.js',
		'./bower_components/jquery/dist/jquery.min.js'
	])
		.pipe(flatten())
		.pipe(gulp.dest('./js'));
	gulp.src([
		'./bower_components/slick-carousel/slick/slick.css',
		'./bower_components/slick-carousel/slick/slick-theme.css',
	])
		.pipe(flatten())
		.pipe(csso())
		.pipe(gulp.dest('./css'));
	gulp.src([
		'./bower_components/slick-carousel/slick/ajax-loader.gif',
	])
		.pipe(flatten())
		.pipe(gulp.dest('./css'));

	gulp.src([
		'./bower_components/slick-carousel/slick/fonts/*'
	])
		.pipe(flatten())
		.pipe(gulp.dest('./css/fonts'));
});

gulp.task('fontello', function (cb) {
	importer.getFont({
		host: 'http://fontello.com',
		config: 'fontello.json',
		css: 'css',
		font: 'font'
	}, cb);
});

gulp.task('serve', ['development'], function () {
	browserSync.init({
		proxy: "http://piterskie-mastera/",
	});
	gulp.watch(['./bem/**/*.sass', './bem/**/*.js', './bem/**/*.jpg', './bem/**/*.png', './bem/**/*.ts'], ['development']);
	gulp.watch(["../../../../**/*.html", "../../../../**/*.php"]).on('change', browserSync.reload);
});

gulp.task('pot', () => {
	gulp.src('./**/*.php')
		.pipe(wpPot({
			package: 'Example project'
		}))
		.pipe(gulp.dest('../../languages/themes/newxel-en_GB.po'));
});

gulp.task('bem', () => {
	const name = argv.name;
	const ts = argv.ts;
	const sass = argv.sass;
	if (!name.length) {
		return;
	}
	if (!ts && !sass) {
		return;
	}
	if (!fs.existsSync('./bem/' + name)) {
		fs.mkdirSync('./bem/' + name);
	}
	if (sass && !fs.existsSync('./bem/' + name + '/' + name + '.sass')) {
		fs.writeFileSync('./bem/' + name + '/' + name + '.sass', '.' + name);
		fs.appendFileSync('./bem/entry.sass', '\n@import \'./' + name + '/' + name + '\'');
	}
	if (ts && !fs.existsSync('./bem/' + name + '/' + name + '.ts')) {
		const className = changeCase.pascalCase(name);
		const code = `export class ${className} {
	constructor(){
        
    }
}`;
		fs.writeFileSync('./bem/' + name + '/' + name + '.ts', code);
	}
})