import path from 'path';
import autoprefixer from 'autoprefixer';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ProgressBarPlugin from 'progress-bar-webpack-plugin';
import FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin';

import { config as configs } from './config';

// Configs

export const commonCfg = () => {
  const config = configs.get();
  return {
    entry: {
      index: [ path.resolve(config.SRC_PATH, './index.js') ],
    },
    output: {
      // 打包输出的文件
      path: config.BUILD_PATH,
      publicPath: '/',
    },
    resolve: {
      modules: [
        config.ROOT_PATH,
        'node_modules'
      ],
      alias: {
      "root": config.ROOT_PATH,
      "src": config.SRC_PATH
      },
      extensions: ['.ts', '.tsx', '.js', '.css', '.scss'],
      symlinks: false,
      cacheWithContext: false
    },
    externals: {
      'CONFIG': config.IS_DEV ? `'${JSON.stringify(config.RUNTIME)}'` : {},
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
            path.resolve(config.ROOT_PATH, 'src')
          ],
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                hmr: config.IS_DEV,
              },
            },
            {
              loader: 'css-loader',
              options: {
                modules: {
                  localIdentName: config.CSS_SCOPED_NAME
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
            'babel-loader',
          ],
          include: path.resolve(config.ROOT_PATH, 'src'),
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
        filename: config.IS_DEV ? '[name].css' : '[name].[contenthash].css',
        chunkFilename: config.IS_DEV ? '[id].css' : '[id].[contenthash].css',
        ignoreOrder: false, // Enable to remove warnings about conflicting order
      }),
      new CleanWebpackPlugin({
        verbose: true, // Write logs to console.
        dry: false, // Use boolean 'true' to test/emulate delete. (will not remove files).
      }),
      // config.ANALYZE && new BundleAnalyzerPlugin()
    ],
  };
}