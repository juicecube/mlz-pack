import webpack from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';
import CompressionPlugin from 'compression-webpack-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

import { config as configs } from './config';

export const prodCfg = () => {
  const config = configs.get();
  const libraries = config.libs;
  return {
    mode: 'production',
    output: {
      publicPath: config.publicPath, // local: '/'
      filename: 'js/[name].[chunkhash].js',
      chunkFilename: 'js/[name].[chunkhash].js',
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
          vendor: {
            test: /node_modules/,
            chunks: 'all',
            name(module) {
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
              const names = Object.keys(libraries);
              let name = 'lib';
              names.map((val) => {
                if (libraries[val].indexOf(packageName) >= 0) {
                  name = val;
                }
              });
              return name;
            },
          },
        },
      },
      minimizer: [
        new TerserPlugin({
          sourceMap: true,
        }),
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
              enforce: 'pre',
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
              loader: require.resolve('file-loader'),
              options: {
                name: 'assets/[name]_[hash:5].[ext]',
                publicPath: config.publicPath,
              },
            },
          ],
        },
      ],
    },
    plugins: [
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
    ],
  };
};