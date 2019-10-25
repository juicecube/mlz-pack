const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');

import { config as configs } from './config';

export const devCfg = () => {
  const config = configs.get();
  return {
    entry: {
    },
    output: {
      filename: 'js/[name].js',
      chunkFilename: 'js/[name].js',
      pathinfo: false,
    },
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
    module: {
      rules: [
        {
          test: /\.(woff|woff2|eot|ttf|mp3)$/,
          exclude: /(node_modules)/,
          use: [
            {
              loader: require.resolve('file-loader'),
            },
          ],
        },
        {
          test: /\.(jpe?g|png|gif|svg)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: require.resolve('url-loader'),
              options: {
                limit: 100000,
                name: 'img/[hash].[ext]',
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        'DEBUG': true,
        ...config.definePlugin,
      }),
      new webpack.HotModuleReplacementPlugin(),
      // TODO 的环境dll加速build
      // new webpack.DllReferencePlugin({
      //   context: path.join(__dirname, 'dll'),
      //   manifest: require('./dll/vender-manifest.json'),
      // }),
      // new CopyWebpackPlugin([{
      //   from: path.resolve(__dirname, 'dll'),
      //   to: 'dll',
      // }]),
      // new HtmlWebpackTagsPlugin({
      //   tags: ['dll/vender.dll.js'],
      //   append: false,
      // }),
    ],
  };
};