import webpack from 'webpack';
import path from 'path';
import autoprefixer from 'autoprefixer';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import ProgressBarPlugin from 'progress-bar-webpack-plugin';
import FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');

import { config as configs } from './config';
import { getBabelConfig } from './babel';

export const devCfg = () => {
  const config = configs.get();
  return {
    entry: config.entryPath,
    output: {
      // 打包输出的文件
      path: config.buildPath,
      publicPath: config.publicPath,
      filename: 'js/[name].js',
      chunkFilename: 'js/[name].js',
    },
    resolve: {
      modules: [
        config.rootPath,
        'node_modules',
      ],
      alias: {
        'root': config.rootPath,
        ...config.alias,
      },
      extensions: ['.ts', '.tsx', '.js', '.css', '.scss'],
      symlinks: false,
      cacheWithContext: false,
    },
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
    module: {
      rules: [
        {
          test: /\.css$/,
          include: /node_modules/,
          use: [
            'style-loader',
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                plugins: () => {
                  return [
                    autoprefixer(),
                  ];
                },
              },
            },
            'sass-loader',
          ],
        },
        {
          test: /\.s?css$/,
          exclude: /node_modules/,
          use: [
            { loader: 'style-loader' },
            {
              loader: 'css-loader',
              options: {
                modules: true,
                localIdentName: config.cssScopeName,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: () => {
                  return [
                    autoprefixer(),
                  ];
                },
              },
            },
            'sass-loader',
          ],
        },
        {
          test: /\.(woff|woff2|eot|ttf|mp3)$/,
          exclude: /(node_modules)/,
          use: [
            {
              loader: 'file-loader',
            },
          ],
        },
        {
          test: /\.(jpe?g|png|gif|svg)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 100000,
                name: 'img/[hash].[ext]',
              },
            },
          ],
        },
        {
          test: /\.(ts|tsx)?$/,
          use: [
            {
              loader: 'babel-loader',
              options: getBabelConfig(),
            },
          ],
          exclude: /(node_modules)/,
        },
        {
          test: /\.worker\.js$/,
          use: {
            loader: 'worker-loader',
            options: {
              name: '[name].js',
              inline: true,
            },
          },
          exclude: /(node_modules)/,
        },
      ],
    },
    plugins: [
      new ProgressBarPlugin(),
      new FriendlyErrorsWebpackPlugin(),
      new CleanWebpackPlugin({
        verbose: true, // Write logs to console.
        dry: false, // Use boolean 'true' to test/emulate delete. (will not remove files).
      }),
      new webpack.DefinePlugin({
        'DEBUG': true,
        ...config.definePlugin,
      }),
      new HtmlWebpackPlugin({
        ...config.htmlPlugin,
      }),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
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