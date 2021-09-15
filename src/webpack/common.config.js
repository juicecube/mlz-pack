const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin;
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const autoprefixer = require('autoprefixer');
const pxtorem = require('postcss-pxtorem');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const AutoDllPlugin = require('autodll-webpack-plugin');

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
          // new
          context: process.cwd(),
        },
        importLoaders: 3,
        sourceMap: false,
      },
    },
    {
      loader: 'postcss-loader',
      options: {
        // new
        postcssOptions: () => {
          const options = {};
          // 配置有plugin、全量覆盖
          if (config.postCssPlugins) {
            options.plugins = config.postCssPlugins.map((plugin) => require(plugin.name)(plugin.options || {}));
            return options;
          }
          const plugins = [autoprefixer()];
          if (config.pxtorem) {
            plugins.push(pxtorem(config.pxtorem));
          }
          options.plugins = plugins;
          return options;
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
    // new
    cache: {
      type: 'filesystem',
      buildDependencies: {
        config: [__filename],
      },
    },
    output: {
      ...config.output,
      // 打包输出的文件
      path: config.buildPath,
      publicPath: config.publicPath,
      assetModuleFilename: 'images/[name]__[hash:5].[ext]',
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
      // ? 看情况确认是否需要修改
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
                // new
                postcssOptions: () => {
                  const options = {};
                  // 配置有plugin、全亮覆盖
                  if (config.postCssPlugins) {
                    options.plugins = config.postCssPlugins.map((plugin) => require(plugin.name)(plugin.options || {}));
                    return options;
                  }
                  options.plugins = [autoprefixer()];
                  return options;
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
          type: 'asset',
          parser: {
            dataUrlCondition: {
              maxSize: 3 * 1024, // 4kb
            },
          },
        },
        {
          test: /\.(woff|woff2|eot|ttf|mp3|mp4)$/,
          exclude: /node_modules/,
          type: 'asset',
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
      // new
      new webpack.ProgressPlugin({
        activeModules: false,
        entries: true,
        modules: true,
        modulesCount: 5000,
        profile: false,
        dependencies: true,
        dependenciesCount: 10000,
        percentBy: 'entries',
        // handler: (percentage, message, ...args) => {
        //   console.info(percentage, message, ...args);
        // }
      }),
      new FriendlyErrorsWebpackPlugin(),
      new CleanWebpackPlugin({
        verbose: true, // Write logs to console.
        dry: false,
      }),
      new webpack.DefinePlugin({
        'DEBUG': config.isDev,
        ...config.definePlugin,
      }),
    ],
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
