const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');
const pxtorem = require('postcss-pxtorem');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack');
const merge = require('webpack-merge');

const commonCfg = require('./common.config');
const configs = require('./config');

module.exports = () => {
  const config = configs.get();
  const baseConfig = commonCfg();
  const libraries = config.libs;
  const prodConfig = merge(baseConfig, {
    mode: 'production',
    output: {
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
            {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: 'css-loader',
              options: {
                modules: {
                  localIdentName: config.cssScopeName,
                },
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: () => {
                  const plugin = [autoprefixer()];
                  if (config.pxtorem) {
                    plugin.push(pxtorem(config.pxtorem));
                  }
                  return plugin;
                },
              },
            },
            'sass-loader',
          ],
        },
      ],
    },
    plugins: [
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
      new ImageminPlugin({
        bail: false, // Ignore errors on corrupted images
        name: '[name]__[hash:5].[ext]',
        imageminOptions: {
          plugins: [
            ['jpegtran', { progressive: true }],
            ['optipng', { optimizationLevel: 5 }],
            ['pngquant', {
                quality: [0.65],
                speed: 4,
              },
            ],
            ['svgo', {
                plugins: [{ removeViewBox: false }],
              },
            ],
          ],
        },
      }),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    ],
  });
  return prodConfig;
};