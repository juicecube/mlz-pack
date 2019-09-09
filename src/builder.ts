import { BaseConfig, Env } from './types';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import Config from './config';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import path from 'path';
import cloneDeep from 'lodash/cloneDeep';
import FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin';
import webpack from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';
import SpeedMeasurePlugin from 'speed-measure-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import ProgressBarPlugin from 'progress-bar-webpack-plugin';
const smp = new SpeedMeasurePlugin();
class Builder {
  // 当前运行的时候的根目录
  static projectRoot:string = Config.getPath(Config.jsonConfigName) || Config.getPath(Config.jsConfigName);
  // TODO: 完善基本配置
  /**
   * @description 创建基础配置
   * @param env 当前环境
   * @param options 自定义配置项
   */
  static createBaseConfig(env:Env, options:BaseConfig) : BaseConfig {
    const isProd = env === 'prod';
    return {
      target: 'web',
      cache: true,
      entry: path.join(Builder.projectRoot, './src/index.js'),
      output: {
        path: options.outputDir,
        publicPath: isProd ? options.cdnPath : './',
        filename: isProd ? 'js/[name].[chunkhash:5].js' : 'js/[name].js',
        chunkFilename: isProd ? 'js/[name].[chunkhash:5].js' : 'js/[name].js',
      },
      module: {
        rules: [
          {
            enforce: 'pre',
            test: /\.tsx?$/,
            use: [
              {
                loader: 'tslint-loader',
                options: {
                  emitErrors: false,
                },
              },
            ],
            exclude: /node_modules/,
          },
          {
            test: /\.tsx?$/,
            use: [
              {
                loader: 'thread-loader',
                options: {
                  workers: 4,
                },
              },
              'babel-loader?cacheDirectory=true',
              'ts-loader',
            ],
            include: path.resolve(Builder.projectRoot, 'src'),
            exclude: /(node_modules)/,
          },
          {
            test: /\.scss$/,
            use: [
              MiniCssExtractPlugin.loader,
              // 'style-loader',
              {
                loader: 'css-loader',
                options: {
                  modules: {
                    localIdentName: '[local]_[hash:base64:5]',
                  },
                  importLoaders: 3,
                },
              },
              {
                loader: 'postcss-loader',
                options: {
                  sourceMap: true,
                  plugins: () => [
                    require('autoprefixer')({
                      overrideBrowserslist: ['last 2 version', '> 1%',  'iOS 7'],
                    }),
                  ],
                },
              },
              'resolve-url-loader',
              {
                loader: 'sass-loader',
                options: {
                  sourceMap: false,
                },
              },
            ],
          },
          {
            test: /\.json$/,
            loader: 'json-loader',
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
          },
          {
            test: /\.svg$/,
            issuer: {
              test: /\.(tsx?|jsx?)$/,
            },
            use: [
              {
                loader: '@svgr/webpack',
              },
              {
                loader: 'url-loader',
                options: {
                  limit: 8192,
                  name: 'images/[name].[hash:5].[ext]',
                  publicPath: isProd ? options.cdnPath : '',
                },
              },
            ],
          },
          {
            test: /\.(jpe?g|gif|ico|png)$/i,
            use: [
              {
                loader: 'url-loader',
                options: {
                  limit: 8192,
                  name: 'images/[name].[hash:5].[ext]',
                  publicPath: isProd ? options.cdnPath : '',
                },
              },
              {
                loader: 'image-webpack-loader',
                options: {
                  mozjpeg: {
                    progressive: true,
                    quality: 65,
                  },
                  // optipng.enabled: false will disable optipng
                  optipng: {
                    enabled: false,
                  },
                  pngquant: {
                    quality: [0.65, 0.90],
                    speed: 4,
                  },
                  gifsicle: {
                    interlaced: false,
                  },
                  // the webp option will enable WEBP
                  webp: {
                    quality: 75,
                  },
                },
              },
            ],
          },
          {
            test: /\.(woff|eot|ttf|mp4)\??.*$/i,
            use: [
              {
                loader: 'url-loader',
                options: {
                  limit: 8192,
                  name: 'fonts/[name].[hash:5].[ext]',
                  publicPath: isProd ? options.cdnPath : '',
                },
              },
            ],
          },
        ],
      },
      plugins: [
        new ProgressBarPlugin(),
        new FriendlyErrorsWebpackPlugin(),
        new MiniCssExtractPlugin({
          // Options similar to the same options in webpackOptions.output
          // all options are optional
          filename: 'css/[name].[hash:5].css',
          // chunkFilename: '[id].css',
          allChunks: true,
          ignoreOrder: false, // Enable to remove warnings about conflicting order
        }),
      ],
    };
  }
  /**
   * @description 创建开发环境配置
   * @param options 自定义配置项
   */
  static createDevConfig(baseConfig:BaseConfig, options:BaseConfig) : BaseConfig {
    let devConfig = cloneDeep(baseConfig);
    devConfig.mode = 'development';
    // 设置打包规则
    // TODO：完善开发环境打包规则
    const devRules:any[] = [];
    devConfig.module.rules = [...devConfig.module.rules, ...devRules];

    // 设置打包插件
    // TODO：完善开发环境打包插件
    const devPlugins:any[] = [];
    devPlugins.push(new webpack.HotModuleReplacementPlugin());
    if (options['volume-analysis']) {
      devPlugins.push(new BundleAnalyzerPlugin());
    }
    devPlugins.push(this.setSinglePage());
    devConfig.plugins = [...devConfig.plugins, ...devPlugins];

    // 开发阶段增加sourcemap.
    devConfig.devtool = 'inline-source-map';
    if (options['speed-analysis']) {
      devConfig = smp.wrap(devConfig);
    }
    return devConfig;
  }
  /**
   * @description 创建生产环境配置
   * @param options 自定义配置项
   */
  static createProdConfig(baseConfig:BaseConfig, options:BaseConfig) : BaseConfig {
    // const prodConfig = deepCopy(this.baseConfig);
    let prodConfig = cloneDeep(baseConfig);
    prodConfig.mode = 'production';
    // 设置打包规则
    // TODO：完善生产环境打包规则
    const prodRules:any[] = [];
    prodConfig.module.rules = [...prodConfig.module.rules, ...prodRules];

    // 设置打包插件
    // TODO：完善生产环境打包插件
    const prodPlugins:any[] = [];
    // 清除默认输出目录
    prodPlugins.push(new CleanWebpackPlugin());
    prodPlugins.push(this.setSinglePage());
    if (options['volume-analysis']) {
      prodPlugins.push(new BundleAnalyzerPlugin());
    }
    prodConfig.plugins = [...prodConfig.plugins, ...prodPlugins];

    // 设置optimization
    prodConfig.optimization = {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          parallel: true,
        }),
      ],
    };
    console.log('prodConfig', prodConfig);
    if (options['speed-analysis']) {
      prodConfig = smp.wrap(prodConfig);
    }
    return prodConfig;
  }
  /**
   * 设置单页配置
   */
  static setSinglePage () {
    return new HtmlWebpackPlugin({
      title: 'mlz-pack',
      template: path.join(this.projectRoot, './src/index.html'),
    });
  }
  /**
   * 设置多页配置
   */
  static setMultiPage () {
    // TODO
  }
}

export default Builder;