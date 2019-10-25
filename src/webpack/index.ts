import webpack from 'webpack';
import merge from 'webpack-merge';
import SpeedMeasurePlugin from 'speed-measure-webpack-plugin';

import { commonCfg } from './common.config';
import { devCfg } from './dev.config';
import { prodCfg } from './product.config';
import { dllCfg } from './webpack.dll.config';
import { config, WebpackConfig } from './config';
import Server from './devServer';

export { WebpackConfig } from './config';

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
  config.init(baseCfg);
  let webpackConfig = commonCfg();
  // 打包速度分析工具
  const smp = new SpeedMeasurePlugin();
  if (!baseCfg!.isDev) {
    // 正式环境
    webpackConfig = merge.smartStrategy({
      entry: 'prepend',
    })(webpackConfig, prodCfg());
    // TODO 是否加载打包速度分析工具
    webpackConfig = smp.wrap(webpackConfig);
  } else {
    // 测试环境
    // TODO add dll
    // if (!fs.existsSync(path.join(__dirname, './dll/vender-manifest.json'))) {
    //   console.log('create dll file.');
    //   webpack(dllCfg(), (err, stats) => {
    //     if (err) {
    //       console.log(err);
    //       process.exit(2);
    //     }
    //     console.log(stats && stats.toString({
    //       chunks: false,
    //       colors: true,
    //       children: false,
    //     }));
    //   });
    // }
    webpackConfig = merge.smartStrategy({
      entry: 'prepend',
    })(webpackConfig, devCfg());
  }
  return webpackConfig;
}