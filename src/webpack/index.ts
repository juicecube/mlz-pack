import webpack from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import SpeedMeasurePlugin from 'speed-measure-webpack-plugin';

import { devCfg } from './dev.config';
import { prodCfg } from './product.config';
import { dllCfg } from './webpack.dll.config';
import { config } from './config';
import { WebpackConfig } from '../types';
import Server from './devServer';

export function build(baseCfg?:Partial<WebpackConfig>) {
  const webpackConfig = getWebpackConfig(baseCfg);
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
  if (baseCfg && baseCfg.loaderOptions) {
    webpackConfig.module.rules = [...webpackConfig.module.rules, ...baseCfg.loaderOptions];
  }
  if (baseCfg && baseCfg.analyzePlugin) {
    webpackConfig.plugins.push(new BundleAnalyzerPlugin());
  }
  webpackConfig = smp.wrap(webpackConfig);
  return webpackConfig;
}