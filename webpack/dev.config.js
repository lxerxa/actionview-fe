import path from 'path';
import webpack from 'webpack';
import { isArray } from 'lodash';

import writeStats from './utils/write-stats';
import startExpress from './utils/start-express';
import postCSSPlugins from './postcss.config';

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
        `webpack-hot-middleware/client?path=http://${HOST}:${PORT}/__webpack_hmr`,
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
        { test: JS_REGEX, exclude: /node_modules/, loader: 'eslint' }
      ],
      loaders: [
        { test: /\.json$/, exclude: /node_modules/, loader: 'json' },
        { test: JS_REGEX, exclude: /node_modules/, loader: 'babel' },
        {
          test: /\.(jpe?g|png|gif|svg|woff|woff2|eot|ttf)(\?v=[0-9].[0-9].[0-9])?$/,
          loader: 'file?name=[sha512:hash:base64:7].[ext]',
          exclude: /node_modules\/(?!font-awesome|bootstrap)/
        },
        { test: /\.css$/, exclude: /node_modules/, loader: 'style!css!postcss' }
      ]
    },
    postcss: [ ...postCSSPlugins ],
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),

      new webpack.DefinePlugin({
        'process.env': {
          BROWSER: JSON.stringify('true'),
          NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
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
