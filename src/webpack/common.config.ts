import path from 'path';
import autoprefixer from 'autoprefixer';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import ProgressBarPlugin from 'progress-bar-webpack-plugin';
import FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';

import { config as configs } from './config';
import { getBabelConfig } from './babel';
import { filter } from '../utils';

export const commonCfg = () => {
  const config = configs.get();
  const webpackConfig = {
    entry: config.entryPath,
    output: {
      // 打包输出的文件
      path: config.buildPath,
      publicPath: config.publicPath || '/',
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
    module: {
      rules: [
        {
          test: /\.s?css$/,
          exclude: /node_modules/,
          include: [
            path.resolve(config.rootPath, 'src'),
          ],
          use: [
            { loader: require.resolve('style-loader') },
            {
              loader: 'css-loader',
              options: {
                modules: true,
                localIdentName: config.cssScopeName,
              },
            },
            {
              loader: require.resolve('postcss-loader'),
              options: {
                plugins: () => {
                  return [
                    autoprefixer(),
                  ];
                },
              },
            },
            require.resolve('sass-loader'),
          ],
        },
        {
          test: /\.css$/,
          include: [
            path.resolve(config.rootPath, 'node_modules/perfect-scrollbar/dist/css'),
            path.resolve(config.rootPath, 'node_modules/animate.css/animate.css'),
          ],
          use: [
            require.resolve('style-loader'),
            require.resolve('css-loader'),
            {
              loader: require.resolve('postcss-loader'),
              options: {
                plugins: () => {
                  return [
                    autoprefixer(),
                  ];
                },
              },
            },
          ],
        },
        {
          test: /\.(ts|tsx)?$/,
          use: [
            {
              loader: require.resolve('babel-loader'),
              options: getBabelConfig(),
            },
          ],
          include: path.resolve(config.rootPath, 'src'),
          exclude: /(node_modules)/,
        },
        {
          test: /\.worker\.js$/,
          use: {
            loader: require.resolve('worker-loader'),
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
    ],
  };
  const htmlConfig = filter({
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
    ...config.htmlPlugin.options,
  }, (item) => item !== undefined);
  webpackConfig.plugins.push(new HtmlWebpackPlugin(htmlConfig));
  if (config.analyzePlugin) {
    webpackConfig.plugins.push(new BundleAnalyzerPlugin());
  }

  return webpackConfig;
};