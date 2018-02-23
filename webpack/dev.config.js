import path from 'path';
import webpack from 'webpack';
import { isArray } from 'lodash';

import writeStats from './utils/write-stats';
import startExpress from './utils/start-express';
import { baseConfig } from './base.config';

const PORT = parseInt(process.env.PORT, 10) + 1 || 3001;
const LOCAL_IP = require('dev-ip')();
const HOST = isArray(LOCAL_IP) && LOCAL_IP[0] || LOCAL_IP || 'localhost';
//const HOST = 'localhost';
const PUBLIC_PATH = `http://${HOST}:${PORT}/assets/`;

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
    ...baseConfig,
    devtool: 'cheap-module-source-map',
    entry: {
      app: [
        `webpack-hot-middleware/client?path=http://${HOST}:${PORT}/__webpack_hmr`,
        './app/index.js'
      ],
      common: ['react', 'react-dom', 'redux', 'react-redux', 'react-router', 'react-router-redux', 'react-bootstrap', 'react-bootstrap-table', 'react-dnd', 'react-dnd-html5-backend' ]
    },
    output: {
      ...baseConfig.output,
      publicPath: PUBLIC_PATH
    },
    module: {
      ...baseConfig.module,
      loaders: [
        ...baseConfig.module.loaders,
        {
          test: /\.(jpe?g|png|gif|svg|woff|woff2|eot|ttf)(\?v=[0-9].[0-9].[0-9])?$/,
          loaders: [
            'url?limit=1000&name=[sha512:hash:base64:7].[ext]'
          ],
          exclude: /node_modules\/(?!font-awesome|bootstrap|react-bootstrap-table|react-dropzone-component|dropzone)/
        },
        {
          test: /\.css$/,
          loader: 'style!css!postcss',
          exclude: /node_modules\/(?!font-awesome|cropper|react-select|bootstrap|react-bootstrap-table|react-datetime|rc-tabs|mermaid|react-dropzone-component|dropzone)/
        }
      ]
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),

      new webpack.DefinePlugin({
        'process.env': {
          BROWSER: JSON.stringify(true),
          NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
        }
      }),

      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.OccurenceOrderPlugin(),

      new webpack.optimize.CommonsChunkPlugin({
        names: ['common'],
        filename: 'common.js' }),

      function() { this.plugin('done', writeStats); },
      function() { this.plugin('done', startExpress); }
    ]
  }
};
