const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin;
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const configs = require('./config');
const getBabelConfig = require('./babel');

module.exports = () => {
  const config = configs.get();
  const commonConfig = {
    entry: config.entryPath,
    output: {
      // 打包输出的文件
      path: config.buildPath,
      publicPath: config.publicPath,
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
      plugins: [new TsconfigPathsPlugin()],
    },
    module: {
      rules: [
        {
          test: /\.(jpe?g|png|gif|svg)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'url-loader',
              options: {
                emitFile: true,
                limit: 3 * 1024,
                name: 'images/[name]__[hash:5].[ext]',
                publicPath: config.publicPath,
              },
            },
          ],
        },
        {
          test: /\.(woff|woff2|eot|ttf|mp3|mp4)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: 'assets/[name]__[hash:5].[ext]',
                publicPath: config.publicPath,
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
        dry: false,
      }),
      new webpack.DefinePlugin({
        'DEBUG': config.isDev,
        ...config.definePlugin,
      }),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    ],
  };
  if (config.analyzePlugin) {
    commonConfig.plugins.push(new BundleAnalyzerPlugin());
  }
  if (config.loaderOptions) {
    commonConfig.module.rules.push(...config.loaderOptions);
  }
  if (config.pluginOptions) {
    commonConfig.plugins.push(...config.pluginOptions);
  }

  return commonConfig;
};