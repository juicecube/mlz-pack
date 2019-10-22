import path from 'path';
import autoprefixer from 'autoprefixer';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ProgressBarPlugin from 'progress-bar-webpack-plugin';
import FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin';
const HtmlWebpackPlugin = require('html-webpack-plugin');

import { config as configs } from './config';
import { getBabelConfig } from './babel';
import { filter } from '../utils';

export const commonCfg = () => {
  const config = configs.get();
  const webpackConfig = {
    entry: {
      index: config.entryPath,
    },
    output: {
      // 打包输出的文件
      path: config.buildPath,
      publicPath: '/',
    },
    resolve: {
      modules: [
        config.rootPath,
        'node_modules'
      ],
      alias: {
        "root": config.rootPath,
        ...config.alias
      },
      extensions: ['.ts', '.tsx', '.js', '.css', '.scss'],
      symlinks: false,
      cacheWithContext: false
    },
    module: {
      rules: [
        {
          enforce: 'pre' as 'pre',
          test: /\.tsx?$/,
          use: [
            {
              loader: 'tslint-loader',
              options: {
                emitErrors: false,
              },
            },
          ],
          exclude: /node_modules/,
        },
        {
          test: /\.s?css$/,
          exclude: /node_modules/,
          include: [
            path.resolve(config.rootPath, 'src')
          ],
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                hmr: config.isDev,
              },
            },
            {
              loader: 'css-loader',
              options: {
                modules: {
                  localIdentName: config.cssScopeName
                }
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: function () {
                  return [
                    autoprefixer(),
                  ];
                }
              }
            },
            'sass-loader'
          ]
        },
        {
          test: /\.(ts|tsx)?$/,
          use: [
            {
              loader: 'babel-loader',
              options: getBabelConfig(),
            }
          ],
          include: path.resolve(config.rootPath, 'src'),
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
          exclude: /(node_modules)/
        }
      ],
    },
    plugins: [
      new ProgressBarPlugin(),
      new FriendlyErrorsWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: config.isDev ? '[name].css' : '[name].[contenthash].css',
        chunkFilename: config.isDev ? '[id].css' : '[id].[contenthash].css',
        ignoreOrder: false, // Enable to remove warnings about conflicting order
      }),
      new CleanWebpackPlugin({
        verbose: true, // Write logs to console.
        dry: false, // Use boolean 'true' to test/emulate delete. (will not remove files).
      }),
    ],
  };
  const htmlConfig = filter({
    inject: 'head',
    filename: config.htmlPlugin.filename,
    template: config.htmlPlugin.template,
    favicon: config.htmlPlugin.favicon,
    minify: config.isDev ? undefined : {
      removeAttributeQuotes: true,
      collapseWhitespace: true,
      html5: true,
      minifyCSS: true,
      removeComments: false,
      removeEmptyAttributes: true,
    },
    ...config.htmlPlugin.options
  }, (item) => item !== undefined);
  console.log(htmlConfig);
  webpackConfig.plugins.push(new HtmlWebpackPlugin(htmlConfig));
  if (config.analyze) {
    webpackConfig.plugins.push(new BundleAnalyzerPlugin());
  }

  return webpackConfig;
}