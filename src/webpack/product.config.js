const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ImageminPlugin = require('@mlz/imagemin-webpack');
const merge = require('webpack-merge');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const SentryPlugin = require('@sentry/webpack-plugin');

const commonCfg = require('./common.config');
const configs = require('./config');

module.exports = () => {
  const config = configs.get();
  const baseConfig = commonCfg();
  const libraries = config.libs;
  const prodConfig = merge(baseConfig, {
    mode: 'production',
    output: {
      filename: 'js/[name].[contenthash].js',
      chunkFilename: 'js/[name].[contenthash].js',
    },
    optimization: {
      removeAvailableModules: true,
      removeEmptyChunks: true,
      sideEffects: false,
      moduleIds: 'hashed',
      runtimeChunk: {
        name: 'manifest',
      },
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 3000,
        cacheGroups: {
          vendors: {
            test: /node_modules/,
            chunks: 'all',
            name(module) {
              let name = 'venderLibs';
              if (libraries) {
                const context = module.context.split('/');
                const nIndex = context.indexOf('node_modules');
                let packageName = context[nIndex + 1];
                if (packageName.indexOf('@') > -1) {
                  packageName = `${context[nIndex + 1]}/${context[nIndex + 2]}`;
                }
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
        new TerserPlugin({
          sourceMap: true,
          terserOptions: {
            compress: {
              'drop_console': config.dropConsole,
              'drop_debugger': true,
            },
            output: {
              comments: false,
            },
          },
        }),
        new OptimizeCSSAssetsPlugin({
          cssProcessorOptions: {
            discardComments: { removeAll: true },
          },
          canPrint: true,
        }),
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        loading: config.loading,
        cache: false,
        minify: {
          collapseWhitespace: true,
          removeComments: false,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true,
        },
        ...config.htmlPlugin,
      }),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    ],
  });

  if (config.imageminPlugin) {
    prodConfig.plugins.push(new ImageminPlugin({
      bail: false, // Ignore errors on corrupted images
      name: '[name]__[hash:5].[ext]',
      imageminOptions: {
        plugins: [
          ['@mlz/imagemin-mozjpeg', { quality: 50 }],
          ['@mlz/imagemin-optipng', { optimizationLevel: 5 }],
        ],
      },
    }));
  }

  if (config.extraCssPlugin) {
    prodConfig.plugins.push(new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css',
      chunkFilename: 'css/[name].[contenthash].css',
      ignoreOrder: false, // Enable to remove warnings about conflicting order
    }));
  }

  if (config.hardSourcePlugin) {
    prodConfig.plugins.push(new HardSourceWebpackPlugin());
  }

  if (config.sentryPlugin) {
    let version = '0.0.1';
    try {
      version = require(path.resolve(process.cwd(), 'package.json')).version;
    } catch(e) {
      console.log(e);
    }
    prodConfig.devtool = 'hidden-source-map';
    prodConfig.plugins.push(new SentryPlugin({
      include: config.buildPath,
      ignoreFile: '.sentrycliignore',
      ignore: ['node_modules'],
      configFile: 'sentry.properties',
      urlPrefix: config.publicPath,
      release: version,
      ...config.sentryPlugin,
    }));
  }
  return prodConfig;
};
