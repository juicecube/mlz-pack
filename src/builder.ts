import { deepCopy } from './utils';
import { BaseConfig } from './types';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import Config from './config';
import path from 'path';

// 当前运行的时候的根目录
let projectRoot:string = Config.getPath(Config.jsonConfigName);

if (!projectRoot) {
  projectRoot = Config.getPath(Config.jsConfigName);
}

console.log('projectRoot', projectRoot);

// 基础配置
const baseConfig:BaseConfig = {
  target: 'web',
  cache: true,
  entry: path.join(projectRoot, './src/index.js'),
  output: {
    publicPath: './',
    filename: '[name].[chunkhash:5].js',
    chunkFilename: '[name].[chunkhash:5].js',
  },
  module: {
    rules: [],
  },
  plugins: [],
};

class Builder {
  /**
   * @description 创建开发环境配置
   * @param options 自定义配置项
   */
  static createDevConfig(options:BaseConfig) : BaseConfig {
    console.log('dev', options);
    const devConfig = deepCopy(baseConfig);
    devConfig.mode = 'development';
    // 设置打包规则
    const devRules:any[] = [];
    devRules.push(this.setCssRules());
    devRules.push(this.setJsRules());
    devConfig.module.rules = devRules;
    // 设置打包插件
    const devPlugins:any[] = [];
    devPlugins.push(this.setSinglePage());
    devConfig.plugins = devPlugins;
    return devConfig;
  }
  /**
   * @description 创建生产环境配置
   * @param options 自定义配置项
   */
  static createProdConfig(options:BaseConfig) : BaseConfig {
    console.log('prod', options);
    const prodConfig = deepCopy(baseConfig);
    prodConfig.mode = 'production';
    // 设置打包规则
    const prodRules:any[] = [];
    prodRules.push(this.setCssRules());
    prodRules.push(this.setJsRules());
    prodConfig.module.rules = prodRules;
    // 设置打包插件
    const prodPlugins:any[] = [];
    prodPlugins.push(this.setSinglePage());
    prodConfig.plugins = prodPlugins;
    return prodConfig;
  }
  /**
   * 设置css文件规则
   */
  static setCssRules () {
    return {
      test: /\.css$/,
      exclude: /node_modules/,
      use: ['style-loader', 'css-loader'],
    };
  }
  static setJsRules () {
    return {
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
        },
      },
    };
  }
  /**
   * 设置单页配置
   */
  static setSinglePage () {
    return new HtmlWebpackPlugin({
      title: 'mlz-pack',
      template: path.join(projectRoot, './src/index.html'),
    });
  }
}

export default Builder;