const merge = require('webpack-merge');
const webpack = require('webpack');
const path = require('path');
import TerserPlugin from 'terser-webpack-plugin';
const CompressionPlugin = require("compression-webpack-plugin")
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = require('./config');
const libraries = config.libs;
export const prodCfg = () =>{
  return {
    mode: 'production',
    output: {
      publicPath: config.CDN_PATH, // local: '/'
      filename: 'js/[name].[chunkhash].js',
      chunkFilename: 'js/[name].[chunkhash].js'
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
            }
          }
        }
      },
      minimizer: [
        new TerserPlugin({
          sourceMap: true,
        }),
        new OptimizeCSSAssetsPlugin({
          cssProcessorOptions: {
            discardComments: { removeAll: true },
          },
          canPrint: true
        }),
      ]
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
                limit: 3 * 1024,
                name: 'images/[name]_[hash:5].[ext]',
                publicPath: config.CDN_PATH,
              }
            },
            {
              loader: 'image-webpack-loader', //图片压缩
            }
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
                publicPath: config.CDN_PATH,
              }
            }
          ],
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        'DEBUG': false,
      }),
      new CompressionPlugin({
        test: /\.js$|\.css$|\.html$/,
        threshold: 1024,
        minRatio: 0.8
      }),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: path.resolve(config.SRC_PATH, 'index.ejs'),
        favicon: path.resolve(config.ROOT_PATH, 'favicon.ico'),
        minify: {
          removeAttributeQuotes: true,
          collapseWhitespace: true,
          html5: true,
          minifyCSS: true,
          removeComments: false,
          removeEmptyAttributes: true,
        },
      }),
      new InlineManifestWebpackPlugin(),
      new webpack.SourceMapDevToolPlugin({
        // this is the url of our local sourcemap server
        publicPath: config.SOURCEMAP,
        filename: '[file].map',
      })
    ]
  };
}