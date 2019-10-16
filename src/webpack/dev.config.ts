const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const config = require('./config');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');

import { config as configs } from './config';

export const devCfg = () => {
  const config = configs.get();
  return {
    entry: {
      index: [
        "webpack-hot-middleware/client?reload=true&timeout=2000&overlay=false",
      ]
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
          loader: 'url-loader?limit=100000',
          test: /\.(woff|woff2|eot|ttf)$/,
          exclude: /(node_modules)/
        },
        {
          test: /\.(jpe?g|png|gif|svg)$/,
          loader: 'url-loader?limit=100000&name=img/[hash].[ext]',
          exclude: /node_modules/,
        },
        {
          test: /\.mp3$/,
          include: /src/,
          loader: 'file-loader',
          exclude: /node_modules/,
        },
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        'DEBUG': config.debug,
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
      new HtmlWebpackPlugin({
        filename: 'index.html',
        // template: config.htmlPath,
        // favicon: path.resolve(config.rootPath, 'favicon.ico') || '',
        // TODO front_config的dev环境模拟
        front_config: `<script>window.CODEMAOCONFIG = ${JSON.stringify(config)}</script>`,
      }),
      // new HtmlWebpackTagsPlugin({
      //   tags: ['dll/vender.dll.js'],
      //   append: false,
      // }),
    ]
  };
}