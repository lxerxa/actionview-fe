import path from 'path';
import webpack from 'webpack';

import writeStats from './utils/write-stats';

const JS_REGEX = /\.js$|\.jsx$|\.es6$|\.babel$/;
export default {
  baseConfig: {
    devtool: 'source-map',
    output: {
      path: path.resolve(__dirname, '../dist'),
      filename: '[name]-[hash].js',
      chunkFilename: '[name]-[hash].js',
      publicPath: '/assets/'
    },
    module: {
      preLoaders: [
        { test: JS_REGEX, exclude: /node_modules/, loader: 'eslint' }
      ],
      loaders: [
        { test: /\.json$/, exclude: /node_modules/, loader: 'json' },
        { test: JS_REGEX, exclude: /node_modules/, loaders: [ 'react-hot', 'babel' ] },
      ],
    },
    postcss: [
      require('postcss-import')(),
      require('postcss-url')(),
      require('precss')(),
      require('autoprefixer')({ browsers: ['last 2 versions'] })
    ],
    plugins: [
      function() { this.plugin('done', writeStats) }
    ],
    externals: {
      'mermaid': 'window.mermaid',
      '$': 'window.$'
    },
    resolve: {
      extensions: ['', '.js', '.json', '.jsx', '.es6', '.babel'],
      modulesDirectories: ['node_modules', 'app']
    }
  }
}
