const webpack = require('webpack');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
import fs from 'fs';
import path from 'path';
import { ncp } from 'ncp';

const devCfg = require('./dev.config.js').devCfg;
import { prodCfg } from './product.config';
import { dllCfg } from './webpack.dll.config';
import { config } from './config';
import { WebpackConfig } from '../types';
import Server from './devServer';

export function build(baseCfg?:Partial<WebpackConfig>) {
  const webpackConfig = getWebpackConfig(baseCfg);
  console.log('webpack', webpackConfig);
  webpack(webpackConfig, (err, stats) => {
    if (err) {
      console.log(err);
      process.exit(2);
    }
    console.log(stats && stats.toString({
      chunks: false,
      colors: true,
      children: false,
    }));
  });
}

export function serve(baseCfg?:Partial<WebpackConfig>) {
  const webpackConfig = getWebpackConfig(baseCfg);
  Server(webpackConfig, config.get().devServer.port);
}

export function getWebpackConfig(baseCfg?:Partial<WebpackConfig>) {
  // TODO 检查到有根目录下有webpack.config.js直接return config
  if (fs.existsSync(path.join(process.cwd(), 'webpack.config.js'))) {
    const configs = require(path.join(process.cwd(), 'webpack.config.js'));
    return configs;
  }
  config.init(baseCfg);
  let webpackConfig;
  // 打包速度分析工具
  const smp = new SpeedMeasurePlugin();
  if (!baseCfg!.isDev) {
    // 正式环境
    webpackConfig = prodCfg();
  } else {
    webpackConfig = devCfg();
  }

  webpackConfig = smp.wrap(webpackConfig);
  return webpackConfig;
}

export function eject() {
  console.log(path.resolve(__dirname));
  ncp(path.resolve(__dirname), path.resolve(process.cwd(), 'webpack'), (err) => {
    if (err) {
      return console.error(err);
    }
    console.log('Done!');
  });
}