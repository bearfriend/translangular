'use strict';

var gulp = require('gulp');
var gutil = require("gulp-util");
var webpack = require('webpack');
var ngAnnotatePlugin = require('ng-annotate-webpack-plugin');

gulp.task("webpack", function(callback) {
  // run webpack
  webpack({
    entry: './src/translangular.ts',
    output: {
      filename: './dist/translangular.js'
    },
    // Turn on sourcemaps
    devtool: 'source-map',
    resolve: {
      extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
    },
    // Add minification
    plugins: [
      //new webpack.optimize.UglifyJsPlugin()
      new ngAnnotatePlugin({
            add: true
            // other ng-annotate options here
        })
    ],
    module: {
      loaders: [
        { test: /\.ts$/, loader: 'awesome-typescript-loader' }
      ]
    }
  }, function(err, stats) {
    if(err) throw new gutil.PluginError("webpack", err);
    gutil.log("[webpack]", stats.toString({
      // output options
    }));
    callback();
  });
});


gulp.task('build', [ 'webpack' ]);
