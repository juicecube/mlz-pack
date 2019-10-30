import webpack from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';
import CompressionPlugin from 'compression-webpack-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import autoprefixer from 'autoprefixer';
import HtmlWebpackPlugin from 'html-webpack-plugin';

import { config as configs } from './config';
import { getBabelConfig } from './babel';

export const prodCfg = () => {
  const config = configs.get();
  const libraries = config.libs;
  return {
    mode: 'production',
    entry: config.entryPath,
    output: {
      path: config.buildPath,
      publicPath: config.publicPath, // local: '/'
      filename: 'js/[name].[chunkhash].js',
      chunkFilename: 'js/[name].[chunkhash].js',
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
    optimization: {
      removeAvailableModules: true,
      removeEmptyChunks: true,
      moduleIds: 'hashed',
      runtimeChunk: {
        name: 'manifest',
      },
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendors: {
            test: /node_modules/,
            chunks: 'all',
            name(module) {
              let name = 'venderLibs';
              if (libraries) {
                const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
                const names = Object.keys(libraries);
                names.map((val) => {
                  if (libraries[val].indexOf(packageName) >= 0) {
                    name = val;
                  }
                });
              }
              return name;
            },
          },
        },
      },
      minimizer: [
        new TerserPlugin({ sourceMap: true }),
        new OptimizeCSSAssetsPlugin({
          cssProcessorOptions: {
            discardComments: { removeAll: true },
          },
          canPrint: true,
        }),
      ],
    },
    module: {
      rules: [
        {
          test: /\.s?css$/,
          exclude: /node_modules/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
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
          test: /\.(jpe?g|png|gif|svg)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 3 * 1024,
                name: 'images/[name]_[hash:5].[ext]',
                publicPath: config.publicPath,
              },
            },
            // {
            //   loader: require.resolve('image-webpack-loader'), //图片压缩
            // }
          ],
        },
        {
          test: /\.(woff|woff2|eot|ttf|mp3|mp4)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: 'assets/[name]_[hash:5].[ext]',
                publicPath: config.publicPath,
              },
            },
          ],
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
      new CleanWebpackPlugin({
        verbose: true, // Write logs to console.
        dry: false, // Use boolean 'true' to test/emulate delete. (will not remove files).
      }),
      new webpack.DefinePlugin({
        'DEBUG': false,
        ...config.definePlugin,
      }),
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css',
        chunkFilename: '[id].[contenthash].css',
        ignoreOrder: false, // Enable to remove warnings about conflicting order
      }),
      new CompressionPlugin({
        test: /\.js$|\.css$|\.html$/,
        threshold: 1024,
        minRatio: 0.8,
      }),
      new webpack.SourceMapDevToolPlugin({
        // TODO sourceMap的地址
        // this is the url of our local sourcemap server
        // publicPath: config.SOURCEMAP,
        filename: '[file].map',
      }),
      new HtmlWebpackPlugin({
        ...config.htmlPlugin,
        removeAttributeQuotes: true,
        collapseWhitespace: true,
        html5: true,
        minifyCSS: true,
        removeComments: false,
        removeEmptyAttributes: true,
      }),
    ],
  };
};