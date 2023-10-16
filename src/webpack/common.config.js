const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin;
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const autoprefixer = require('autoprefixer');
const pxtorem = require('postcss-pxtorem');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const AutoDllPlugin = require('autodll-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const configs = require('./config');
const getBabelConfig = require('./babel');


module.exports = () => {
  const config = configs.get();
  const tsconfig = config.tsconfig ? { configFile: config.tsconfig } : {};
  const scssRules = [
    {
      loader: 'css-loader',
      options: {
        modules: {
          localIdentName: config.cssScopeName,
          context: process.cwd(),
        },
        importLoaders: 3,
        sourceMap: false,
      },
    },
    {
      loader: 'postcss-loader',
      options: {
        plugins: () => {
          // 配置有直接全覆盖
          if (config.postScssPlugins) {
            return config.postScssPlugins.map((plugin) => require(plugin.name)(plugin.options || {}));
          }
          const plugin = [autoprefixer()];
          if (config.pxtorem) {
            plugin.push(pxtorem(config.pxtorem));
          }
          return plugin;
        },
      },
    },
    {
      loader: 'sass-loader',
      options: {
        implementation: require('sass'),
      },
    },
  ];

  // 正式环境并且extraCssPlugin时导出css文件，否则用style-loader处理
  if (!config.isDev && config.extraCssPlugin) {
    scssRules.unshift({ loader: MiniCssExtractPlugin.loader });
  } else {
    scssRules.unshift('style-loader');
  }

  const commonConfig = {
    entry: config.entryPath,
    target: config.target,
    output: {
      ...config.output,
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
        ...config.alias,
      },
      extensions: ['.ts', '.tsx', '.js', '.css', '.scss'],
      symlinks: false,
      cacheWithContext: false,
      plugins: [new TsconfigPathsPlugin(tsconfig)],
    },
    watchOptions: {
      poll: 1000,
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          // include: /node_modules/,
          use: [
            'style-loader',
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                plugins: () => {
                  // 配置有plugin、全亮覆盖
                  if (config.postCssPlugins) {
                    return config.postCssPlugins.map((plugin) => require(plugin.name)(plugin.options || {}));
                  }
                  return [autoprefixer()];
                },
              },
            },
          ],
        },
        {
          test: /\.scss$/,
          exclude: /node_modules/,
          use: [...scssRules],
        },
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
                publicPath: config.assetsPublicPath,
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
                publicPath: config.assetsPublicPath,
              },
            },
          ],
        },
        {
          test: /\.(ts|tsx)?$/,
          use: [{
            loader: 'babel-loader',
            options: getBabelConfig(),
          }],
          exclude: /(node_modules)/,
        },
        {
          test: /\.worker\.js$/,
          use: [
            {
              loader: 'worker-loader',
              options: {
                name: '[name].js',
                inline: true,
              },
            },
          ],
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
      config.isDev && new ReactRefreshWebpackPlugin(),
    ].filter(Boolean),
    externals: {},
  };
  if (config.svgr) {
    commonConfig.module.rules.unshift({
      test: /\.svg$/,
      issuer: {
        test: /\.(jsx|tsx)?$/,
      },
      use: [
        '@svgr/webpack',
        {
          loader: 'url-loader',
          options: {
            emitFile: true,
            limit: 3 * 1024,
            name: 'images/[name]__[hash:5].[ext]',
            publicPath: config.assetsPublicPath,
          },
        },
      ],
    });
  }
  if (config.analyzePlugin) {
    commonConfig.plugins.push(new BundleAnalyzerPlugin());
  }
  if (config.loaderOptions) {
    commonConfig.module.rules.push(...config.loaderOptions);
  }
  if (config.pluginOptions) {
    commonConfig.plugins.push(...config.pluginOptions);
  }
  if(config.externals){
    commonConfig.externals = config.externals;
  }

  return commonConfig;
};
