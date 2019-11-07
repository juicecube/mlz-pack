const webpack = require('webpack');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const fs = require('fs');
const path = require('path');
const ncp = require('ncp').ncp;

const devCfg = require('./dev.config.js');
const prodCfg = require('./product.config');
// const dllCfg = require('./webpack.dll.config');
const config = require('./config');
const Server = require('./devServer');

function build(baseCfg) {
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

function serve(baseCfg) {
  const webpackConfig = getWebpackConfig(baseCfg);
  Server(webpackConfig, config.get().devServer.port);
}

function getWebpackConfig(baseCfg) {
  if (fs.existsSync(path.join(process.cwd(), 'webpack.config.js'))) {
    const configs = require(path.join(process.cwd(), 'webpack.config.js'));
    return configs;
  }
  config.init(baseCfg);
  let webpackConfig;
  // 打包速度分析工具
  const smp = new SpeedMeasurePlugin();
  if (!baseCfg.isDev) {
    // 正式环境
    webpackConfig = prodCfg();
  } else {
    webpackConfig = devCfg();
  }

  webpackConfig = smp.wrap(webpackConfig);
  return webpackConfig;
}

function eject() {
  ncp(path.resolve(__dirname), path.resolve(process.cwd(), 'webpack'), (err) => {
    if (err) {
      return console.error(err);
    }
    console.log('Done!');
  });
}

module.exports = { build, serve, eject };