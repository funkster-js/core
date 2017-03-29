'use strict'

const tslint = require('gulp-tslint')
const ts = require('gulp-typescript')
const istanbul = require('gulp-istanbul')
const mocha = require('gulp-mocha')
const tar = require('gulp-tar-path')
const gzip = require('gulp-gzip')
const merge = require('merge2')
const del = require('del')
const tslintCustom = require('tslint')

const gulp = require('gulp-help')(require('gulp'))

const tsProject = ts.createProject('tsconfig.json')

gulp.task('clean', 'Cleans the lib directory', () =>
  del([ 'lib', 'dist' ])
)

gulp.task('lint', 'Lints all TypeScript source files', () =>
  gulp.src('src/**/*.ts')
    .pipe(tslint({
      tslint: tslintCustom,
      formatter: 'verbose'
    }))
    .pipe(tslint.report())
)

gulp.task('build', 'Compiles all TypeScript source files', ['clean', 'lint'], () => {
  const result = tsProject.src().pipe(tsProject())

  return merge(
    result.dts.pipe(gulp.dest('lib')),
    result.js.pipe(gulp.dest('lib')))
})

gulp.task('pre-test', ['build'], () =>
  gulp.src(['lib/**/*.js'])
    .pipe(istanbul())
    .pipe(istanbul.hookRequire())
)

gulp.task('test', 'Runs the tests', ['pre-test'], () =>
  gulp.src('test/*.ts')
    .pipe(mocha({ require: ['ts-node/register'] }))
    .pipe(istanbul.writeReports())
    .pipe(istanbul.enforceThresholds({ thresholds: { global: 90 } }))
)

gulp.task('pre-package', 'Prepares a release by copying all relevant files to the lib dir', ['test'], () =>
  gulp.src(['package.json', 'LICENSE', 'yarn.lock'])
    .pipe(gulp.dest('lib'))
)

gulp.task('package', 'Creates a tarball from the prepared lib dir in the dist dir', ['pre-package'], () =>
  gulp.src(['lib'])
    .pipe(tar('package.tar'))
    .pipe(gzip())
    .pipe(gulp.dest('dist'))
)

gulp.task('default', ['test'])
