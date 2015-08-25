import path from 'path';
import webpack from 'webpack';
import { isArray } from 'lodash';
import cssnext from 'cssnext';

import writeStats from './utils/write-stats';
import startExpress from './utils/start-express';

const PORT = parseInt(process.env.PORT, 10) + 1 || 3001;
const LOCAL_IP = require('dev-ip')();
const HOST = isArray(LOCAL_IP) && LOCAL_IP[0] || LOCAL_IP || 'localhost';
const PUBLIC_PATH = `http://${HOST}:${PORT}/assets/`;
const JS_REGEX = /\.js$|\.jsx$|\.es6$|\.babel$/;

export default {
  server: {
    port: PORT,
    options: {
      publicPath: PUBLIC_PATH,
      hot: true,
      stats: {
        assets: true,
        colors: true,
        version: false,
        hash: false,
        timings: true,
        chunks: false,
        chunksModule: false
      }
    }
  },
  webpack: {
    devtool: 'cheap-module-source-map',
    entry: {
      app: [
        `webpack-dev-server/client?http://0.0.0.0:${PORT}`,
        'webpack/hot/only-dev-server',
        './app/index.js'
      ]
    },
    output: {
      path: path.join(__dirname, '../dist'),
      filename: '[name]-[hash].js',
      chunkFilename: '[name]-[hash].js',
      publicPath: PUBLIC_PATH
    },
    module: {
      preLoaders: [
        {test: JS_REGEX, exclude: /node_modules/, loader: 'eslint'}
      ],
      loaders: [
        {test: /\.json$/, exclude: /node_modules/, loader: 'json'},
        {test: JS_REGEX, exclude: /node_modules/, loaders: ['react-hot', 'babel']},
        {test: /\.(jpe?g|png|gif|svg|woff|woff2|eot|ttf)$/, loader: 'file?name=[sha512:hash:base64:7].[ext]'},
        {test: /\.css$/, exclude: /node_modules/, loader: 'style!css!postcss'}
      ]
    },
    postcss: [
      cssnext()
    ],
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),

      new webpack.DefinePlugin({
        'process.env': {
          BROWSER: JSON.stringify('true'),
          NODE_ENV: JSON.stringify('development')
        }
      }),

      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.OccurenceOrderPlugin(),

      function() { this.plugin('done', writeStats); },
      function() { this.plugin('done', startExpress); }
    ],
    resolve: {
      extensions: ['', '.js', '.jsx', '.babel', '.es6', '.json'],
      modulesDirectories: ['node_modules', 'app']
    }
  }
};
