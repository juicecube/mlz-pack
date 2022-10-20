const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin;
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const autoprefixer = require('autoprefixer');
const pxtorem = require('postcss-pxtorem');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const genericNames = require('generic-names');

const configs = require('./config');
const getBabelConfig = require('./loaders/babel');


module.exports = () => {
  const config = configs.get();
  const scssRules = [
    {
      loader: 'css-loader',
      options: {
        modules: {
          getLocalIdent({ resourcePath }, localIdentName, localName) {
            const generateScope = genericNames(config.cssScopeName, {
              context: process.cwd(),
            });
            return generateScope(localName, resourcePath);
          },
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
    // 开启构建缓存加快构建速度
    cache: {
      type: 'filesystem',
      // 针对构建的额外代码依赖的数组对象。webpack 将使用这些项和所有依赖项的哈希值来使文件系统缓存失效。
      buildDependencies: {
        // This makes all dependencies of this file - build dependencies
        config: [__filename],
      },
      store: 'pack',
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
          test: /\.(jpe?g|png|gif)$/,
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
        {
          test: /\.svg$/i,
          type: 'asset',
          issuer: /\.(css|less|scss|sass|styl)$/,
          parser: {
            dataUrlCondition: {
              maxSize: 4 * 1024, // 4kb
            },
          },
        },
        {
          test: /\.svg$/i,
          type: 'asset',
          resourceQuery: /url/, // *.svg?url
          parser: {
            dataUrlCondition: {
              maxSize: 4 * 1024, // 4kb
            },
          },
        },
        {
          test: /\.svg$/i,
          issuer: /\.[jt]sx?$/,
          resourceQuery: { not: [/url/] }, // exclude react component if *.svg?url
          use: ['@svgr/webpack'],
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
