import webpack from 'webpack';
import merge from 'webpack-merge';
import SpeedMeasurePlugin from 'speed-measure-webpack-plugin';

import { Env } from '../types';
import { commonCfg } from './common.config';
import { devCfg } from './dev.config';
import { prodCfg } from './product.config';
import { dllCfg } from './webpack.dll.config';
import { config, WebpackConfig } from './config';
import Server from './devServer';

export { WebpackConfig } from './config';

export function start(env:Env, baseCfg?:Partial<WebpackConfig>) {
  // FIXME 通过用户配置更新webpack的基本config的值
  console.log('env--------', env);
  config.init(baseCfg);
  let webpackConfig = commonCfg();
  // 打包速度分析工具
  const smp = new SpeedMeasurePlugin();
  
  if (env !== 'dev') {
    webpackConfig = merge.smartStrategy({
      entry: 'prepend',
    })(webpackConfig, prodCfg);
    // TODO 是否加载打包速度分析工具
    webpackConfig = smp.wrap(webpackConfig);
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
  } else {
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
    // TODO 是否加载打包速度分析工具和设置dev-server的端口号
    // webpackConfig = smp.wrap(webpackConfig);
    Server(webpackConfig, '5000');
  }
}