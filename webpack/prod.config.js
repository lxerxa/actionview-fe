import path from 'path';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

import { baseConfig } from './base.config';

export default {
  ...baseConfig,
  module: {
    ...baseConfig.module,
    loaders: [
      ...baseConfig.module.loaders,
      {
        test: /\.(svg|woff|woff2|eot|ttf)(\?v=[0-9].[0-9].[0-9])?$/,
        loader: 'file?name=[sha512:hash:base64:7].[ext]',
        exclude: /node_modules\/(?!font-awesome|bootstrap)/
      },
      {
        test: /\.(jpe?g|png|gif)$/,
        loader: 'file?name=[sha512:hash:base64:7].[ext]!image?optimizationLevel=7&progressive&interlaced',
        exclude: /node_modules\/(?!font-awesome|bootstrap)/
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style', 'css!postcss')
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
