import path from 'path';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

import { baseConfig } from './base.config';

export default {
  ...baseConfig,
  entry: {
    app: [
      './app/index.js'
    ],
    common: ['react', 'react-dom', 'redux', 'react-redux', 'react-router', 'react-router-redux', 'react-bootstrap', 'react-bootstrap-table']
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
          exclude: /node_modules\/(?!font-awesome|bootstrap|jackblog-sass|react-bootstrap-table|react-dropzone-component|dropzone)/
        },
        {
          test: /\.css$/,
          loader: 'style!css!postcss',
          exclude: /node_modules\/(?!font-awesome|cropper|react-select|bootstrap|jackblog-sass|react-bootstrap-table|react-datetime|rc-tabs|mermaid|react-dropzone-component|dropzone)/
        }
    ]
  },
  plugins: [
    new ExtractTextPlugin('[name]-[hash].css'),

    new webpack.DefinePlugin({
      'process.env': {
        BROWSER: JSON.stringify(true),
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'production')
      }
    }),

    new webpack.optimize.CommonsChunkPlugin({
      names: ['common'],
      filename: 'common.js' }),

    // optimizations
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        screw_ie8: true,
        sequences: true,
        dead_code: true,
        drop_debugger: true,
        comparisons: true,
        conditionals: true,
        evaluate: true,
        booleans: true,
        loops: true,
        unused: true,
        hoist_funs: true,
        if_return: true,
        join_vars: true,
        cascade: true,
        drop_console: true
      },
      output: {
        comments: false
      }
    }),

    ...baseConfig.plugins
  ]
};
